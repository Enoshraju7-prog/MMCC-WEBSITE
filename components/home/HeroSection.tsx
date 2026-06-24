'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useBooking } from '@/lib/booking-context'
import { useCallback } from '@/lib/callback-context'

const HEADLINES = [
  ['MM', 'Car', 'Care.'],
  ['We Take', 'Care of', 'Your Car.'],
]

// hero-5 is first and featured — stays 7 sec. Others rotate at 4.5 sec.
const SLIDES = [
  { src: '/uploads/hero-5.jpg', duration: 7000, pos: 'center' },
  { src: '/uploads/hero-1.jpg', duration: 4500, pos: 'center' },
  { src: '/uploads/hero-2.jpg', duration: 4500, pos: 'center' },
  { src: '/uploads/hero-6.jpg', duration: 4500, pos: 'center' },
]

function HeroHeadline() {
  const [idx, setIdx] = useState(0)
  const [lines, setLines] = useState(HEADLINES[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  useLayoutEffect(() => {
    const spans = lineRefs.current.filter(Boolean)
    gsap.fromTo(
      spans,
      { y: '110%' },
      { y: '0%', duration: 0.95, ease: 'power4.out', stagger: 0.12, delay: 0.4 }
    )
  }, [])

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
              fontSize: 'clamp(48px, 7vw, 110px)',
              fontWeight: 400,
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: '#fff',
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

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useLayoutEffect(() => {
    if (wrapRef.current) {
      gsap.fromTo(wrapRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 })
    }
  }, [])

  const advance = (from: number) => {
    const next = (from + 1) % SLIDES.length
    const outEl = imgRefs.current[from]
    const inEl = imgRefs.current[next]

    if (outEl) gsap.to(outEl, { opacity: 0, duration: 0.9, ease: 'power2.inOut' })
    if (inEl) gsap.to(inEl, { opacity: 1, duration: 0.9, ease: 'power2.inOut' })

    currentRef.current = next
    setCurrent(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => advance(next), SLIDES[next].duration)
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => advance(0), SLIDES[0].duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    advance(currentRef.current)
  }

  return (
    <div
      ref={wrapRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(201,169,110,0.18)',
        cursor: 'pointer',
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          ref={(el) => { imgRefs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === 0 ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt={`MM Car Care service ${i + 1}`}
            fill
            priority={i === 0}
            style={{ objectFit: 'cover', objectPosition: slide.pos }}
          />
        </div>
      ))}

      {/* Gold corner accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '40px', height: '40px',
        borderTop: '2px solid rgba(201,169,110,0.5)',
        borderLeft: '2px solid rgba(201,169,110,0.5)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: '40px', height: '40px',
        borderBottom: '2px solid rgba(201,169,110,0.5)',
        borderRight: '2px solid rgba(201,169,110,0.5)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Slide indicator dots */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 3,
      }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? '#C9A96E' : 'rgba(255,255,255,0.3)',
              transition: 'width 400ms ease, background 400ms ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const { open } = useBooking()
  const { open: openCallback } = useCallback()
  const heroRef = useRef<HTMLElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.0)
      tl.fromTo(btnsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.85)
    }, heroRef)

    return () => ctx.revert()
  }, [])

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
        alignItems: 'stretch',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gold wash on right */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
        background: 'linear-gradient(to left, rgba(201,169,110,0.04) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />


      {/* Split layout */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 4vw, 64px)',
          padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          alignItems: 'center',
        }}
      >
        {/* Left: Text */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <HeroHeadline />

          <p
            ref={subRef}
            style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.72)',
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
                background: '#C9A96E',
                color: '#0a0a0a',
                border: '1px solid #C9A96E',
                borderRadius: '9999px',
                padding: '15px 36px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '12px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                transition: 'background 250ms ease, color 250ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
            >
              Book a Service
            </button>

            {/* AI Callback CTA */}
            <button
              onClick={openCallback}
              style={{
                background: 'transparent',
                color: '#C9A96E',
                border: '1px solid rgba(201,169,110,0.45)',
                borderRadius: '9999px',
                padding: '15px 32px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '12px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 250ms ease, border-color 250ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,110,0.08)'; e.currentTarget.style.borderColor = '#C9A96E' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.45)' }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#C9A96E',
                display: 'inline-block',
                flexShrink: 0,
                animation: 'hero-pulse 1.8s ease-in-out infinite',
              }} />
              Get AI Callback
            </button>

            <a
              href="https://maps.app.goo.gl/SRBWNggKuSY9ge8k7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '15px 28px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '12px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'border-color 200ms ease, color 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Find Us
            </a>
          </div>
        </div>

        {/* Right: Slideshow */}
        <div className="hero-image-wrap" style={{
          height: 'clamp(380px, 55vh, 640px)',
          position: 'relative',
        }}>
          <HeroSlideshow />
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr !important;
            padding-top: 100px !important;
            padding-bottom: 40px !important;
            gap: 28px !important;
          }
          .hero-image-wrap {
            height: 56vw !important;
            min-height: 260px !important;
            max-height: 420px !important;
          }
        }
      `}</style>
    </section>
  )
}
