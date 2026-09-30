import type { Metadata } from 'next'
import ServicesGrid from '@/components/services/ServicesGrid'
import { SITE_URL } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Car Services in Kakinada – MM Car Care',
  description:
    'Full car services in Kakinada: ceramic coating, paint correction, interior detailing, AC service, oil change, engine work, brake service, wheel alignment and more. Call 9848377309.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Car Services in Kakinada – MM Car Care',
    description:
      'Ceramic coating, paint correction, detailing, AC service, engine work and more. Kakinada\'s most complete car care garage.',
    url: `${SITE_URL}/services`,
  },
}

export default function ServicesPage() {
  return <ServicesGrid />
}
