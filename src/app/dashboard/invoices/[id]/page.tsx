'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Download,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Scale,
  Eye,
  ExternalLink,
  FileBarChart,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Invoice {
  id: string
  invoice_number: string
  weight: number
  profit: number | null
  sale_cost: number | null
  purchase_cost: number | null
  tds: number | null
  sale_party: { name: string } | null
  purchase_party: { name: string } | null
  status: 'payment_pending' | 'completed'
  hsn_code: string | null
  sale_doc: string | null
  purchase_doc: string | null
  toll_doc: string | null
  weight_report: string | null
  classification_report: string | null
  consolidated_report_id: string | null
  debit_note: string | null
  credit_note: string | null
  created_at: string
  updated_at: string
  created_by: string
}

interface Document {
  id: string
  document_id: string
  file_name: string
  file_size: number
  file_type: string
  document_type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other'
  storage_type: 'supabase'
  storage_path: string
  created_at: string
  can_view: boolean
  view_url: string | null
  download_url: string | null
  invoice_field_label?: string // Label for display (e.g., "Sale Document")
  invoice_field_type?: string // Type from invoice field (e.g., "sale")
  size_formatted?: string // Formatted file size
}

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [consolidatedReportLoading, setConsolidatedReportLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session && id) {
      fetchInvoice()
    }
  }, [session, id])

  // Fetch documents after invoice is loaded
  useEffect(() => {
    if (invoice) {
      fetchDocuments()
    }
  }, [invoice])

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data.invoice)
        return data.invoice // Return the updated invoice
      } else {
        router.push('/dashboard/invoices')
        return null
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
      router.push('/dashboard/invoices')
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    if (!invoice) return
    
    try {
      // Collect all document IDs referenced by this invoice with their types
      const documentRefs = [
        { id: invoice.sale_doc, label: 'Sale Document', type: 'sale' },
        { id: invoice.purchase_doc, label: 'Purchase Document', type: 'purchase' },
        { id: invoice.toll_doc, label: 'Toll Document', type: 'toll' },
        { id: invoice.weight_report, label: 'Weight Report', type: 'weight_report' },
        { id: invoice.classification_report, label: 'Classification Report', type: 'classification' },
        { id: invoice.consolidated_report_id, label: 'Consolidated Report', type: 'consolidated' }
      ].filter(ref => ref.id) // Remove null/undefined values

      if (documentRefs.length === 0) {
        setDocuments([])
        return
      }

      // Fetch documents with specific IDs
      const documentPromises = documentRefs.map(async (ref) => {
        try {
          const response = await fetch(`/api/documents/${ref.id}/metadata`)
          if (response.ok) {
            const data = await response.json()
            return {
              ...data.document,
              invoice_field_label: ref.label,
              invoice_field_type: ref.type
            }
          }
          return null
        } catch (error) {
          console.error(`Error fetching document ${ref.id}:`, error)
          return null
        }
      })

      const fetchedDocuments = await Promise.all(documentPromises)
      const validDocuments = fetchedDocuments.filter(Boolean)
      
      setDocuments(validDocuments)
    } catch (error) {
      console.error('Error fetching invoice documents:', error)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!invoice) return

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInvoice(data.invoice)
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDocumentView = async (documentId: string) => {
    try {
      window.open(`/api/documents/${documentId}?action=view`, '_blank')
    } catch (error) {
      console.error('Error viewing document:', error)
    }
  }

  const handleDocumentDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}?action=download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleGenerateConsolidatedReport = async () => {
    if (!invoice) return

    setConsolidatedReportLoading(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/consolidated-report/generate`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Consolidated report generated successfully! Processed ${data.documentsProcessed} documents.`)
        // Refresh invoice data to get the new consolidated_report_id
        const updatedInvoice = await fetchInvoice()
        // Explicitly refresh documents with the updated invoice to ensure the new report appears
        if (updatedInvoice) {
          setInvoice(updatedInvoice)
        }
      } else {
        const error = await response.json()
        alert(`Failed to generate consolidated report: ${error.message}`)
      }
    } catch (error) {
      console.error('Error generating consolidated report:', error)
      alert('Error generating consolidated report')
    } finally {
      setConsolidatedReportLoading(false)
    }
  }

  const handleViewConsolidatedReport = async () => {
    if (!invoice) return

    try {
      // First check if consolidated report exists
      if (!invoice.consolidated_report_id) {
        alert('No consolidated report found. Please generate one first.')
        return
      }

      console.log('Opening consolidated report for invoice:', invoice.id, 'with report ID:', invoice.consolidated_report_id)
      
      const url = `/api/invoices/${invoice.id}/consolidated-report?action=view`
      const newWindow = window.open(url, '_blank')
      
      if (!newWindow) {
        alert('Pop-up blocked. Please allow pop-ups for this site and try again.')
      }
    } catch (error) {
      console.error('Error viewing consolidated report:', error)
      alert('Error viewing consolidated report: ' + (error as Error).message)
    }
  }

  const handleDownloadConsolidatedReport = async () => {
    if (!invoice) return

    try {
      // First check if consolidated report exists
      if (!invoice.consolidated_report_id) {
        alert('No consolidated report found. Please generate one first.')
        return
      }

      console.log('Downloading consolidated report for invoice:', invoice.id, 'with report ID:', invoice.consolidated_report_id)
      
      const response = await fetch(`/api/invoices/${invoice.id}/consolidated-report?action=download`)
      
      if (response.ok) {
        const blob = await response.blob()
        console.log('Downloaded blob size:', blob.size, 'bytes')
        
        if (blob.size === 0) {
          alert('Downloaded file is empty. There may be an issue with the report generation.')
          return
        }
        
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `consolidated_report_${invoice.invoice_number}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        console.log('Download completed successfully')
      } else {
        const contentType = response.headers.get('content-type')
        let errorMessage = 'Unknown error'
        
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json()
          errorMessage = error.message || 'Failed to download consolidated report'
        } else {
          errorMessage = `Server returned ${response.status}: ${response.statusText}`
        }
        
        console.error('Download failed:', response.status, response.statusText)
        alert(`Failed to download consolidated report: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error downloading consolidated report:', error)
      alert('Error downloading consolidated report: ' + (error as Error).message)
    }
  }

  const handleDeleteConsolidatedReport = async () => {
    if (!invoice) return

    if (!confirm('Are you sure you want to delete the consolidated report? You can regenerate it later.')) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoice.id}/consolidated-report`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Consolidated report deleted successfully')
        // Refresh invoice data to clear the consolidated_report_id
        const updatedInvoice = await fetchInvoice()
        // Explicitly refresh documents with the updated invoice to ensure the report is removed
        if (updatedInvoice) {
          setInvoice(updatedInvoice)
        }
      } else {
        const error = await response.json()
        alert(`Failed to delete consolidated report: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting consolidated report:', error)
      alert('Error deleting consolidated report')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session || !invoice) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard/invoices">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {invoice.invoice_number}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Invoice details and documentation
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Badge className={`${getStatusColor(invoice.status)} justify-center sm:justify-start`}>
                {invoice.status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
              </Badge>
              <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Created Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Scale className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Weight</p>
                        <p className="text-lg font-semibold">
                          {invoice.weight} kg
                        </p>
                      </div>
                    </div>

                    {invoice.hsn_code && (
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">HSN Code</p>
                          <p className="text-lg font-semibold">
                            {invoice.hsn_code}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {invoice.profit !== null && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Profit</p>
                          <p className={`text-lg font-semibold ${
                            invoice.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${invoice.profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {invoice.sale_cost && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Sale Cost</p>
                          <p className="text-lg font-semibold text-green-600">
                            ${invoice.sale_cost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {invoice.purchase_cost && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Purchase Cost</p>
                          <p className="text-lg font-semibold text-red-600">
                            ${invoice.purchase_cost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {invoice.tds !== null && invoice.tds > 0 && (
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">TDS</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {invoice.tds}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Party Information */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Sale Party</p>
                      <p className="text-lg font-semibold">
                        {invoice.sale_party?.name || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Purchase Party</p>
                      <p className="text-lg font-semibold">
                        {invoice.purchase_party?.name || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(invoice.debit_note || invoice.credit_note) && (
                  <div className="pt-4 border-t space-y-4">
                    {invoice.debit_note && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Debit Note</p>
                        <p className="text-gray-700">{invoice.debit_note}</p>
                      </div>
                    )}
                    {invoice.credit_note && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Credit Note</p>
                        <p className="text-gray-700">{invoice.credit_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Files associated with this invoice
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{doc.file_name}</p>
                              {doc.invoice_field_label && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-shrink-0">
                                  {doc.invoice_field_label}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:space-y-0 gap-x-4 text-xs sm:text-sm text-gray-600">
                              <span className="flex-shrink-0">{doc.size_formatted || formatFileSize(doc.file_size)}</span>
                              <span className="capitalize flex-shrink-0">
                                {doc.file_type?.replace('application/', '').replace('image/', '')}
                              </span>
                              <span className="flex-shrink-0">{new Date(doc.created_at).toLocaleDateString()}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                                ID: {doc.document_id.length > 15 ? `${doc.document_id.slice(0, 15)}...` : doc.document_id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 sm:ml-4">
                          {doc.can_view && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDocumentView(doc.id)}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="h-4 w-4 sm:mr-0" />
                              <span className="ml-1 sm:hidden">View</span>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDocumentDownload(doc.id, doc.file_name)}
                            className="flex-1 sm:flex-none"
                          >
                            <Download className="h-4 w-4 sm:mr-0" />
                            <span className="ml-1 sm:hidden">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Update Status</p>
                  <div className="space-y-2">
                    {['payment_pending', 'completed'].map((status) => (
                      <Button
                        key={status}
                        variant={invoice.status === status ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate(status)}
                        disabled={invoice.status === status}
                      >
                        {status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-700">
                    {new Date(invoice.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-700">
                    {new Date(invoice.updated_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <p className="text-sm text-gray-700">
                    {documents.length} file(s) attached
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Invoice
                </Button>
              </CardContent>
            </Card>

            {/* Consolidated Report */}
            <Card>
              <CardHeader>
                <CardTitle>Consolidated Report</CardTitle>
                <CardDescription>
                  Generate a combined PDF report with all invoice documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!invoice.consolidated_report_id ? (
                  <Button 
                    onClick={handleGenerateConsolidatedReport}
                    disabled={consolidatedReportLoading}
                    className="w-full justify-start"
                  >
                    {consolidatedReportLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileBarChart className="h-4 w-4 mr-2" />
                    )}
                    {consolidatedReportLoading ? 'Generating...' : 'Generate Report'}
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleViewConsolidatedReport}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                    <Button 
                      onClick={handleDownloadConsolidatedReport}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleGenerateConsolidatedReport}
                        disabled={consolidatedReportLoading}
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center"
                      >
                        {consolidatedReportLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileBarChart className="h-4 w-4" />
                        )}
                        <span className="ml-1 sm:hidden">Regenerate</span>
                      </Button>
                      <Button 
                        onClick={handleDeleteConsolidatedReport}
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center text-red-600 hover:text-red-700"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="ml-1 sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

