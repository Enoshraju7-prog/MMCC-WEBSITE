import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return NextResponse.json({ error: 'No key' }, { status: 500 })

  const address = encodeURIComponent('MM Car Care, Opp APSP Petrol Bunk, Kakinada, Andhra Pradesh 533001, India')

  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=17&size=640x320&scale=2&maptype=roadmap&markers=color:0xC9A96E|label:M|${address}&key=${key}`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return NextResponse.json({ error: 'Map API failed' }, { status: 502 })
    const data = await res.arrayBuffer()
    return new Response(data, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch map' }, { status: 500 })
  }
}
