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
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    let query = supabase
      .from('parties')
      .select('*')
      .order('name', { ascending: true })

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: parties, error, count } = await query

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      parties,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching parties:', error)
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
    const partyData = await request.json()

    const { name } = partyData

    if (!name?.trim()) {
      return NextResponse.json(
        { message: 'Party name is required' },
        { status: 400 }
      )
    }

    // Check if party name already exists
    const { data: existingParty } = await supabase
      .from('parties')
      .select('id')
      .eq('name', name.trim())
      .single()

    if (existingParty) {
      return NextResponse.json(
        { message: 'Party name already exists' },
        { status: 409 }
      )
    }

    // Create party
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .insert([{
        name: name.trim(),
      }] as any)
      .select()
      .single()

    if (partyError) {
      return NextResponse.json({ message: partyError.message }, { status: 500 })
    }

    return NextResponse.json({ party }, { status: 201 })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
