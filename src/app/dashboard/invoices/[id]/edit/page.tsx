'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { 
  ArrowLeft, 
  Save,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { PartySelector } from '@/components/ui/party-selector'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  FileText,
  Upload,
  X
} from 'lucide-react'

interface InvoiceFormData {
  invoice_number: string
  weight: string
  sale_cost: string
  purchase_cost: string
  sale_party_id: string
  purchase_party_id: string
  status: 'payment_pending' | 'completed'
  hsn_code: string
  debit_note: string
  credit_note: string
  sale_doc: string
  purchase_doc: string
  toll_doc: string
  weight_report: string
  consolidated_doc: string
  classification_report: string
}

interface UploadedDocument {
  document_id: string
  file_name: string
  file_size: number
  file_type: string
  type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other'
  storage_path: string
  uploading?: boolean
  uploadError?: string
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  // Get the invoice ID from params at the component level
  const { id: invoiceId } = React.use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoice_number: '',
    weight: '',
    sale_cost: '',
    purchase_cost: '',
    sale_party_id: '',
    purchase_party_id: '',
    status: 'payment_pending',
    hsn_code: '',
    debit_note: '',
    credit_note: '',
    sale_doc: '',
    purchase_doc: '',
    toll_doc: '',
    weight_report: '',
    consolidated_doc: '',
    classification_report: ''
  })
  const [calculatedProfit, setCalculatedProfit] = useState<number>(0)
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [errors, setErrors] = useState<Partial<InvoiceFormData>>({})

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      if (response.ok) {
        const data = await response.json()
        const invoice = data.invoice
        setFormData({
          invoice_number: invoice.invoice_number,
          weight: invoice.weight.toString(),
          sale_cost: invoice.sale_cost ? invoice.sale_cost.toString() : '',
          purchase_cost: invoice.purchase_cost ? invoice.purchase_cost.toString() : '',
          sale_party_id: invoice.sale_party_id || '',
          purchase_party_id: invoice.purchase_party_id || '',
          status: invoice.status,
          hsn_code: invoice.hsn_code || '',
          debit_note: invoice.debit_note || '',
          credit_note: invoice.credit_note || '',
          sale_doc: invoice.sale_doc || '',
          purchase_doc: invoice.purchase_doc || '',
          toll_doc: invoice.toll_doc || '',
          weight_report: invoice.weight_report || '',
          consolidated_doc: invoice.consolidated_doc || '',
          classification_report: invoice.classification_report || ''
        })
        
        // Calculate initial profit
        if (invoice.sale_cost && invoice.purchase_cost) {
          setCalculatedProfit(invoice.sale_cost - invoice.purchase_cost)
        }
      } else {
        router.push('/dashboard/invoices')
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
      router.push('/dashboard/invoices')
    } finally {
      setInitialLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchInvoice()
    }
  }, [session, fetchInvoice])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-calculate profit when sale_cost or purchase_cost changes
    if (name === 'sale_cost' || name === 'purchase_cost') {
      const saleValue = name === 'sale_cost' ? parseFloat(value) || 0 : parseFloat(formData.sale_cost) || 0
      const purchaseValue = name === 'purchase_cost' ? parseFloat(value) || 0 : parseFloat(formData.purchase_cost) || 0
      setCalculatedProfit(saleValue - purchaseValue)
    }
    
    if (errors[name as keyof InvoiceFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleDocumentAdd = async (file: File, type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other') => {
    // Create temporary document entry with uploading state
    const tempId = `temp_${Date.now()}`
    const uploadingDocument: UploadedDocument = {
      document_id: tempId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      type,
      storage_path: '',
      uploading: true
    }
    
    // Add to documents list with uploading state
    setDocuments(prev => [...prev, uploadingDocument])
    
    try {
      // Upload file immediately
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('document_type', type)

      const uploadResponse = await fetch('/api/upload/supabase', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const uploadResult = await uploadResponse.json()
      
      // Update document with real data from server
      const finalDocument: UploadedDocument = {
        document_id: uploadResult.document_id,
        file_name: uploadResult.file_name,
        file_size: uploadResult.file_size,
        file_type: uploadResult.file_type,
        type,
        storage_path: uploadResult.storage_path,
        uploading: false
      }

      // Replace temporary document with final document
      setDocuments(prev => prev.map(doc => 
        doc.document_id === tempId ? finalDocument : doc
      ))

      // Auto-populate the corresponding reference field
      const fieldMapping = {
        'sale': 'sale_doc',
        'purchase': 'purchase_doc',
        'toll': 'toll_doc',
        'weight_report': 'weight_report',
        'consolidated': 'consolidated_doc',
        'classification': 'classification_report'
      }
      
      const fieldName = fieldMapping[type as keyof typeof fieldMapping]
      if (fieldName) {
        setFormData(prev => ({ ...prev, [fieldName]: uploadResult.document_id }))
      }

    } catch (error) {
      console.error('Upload error:', error)
      
      // Update document with error state
      setDocuments(prev => prev.map(doc => 
        doc.document_id === tempId 
          ? { ...doc, uploading: false, uploadError: error instanceof Error ? error.message : 'Upload failed' }
          : doc
      ))
    }
  }

  const handleDocumentRemove = async (documentId: string) => {
    // Find the document being removed
    const documentToRemove = documents.find(d => d.document_id === documentId)
    
    if (documentToRemove && !documentToRemove.uploading && !documentToRemove.uploadError) {
      // Try to delete from server if it was successfully uploaded
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('Error deleting document from server:', error)
        // Continue with local removal even if server deletion fails
      }
    }
    
    // Remove from documents list
    setDocuments(prev => prev.filter(d => d.document_id !== documentId))
    
    // Clear the corresponding reference field
    if (documentToRemove) {
      const fieldMapping = {
        'sale': 'sale_doc',
        'purchase': 'purchase_doc',
        'toll': 'toll_doc',
        'weight_report': 'weight_report',
        'consolidated': 'consolidated_doc',
        'classification': 'classification_report'
      }
      
      const fieldName = fieldMapping[documentToRemove.type as keyof typeof fieldMapping]
      if (fieldName) {
        setFormData(prev => ({ ...prev, [fieldName]: '' }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<InvoiceFormData> = {}

    if (!formData.invoice_number.trim()) {
      newErrors.invoice_number = 'Invoice number is required'
    }
    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Valid weight is required'
    }
    if (!formData.sale_party_id) {
      newErrors.sale_party_id = 'Sale party is required'
    }
    if (!formData.purchase_party_id) {
      newErrors.purchase_party_id = 'Purchase party is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Check if any documents are still uploading
      const uploadingDocs = documents.filter(doc => doc.uploading)
      if (uploadingDocs.length > 0) {
        alert(`Please wait for ${uploadingDocs.length} document(s) to finish uploading`)
        setLoading(false)
        return
      }

      // Check for upload errors
      const errorDocs = documents.filter(doc => doc.uploadError)
      if (errorDocs.length > 0) {
        alert(`Please fix upload errors for: ${errorDocs.map(d => d.file_name).join(', ')}`)
        setLoading(false)
        return
      }

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_number: formData.invoice_number,
          weight: Number(formData.weight),
          sale_cost: formData.sale_cost ? Number(formData.sale_cost) : null,
          purchase_cost: formData.purchase_cost ? Number(formData.purchase_cost) : null,
          sale_party_id: formData.sale_party_id || null,
          purchase_party_id: formData.purchase_party_id || null,
          status: formData.status,
          hsn_code: formData.hsn_code || null,
          debit_note: formData.debit_note || null,
          credit_note: formData.credit_note || null,
          sale_doc: formData.sale_doc || null,
          purchase_doc: formData.purchase_doc || null,
          toll_doc: formData.toll_doc || null,
          weight_report: formData.weight_report || null,
          consolidated_doc: formData.consolidated_doc || null,
          classification_report: formData.classification_report || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update invoice')
      }

      router.push(`/dashboard/invoices/${invoiceId}`)
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert(error instanceof Error ? error.message : 'Failed to update invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/invoices')
      } else {
        alert('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Error deleting invoice')
    }
  }

  if (status === 'loading' || initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href={`/dashboard/invoices/${invoiceId}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoice
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Invoice</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Update invoice details and information
                </p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Invoice
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number *</Label>
                  <Input
                    id="invoice_number"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleInputChange}
                    placeholder="INV-001"
                    className={errors.invoice_number ? 'border-red-500' : ''}
                  />
                  {errors.invoice_number && (
                    <p className="text-red-500 text-sm">{errors.invoice_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm">{errors.weight}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hsn_code">HSN Code</Label>
                  <Input
                    id="hsn_code"
                    name="hsn_code"
                    value={formData.hsn_code}
                    onChange={handleInputChange}
                    placeholder="HSN Code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="payment_pending">Payment Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Party & Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Party & Financial Information</CardTitle>
              <CardDescription>
                Update the parties involved and financial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <PartySelector
                  value={formData.sale_party_id}
                  onValueChange={(partyId) => setFormData(prev => ({ ...prev, sale_party_id: partyId }))}
                  label="Sale Party"
                  placeholder="Select sale party"
                  error={errors.sale_party_id}
                  required
                />

                <PartySelector
                  value={formData.purchase_party_id}
                  onValueChange={(partyId) => setFormData(prev => ({ ...prev, purchase_party_id: partyId }))}
                  label="Purchase Party"
                  placeholder="Select purchase party"
                  error={errors.purchase_party_id}
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="sale_cost">Sale Cost ($)</Label>
                  <Input
                    id="sale_cost"
                    name="sale_cost"
                    type="number"
                    step="0.01"
                    value={formData.sale_cost}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchase_cost">Purchase Cost ($)</Label>
                  <Input
                    id="purchase_cost"
                    name="purchase_cost"
                    type="number"
                    step="0.01"
                    value={formData.purchase_cost}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                {(formData.sale_cost || formData.purchase_cost) && (
                  <div className="space-y-2">
                    <Label>Calculated Profit</Label>
                    <div className={`px-3 py-2 border rounded-md bg-gray-50 ${
                      calculatedProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${calculatedProfit.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="debit_note">Debit Note</Label>
                  <Input
                    id="debit_note"
                    name="debit_note"
                    value={formData.debit_note}
                    onChange={handleInputChange}
                    placeholder="Debit note reference"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_note">Credit Note</Label>
                  <Input
                    id="credit_note"
                    name="credit_note"
                    value={formData.credit_note}
                    onChange={handleInputChange}
                    placeholder="Credit note reference"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Upload and manage documents for this invoice. Document IDs will be automatically assigned.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { key: 'sale', label: 'Sale Document', field: 'sale_doc' },
                  { key: 'purchase', label: 'Purchase Document', field: 'purchase_doc' },
                  { key: 'toll', label: 'Toll Document', field: 'toll_doc' },
                  { key: 'weight_report', label: 'Weight Report', field: 'weight_report' },
                  { key: 'consolidated', label: 'Consolidated Document', field: 'consolidated_doc' },
                  { key: 'classification', label: 'Classification Report', field: 'classification_report' }
                ].map((docConfig) => {
                  const existingDoc = documents.find(d => d.type === docConfig.key)
                  const fieldValue = formData[docConfig.field as keyof InvoiceFormData] as string
                  
                  return (
                    <div key={docConfig.key} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{docConfig.label}</Label>
                        {fieldValue && !existingDoc && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Current: {fieldValue.slice(0, 20)}...
                          </span>
                        )}
                      </div>
                      
                      {existingDoc ? (
                        // Show uploaded document status
                        <div className={`border-2 rounded-md p-3 sm:p-4 ${
                          existingDoc.uploading 
                            ? 'border-blue-200 bg-blue-50' 
                            : existingDoc.uploadError 
                            ? 'border-red-200 bg-red-50'
                            : 'border-green-200 bg-green-50'
                        }`}>
                          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {existingDoc.uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0"></div>
                              ) : existingDoc.uploadError ? (
                                <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${
                                  existingDoc.uploading 
                                    ? 'text-blue-800' 
                                    : existingDoc.uploadError 
                                    ? 'text-red-800'
                                    : 'text-green-800'
                                }`}>
                                  {existingDoc.file_name}
                                </p>
                                <p className={`text-xs ${
                                  existingDoc.uploading 
                                    ? 'text-blue-600' 
                                    : existingDoc.uploadError 
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                }`}>
                                  {existingDoc.uploading 
                                    ? 'Uploading...' 
                                    : existingDoc.uploadError 
                                    ? `Error: ${existingDoc.uploadError}`
                                    : `${(existingDoc.file_size / 1024).toFixed(1)} KB`}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDocumentRemove(existingDoc.document_id)}
                              className="text-red-600 hover:text-red-700 p-2 border border-red-200 rounded-md w-full sm:w-auto flex items-center justify-center"
                              disabled={existingDoc.uploading}
                            >
                              <X className="h-4 w-4 sm:mr-0" />
                              <span className="ml-1 sm:hidden">Remove</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Show upload area or current reference
                        <div>
                          <FileUpload
                            onFileSelect={(file) => handleDocumentAdd(file, docConfig.key as any)}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="border-dashed border-2 border-gray-300 hover:border-gray-400"
                          >
                            <div className="text-center py-4 sm:py-6">
                              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs sm:text-sm text-gray-600">
                                {fieldValue ? `Replace ${docConfig.label}` : `Upload ${docConfig.label}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC</p>
                            </div>
                          </FileUpload>
                          
                          {fieldValue && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Current Reference:</strong> {fieldValue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Upload Status Summary */}
              {documents.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    New Documents ({documents.filter(d => !d.uploading && !d.uploadError).length} of {documents.length} ready)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {documents.map((doc) => (
                      <span
                        key={doc.document_id}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          doc.uploading 
                            ? 'bg-blue-100 text-blue-800' 
                            : doc.uploadError 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {doc.type.replace('_', ' ').charAt(0).toUpperCase() + doc.type.replace('_', ' ').slice(1)}
                        {doc.uploading && ' ⏳'}
                        {doc.uploadError && ' ❌'}
                        {!doc.uploading && !doc.uploadError && ' ✅'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href={`/dashboard/invoices/${invoiceId}`} className="w-full sm:w-auto">
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
