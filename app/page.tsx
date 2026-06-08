import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import ServicesOverview from '@/components/home/ServicesOverview'
import ProcessStrip from '@/components/home/ProcessStrip'
import CTASection from '@/components/home/CTASection'
import MarqueeStrip from '@/components/MarqueeStrip'
import { SITE_URL } from '@/lib/business'

export const metadata: Metadata = {
  title: 'MM Car Care – Best Car Service in Kakinada, Andhra Pradesh',
  description:
    "Kakinada's most trusted car wash, detailing & maintenance centre. Ceramic coating, paint correction, interior detailing, AC service, engine work. 25+ years, 1500+ customers. Call 9848377309.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'MM Car Care – Best Car Service in Kakinada',
    description:
      "Kakinada's most trusted car care centre. 25+ years, 1500+ loyal customers. Ceramic coating, paint correction, engine work and more.",
    url: SITE_URL,
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <MarqueeStrip inverted />
      <ServicesOverview />
      <ProcessStrip />
      <MarqueeStrip inverted />
      <CTASection />
    </>
  )
}
