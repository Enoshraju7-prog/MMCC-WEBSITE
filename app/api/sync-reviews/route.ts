import { NextResponse } from 'next/server'

const PLACE_ID = 'ChIJWwlCBNkpODoROIMxVQQbd2w'
const GITHUB_REPO = 'Enoshraju7-prog/MMCC-WEBSITE'
const FILE_PATH = 'lib/reviews.ts'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_KEY
  const githubToken = process.env.GITHUB_TOKEN

  if (!apiKey || !githubToken) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  // 1. Fetch latest reviews from Google Places API
  const placesRes = await fetch(
    `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&languageCode=en&key=${apiKey}`
  )
  const placesData = await placesRes.json()
  const reviews = placesData.reviews ?? []

  if (!reviews.length) {
    return NextResponse.json({ message: 'No reviews from API' })
  }

  // 2. Get current reviews.ts from GitHub
  const ghRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  const ghData = await ghRes.json()
  const currentContent = Buffer.from(ghData.content, 'base64').toString('utf8')

  // 3. Find new reviews not already in the file
  const existingTexts = new Set(
    [...currentContent.matchAll(/text:\s*'([^']+)'/g)].map(m => m[1].toLowerCase().trim())
  )

  const newEntries: string[] = []

  for (const r of reviews) {
    if (r.rating < 4) continue
    const text = (r.text?.text ?? '').replace(/'/g, "\\'").trim()
    const author = (r.authorAttribution?.displayName ?? 'Anonymous').replace(/'/g, "\\'")
    const date = (r.publishTime ?? new Date().toISOString()).slice(0, 10)
    const ts = Math.floor(new Date(r.publishTime ?? Date.now()).getTime() / 1000)
    const id = `g${ts}`

    if (!text) continue
    if (existingTexts.has(text.toLowerCase())) continue
    if (currentContent.includes(`id: '${id}'`)) continue

    newEntries.push(
      `  {\n    id: '${id}',\n    author: '${author}',\n    rating: ${r.rating},\n    text: '${text}',\n    date: '${date}',\n  },`
    )
  }

  if (!newEntries.length) {
    return NextResponse.json({ message: 'No new reviews to add' })
  }

  // 4. Insert new reviews at the top of the REVIEWS array
  const marker = 'export const REVIEWS: Review[] = [\n'
  const insertAt = currentContent.indexOf(marker) + marker.length
  const updatedContent = currentContent.slice(0, insertAt) + newEntries.join('\n') + '\n' + currentContent.slice(insertAt)

  // 5. Commit back to GitHub
  const commitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `chore: sync ${newEntries.length} new Google review(s)`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: ghData.sha,
        committer: { name: 'reviews-bot', email: 'bot@mmcarcarekakinada.co.in' },
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json()
    return NextResponse.json({ error: 'GitHub commit failed', detail: err }, { status: 500 })
  }

  return NextResponse.json({ message: `Added ${newEntries.length} new review(s)` })
}
