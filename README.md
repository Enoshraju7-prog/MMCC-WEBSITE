# MM Car Care — Website

Professional car wash, detailing, and maintenance service based in Kakinada, Andhra Pradesh.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP 3 + ScrollTrigger
- **Deployment:** Vercel

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| Services | `/services` |
| About | `/about` |
| Contact | `/contact` |

## Features

- GSAP custom cursor with hover effects
- Scroll-triggered text and card reveals
- Animated hero with alternating headlines
- Booking modal — 3-step flow with WhatsApp + Google Form integration
- Full-screen nav drawer
- Car SVG animation
- Scroll progress bar
- Infinite marquee strip
- Fully responsive

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Booking Flow

1. User selects a service
2. Fills in name, phone, vehicle, preferred time, and optional note
3. WhatsApp message sent to MM Car Care
4. Google Form opens for booking confirmation
