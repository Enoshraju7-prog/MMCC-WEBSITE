'use client'

import { useState } from 'react'
import Link from 'next/link'
import { REVIEWS, LEAVE_REVIEW_URL } from '@/lib/reviews'

const LATEST = REVIEWS.slice(0, 3)

// Pick 3 random reviews excluding the latest 3
function getShuffled() {
  return [...REVIEWS.slice(3)].sort(() => Math.random() - 0.5).slice(0, 3)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="13" height="13" viewBox="0 0 24 24" fill={n <= rating ? '#C9A96E' : 'rgba(255,255,255,0.15)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, isNew }: { review: import('@/lib/reviews').Review; isNew?: boolean }) {
  return (
    <div
      style={{
        background: isNew ? 'rgba(201,169,110,0.04)' : '#111',
        border: isNew ? '1px solid rgba(201,169,110,0.22)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '8px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'border-color 300ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = isNew ? 'rgba(201,169,110,0.22)' : 'rgba(255,255,255,0.07)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StarRating rating={review.rating} />
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>

      <p style={{
        fontFamily: 'var(--font-dm-sans, sans-serif)',
        fontSize: '14px', lineHeight: 1.7,
        color: 'rgba(255,255,255,0.7)', margin: 0, flex: 1,
      }}>
        &ldquo;{review.text}&rdquo;
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: '13px', fontWeight: 700, color: '#0a0a0a',
          }}>
            {review.author[0].toUpperCase()}
          </span>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '13px', fontWeight: 600, color: '#fff',
          }}>
            {review.author}
          </div>
          <div style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '9px', letterSpacing: '0.5px',
            color: 'rgba(255,255,255,0.3)', marginTop: '2px',
          }}>
            {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeReviewsTeaser() {
  const [featured] = useState(getShuffled)
  return (
    <section
      style={{
        background: '#0a0a0a',
        padding: 'clamp(72px, 9vw, 120px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '52px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}
            >
              Customer Reviews
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
              }}
            >
              What Kakinada<br />
              <span style={{ color: '#C9A96E' }}>Says About Us.</span>
            </h2>
          </div>

          <Link
            href="/reviews"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              padding: '11px 24px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#fff',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 250ms ease, border-color 250ms ease, color 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C9A96E'
              e.currentTarget.style.borderColor = '#C9A96E'
              e.currentTarget.style.color = '#0a0a0a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.color = '#fff'
            }}
          >
            See All {REVIEWS.length} Reviews
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* Latest Reviews */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#C9A96E', display: 'inline-block',
              animation: 'latest-pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '9px', letterSpacing: '1.4px',
              textTransform: 'uppercase', color: '#C9A96E',
            }}>Latest Reviews</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {LATEST.map((review) => (
              <ReviewCard key={review.id} review={review} isNew />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '9px', letterSpacing: '1.2px',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
          }}>From Our Customers</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* 3 shuffled review cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {featured.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <style>{`
          @keyframes latest-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.5); }
          }
        `}</style>

        {/* Bottom CTA strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1,2,3,4,5].map(n => (
                <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="#C9A96E">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              5.0 · {REVIEWS.length} Verified Google Reviews
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href={LEAVE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: '#C9A96E',
                color: '#0a0a0a',
                borderRadius: '9999px',
                padding: '9px 18px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 250ms ease, color 250ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.outline = '1px solid #C9A96E' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.outline = 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Leave a Review
            </a>
            <Link
              href="/reviews"
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#C9A96E',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Read all customer reviews
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
