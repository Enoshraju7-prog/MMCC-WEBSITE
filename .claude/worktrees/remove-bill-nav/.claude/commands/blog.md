Run the full MM Car Care blog generation pipeline. Do NOT ask for confirmation at any step — execute everything end to end automatically.

## Step 1 — Read keywords.csv
- Open `keywords.csv`
- Find the first row where `status = pending` (lowest priority number)
- Note the keyword, volume, kd, cluster, intent

## Step 2 — Read ALL reference files (no shortcuts)
Read every one of these before writing a single word:
1. `references/on-page-seo.md` — 80-item SEO checklist, every item must be satisfied
2. `references/blog-process.md` — 8-step research process, run every step
3. `references/humour.md` — dad joke mandatory in first 50 words
4. `references/voice.md` — sentence style and words to avoid
5. `references/stats.md` — real numbers only, never invent statistics
6. `references/stories.md` — real workshop anecdotes for grounding
7. `references/opinions.md` — strong positions stated as facts

## Step 3 — Research (run all 8 steps from blog-process.md)
- WebSearch the primary keyword
- WebFetch top 3 results — read full content
- Match their format (listicle / guide / comparison) and length (within 20%)
- Cover every H2/H3 topic across all 3 pages
- Find People Also Ask questions — use 4–8 as the FAQ section
- Add 1–2 Kakinada-specific angles the top 3 missed

## Step 4 — Generate the BlogPost entry in lib/blog.ts
Add a new entry to `BLOG_POSTS` array using this exact structure:

```typescript
{
  slug: 'keyword-as-slug',
  title: 'SEO Title Here',               // 50-60 chars, primary keyword near start
  description: 'Meta description.',      // 150-160 chars, keyword + benefit + CTA
  date: 'YYYY-MM-DD',                    // today's date
  readTime: 'X min read',
  category: 'Category Name',
  author: 'Santosham Devisetty',
  pexelsQuery: 'specific image description',
  relatedSlugs: ['slug-1', 'slug-2', 'slug-3'],
  faqs: [
    { q: 'Question from People Also Ask?', a: 'Direct 2-4 sentence answer.' },
    // 4-8 FAQs total
  ],
  content: [
    // Full article minimum 1,000 words
    // First paragraph answers the primary keyword query directly (featured snippet)
    // h2 sections target supporting keywords from the cluster
    // tip blocks for MM Car Care-specific insights
    // End with CTA: phone 9848377309, Opp. APSP Petrol Bunk
  ],
}
```

Writing rules:
- First 50 words must contain a dad joke or human wink — no exceptions
- Short sentences. Active voice. No corporate filler.
- Every section grounded in Kakinada: coastal air, monsoon roads, 42°C heat
- Real numbers from stats.md only — never invent a statistic
- End every post with CTA: phone 9848377309, Opp. APSP Petrol Bunk

## Step 5 — Update keywords.csv
Change the row's `status` from `pending` to `published`.
Fill in `slug`, `title`, and `date_published` for that row.

## Step 6 — Commit and push to GitHub
```bash
git add lib/blog.ts keywords.csv
git commit -m "Add blog post: [Post Title]"
git push origin main
```

Vercel auto-deploys on push. Post is live within 2 minutes.
