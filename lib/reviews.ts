export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export const PLACE_ID = 'ChIJl7poLAApODoRUFbeiL04nKs'

export const LEAVE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`

export const REVIEWS: Review[] = [
  // Real reviews from Google Places API — run /get-reviews to sync new ones
  {
    id: 'g1782112939',
    author: 'DEVU MADUSUDHANARAO',
    rating: 1,
    text: 'Very poor service experience. Before the service, my car had no AC motor issues. The problem started only after the service was completed.',
    date: '2026-06-22',
  },
  {
    id: 'g1782106944',
    author: 'Srinvasa Raju',
    rating: 5,
    text: 'Good work',
    date: '2026-06-22',
  },
  {
    id: 'g1781365653',
    author: 'Satyanarayana Pasagadugula',
    rating: 5,
    text: 'Excellent service',
    date: '2026-06-13',
  },
]
