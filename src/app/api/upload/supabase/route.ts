import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const documentType = formData.get('document_type') as string || 'other'

    if (!file) {
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 }
      )
    }

    // Generate document ID on the server side
    const documentId = `${documentType}_${Date.now()}_${uuidv4().slice(0, 8)}`

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user?.email || '')
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if document ID already exists
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id')
      .eq('document_id', documentId)
      .single()

    if (existingDoc) {
      return NextResponse.json({ message: 'Document ID already exists' }, { status: 409 })
    }

    // Generate unique file name
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = `documents/${documentType}/${uniqueFileName}`

    /* OPTION 1: Traditional Supabase Storage Client (commented out)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json(
        { message: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }
    */

    // OPTION 2: S3 Approach - Now Active
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

    // Upload file using S3 API
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
    } catch (uploadError) {
      console.error('S3 upload error:', uploadError)
      return NextResponse.json(
        { message: `Upload failed: ${uploadError}` },
        { status: 500 }
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
        storage_type: 'supabase',
        storage_path: filePath,
        document_type: documentType,
        uploaded_by: (user as any).id,
      }] as any)
      .select()
      .single()

    if (docError) {
      // Clean up uploaded file if document creation fails - S3 approach
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: 'documents',
          Key: filePath,
        })
        await s3Client.send(deleteCommand)
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }

      /* For Supabase client approach, use this cleanup instead:
      await supabase.storage
        .from('documents')
        .remove([uploadData.path])
      */
      
      return NextResponse.json(
        { message: `Document creation failed: ${docError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      document,
      document_id: documentId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      document_type: documentType,
      storage_path: filePath,
    }, { status: 201 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
