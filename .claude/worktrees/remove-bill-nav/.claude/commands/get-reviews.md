Fetch new Google reviews for MM Car Care and update lib/reviews.ts. Run all steps automatically without asking for confirmation.

## Requirements
This command needs GOOGLE_PLACES_KEY in .env.local and the Place ID.
If PLACE_ID in lib/reviews.ts is empty, find it first (Step 1). Otherwise skip to Step 2.

## Step 1 — Find Place ID (only if PLACE_ID is empty in lib/reviews.ts)
Use WebFetch to call the Places API Find Place endpoint:
```
https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=MM+Car+Care+Kakinada&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=YOUR_KEY
```
Replace YOUR_KEY with the value of GOOGLE_PLACES_KEY from .env.local.
Extract the `place_id` from the response and update the `PLACE_ID` constant in `lib/reviews.ts`.

## Step 2 — Fetch reviews from Google Places API
Use WebFetch to call the Place Details endpoint:
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=reviews,rating,user_ratings_total&reviews_sort=newest&key=YOUR_KEY
```
Replace PLACE_ID and YOUR_KEY with actual values.
The API returns up to 5 reviews (Google's limit for Places API).

## Step 3 — Compare with existing reviews in lib/reviews.ts
- Read the current REVIEWS array in lib/reviews.ts
- Check each fetched review: if author_name + text combo does NOT exist in REVIEWS, it is new
- SKIP any review with rating < 4 — only show 4 and 5 star reviews on the website
- New reviews get added to the TOP of the REVIEWS array (most recent first)
- Format each new review:
  - id: 'g' + timestamp (e.g. 'g1750000000')
  - author: result.author_name
  - rating: result.rating
  - text: result.text
  - date: convert result.time (Unix timestamp) to YYYY-MM-DD

## Step 4 — Update lib/reviews.ts
- Add new reviews to the top of the REVIEWS array
- Update PLACE_ID if it was empty
- Update LEAVE_REVIEW_URL to use the real Place ID:
  `https://search.google.com/local/writereview?placeid=PLACE_ID`
- Update the hardcoded "64 Verified" count in app/reviews/page.tsx to match REVIEWS.length

## Step 5 — Commit
```bash
git add lib/reviews.ts app/reviews/page.tsx
git commit -m "Update Google reviews — [N] new reviews added"
git push origin main
```

## Setup instructions (tell user if GOOGLE_PLACES_KEY is missing from .env.local)
1. Go to console.cloud.google.com → Enable "Places API"
2. Create an API key → Restrict it to "Places API" only
3. Add to .env.local: GOOGLE_PLACES_KEY=your_key_here
4. Run /get-reviews again

Note: Google Places API returns max 5 reviews per call (their limit).
For all 64+, the Business Profile API is needed (separate OAuth setup).
