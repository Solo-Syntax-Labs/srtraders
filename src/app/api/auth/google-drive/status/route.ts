import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: tokenData, error } = await supabase
      .from('google_drive_tokens')
      .select('expires_at, created_at')
      .eq('user_id', session.user.id)
      .single()

    if (error || !tokenData) {
      return NextResponse.json({
        connected: false,
        message: 'Google Drive not connected'
      })
    }

    const isExpired = tokenData.expires_at ? 
      new Date(tokenData.expires_at) < new Date() : false

    return NextResponse.json({
      connected: true,
      expired: isExpired,
      connectedAt: tokenData.created_at,
      expiresAt: tokenData.expires_at,
    })
  } catch (error) {
    console.error('Error checking Google Drive status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('google_drive_tokens')
      .delete()
      .eq('user_id', session.user.id)

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Google Drive disconnected successfully' })
  } catch (error) {
    console.error('Error disconnecting Google Drive:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
