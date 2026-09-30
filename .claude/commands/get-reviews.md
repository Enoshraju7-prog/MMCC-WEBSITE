Check MM Car Care's public Google Maps reviews in a browser and update `frontend/data/reviews.ts`. Do not use the Google Places API or require an API key.

## Source

- Business: `MMCarCare (Maruthi Mobile Car Care)`, Kakinada
- Google Place ID: `ChIJWwlCBNkpODoROIMxVQQbd2w`
- Public listing: `https://www.google.com/maps/search/?api=1&query=MMCarCare%20Kakinada&query_place_id=ChIJWwlCBNkpODoROIMxVQQbd2w`

## Workflow

1. Open the public Google Maps listing and sort reviews by newest.
2. Read `frontend/data/reviews.ts` before making any change.
3. Compare Google reviews against every existing website review using:
   - Google/source review ID when available.
   - Otherwise the normalized `author + full review text` pair.
4. A repeated short comment from a different author is not a duplicate. Never add the same author's same review text twice.
5. Add only genuinely new written reviews rated 4 or 5 stars. Skip star-only reviews and ratings below 4 stars.
6. Preserve the reviewer's name, wording, language, star rating, and published date. Insert new entries at the top, newest first.
7. Do not edit a hardcoded count; the website derives it from `REVIEWS.length`.
8. If nothing new exists, make no file or Git changes and report that result.
9. If reviews were added, run:

   ```bash
   npx tsc -p frontend/tsconfig.json --noEmit --incremental false
   npm run build
   git diff --check
   ```

10. Commit only `frontend/data/reviews.ts`, push `main`, wait for deployment, and verify the live review count and newest names.

In the result, list each added reviewer and explicitly confirm the duplicate check. If access to Google Maps, Git, or deployment is unavailable, stop without inventing review data and report the exact blocker.
