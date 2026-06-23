export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export const PLACE_ID = 'ChIJl7poLAApODoRUFbeiL04nKs'

export const LEAVE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`

// Only 4-5 star reviews shown. Nightly sync adds new ones automatically.
export const REVIEWS: Review[] = [
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
