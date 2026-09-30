# MM Car Care Kakinada

Production website for MM Car Care — a car workshop in Kakinada, Andhra Pradesh.  
Live at **[mmcarcarekakinada.co.in](https://mmcarcarekakinada.co.in)**

---

## What This App Does

- Full marketing website with 10 service pages, blog, reviews, and contact
- **AI phone agent** — customer fills a form → outbound AI call triggers from an Indian number → AI collects car issue + books slot in English or Telugu
- **Lead email alerts** — after every call, owner receives a styled HTML email with customer details + call summary
- **SEO blog** — structured blog pipeline with keyword tracking, FAQ schema, and Kakinada-specific content
- **Google Reviews** — 80 live reviews displayed on site, checked by a duplicate-safe browser agent every three days

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 |
| AI Calls | VAPI.ai + Claude Haiku (Anthropic) |
| STT | Deepgram nova-2 (English), Google Gemini 2.5 Flash (Telugu) |
| TTS | Azure Neural — en-IN-NeerjaNeural / te-IN-ShrutiNeural |
| SIP Trunk | Vobiz (Indian +91 number) |
| Email | Resend (free tier, 3k/mo) |
| Deployment | Vercel |
| Call Logging | Google Sheets via Apps Script webhook |

---

## Project Structure

```
frontend/
├── app/                      # Next.js pages, layouts, and API entrypoints
├── components/               # Reusable UI and page sections
├── contexts/                 # Booking and callback client state
├── data/                     # Blog, review, and business content
├── public/                   # Static assets and verification files
└── ...                       # Next.js and TypeScript configuration

backend/
└── routes/                   # Server-side API implementations

docs/
├── references/               # SEO and editorial source material
├── review-automation.md      # Three-day Google review task
└── project_specs.md          # Project architecture and requirements
```

---

## AI Phone Agent — How It Works

```
Customer fills form (name + phone + language selection)
        ↓
POST /api/callback
        ↓
VAPI API → outbound call from +91 80715 79188 (Vobiz SIP trunk)
        ↓
AI agent (Claude Haiku) runs bilingual conversation:
  English → Deepgram nova-2 STT + Azure en-IN-NeerjaNeural TTS
  Telugu  → Google Gemini 2.5 Flash STT + Azure te-IN-ShrutiNeural TTS
        ↓
Call ends → VAPI sends end-of-call-report to POST /api/vapi-webhook
        ↓
Webhook → Resend email to owner (both Gmail accounts)
Webhook → Google Sheets log via Apps Script
```

**System prompt handles:**
- Recognises 12+ service types in English and Telugu (car wash, oil change, AC, brakes, tyres, engine, dent, polish, alignment, battery, ceramic coating)
- Interprets common Telugu STT misreads (e.g. "కార్పొరేట్" → car wash)
- Collects: issue → additional issues → preferred visit day
- Closes with proper bilingual goodbye in both languages

---

## Environment Variables

Create `.env.local` with the following keys:

```env
# VAPI — AI phone calls
VAPI_PRIVATE_KEY=           # From vapi.ai dashboard → API Keys
VAPI_PHONE_NUMBER_ID=       # Phone number ID (your BYO SIP trunk number)

# Resend — lead email alerts after every call
RESEND_API_KEY=             # From resend.com → API Keys
RESEND_FROM_EMAIL=          # e.g. MMCarCare <leads@mmcarcarekakinada.co.in>
LEAD_NOTIFY_EMAILS=         # Comma-separated: email1@gmail.com,email2@gmail.com

# Google Sheets — call log
GOOGLE_SHEET_URL=           # Apps Script web app deployment URL

# Pexels — blog post hero images
PEXELS_API_KEY=             # From pexels.com/api (free)

```

---

## Running Locally

```bash
# Install dependencies
npm install

# Add environment variables
# Create .env.local and fill in the keys above

# Start dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

---

## Blog System

All blog posts live in `frontend/data/blog.ts` as a typed TypeScript array — no database needed. Each post follows this schema:

```typescript
{
  slug: 'post-url-slug',
  title: 'SEO Title (50-60 chars)',
  description: 'Meta description (150-160 chars)',
  date: 'YYYY-MM-DD',
  readTime: 'X min read',
  category: 'Category Name',
  author: 'Author Name',
  pexelsQuery: 'image search term for hero',
  relatedSlugs: ['slug-1', 'slug-2', 'slug-3'],
  faqs: [{ q: 'Question?', a: 'Answer (2-4 sentences).' }],
  content: [ /* structured content blocks */ ],
}
```

Hero images are fetched at runtime from Pexels API via `/api/pexels?query=...`.

## Google Review Monitoring

A scheduled desktop task runs every three days and opens the public Google Maps listing in a browser. It compares the newest reviews with `frontend/data/reviews.ts` using the source ID when available and normalized author-plus-text as a fallback. It adds only genuinely new written 4- or 5-star reviews, runs the build checks, pushes `main`, and verifies the deployed count. No Google Places API key is required.

The durable task prompt and schedule are documented in [`docs/review-automation.md`](docs/review-automation.md). The machine must be on and the ChatGPT desktop app must be running for a local-project scheduled task.

---

## Deployment

Deployed on Vercel. Every push to `main` auto-deploys to production (~90 seconds).

```bash
git add .
git commit -m "your message"
git push origin main
```

Environment variables live in Vercel dashboard — never committed to git.

---

## Key Technical Decisions

**Why VAPI + Vobiz SIP trunk?**  
Twilio US numbers get ignored by Indian customers. Vobiz provides a DoT-licensed Indian +91 number via SIP trunk integration with VAPI. Customers recognise the local number and answer.

**Critical VAPI gotcha — PATCH silently drops `authPassword`:**  
VAPI's API marks `authPassword` as "not returned in the API." On PATCH requests, it's also not saved. This causes Vobiz to return SIP 503 on every call with no obvious error. Fix: DELETE the credential + phone number, then recreate both via POST (which does save the password). Update `VAPI_PHONE_NUMBER_ID` env var after recreation.

**Why Resend instead of Twilio SMS for owner alerts?**  
Resend's free tier gives 3,000 emails/month. Gmail push notifications are as fast as SMS for this use case. Zero ongoing cost vs per-SMS Twilio charges. Domain `mmcarcarekakinada.co.in` verified via Vercel auto-configure.

**Why TypeScript arrays for blog and reviews instead of a CMS?**  
No database cost, no CMS subscription, content is version-controlled, TypeScript catches schema errors at build time, and Vercel serves it statically. For this volume of content it's the right tradeoff.

---

## Built With Claude Code

This project was built using [Claude Code](https://claude.ai/code) as the primary AI coding assistant across ~2 months of active development. The AI handled scaffolding, API integrations, SIP trunk debugging, prompt engineering, and email templating. All output was reviewed, tested on real customers, and corrected where needed.

---

*MM Car Care Kakinada · Opp. APSP Petrol Bunk, Kakinada · +91 98483 77309*
