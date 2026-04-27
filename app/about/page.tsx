'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import FounderSection from '@/components/about/FounderSection'
import ValuesGrid from '@/components/about/ValuesGrid'
import AboutStats from '@/components/about/AboutStats'

export default function AboutPage() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const ctx = gsap.context(() => {
      gsap.from('.about-label', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 })
      gsap.from('.about-heading-line', {
        y: '105%',
        duration: 0.95,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.35,
      })
    }, header)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Header */}
      <section
        ref={headerRef}
        style={{
          background: '#000',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid #111',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="about-label"
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#555',
              marginBottom: '20px',
            }}
          >
            Our Story
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h1
              className="about-heading-line"
              style={{
                display: 'block',
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 130px)',
                fontWeight: 400,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              Built on
            </h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h1
              className="about-heading-line"
              style={{
                display: 'block',
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 130px)',
                fontWeight: 400,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              Craft.
            </h1>
          </div>
        </div>
      </section>

      <FounderSection />
      <ValuesGrid />
      <AboutStats />
    </>
  )
}
