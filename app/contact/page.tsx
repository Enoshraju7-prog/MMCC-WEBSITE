import type { Metadata } from 'next'
import ContactGrid from '@/components/contact/ContactGrid'
import { SITE_URL } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Contact MM Car Care – Kakinada | 9848377309',
  description:
    'Contact MM Car Care in Kakinada. Call 9848377309 or visit us at Opp. APSP Petrol Bunk, Kakinada, AP. Open Mon–Sat, 9 AM to 9 PM.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact MM Car Care Kakinada',
    description:
      'Call 9848377309. Opp. APSP Petrol Bunk, Kakinada, Andhra Pradesh. Mon–Sat 9 AM–9 PM.',
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactPage() {
  return <ContactGrid />
}
