import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const invoiceId = formData.get('invoice_id') as string
    const documentType = formData.get('document_type') as string || 'other'

    if (!file || !invoiceId) {
      return NextResponse.json(
        { message: 'File and invoice ID are required' },
        { status: 400 }
      )
    }

    // Verify user has access to the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('created_by')
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.created_by !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Get user's Google Drive tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('google_drive_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { message: 'Google Drive not connected. Please connect your Google Drive account first.' },
        { status: 400 }
      )
    }

    // Set up Google Drive API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    )

    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
    })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Create folder for invoice if it doesn't exist
    const folderName = `Invoice_${invoiceId}`
    let folderId: string

    try {
      const folderSearch = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        spaces: 'drive',
      })

      if (folderSearch.data.files && folderSearch.data.files.length > 0) {
        folderId = folderSearch.data.files[0].id!
      } else {
        const folderCreate = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
          },
        })
        folderId = folderCreate.data.id!
      }
    } catch (error) {
      console.error('Error creating/finding folder:', error)
      return NextResponse.json(
        { message: 'Failed to create Google Drive folder' },
        { status: 500 }
      )
    }

    // Upload file to Google Drive
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      
      const uploadResponse = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: [folderId],
        },
        media: {
          mimeType: file.type,
          body: fileBuffer,
        },
      })

      const googleDriveId = uploadResponse.data.id!

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert({
          invoice_id: invoiceId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_type: 'google_drive',
          google_drive_id: googleDriveId,
          document_type: documentType,
          uploaded_by: session.user.id,
        })
        .select()
        .single()

      if (docError) {
        // Clean up uploaded file if document creation fails
        try {
          await drive.files.delete({ fileId: googleDriveId })
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError)
        }
        
        return NextResponse.json(
          { message: `Document creation failed: ${docError.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'File uploaded to Google Drive successfully',
        document,
        googleDriveId,
      }, { status: 201 })

    } catch (uploadError) {
      console.error('Google Drive upload error:', uploadError)
      return NextResponse.json(
        { message: 'Failed to upload file to Google Drive' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
