import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import MarqueeStrip from '@/components/MarqueeStrip'
import HomeServicesPreview from '@/components/services/HomeServicesPreview'
import FounderSection from '@/components/about/FounderSection'
import AboutStats from '@/components/about/AboutStats'
import HomeReviewsTeaser from '@/components/home/HomeReviewsTeaser'
import ContactGrid from '@/components/contact/ContactGrid'
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
      <section id="home">
        <HeroSection />
        <StatsBar />
        <MarqueeStrip />
      </section>

      <section id="services">
        <HomeServicesPreview />
      </section>

      <section id="about">
        <div style={{
          background: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 60px)',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              marginBottom: '20px',
            }}>
              Our Story
            </div>
            <h2 style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.0,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              margin: 0,
            }}>
              <span style={{ color: '#ffffff' }}>BUILT ON</span>
              <br />
              <span style={{ color: '#C9A96E' }}>CRAFT.</span>
            </h2>
          </div>
        </div>
        <FounderSection />
        <AboutStats />
        <HomeReviewsTeaser />
      </section>

      <section id="contact">
        <ContactGrid />
      </section>
    </>
  )
}
