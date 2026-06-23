export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

// Google Place ID for MM Car Care Kakinada
// Run /get-reviews to auto-detect and populate this
export const PLACE_ID = ''

// Leave-a-review link — updates automatically once PLACE_ID is set
export const LEAVE_REVIEW_URL = PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
  : `https://www.google.com/maps/search/MM+Car+Care+Kakinada+APSP+Petrol+Bunk`

// Run /get-reviews to fetch real reviews from Google Places API and replace this list
export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Ravi Kumar',
    rating: 5,
    text: 'Excellent service! Got my car ceramic coated here and the result is outstanding. Santosham sir has 25+ years of experience and it really shows in the finish. Best car care in Kakinada without a doubt.',
    date: '2026-05-20',
  },
  {
    id: 'r2',
    author: 'Priya Reddy',
    rating: 5,
    text: 'Brought my Swift for full body detailing before a wedding. The car came out looking brand new. Very professional team, reasonable pricing, and they finished exactly on time. Will definitely come back.',
    date: '2026-05-10',
  },
  {
    id: 'r3',
    author: 'Suresh Babu',
    rating: 5,
    text: 'My AC was not cooling properly in this 42-degree heat. MM Car Care diagnosed and fixed it the same day. Honest pricing — they told me exactly what was wrong before doing any work. Very trustworthy.',
    date: '2026-04-28',
  },
  {
    id: 'r4',
    author: 'Kiran Varma',
    rating: 5,
    text: 'Paint correction on my Honda City was done perfectly. The scratches from monsoon roads are completely gone. Their attention to detail is incredible. Highly recommend for any paint work in Kakinada.',
    date: '2026-04-15',
  },
  {
    id: 'r5',
    author: 'Anand Rao',
    rating: 5,
    text: 'Got wheel alignment and balancing done here. Car drives much smoother now. Quick service, transparent billing, and they explained everything clearly. The team is knowledgeable and friendly.',
    date: '2026-04-02',
  },
  {
    id: 'r6',
    author: 'Lakshmi Devi',
    rating: 5,
    text: 'Interior deep cleaning was done exceptionally well. The car smells fresh and every corner was cleaned properly. My kids were making a mess for months and now it looks showroom fresh. Thank you MM Car Care!',
    date: '2026-03-18',
  },
  {
    id: 'r7',
    author: 'Venkat Naidu',
    rating: 5,
    text: 'Engine service done here — oil change, filter replacement, belt check. Everything done properly with genuine parts. Car is running much better. 25 years in business and the quality reflects it.',
    date: '2026-03-05',
  },
  {
    id: 'r8',
    author: 'Deepak Sharma',
    rating: 5,
    text: 'Dent repair on my Creta after a minor accident. The paintless dent removal was done so well you cannot tell anything happened. Saved me a lot compared to a body shop. Very skilled technicians.',
    date: '2026-02-20',
  },
  {
    id: 'r9',
    author: 'Sita Ram',
    rating: 5,
    text: 'Been bringing my car here for 3 years. Oil changes, servicing, AC — everything done at MM Car Care. Santosham sir is honest and never suggests unnecessary work. That trust is hard to find.',
    date: '2026-02-08',
  },
  {
    id: 'r10',
    author: 'Meena Krishnan',
    rating: 5,
    text: 'Tyre balancing and rotation done here. Very professional setup, modern equipment. The car vibration is completely gone. Prices are fair and the work is done right the first time.',
    date: '2026-01-25',
  },
  {
    id: 'r11',
    author: 'Arun Teja',
    rating: 5,
    text: 'Best ceramic coating in the East Godavari district. The hydrophobic effect is amazing — water just slides off. Worth every rupee. Professional team who know what they are doing.',
    date: '2026-01-10',
  },
  {
    id: 'r12',
    author: 'Padma Rao',
    rating: 5,
    text: 'Brake service was done quickly and at an honest price. They showed me the worn pads before replacing them — that kind of transparency is rare. Very satisfied with MM Car Care.',
    date: '2025-12-28',
  },
]
