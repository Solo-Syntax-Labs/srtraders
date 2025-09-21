import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import ConsolidatedReportTemplate from '@/lib/pdf/ConsolidatedReportTemplate'
import DocumentProcessor from '@/lib/pdf/documentProcessor'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function POST(
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

    // Get user id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Fetch invoice with party information
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        sale_party:sale_party_id(id, name),
        purchase_party:purchase_party_id(id, name)
      `)
      .eq('id', id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
    }

    // Check if user owns this invoice
    if (invoice.created_by !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Process documents
    const documentProcessor = new DocumentProcessor()
    const processedDocuments = await documentProcessor.processAllDocuments(invoice)

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      ConsolidatedReportTemplate({
        invoice,
        documentImages: processedDocuments
      })
    )

    // Generate unique document ID
    const documentId = `consolidated_${invoice.invoice_number}_${Date.now()}`
    const fileName = `consolidated_report_${invoice.invoice_number}.pdf`
    const storagePath = `consolidated-reports/${documentId}.pdf`

    // Upload PDF to Supabase storage using S3 client
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

      const uploadCommand = new PutObjectCommand({
        Bucket: 'documents',
        Key: storagePath,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        CacheControl: '3600',
        Metadata: {
          'original-name': fileName,
          'uploaded-by': (user as any).id,
          'document-id': documentId,
        }
      })

      await s3Client.send(uploadCommand)
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { message: 'Failed to save consolidated report' },
        { status: 500 }
      )
    }

    // Create document record
    const { data: documentRecord, error: docError } = await supabase
      .from('documents')
      .insert([{
        document_id: documentId,
        file_name: fileName,
        file_size: pdfBuffer.length,
        file_type: 'application/pdf',
        storage_type: 'supabase',
        storage_path: storagePath,
        document_type: 'other',
        uploaded_by: (user as any).id
      }] as any)
      .select()
      .single()

    if (docError) {
      console.error('Document record error:', docError)
      // Try to clean up uploaded file using S3 client
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
          Key: storagePath,
        })
        await s3Client.send(deleteCommand)
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }
      
      return NextResponse.json(
        { message: 'Failed to create document record' },
        { status: 500 }
      )
    }

    // Update invoice with consolidated report reference
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ consolidated_report_id: documentId })
      .eq('id', id)

    if (updateError) {
      console.error('Invoice update error:', updateError)
      // Note: We don't clean up here since the report was generated successfully
    }

    // Generate signed URL for download
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600) // 1 hour expiry

    return NextResponse.json({
      success: true,
      message: 'Consolidated report generated successfully',
      documentId,
      fileName,
      downloadUrl: signedUrlData?.signedUrl,
      documentsProcessed: processedDocuments.length
    })

  } catch (error) {
    console.error('Error generating consolidated report:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
