import { NextRequest, NextResponse } from 'next/server'

/**
 * MEGA Upload Route - Delegates to Unified Documents API
 * 
 * This route is a convenience wrapper that forces MEGA storage
 * by calling the unified documents API with storage=mega parameter.
 * This ensures consistent behavior and reduces code duplication.
 */
export async function POST(request: NextRequest) {
  try {
    // Create a new URL with the mega storage parameter
    const url = new URL(request.url)
    url.pathname = '/api/documents'
    url.searchParams.set('storage', 'mega')

    // Create a new request with the modified URL
    const documentsRequest = new NextRequest(url.toString(), {
      method: 'POST',
      headers: request.headers,
      body: request.body,
    })

    // Import and call the unified documents API
    const { POST: documentsPost } = await import('@/app/api/documents/route')
    
    return await documentsPost(documentsRequest)

  } catch (error) {
    console.error('MEGA upload route error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
