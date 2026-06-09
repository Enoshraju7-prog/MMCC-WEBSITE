# On-Page SEO Checklist — MM Car Care

Every blog post, service page, and landing page must satisfy every item below before being published.

---

## URL STRUCTURE
- Primary keyword in the slug
- Hyphens only — never underscores
- Lowercase only
- No stop words ("the", "a", "of") unless necessary for readability
- Logical hierarchy: `/services/[slug]`, `/blog/[slug]`

---

## HTML STRUCTURE
- Exactly one H1 per page — contains the primary keyword
- Logical H2 → H3 hierarchy — never skip levels
- H2s use supporting keywords and questions from the cluster
- No keyword stuffing — write naturally

---

## META / HEAD
- Title tag: 50–60 chars, primary keyword near the start
- Meta description: 150–160 chars, keyword + benefit + soft CTA
- Canonical URL set on every page to prevent duplicates
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`
- Twitter Card: `summary_large_image`, title, description, image
- Language attribute on `<html>` (e.g. `lang="en"`)
- Viewport meta tag for responsive rendering
- Favicon + apple-touch-icon
- Charset meta: `<meta charset="utf-8">`

---

## CONTENT
- Primary keyword in the first 100 words
- Direct answer to the query in the first paragraph (featured snippet target)
- Length matches SERP average (within 20% of top-3 results)
- Short paragraphs: 1–4 sentences max
- Readability: 8th–10th grade level
- Active voice preferred
- Bold key phrases — sparingly
- Bullets and numbered lists where appropriate

---

## INTERNAL LINKS
- 3–5 internal links per post
- Link to related blog posts and relevant service pages
- Descriptive anchor text — never "click here" or "read more"
- Contextually placed in body copy
- Breadcrumbs on every page

---

## FAQ SECTION (every blog post)
- 4–8 questions sourced from People Also Ask + SEMrush Questions tab
- Direct answers — 2–4 sentences each
- `FAQPage` JSON-LD schema applied automatically
- Place FAQ section before the CTA block

---

## EXTERNAL LINKS
- 2–3 external links to authoritative sources (government, educational, major industry bodies)
- Relevant to the article topic
- Open in new tab with `rel="noopener"`
- `rel="nofollow"` for any sponsored or paid links

---

## E-E-A-T (Experience · Expertise · Authority · Trust)
- Author byline with full name on every blog post
- Author bio with credentials (years of experience, qualifications)
- Link from byline to the About page
- Published date displayed
- "Last updated" date shown when content is refreshed
- Real stories, real numbers, and opinions from `references/stories.md` and `references/opinions.md`
- Cite authoritative sources in-text where claims are made
- About page with full company history and credentials
- Contact page with real address, phone number, and business hours

---

## SOCIAL PREVIEW
- OG image: 1200×630, under 1 MB
- Twitter Card image: 1200×600
- `og:description` can differ from meta description if it improves click-through

---

## ACCESSIBILITY (A11y = SEO signals)
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- ARIA labels on interactive elements where screen readers need context
- Colour contrast meets WCAG AA minimum
- Focus indicators visible on all interactive elements
- Alt text on all images (empty `alt=""` only for purely decorative images)
- Descriptive link text throughout
- Skip-to-content link for keyboard users

---

## IMAGES
- Alt text describes the image and includes keyword where it reads naturally
- Filenames: descriptive, hyphens only (e.g. `ceramic-coating-kakinada.webp`)
- WebP format, compressed under 200 KB
- Width and height attributes specified to prevent Cumulative Layout Shift (CLS)
- `loading="lazy"` on all below-the-fold images
- Responsive `srcset` where needed
- Featured image present for social sharing

---

## SCHEMA / STRUCTURED DATA (JSON-LD in or near `<head>`)
- `Article` schema on every blog post (headline, author, datePublished, dateModified, publisher)
- `LocalBusiness` schema — most specific subtype (use `AutoRepair` for MM Car Care)
- `Service` schema on service pages
- `FAQPage` schema wherever a FAQ section exists
- `BreadcrumbList` schema on every page
- `Organization` schema site-wide
- `Person` schema for author bylines

---

## MOBILE (mobile-first indexing)
- Fully responsive layout at all viewport widths
- Touch targets minimum 48×48 px
- Body font minimum 16 px
- No horizontal scroll at any viewport width
- No intrusive interstitials or pop-ups on mobile

---

## CONVERSION ELEMENTS (service pages only)
- Primary CTA visible above the fold
- Phone number as a click-to-call link (`tel:9848377309`)
- Multiple CTA placements throughout the page (top, middle, bottom)
- Trust signals: years in business, number of customers served
- Testimonials with names and photos where possible
- Service area coverage listed explicitly
- Business hours displayed clearly
- Physical address with embedded Google Maps

---

## LONG-FORM CONTENT (posts over 1,500 words)
- Table of contents with anchor links at the top of the article
- Jump links for each H2 section
- Back-to-top button (floating, appears after scrolling 600px)
