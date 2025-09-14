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
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        sale_party:sale_party_id(id, name),
        purchase_party:purchase_party_id(id, name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
      }
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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
    const updateData = await request.json()

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if invoice exists and user has permission to update
    const { data: existingInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
      }
      return NextResponse.json({ message: fetchError.message }, { status: 500 })
    }

    // Check permissions (user can only update their own invoices)
    if ((existingInvoice as any).created_by !== (user as any).id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Calculate profit if sale_cost and purchase_cost are provided
    if (updateData.sale_cost && updateData.purchase_cost) {
      updateData.profit = parseFloat(updateData.sale_cost) - parseFloat(updateData.purchase_cost)
    }

    // Convert numeric fields
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight)
    if (updateData.sale_cost) updateData.sale_cost = parseFloat(updateData.sale_cost)
    if (updateData.purchase_cost) updateData.purchase_cost = parseFloat(updateData.purchase_cost)
    if (updateData.profit) updateData.profit = parseFloat(updateData.profit)

    // Update invoice
    const { data: invoice, error: updateError } = await supabase
      .from('invoices')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ message: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { id } = await params

    // Check if invoice exists and user has permission to delete
    const { data: existingInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ message: 'Invoice not found' }, { status: 404 })
      }
      return NextResponse.json({ message: fetchError.message }, { status: 500 })
    }

    // Get user id by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user?.email)
      .single()
      
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check permissions
    if ((existingInvoice as any).created_by !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Delete invoice (cascade will handle products and documents)
    const { error: deleteError } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ message: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
