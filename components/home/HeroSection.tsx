'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useBooking } from '@/lib/booking-context'

const HEADLINES = [
  ['MM', 'Car', 'Care.'],
  ['We Take', 'Care of', 'Your Car.'],
]

function HeroHeadline() {
  const [idx, setIdx] = useState(0)
  const [lines, setLines] = useState(HEADLINES[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Initial entrance
  useLayoutEffect(() => {
    const spans = lineRefs.current.filter(Boolean)
    gsap.fromTo(
      spans,
      { y: '110%' },
      { y: '0%', duration: 0.95, ease: 'power4.out', stagger: 0.12, delay: 0.4 }
    )
  }, [])

  // Cycle every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const spans = lineRefs.current.filter(Boolean)
      const nextIdx = (idx + 1) % HEADLINES.length

      gsap.to(spans, {
        y: '-110%',
        duration: 0.55,
        ease: 'power2.in',
        stagger: 0.06,
        onComplete: () => {
          setLines(HEADLINES[nextIdx])
          setIdx(nextIdx)
          gsap.fromTo(
            spans,
            { y: '110%' },
            { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }
          )
        },
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [idx])

  return (
    <div ref={containerRef} style={{ marginBottom: '48px' }}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden', lineHeight: 1.0 }}>
          <span
            ref={(el) => { lineRefs.current[i] = el }}
            style={{
              display: 'block',
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(48px, 9vw, 130px)',
              fontWeight: 400,
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: '#000',
              letterSpacing: '-1px',
            }}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const { open } = useBooking()
  const heroRef = useRef<HTMLElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const decoLine1 = useRef<HTMLDivElement>(null)
  const decoLine2 = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      // Sub & buttons
      tl.fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.0)
      tl.fromTo(btnsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.85)

      // Decorative vertical lines draw in
      tl.fromTo(decoLine1.current, { scaleY: 0, transformOrigin: 'top' }, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 0.3)
      tl.fromTo(decoLine2.current, { scaleY: 0, transformOrigin: 'top' }, { scaleY: 1, duration: 1.0, ease: 'power3.inOut' }, 0.5)
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (heroRef.current) {
        const content = heroRef.current.querySelector('.hero-content') as HTMLElement
        if (content) gsap.set(content, { y: y * 0.12 })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(32px, 5vw, 80px) clamp(24px, 5vw, 80px)',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Geometric accents */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '50%',
          background: 'linear-gradient(to left, rgba(0,0,0,0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={decoLine1}
        style={{
          position: 'absolute',
          right: '10%',
          top: '15%',
          width: '1px',
          height: '40%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08), transparent)',
        }}
      />
      <div
        ref={decoLine2}
        style={{
          position: 'absolute',
          right: '25%',
          top: '20%',
          width: '1px',
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.04), transparent)',
        }}
      />

      {/* Bottom vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(255,255,255,0.0) 0%, rgba(0,0,0,0) 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '1000px' }}>
        <HeroHeadline />

        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            lineHeight: 1.6,
            color: '#999',
            marginBottom: '40px',
            maxWidth: '440px',
          }}
        >
          The right way. Trusted by 1,500+ loyal customers across Kakinada. Professional-grade products and trained hands — every single time.
        </p>

        <div ref={btnsRef} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={open}
            style={{
              background: '#000',
              color: '#fff',
              border: '1px solid #000',
              borderRadius: '9999px',
              padding: '15px 36px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '12px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              transition: 'background 250ms ease, color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff' }}
          >
            Book a Service
          </button>
          <Link
            href="/services"
            style={{
              background: 'transparent',
              color: '#000',
              border: '1px solid #bbb',
              borderRadius: '9999px',
              padding: '15px 36px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '12px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#000')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#bbb')}
          >
            All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
