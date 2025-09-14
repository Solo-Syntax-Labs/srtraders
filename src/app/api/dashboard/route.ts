import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    
    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get dashboard statistics
    const [statsResult, recentInvoicesResult] = await Promise.all([
      // Get overall statistics
      supabase
        .from('invoices')
        .select('status, profit')
        .eq('created_by', (user as any).id),
      
      // Get recent 5 invoices with detailed information
      supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          status,
          profit,
          weight,
          hsn_code,
          created_at,
          sale_party:sale_party_id(name),
          purchase_party:purchase_party_id(name)
        `)
        .eq('created_by', (user as any).id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    if (statsResult.error) {
      console.error('Error fetching stats:', statsResult.error)
      return NextResponse.json({ message: 'Error fetching statistics' }, { status: 500 })
    }

    if (recentInvoicesResult.error) {
      console.error('Error fetching recent invoices:', recentInvoicesResult.error)
      return NextResponse.json({ message: 'Error fetching recent invoices' }, { status: 500 })
    }

    // Calculate statistics from all invoices
    const allInvoices = statsResult.data || []
    const totalInvoices = allInvoices.length
    const pendingInvoices = allInvoices.filter(inv => inv.status === 'payment_pending').length
    const completedInvoices = allInvoices.filter(inv => inv.status === 'completed').length
    const totalProfit = allInvoices.reduce((sum, inv) => sum + (inv.profit || 0), 0)

    // Calculate profit trends (optional: you can expand this later)
    const avgProfitPerInvoice = totalInvoices > 0 ? totalProfit / totalInvoices : 0

    return NextResponse.json({
      stats: {
        totalInvoices,
        pendingInvoices,
        completedInvoices,
        totalProfit,
        avgProfitPerInvoice,
        completionRate: totalInvoices > 0 ? Math.round((completedInvoices / totalInvoices) * 100) : 0
      },
      recentInvoices: recentInvoicesResult.data || [],
      summary: {
        hasInvoices: totalInvoices > 0,
        mostRecentInvoice: recentInvoicesResult.data?.[0] || null,
        profitTrend: totalProfit >= 0 ? 'positive' : 'negative'
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
