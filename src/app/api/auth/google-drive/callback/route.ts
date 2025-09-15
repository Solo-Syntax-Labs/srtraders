import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url)
    // const code = searchParams.get('code')
    // const state = searchParams.get('state') // This should be the user ID
    // const error = searchParams.get('error')

    // if (error) {
    //   return NextResponse.redirect(new URL(`/dashboard?error=google_drive_auth_failed`, request.url))
    // }

    // if (!code || !state) {
    //   return NextResponse.redirect(new URL(`/dashboard?error=missing_parameters`, request.url))
    // }

    // const oauth2Client = new google.auth.OAuth2(
    //   process.env.GOOGLE_DRIVE_CLIENT_ID,
    //   process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    //   process.env.GOOGLE_DRIVE_REDIRECT_URI
    // )

    // // Exchange code for tokens
    // const { tokens } = await oauth2Client.getToken(code)

    // if (!tokens.access_token) {
    //   return NextResponse.redirect(new URL(`/dashboard?error=token_exchange_failed`, request.url))
    // }

    // const supabase = await createServerClient()

    // // Store tokens in database
    // const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null

    // const { error: dbError } = await supabase
    //   .from('google_drive_tokens')
    //   .upsert({
    //     user_id: state, // user ID from state parameter
    //     access_token: tokens.access_token,
    //     refresh_token: tokens.refresh_token || null,
    //     expires_at: expiresAt?.toISOString() || null,
    //   })

    // if (dbError) {
    //   console.error('Error storing Google Drive tokens:', dbError)
    //   return NextResponse.redirect(new URL(`/dashboard?error=token_storage_failed`, request.url))
    // }

    return NextResponse.redirect(new URL(`/dashboard?success=google_drive_connected`, request.url))
  } catch (error) {
    console.error('Google Drive callback error:', error)
    return NextResponse.redirect(new URL(`/dashboard?error=callback_failed`, request.url))
  }
}
