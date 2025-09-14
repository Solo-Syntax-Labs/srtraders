'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Filter,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  weight: number
  profit: number | null
  sale_cost: number | null
  purchase_cost: number | null
  sale_party: { name: string } | null
  purchase_party: { name: string } | null
  status: 'payment_pending' | 'completed'
  hsn_code: string | null
  created_at: string
}

export default function InvoicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [partyFilter, setPartyFilter] = useState('all')
  const [parties, setParties] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchInvoices()
      fetchParties()
    }
  }, [session])

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/parties')
      if (response.ok) {
        const data = await response.json()
        setParties(data.parties || [])
      }
    } catch (error) {
      console.error('Error fetching parties:', error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (partyFilter !== 'all') params.append('party', partyFilter)
      
      const response = await fetch(`/api/invoices?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setInvoices(invoices.filter(inv => inv.id !== invoiceId))
      } else {
        alert('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Error deleting invoice')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-2">
              Manage your business invoices with party details and financial tracking
            </p>
          </div>
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by invoice number, HSN code, party name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Search by invoice number, HSN code, or party name
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Party</label>
                  <select
                    value={partyFilter}
                    onChange={(e) => setPartyFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Parties</option>
                    {parties.map((party) => (
                      <option key={party.id} value={party.id}>
                        {party.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                {invoices.length} invoice(s) found
              </div>
              <Button onClick={fetchInvoices} className="w-full sm:w-auto order-1 sm:order-2">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoices found
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first invoice
                </p>
                <Link href="/dashboard/invoices/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {invoice.invoice_number}
                        </h3>
                        <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center gap-x-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <div className="flex items-center flex-shrink-0">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="truncate">{new Date(invoice.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center min-w-0">
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {(invoice.sale_party?.name || 'No Sale Party')} → {(invoice.purchase_party?.name || 'No Purchase Party')}
                            </span>
                          </div>
                          {invoice.profit !== null && (
                            <div className="flex items-center flex-shrink-0">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span>Profit: ${invoice.profit.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex justify-between sm:justify-end space-x-2 order-2 sm:order-2">
                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Eye className="h-4 w-4 sm:mr-0" />
                            <span className="ml-1 sm:hidden">View</span>
                          </Button>
                        </Link>
                        <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Edit className="h-4 w-4 sm:mr-0" />
                            <span className="ml-1 sm:hidden">Edit</span>
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-4 w-4 sm:mr-0" />
                          <span className="ml-1 sm:hidden">Delete</span>
                        </Button>
                      </div>

                      <div className="text-left sm:text-right order-1 sm:order-1">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
                        </Badge>
                        <div className="flex flex-wrap gap-x-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <span>Weight: {invoice.weight} kg</span>
                          {invoice.hsn_code && (
                            <span>HSN: {invoice.hsn_code}</span>
                          )}
                        </div>
                        {(invoice.sale_cost || invoice.purchase_cost) && (
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-2">
                            {invoice.sale_cost && <span>Sale: $${invoice.sale_cost}</span>}
                            {invoice.purchase_cost && <span>Purchase: $${invoice.purchase_cost}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
