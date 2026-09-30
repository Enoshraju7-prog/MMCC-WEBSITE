import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get an AI Callback — MM Car Care Kakinada',
  description: 'Book a car service at MM Car Care Kakinada. Enter your number and our AI agent calls you within seconds to confirm your booking.',
  openGraph: {
    title: 'MM Car Care — Get an AI Callback',
    description: 'Enter your number. We call you in seconds. MM Car Care Kakinada — Opp. APSP Petrol Bunk · 9848377309',
    url: 'https://mmcarcarekakinada.co.in/ai-call',
    siteName: 'MM Car Care',
    images: [{ url: '/og-image.jpg', width: 1376, height: 768, alt: 'MM Car Care Kakinada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function AiCallLayout({ children }: { children: React.ReactNode }) {
  return children
}
