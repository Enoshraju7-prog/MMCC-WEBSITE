import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import ServicesOverview from '@/components/home/ServicesOverview'
import ProcessStrip from '@/components/home/ProcessStrip'
import CTASection from '@/components/home/CTASection'
import MarqueeStrip from '@/components/MarqueeStrip'

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
