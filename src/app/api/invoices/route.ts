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
    const { searchParams } = new URL(request.url)
    
    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build base query
    let query = supabase
      .from('invoices')
      .select(`
        *,
        sale_party:sale_party_id(name),
        purchase_party:purchase_party_id(name)
      `)
      .eq('created_by', (user as any).id)

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply party filter
    const party = searchParams.get('party')
    if (party && party !== 'all') {
      query = query.or(`sale_party_id.eq.${party},purchase_party_id.eq.${party}`)
    }

    // Apply search filter with party name support
    if (search) {
      try {
        // First, find parties that match the search term
        const { data: matchingParties, error: partyError } = await supabase
          .from('parties')
          .select('id')
          .ilike('name', `%${search}%`)

        if (partyError) {
          console.error('Error searching parties:', partyError)
        }

        const matchingPartyIds = matchingParties?.map((p: any) => p.id) || []

        // Build search conditions for invoice fields
        let searchConditions = `invoice_number.ilike.%${search}%,hsn_code.ilike.%${search}%`
        
        // Add party conditions if we found matching parties
        if (matchingPartyIds.length > 0) {
          const partyConditions = matchingPartyIds.map(id => 
            `sale_party_id.eq.${id},purchase_party_id.eq.${id}`
          ).join(',')
          searchConditions += `,${partyConditions}`
        }

        query = query.or(searchConditions)
      } catch (searchError) {
        console.error('Error in search functionality:', searchError)
        // Fallback to basic search if party search fails
        query = query.or(`invoice_number.ilike.%${search}%,hsn_code.ilike.%${search}%`)
      }
    }

    // Apply ordering after all filters
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: invoices, error, count } = await query

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const invoiceData = await request.json()

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const {
      invoice_number,
      sale_doc,
      purchase_doc,
      toll_doc,
      weight_report,
      consolidated_doc,
      hsn_code,
      weight,
      profit,
      sale_cost,
      purchase_cost,
      sale_party_id,
      purchase_party_id,
      status = 'payment_pending',
      debit_note,
      credit_note,
      classification_report,
    } = invoiceData

    if (!invoice_number?.trim()) {
      return NextResponse.json(
        { message: 'Invoice number is required' },
        { status: 400 }
      )
    }

    if (!weight || weight <= 0) {
      return NextResponse.json(
        { message: 'Valid weight is required' },
        { status: 400 }
      )
    }

    // Check if invoice number already exists
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('invoice_number', invoice_number.trim())
      .single()

    if (existingInvoice) {
      return NextResponse.json(
        { message: 'Invoice number already exists' },
        { status: 409 }
      )
    }

    // Calculate profit if sale_cost and purchase_cost are provided
    let calculatedProfit = profit
    if (sale_cost && purchase_cost) {
      calculatedProfit = parseFloat(sale_cost) - parseFloat(purchase_cost)
    }

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoice_number.trim(),
        sale_doc,
        purchase_doc,
        toll_doc,
        weight_report,
        consolidated_doc,
        hsn_code,
        weight: parseFloat(weight),
        profit: calculatedProfit ? parseFloat(calculatedProfit) : null,
        sale_cost: sale_cost ? parseFloat(sale_cost) : null,
        purchase_cost: purchase_cost ? parseFloat(purchase_cost) : null,
        sale_party_id: sale_party_id || null,
        purchase_party_id: purchase_party_id || null,
        status,
        debit_note,
        credit_note,
        classification_report,
        created_by: (user as any).id,
      }] as any)
      .select()
      .single()

    if (invoiceError) {
      return NextResponse.json({ message: invoiceError.message }, { status: 500 })
    }

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
