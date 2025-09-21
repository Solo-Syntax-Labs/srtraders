import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'

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

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get document metadata - try by UUID first, then by document_id
    const { data: documentData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', (user as any).id)
      .single()
    
    let document = documentData

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

    // Check if document is referenced by invoices
    const { data: invoiceRefs, error: refError } = await supabase
      .from('invoices')
      .select('id, invoice_number')
      .or(`sale_doc.eq.${document!.document_id},purchase_doc.eq.${document!.document_id},toll_doc.eq.${document!.document_id},weight_report.eq.${document!.document_id},classification_report.eq.${document!.document_id},consolidated_report_id.eq.${document!.document_id}`)

    if (refError) {
      console.error('Error checking invoice references:', refError)
    }

    return NextResponse.json({
      document: {
        ...document,
        can_view: document.file_type?.startsWith('image/') || document.file_type === 'application/pdf',
        can_delete: !invoiceRefs || invoiceRefs.length === 0,
        referenced_invoices: invoiceRefs || [],
        view_url: `/api/documents/${document.id}?action=view`,
        download_url: `/api/documents/${document.id}?action=download`,
        size_formatted: formatFileSize(document.file_size || 0)
      }
    })

  } catch (error) {
    console.error('Error fetching document metadata:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
