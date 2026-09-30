# Google Review Browser Automation

## Schedule

- Cadence: every three days
- Time zone: `Asia/Kolkata`
- Preferred start time: 09:00
- Advanced recurrence rule: `RRULE:FREQ=DAILY;INTERVAL=3;BYHOUR=9;BYMINUTE=0`
- Project: this repository, using an isolated Git worktree

The computer must be powered on and the ChatGPT desktop app must be running because this task needs the local repository and a browser.

## Scheduled task prompt

```text
Check MM Car Care's newest public Google reviews and update the website only when genuinely new written reviews exist.

Business: MMCarCare (Maruthi Mobile Car Care), Kakinada
Google Place ID: ChIJWwlCBNkpODoROIMxVQQbd2w
Public listing: https://www.google.com/maps/search/?api=1&query=MMCarCare%20Kakinada&query_place_id=ChIJWwlCBNkpODoROIMxVQQbd2w
Repository data file: frontend/data/reviews.ts

Use browser/web search, not the Google Places API and not an API key. Fetch the latest origin/main before comparing. Open the public Google Maps listing, sort reviews by newest, and compare the visible reviews with every item already in frontend/data/reviews.ts.

Treat a review as already present when its Google/source ID matches, or when its normalized author name plus full review text matches. A repeated short comment from a different author is not a duplicate. Never add the same author's same review text twice.

Add only genuinely new written 4- or 5-star reviews. Skip star-only reviews and ratings below 4 stars. Preserve the reviewer's name, full wording, language, rating, and published date. Insert additions at the top in newest-first order. Do not change a hardcoded review count because the site uses REVIEWS.length.

If no new qualifying reviews exist, make no file or Git changes and report "No new reviews" with the Google and website counts observed.

If reviews were added, run npx tsc -p frontend/tsconfig.json --noEmit --incremental false, npm run build, and git diff --check. Commit only frontend/data/reviews.ts with a message that states the number added, push to origin/main, wait for the Vercel deployment, and verify the live review count plus the newest reviewer names. Report each added reviewer and confirm that the duplicate check passed.

If Google Maps, Git, or deployment access is unavailable, do not invent or approximate review data. Make no partial content update and report the exact blocker.
```

## Safety rules

- Never fabricate a reviewer, review body, rating, or date.
- Never replace the website review array with only the currently visible Google subset.
- Never add a review based only on the total-count difference.
- Never modify unrelated files during a scheduled run.
