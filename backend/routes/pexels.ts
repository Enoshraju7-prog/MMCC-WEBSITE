import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || 'car'
  const apiKey = process.env.PEXELS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ url: null, error: 'Missing API key' })
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 86400 }, // cache 24 hours
      }
    )
    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return NextResponse.json({ url: null })

    return NextResponse.json({
      url: photo.src.large2x,
      small: photo.src.medium,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    })
  } catch {
    return NextResponse.json({ url: null })
  }
}
