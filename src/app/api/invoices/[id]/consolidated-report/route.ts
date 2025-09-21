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
    console.log('=== Consolidated Report GET Request ===')
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('Unauthorized: No session or email')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'download' // 'download' or 'view'
    
    console.log('Request details:', { invoiceId: id, action, userEmail: session.user.email })

    // Get user id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      console.log('User not found for email:', session.user.email)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    
    console.log('Found user:', user.id)

    // Fetch invoice to get consolidated report ID
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('consolidated_report_id, created_by, invoice_number')
      .eq('id', id)
      .single()

    if (invoiceError || !invoice) {
      console.log('Invoice not found:', { id, error: invoiceError })
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
    }
    
    console.log('Found invoice:', { 
      invoiceNumber: invoice.invoice_number, 
      consolidatedReportId: invoice.consolidated_report_id,
      createdBy: invoice.created_by 
    })

    // Check if user owns this invoice
    if (invoice.created_by !== user.id) {
      console.log('Access denied: User does not own this invoice')
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Check if consolidated report exists
    if (!invoice.consolidated_report_id) {
      console.log('No consolidated report found for invoice')
      return NextResponse.json(
        { message: 'No consolidated report found. Please generate one first.' },
        { status: 404 }
      )
    }

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('storage_path, file_name, file_size')
      .eq('document_id', invoice.consolidated_report_id)
      .single()

    if (docError || !document) {
      console.log('Document not found:', { 
        consolidatedReportId: invoice.consolidated_report_id, 
        error: docError 
      })
      return NextResponse.json(
        { message: 'Consolidated report document not found' },
        { status: 404 }
      )
    }
    
    console.log('Found document:', {
      fileName: document.file_name,
      storagePath: document.storage_path,
      fileSize: document.file_size
    })

    // Download the file from storage using S3 client
    let buffer: Buffer;
    try {
      const s3Client = new S3Client({
        forcePathStyle: true,
        region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
        endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
        }
      });

      const getCommand = new GetObjectCommand({
        Bucket: 'documents',
        Key: document.storage_path,
      });

      const response = await s3Client.send(getCommand);
      
      if (!response.Body) {
        return NextResponse.json(
          { message: 'Consolidated report file not found in storage' },
          { status: 404 }
        )
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      buffer = Buffer.concat(chunks);
      console.log('Successfully downloaded from S3, buffer size:', buffer.length, 'bytes')
    } catch (storageError) {
      console.error('Failed to download consolidated report from S3:', storageError);
      return NextResponse.json(
        { message: 'Failed to download consolidated report from storage' },
        { status: 500 }
      )
    }

    // Set appropriate headers based on action
    const headers: HeadersInit = {
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length.toString(),
    }

    if (action === 'download') {
      headers['Content-Disposition'] = `attachment; filename="${document.file_name}"`
    } else if (action === 'view') {
      headers['Content-Disposition'] = 'inline'
    }

    console.log('Returning PDF with headers:', headers)

    // Return the PDF
    return new NextResponse(buffer, {
      headers
    })

  } catch (error) {
    console.error('Error serving consolidated report:', error)
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

    // Get user id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Fetch invoice to get consolidated report ID
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('consolidated_report_id, created_by')
      .eq('id', id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
    }

    // Check if user owns this invoice
    if (invoice.created_by !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Check if consolidated report exists
    if (!invoice.consolidated_report_id) {
      return NextResponse.json(
        { message: 'No consolidated report to delete' },
        { status: 404 }
      )
    }

    // Get document details for cleanup
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('document_id', invoice.consolidated_report_id)
      .single()

    if (document) {
      // Delete from storage using S3 client
      try {
        const s3Client = new S3Client({
          forcePathStyle: true,
          region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
          endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
          credentials: {
            accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
          }
        });

        const deleteCommand = new DeleteObjectCommand({
          Bucket: 'documents',
          Key: document.storage_path,
        });

        await s3Client.send(deleteCommand);
      } catch (storageError) {
        console.error('Failed to delete consolidated report from S3:', storageError);
        // Continue with database cleanup even if storage deletion fails
      }

      // Delete document record
      await supabase
        .from('documents')
        .delete()
        .eq('document_id', invoice.consolidated_report_id)
    }

    // Clear consolidated report ID from invoice
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ consolidated_report_id: null })
      .eq('id', id)

    if (updateError) {
      console.error('Error clearing consolidated report ID:', updateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Consolidated report deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting consolidated report:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
