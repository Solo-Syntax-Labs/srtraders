import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { InsertUser } from '@/lib/supabase/types'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in our users table
    const userData: InsertUser = {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      auth_provider: 'email',
      email_verified: false,
      is_active: true,
    }

    const { data: newUser, error: userError } = await (supabase
      .from('users') as any)
      .insert(userData)
      .select()
      .single()

    if (userError || !newUser) {
      return NextResponse.json(
        { message: 'Failed to create user account' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'User created successfully. You can now sign in.',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
