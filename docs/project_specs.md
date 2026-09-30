# MM Car Care Website Specification

## Purpose and users

MM Car Care's public website helps customers in Kakinada understand services, read Google reviews, contact the garage, book service, and request an AI phone call. The bill pages support internal invoice creation.

## Technology

- Next.js 16 App Router with TypeScript and React 19
- Tailwind CSS and GSAP for styling and motion
- Vercel for hosting and automatic deployment
- VAPI, Google Sheets, Pexels, and GitHub integrations
- Static TypeScript data files for business details, blog posts, and reviews

## Application structure

- `frontend/components` — reusable and page-section UI components
- `frontend/contexts` — client-side booking and callback state
- `frontend/data` — typed site content and business data
- `frontend/app` — Next.js pages, layouts, metadata, and thin API entrypoints
- `frontend/public` — static images and public verification files
- `backend/routes` — server-side API implementations
- `docs` — operational runbooks and scheduled-task prompts
- `docs/references` — editorial and SEO guidance

Next.js still owns the routing boundary, so `frontend/app/api` contains only the thin route files required by the framework; backend implementation code lives in `backend/routes`.

## Review automation

- The public site renders reviews from `frontend/data/reviews.ts`.
- A desktop scheduled task runs every three days and checks the public Google Maps listing in a browser; it does not use the Google Places API.
- The agent ignores ratings below four stars and entries without text, then checks source IDs and normalized author-plus-text pairs before adding anything.
- If new reviews exist, the agent updates `frontend/data/reviews.ts`, verifies the project, commits only that data file, pushes `main`, and checks the deployed count.
- If no new reviews exist, the agent makes no code or Git changes.

## Done for this task

- The six missing written Google reviews are present once each and the site data contains 80 reviews.
- The application code lives under `src` with data, contexts, UI, routes, and services clearly separated.
- Review monitoring has a durable every-three-days task prompt with explicit duplicate protection.
- The requested workshop-opening photo is no longer part of the homepage slideshow.
- Type checking, production build, and rendered review-count verification pass.
