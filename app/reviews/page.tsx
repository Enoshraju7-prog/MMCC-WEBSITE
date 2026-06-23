'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { REVIEWS, LEAVE_REVIEW_URL, type Review } from '@/lib/reviews'

const CARDS_PER_SLIDE = 3
const AUTO_ADVANCE_MS = 5000

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= rating ? '#C9A96E' : 'rgba(255,255,255,0.15)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        transition: 'border-color 300ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Google G icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StarRating rating={review.rating} />
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>

      {/* Review text */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.75)',
          flex: 1,
          margin: 0,
        }}
      >
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Author + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0a0a0a',
              }}
            >
              {review.author[0].toUpperCase()}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {review.author}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '9px',
            letterSpacing: '0.5px',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [cardsPerSlide, setCardsPerSlide] = useState(CARDS_PER_SLIDE)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = REVIEWS.length
  const maxIndex = total - cardsPerSlide

  const advance = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  const back = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1))
  }, [maxIndex])

  // Responsive cards per slide
  useEffect(() => {
    function update() {
      setCardsPerSlide(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(advance, AUTO_ADVANCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [index, paused, advance])

  const visibleReviews = REVIEWS.slice(index, index + cardsPerSlide)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Header */}
      <section
        style={{
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '20px',
            }}
          >
            What Our Customers Say
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 120px)',
                fontWeight: 400,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
              }}
            >
              65 Verified<br />
              <span style={{ color: '#C9A96E' }}>Google Reviews.</span>
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(n => (
                  <svg key={n} width="20" height="20" viewBox="0 0 24 24" fill="#C9A96E">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>
                5.0 · Google Maps
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section
        style={{ padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Progress bar */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '40px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, height: '100%',
                background: '#C9A96E',
                width: `${((index + cardsPerSlide) / total) * 100}%`,
                transition: 'width 500ms ease',
              }}
            />
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cardsPerSlide}, 1fr)`,
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>

            {/* Counter */}
            <div
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '11px',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {index + 1}–{Math.min(index + cardsPerSlide, total)} of {total} reviews
            </div>

            {/* Prev / Next */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={back}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 200ms ease, background 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = '#0a0a0a' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = '#fff' }}
                aria-label="Previous reviews"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: '#fff', transition: 'color 200ms ease' }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={advance}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 200ms ease, background 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = '#0a0a0a' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget.querySelector('svg') as SVGElement).style.color = '#fff' }}
                aria-label="Next reviews"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: '#fff', transition: 'color 200ms ease' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Leave a review CTA */}
            <a
              href={LEAVE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#C9A96E',
                color: '#0a0a0a',
                border: '1px solid #C9A96E',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '11px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 250ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Leave a Review on Google
            </a>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section
        style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
              Ready to experience it yourself?
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '8px',
              }}
            >
              Call 9848377309 · Opp. APSP Petrol Bunk, Kakinada
            </div>
          </div>
          <Link
            href="/contact"
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '9999px',
              padding: '12px 28px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.borderColor = '#C9A96E' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          >
            Book a Service
          </Link>
        </div>
      </section>
    </div>
  )
}
