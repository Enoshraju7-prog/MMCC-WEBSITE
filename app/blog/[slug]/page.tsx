'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

type CoverImage = {
  url: string
  small: string
  alt: string
  photographer: string
  photographerUrl: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params)
  const post = getPost(slug)
  if (!post) notFound()

  const [cover, setCover] = useState<CoverImage | null>(null)

  useEffect(() => {
    fetch(`/api/pexels?q=${encodeURIComponent(post.pexelsQuery)}`)
      .then(r => r.json())
      .then(data => { if (data.url) setCover(data) })
      .catch(() => {})
  }, [post.pexelsQuery])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '120px' }}>
        {/* Header */}
        <div style={{
          borderBottom: cover ? 'none' : '1px solid rgba(201,169,110,0.12)',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 60px)',
        }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <Link href="/blog" style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                Blog
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                color: '#C9A96E',
                letterSpacing: '0.5px',
              }}>
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 24px',
            }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.5px',
              }}>
                {formatDate(post.date)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.5px',
              }}>
                {post.readTime}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                color: '#C9A96E',
                letterSpacing: '0.5px',
              }}>
                MM Car Care
              </span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {cover && (
          <div style={{ position: 'relative', width: '100%', maxHeight: '460px', overflow: 'hidden', borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
            <img
              src={cover.url}
              alt={cover.alt}
              style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block', opacity: 0.75 }}
            />
            <a
              href={cover.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '14px',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                letterSpacing: '0.5px',
              }}
            >
              Photo: {cover.photographer} / Pexels
            </a>
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(48px, 6vw, 72px) clamp(24px, 5vw, 80px) 0' }}>
          {post.content.map((section, i) => {
            if (section.type === 'h2') return (
              <h2 key={i} style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(22px, 3vw, 30px)',
                fontWeight: 700,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 'clamp(36px, 5vw, 52px) 0 16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(201,169,110,0.15)',
              }}>
                {section.text}
              </h2>
            )

            if (section.type === 'h3') return (
              <h3 key={i} style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '28px 0 12px',
              }}>
                {section.text}
              </h3>
            )

            if (section.type === 'p') return (
              <p key={i} style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: 'clamp(15px, 2vw, 17px)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 20px',
              }}>
                {section.text}
              </p>
            )

            if (section.type === 'ul') return (
              <ul key={i} style={{ margin: '0 0 24px', paddingLeft: '0', listStyle: 'none' }}>
                {section.items?.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: 'clamp(15px, 2vw, 16px)',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.6)',
                    padding: '8px 0 8px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '5px',
                      height: '1px',
                      background: '#C9A96E',
                      display: 'inline-block',
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            )

            if (section.type === 'tip') return (
              <div key={i} style={{
                background: 'rgba(201,169,110,0.06)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderLeft: '3px solid #C9A96E',
                padding: '18px 22px',
                margin: '28px 0',
              }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0,
                }}>
                  {section.text}
                </p>
              </div>
            )

            return null
          })}

          {/* CTA */}
          <div style={{
            marginTop: '72px',
            padding: 'clamp(32px, 4vw, 48px)',
            background: 'rgba(201,169,110,0.05)',
            border: '1px solid rgba(201,169,110,0.18)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}>
              Need Car Care in Kakinada?
            </div>
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '28px',
              lineHeight: 1.6,
            }}>
              MM Car Care · Opp. APSP Petrol Bunk, Kakinada · Mon–Sat, 9 AM–9 PM
            </p>
            <a
              href="tel:9848377309"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '12px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                background: '#C9A96E',
                padding: '14px 32px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Call 9848377309
            </a>
          </div>

          {/* Back link */}
          <div style={{ marginTop: '48px' }}>
            <Link href="/blog" style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              ← All articles
            </Link>
          </div>
        </div>
      </div>
  )
}
