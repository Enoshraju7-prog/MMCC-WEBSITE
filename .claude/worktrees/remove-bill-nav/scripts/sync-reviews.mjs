import { readFileSync, writeFileSync } from 'fs'
import { get } from 'https'

const PLACE_ID = 'ChIJWwlCBNkpODoROIMxVQQbd2w'
const API_KEY = process.env.GOOGLE_PLACES_KEY

if (!API_KEY) {
  console.error('GOOGLE_PLACES_KEY env var not set')
  process.exit(1)
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&key=${API_KEY}&languageCode=en`
const result = await fetch(url)

if (!result.reviews) {
  console.log('No reviews returned from API:', JSON.stringify(result))
  process.exit(0)
}

const raw = readFileSync('lib/reviews.ts', 'utf8')

// Extract existing IDs from the file
const existingIds = new Set([...raw.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]))

// Extract existing author+text combos to catch duplicates without IDs
const existingTexts = new Set([...raw.matchAll(/text:\s*'([^']+)'/g)].map(m => m[1].toLowerCase().trim()))

let added = 0

for (const r of result.reviews) {
  if (r.rating < 4) continue

  const text = r.text?.text?.replace(/'/g, "\\'") || ''
  const author = r.authorAttribution?.displayName?.replace(/'/g, "\\'") || 'Anonymous'
  const publishTime = r.publishTime || new Date().toISOString()
  const date = publishTime.slice(0, 10)

  // Generate stable ID from timestamp
  const ts = Math.floor(new Date(publishTime).getTime() / 1000)
  const id = `g${ts}`

  if (existingIds.has(id)) continue
  if (existingTexts.has(text.toLowerCase().trim())) continue
  if (!text) continue

  const entry = `  {
    id: '${id}',
    author: '${author}',
    rating: ${r.rating},
    text: '${text}',
    date: '${date}',
  },\n`

  // Insert after the opening of the REVIEWS array
  const insertPoint = raw.indexOf('export const REVIEWS: Review[] = [\n')
  if (insertPoint === -1) {
    console.error('Could not find insertion point in reviews.ts')
    process.exit(1)
  }

  const insertAt = insertPoint + 'export const REVIEWS: Review[] = [\n'.length
  const newContent = raw.slice(0, insertAt) + entry + raw.slice(insertAt)

  writeFileSync('lib/reviews.ts', newContent)
  console.log(`Added review from ${author} (${date})`)
  added++
}

if (added === 0) {
  console.log('No new reviews to add.')
} else {
  console.log(`Done. Added ${added} new review(s).`)
}
