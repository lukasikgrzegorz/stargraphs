import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, footerCut } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const screenshotApiUrl = process.env.NEXT_PUBLIC_SCREENSHOT_API_URL
    
    if (!screenshotApiUrl) {
      return NextResponse.json(
        { error: 'Screenshot API URL not configured' },
        { status: 500 }
      )
    }

    // Wykonaj zapytanie do zewnętrznego API
    const response = await fetch(screenshotApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        footerCut: footerCut || 160
      })
    })

    if (!response.ok) {
      throw new Error(`Screenshot API returned ${response.status}`)
    }

    // Pobierz obraz jako buffer
    const imageBuffer = await response.arrayBuffer()
    
    // Zwróć obraz z odpowiednimi nagłówkami
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="star-graph.png"',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Screenshot proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to generate screenshot' },
      { status: 500 }
    )
  }
}
