import type { Metadata } from 'next'
import { SITE_URL } from '@frontend/data/business'
import { REVIEWS } from '@frontend/data/reviews'

export const metadata: Metadata = {
  title: 'Customer Reviews | MM Car Care Kakinada',
  description: `${REVIEWS.length} verified Google reviews for MM Car Care Kakinada. Read what our customers say about ceramic coating, detailing, AC service, and more.`,
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: { title: 'Customer Reviews | MM Car Care Kakinada', url: `${SITE_URL}/reviews` },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
