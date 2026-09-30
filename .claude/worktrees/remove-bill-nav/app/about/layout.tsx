import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/business'

export const metadata: Metadata = {
  title: 'About – MM Car Care Kakinada | 25+ Years of Car Care',
  description:
    'MM Car Care was founded by Devisetty Santosham with 25+ years of experience. Trusted by 1,500+ customers across Kakinada. Built on precision, honesty and craft.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About MM Car Care – 25+ Years in Kakinada',
    description:
      'Founded by Devisetty Santosham. 25+ years, 1500+ customers. Built on precision, consistency, honesty and craft.',
    url: `${SITE_URL}/about`,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
