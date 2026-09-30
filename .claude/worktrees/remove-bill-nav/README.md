# MM Car Care Kakinada

Production website for MM Car Care — a car workshop in Kakinada, Andhra Pradesh.  
Live at **[mmcarcarekakinada.co.in](https://mmcarcarekakinada.co.in)**

---

## What This App Does

- Full marketing website with 10 service pages, blog, reviews, and contact
- **AI phone agent** — customer fills a form → outbound AI call triggers from an Indian number → AI collects car issue + books slot in English or Telugu
- **Lead email alerts** — after every call, owner receives a styled HTML email with customer details + call summary
- **SEO blog** — structured blog pipeline with keyword tracking, FAQ schema, and Kakinada-specific content
- **Google Reviews** — 70+ live reviews displayed on site

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
app/
├── page.tsx                  # Home page
├── about/                    # About page
├── services/                 # Services overview + individual service pages
├── blog/
│   ├── page.tsx              # Blog index
│   └── [slug]/page.tsx       # Individual blog post (dynamic)
├── reviews/                  # All reviews page
├── contact/                  # Contact page
├── ai-call/                  # AI call booking page (standalone)
├── booking-confirmed/        # Post-booking confirmation page
└── api/
    ├── callback/             # Triggers outbound VAPI AI call
    ├── vapi-webhook/         # Receives end-of-call report → email + Sheet log
    ├── pexels/               # Fetches blog hero images from Pexels API
    ├── map-image/            # Serves static map image
    └── sync-reviews/         # Review sync endpoint

components/
├── Nav.tsx                   # Navbar with mobile menu + click-to-call
├── Footer.tsx
├── CallbackModal.tsx         # AI call booking modal (home page)
├── BookingModal.tsx          # WhatsApp booking modal
├── home/                     # Home page sections
│   ├── HeroSection.tsx       # GSAP hero slideshow (5 slides)
│   ├── ServicesOverview.tsx
│   ├── HomeReviewsTeaser.tsx
│   ├── StatsBar.tsx
│   ├── ProcessStrip.tsx
│   ├── CTASection.tsx
│   └── CarAnimation.tsx
├── about/                    # About page sections
├── contact/                  # Contact grid
└── services/                 # Service page components

lib/
├── blog.ts                   # All blog post data (BLOG_POSTS array)
├── reviews.ts                # All Google reviews (REVIEWS array)
├── business.ts               # Business info — name, address, phone, hours
└── callback-context.tsx      # React context for callback modal state
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

All blog posts live in `lib/blog.ts` as a typed TypeScript array — no database needed. Each post follows this schema:

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
