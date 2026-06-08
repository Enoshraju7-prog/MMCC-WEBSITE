import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Car Care Tips & Guides – MM Car Care Kakinada',
  description: 'Practical car care guides for Kakinada car owners. Tips on ceramic coating, AC service, car wash, detailing, and protecting your car in Andhra Pradesh\'s climate.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Car Care Tips & Guides – MM Car Care Kakinada',
    description: 'Practical car care guides from Kakinada\'s most trusted car care centre.',
    url: `${SITE_URL}/blog`,
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
