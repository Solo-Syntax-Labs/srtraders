import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'download' // 'download' or 'view'

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get document details - try by UUID first, then by document_id
    let { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', (user as any).id)
      .single()

    // If not found by UUID, try by document_id (custom identifier)
    if (docError || !document) {
      const { data: documentByCustomId, error: customIdError } = await supabase
        .from('documents')
        .select('*')
        .eq('document_id', id)
        .eq('uploaded_by', (user as any).id)
        .single()

      if (customIdError || !documentByCustomId) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 })
      }
      
      document = documentByCustomId
    }

    // Handle different storage types
    if (document.storage_type === 'supabase') {
      try {
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

        // Download file from S3
        const getCommand = new GetObjectCommand({
          Bucket: 'documents',
          Key: document.storage_path,
        })

        const response = await s3Client.send(getCommand)
        
        if (!response.Body) {
          return NextResponse.json({ message: 'File not found in storage' }, { status: 404 })
        }

        // Convert stream to buffer
        const chunks: Uint8Array[] = []
        const stream = response.Body as any
        
        for await (const chunk of stream) {
          chunks.push(chunk)
        }
        
        const buffer = Buffer.concat(chunks)

        // Set appropriate headers
        const headers: HeadersInit = {
          'Content-Type': document.file_type || 'application/octet-stream',
          'Content-Length': buffer.length.toString(),
        }

        if (action === 'download') {
          headers['Content-Disposition'] = `attachment; filename="${document.file_name}"`
        } else if (action === 'view') {
          headers['Content-Disposition'] = 'inline'
          
          // For images and PDFs, set appropriate headers for inline viewing
          if (document.file_type?.startsWith('image/') || document.file_type === 'application/pdf') {
            headers['Cache-Control'] = 'public, max-age=3600'
          }
        }

        return new NextResponse(buffer, { headers })

      } catch (storageError) {
        console.error('Storage download error:', storageError)
        return NextResponse.json(
          { message: 'Failed to download file from storage' },
          { status: 500 }
        )
      }
    } else if (document.storage_type === 'google_drive') {
      // TODO: Implement Google Drive download logic
      return NextResponse.json(
        { message: 'Google Drive download not yet implemented' },
        { status: 501 }
      )
    } else {
      return NextResponse.json(
        { message: 'Unsupported storage type' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error serving document:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get document details before deletion - try by UUID first, then by document_id
    let { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', (user as any).id)
      .single()

    // If not found by UUID, try by document_id (custom identifier)
    if (docError || !document) {
      const { data: documentByCustomId, error: customIdError } = await supabase
        .from('documents')
        .select('*')
        .eq('document_id', id)
        .eq('uploaded_by', (user as any).id)
        .single()

      if (customIdError || !documentByCustomId) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 })
      }
      
      document = documentByCustomId
    }

    // Check if document is referenced by any invoices
    const { data: invoiceRefs, error: refError } = await supabase
      .from('invoices')
      .select('id, invoice_number')
      .or(`sale_doc.eq.${document.document_id},purchase_doc.eq.${document.document_id},toll_doc.eq.${document.document_id},weight_report.eq.${document.document_id},classification_report.eq.${document.document_id},consolidated_report_id.eq.${document.document_id}`)

    if (refError) {
      console.error('Error checking invoice references:', refError)
      return NextResponse.json(
        { message: 'Error checking document references' },
        { status: 500 }
      )
    }

    if (invoiceRefs && invoiceRefs.length > 0) {
      const invoiceNumbers = invoiceRefs.map((inv: any) => inv.invoice_number).join(', ')
      return NextResponse.json(
        { 
          message: `Cannot delete document. It is referenced by invoice(s): ${invoiceNumbers}`,
          referenced_invoices: invoiceRefs
        },
        { status: 409 }
      )
    }

    // Delete from storage first
    if (document.storage_type === 'supabase') {
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
          Key: document.storage_path,
        })

        await s3Client.send(deleteCommand)
      } catch (storageError) {
        console.error('Storage deletion error:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database using the actual document UUID
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id)
      .eq('uploaded_by', (user as any).id)

    if (deleteError) {
      return NextResponse.json(
        { message: `Failed to delete document: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Document deleted successfully',
      deleted_document: {
        id: document.id,
        document_id: document.document_id,
        file_name: document.file_name
      }
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params
    const updateData = await request.json()

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Only allow updating certain fields
    const allowedFields = ['document_type', 'file_name']
    const filteredUpdate = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = updateData[key]
        return obj
      }, {})

    if (Object.keys(filteredUpdate).length === 0) {
      return NextResponse.json(
        { message: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Find document first - try by UUID first, then by document_id
    let { data: document, error: findError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', (user as any).id)
      .single()

    // If not found by UUID, try by document_id (custom identifier)
    if (findError || !document) {
      const { data: documentByCustomId, error: customIdError } = await supabase
        .from('documents')
        .select('*')
        .eq('document_id', id)
        .eq('uploaded_by', (user as any).id)
        .single()

      if (customIdError || !documentByCustomId) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 })
      }
      
      document = documentByCustomId
    }

    // Update document using the actual document UUID
    const { data: updatedDocument, error: updateError } = await supabase
      .from('documents')
      .update(filteredUpdate)
      .eq('id', document.id)
      .eq('uploaded_by', (user as any).id)
      .select()
      .single()

    if (updateError || !updatedDocument) {
      return NextResponse.json(
        { message: updateError?.message || 'Update failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Document updated successfully',
      document: {
        ...updatedDocument,
        can_view: updatedDocument.file_type?.startsWith('image/') || updatedDocument.file_type === 'application/pdf',
        view_url: `/api/documents/${updatedDocument.id}?action=view`,
        download_url: `/api/documents/${updatedDocument.id}?action=download`
      }
    })

  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
