'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { FileText, Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface DashboardStats {
  totalInvoices: number
  pendingInvoices: number
  completedInvoices: number
  totalProfit: number
  avgProfitPerInvoice: number
  completionRate: number
}

interface DashboardSummary {
  hasInvoices: boolean
  mostRecentInvoice: { created_at: string } | null
  profitTrend: 'positive' | 'negative'
}

interface RecentInvoice {
  id: string
  invoice_number: string
  status: 'payment_pending' | 'completed'
  profit: number | null
  weight: number
  hsn_code: string | null
  created_at: string
  sale_party: { name: string } | null
  purchase_party: { name: string } | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    pendingInvoices: 0,
    completedInvoices: 0,
    totalProfit: 0,
    avgProfitPerInvoice: 0,
    completionRate: 0
  })
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([])
  const [summary, setSummary] = useState<DashboardSummary>({
    hasInvoices: false,
    mostRecentInvoice: null,
    profitTrend: 'positive'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        
        setStats(data.stats)
        setRecentInvoices(data.recentInvoices)
        setSummary(data.summary)
      } else {
        console.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <Link href="/dashboard/invoices/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.totalProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${stats.avgProfitPerInvoice.toFixed(2)} avg per invoice
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
            <CardDescription>
              Key performance indicators for your invoice management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.completionRate}%
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${summary.profitTrend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.profitTrend === 'positive' ? '📈' : '📉'}
                </div>
                <p className="text-sm text-muted-foreground">Profit Trend</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.mostRecentInvoice ? new Date(summary.mostRecentInvoice.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">Last Invoice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>
                  Your latest invoice submissions
                </CardDescription>
              </div>
              <Link href="/dashboard/invoices" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoices yet
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
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <Link 
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-full ${
                          invoice.status === 'completed' 
                            ? 'bg-green-100 text-green-600 group-hover:bg-green-200'
                            : invoice.status === 'payment_pending'
                            ? 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        } transition-colors`}>
                          {invoice.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : invoice.status === 'payment_pending' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                            {invoice.invoice_number}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                            {invoice.sale_party?.name && invoice.purchase_party?.name && (
                              <span className="truncate">
                                {invoice.sale_party.name} → {invoice.purchase_party.name}
                              </span>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <span>{invoice.weight} kg</span>
                              {invoice.hsn_code && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  HSN: {invoice.hsn_code}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`font-medium ${(invoice.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${invoice.profit?.toLocaleString() || '0'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            {invoice.status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
                          </p>
                          <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
