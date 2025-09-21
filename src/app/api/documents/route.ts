import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    
    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const documentType = searchParams.get('document_type')
    const storageType = searchParams.get('storage_type')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('documents')
      .select('*')
      .eq('uploaded_by', (user as any).id)

    // Apply filters
    if (documentType) {
      query = query.eq('document_type', documentType)
    }

    if (storageType) {
      query = query.eq('storage_type', storageType)
    }

    if (search) {
      query = query.or(`file_name.ilike.%${search}%,document_id.ilike.%${search}%`)
    }

    // Apply ordering and pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data: documents, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    // Add additional metadata for each document
    const documentsWithMeta = documents?.map(doc => ({
      ...doc,
      can_view: doc.file_type?.startsWith('image/') || doc.file_type === 'application/pdf',
      view_url: `/api/documents/${doc.id}?action=view`,
      download_url: `/api/documents/${doc.id}?action=download`
    })) || []

    return NextResponse.json({
      documents: documentsWithMeta,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const formData = await request.formData()
    const { searchParams } = new URL(request.url)
    
    const file = formData.get('file') as File
    const documentType = (formData.get('document_type') as string) || 'other'
    const storageOption = searchParams.get('storage') || 'supabase' // Default to supabase

    if (!file) {
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'File type not allowed. Please upload PDF, JPG, PNG, or DOC files.' },
        { status: 400 }
      )
    }

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Generate document ID
    const documentId = `${documentType}_${Date.now()}_${uuidv4().slice(0, 8)}`

    // Check if document ID already exists (very unlikely but safe)
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id')
      .eq('document_id', documentId)
      .single()

    if (existingDoc) {
      return NextResponse.json({ message: 'Document ID collision, please try again' }, { status: 409 })
    }

    let uploadResult
    let filePath = ''

    // Handle different storage options
    if (storageOption === 'supabase') {
      // Supabase Storage using S3 API (current implementation)
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${uuidv4()}.${fileExtension}`
      filePath = `documents/${documentType}/${uniqueFileName}`

      // Configure S3 client for Supabase Storage
      const s3Client = new S3Client({
        forcePathStyle: true,
        region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
        endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
        }
      })

      // Convert file to buffer for S3 upload
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      try {
        const uploadCommand = new PutObjectCommand({
          Bucket: 'documents',
          Key: filePath,
          Body: fileBuffer,
          ContentType: file.type,
          CacheControl: '3600',
          Metadata: {
            'original-name': file.name,
            'uploaded-by': (user as any).id,
            'document-id': documentId,
          }
        })

        await s3Client.send(uploadCommand)
        
        uploadResult = {
          success: true,
          path: filePath,
          storage_type: 'supabase'
        }
      } catch (uploadError) {
        console.error('Supabase S3 upload error:', uploadError)
        return NextResponse.json(
          { message: `Supabase upload failed: ${uploadError}` },
          { status: 500 }
        )
      }
    } else {
      // Add support for other storage options here (Google Drive, etc.)
      return NextResponse.json(
        { message: `Storage option '${storageOption}' not yet implemented` },
        { status: 400 }
      )
    }

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert([{
        document_id: documentId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_type: uploadResult.storage_type,
        storage_path: uploadResult.path,
        document_type: documentType,
        uploaded_by: (user as any).id,
      }] as any)
      .select()
      .single()

    if (docError) {
      // Clean up uploaded file if document creation fails
      if (storageOption === 'supabase') {
        try {
          const s3Client = new S3Client({
            forcePathStyle: true,
            region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
            endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
            credentials: {
              accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
            }
          })
          
          const deleteCommand = new DeleteObjectCommand({
            Bucket: 'documents',
            Key: filePath,
          })
          await s3Client.send(deleteCommand)
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError)
        }
      }
      
      return NextResponse.json(
        { message: `Document creation failed: ${docError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Document uploaded successfully',
      document: {
        ...document,
        can_view: file.type?.startsWith('image/') || file.type === 'application/pdf',
        view_url: `/api/documents/${document.id}?action=view`,
        download_url: `/api/documents/${document.id}?action=download`
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
