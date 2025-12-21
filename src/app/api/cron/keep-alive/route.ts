import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * Keep-Alive Endpoint
 * 
 * This endpoint prevents Supabase from auto-pausing due to inactivity.
 * It performs a lightweight database query to maintain activity.
 * 
 * Should be called periodically via cron job (e.g., every 5 days)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServerClient()
    
    // Perform a lightweight query to keep database active
    // Query the users table to check if any users exist
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Keep-alive query error:', error)
      return NextResponse.json(
        { 
          message: 'Keep-alive query failed',
          error: error.message,
          success: false
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Database keep-alive successful',
      timestamp: new Date().toISOString(),
      success: true,
      queryExecuted: true
    })

  } catch (error) {
    console.error('Keep-alive error:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request)
}
