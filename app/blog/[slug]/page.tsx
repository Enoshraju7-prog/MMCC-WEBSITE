'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, BLOG_POSTS } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

type CoverImage = {
  url: string
  alt: string
  photographer: string
  photographerUrl: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: '32px', right: '32px',
        width: '44px', height: '44px', borderRadius: '50%',
        background: '#C9A96E', color: '#0a0a0a',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-space-mono, monospace)',
        fontSize: '16px', fontWeight: 700, zIndex: 50,
        boxShadow: '0 4px 20px rgba(201,169,110,0.3)',
        transition: 'transform 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >↑</button>
  )
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

  const h2Sections = post.content.filter(s => s.type === 'h2')
  const relatedPosts = post.relatedSlugs
    .map(s => BLOG_POSTS.find(p => p.slug === s))
    .filter((p): p is BlogPost => p !== undefined)

  return (
    <>
      <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '120px' }}>

        {/* Header */}
        <header style={{
          borderBottom: cover ? 'none' : '1px solid rgba(201,169,110,0.12)',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 60px)',
        }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>

            {/* Breadcrumb nav */}
            <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <Link href="/" style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px',
                letterSpacing: '1.2px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >Home</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
              <Link href="/blog" style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px',
                letterSpacing: '1.2px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >Blog</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px',
                color: '#C9A96E', letterSpacing: '0.5px',
              }}>
                {post.category}
              </span>
            </nav>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700, lineHeight: 1.05, color: '#fff',
              textTransform: 'uppercase', letterSpacing: '1px',
              margin: '0 0 24px',
            }}>
              {post.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px',
                color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px',
              }}>
                {formatDate(post.date)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '10px',
                color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px',
              }}>
                {post.readTime}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#C9A96E', background: 'rgba(201,169,110,0.1)',
                padding: '3px 10px', borderRadius: '2px',
              }}>
                {post.category}
              </span>
            </div>

            {/* Author byline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A96E, #e8c98a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>SD</span>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                }}>
                  {post.author}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                }}>
                  Founder, MM Car Care · 30 years in car care, Kakinada ·{' '}
                  <Link href="/about" style={{ color: '#C9A96E', textDecoration: 'none' }}>About</Link>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Cover image */}
        {cover && (
          <div style={{ position: 'relative', width: '100%', maxHeight: '460px', overflow: 'hidden', borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
            <img
              src={cover.url}
              alt={cover.alt}
              style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }}
            />
            <a
              href={cover.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute', bottom: '10px', right: '14px',
                fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px',
                color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.5px',
              }}
            >
              Photo: {cover.photographer} / Pexels
            </a>
          </div>
        )}

        {/* Article body */}
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(48px, 6vw, 72px) clamp(24px, 5vw, 80px) 0' }}>

          {/* Table of Contents (3+ H2s) */}
          {h2Sections.length >= 3 && (
            <nav aria-label="Table of contents" style={{
              background: 'rgba(201,169,110,0.04)',
              border: '1px solid rgba(201,169,110,0.15)',
              padding: '24px 28px',
              marginBottom: '48px',
            }}>
              <div style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                color: '#C9A96E', marginBottom: '16px',
              }}>
                In this article
              </div>
              <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {h2Sections.map((section, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', lineHeight: 1.5 }}>
                    <a
                      href={`#${slugify(section.text ?? '')}`}
                      style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 150ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {section.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Content sections */}
          {post.content.map((section, i) => {
            if (section.type === 'h2') return (
              <h2
                key={i}
                id={slugify(section.text ?? '')}
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
                  color: '#fff', textTransform: 'uppercase', letterSpacing: '1px',
                  margin: 'clamp(36px, 5vw, 52px) 0 16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(201,169,110,0.15)',
                }}
              >
                {section.text}
              </h2>
            )

            if (section.type === 'h3') return (
              <h3 key={i} style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700,
                color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
                letterSpacing: '0.5px', margin: '28px 0 12px',
              }}>
                {section.text}
              </h3>
            )

            if (section.type === 'p') return (
              <p key={i} style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.75,
                color: 'rgba(255,255,255,0.7)', margin: '0 0 20px',
              }}>
                {section.text}
              </p>
            )

            if (section.type === 'ul') return (
              <ul key={i} style={{ margin: '0 0 24px', paddingLeft: 0, listStyle: 'none' }}>
                {section.items?.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: 'clamp(15px, 2vw, 16px)', lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.65)',
                    padding: '8px 0 8px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: '5px', height: '1px',
                      background: '#C9A96E', display: 'inline-block',
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
                padding: '18px 22px', margin: '28px 0',
              }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '14px', lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.7)', margin: 0,
                }}>
                  {section.text}
                </p>
              </div>
            )

            return null
          })}

          {/* FAQ Section */}
          {post.faqs.length > 0 && (
            <section aria-label="Frequently asked questions" style={{ marginTop: '64px' }}>
              <h2 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
                color: '#fff', textTransform: 'uppercase', letterSpacing: '1px',
                margin: '0 0 28px', paddingBottom: '12px',
                borderBottom: '1px solid rgba(201,169,110,0.15)',
              }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {post.faqs.map((faq, i) => (
                  <div key={i} style={{
                    background: 'rgba(201,169,110,0.03)',
                    border: '1px solid rgba(201,169,110,0.1)',
                    padding: '20px 24px',
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '15px', fontWeight: 600,
                      color: '#fff', margin: '0 0 10px', lineHeight: 1.4,
                    }}>
                      {faq.q}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '14px', lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.65)', margin: 0,
                    }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div style={{
            marginTop: '64px',
            padding: 'clamp(32px, 4vw, 48px)',
            background: 'rgba(201,169,110,0.05)',
            border: '1px solid rgba(201,169,110,0.18)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '1px',
              marginBottom: '12px',
            }}>
              Need Car Care in Kakinada?
            </div>
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '15px', color: 'rgba(255,255,255,0.55)',
              marginBottom: '28px', lineHeight: 1.6,
            }}>
              MM Car Care · Opp. APSP Petrol Bunk, Kakinada · Mon–Sat, 9 AM–9 PM
            </p>
            <a
              href="tel:9848377309"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#0a0a0a', background: '#C9A96E',
                padding: '14px 32px', textDecoration: 'none', fontWeight: 700,
              }}
            >
              Call 9848377309
            </a>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '56px' }}>
              <div style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                color: '#C9A96E', marginBottom: '20px',
              }}>
                Related Articles
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2px',
              }}>
                {relatedPosts.map(related => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: 'rgba(201,169,110,0.03)',
                        border: '1px solid rgba(201,169,110,0.1)',
                        padding: '20px',
                        transition: 'background 200ms ease, border-color 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.07)'
                        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.03)'
                        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.1)'
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase',
                        color: '#C9A96E', marginBottom: '8px',
                      }}>
                        {related.category}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-big-shoulders, sans-serif)',
                        fontSize: '15px', fontWeight: 700, color: '#fff',
                        textTransform: 'uppercase', lineHeight: 1.2, letterSpacing: '0.5px',
                      }}>
                        {related.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: '48px' }}>
            <Link href="/blog" style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            >
              ← All articles
            </Link>
          </div>

        </article>
      </div>
      <BackToTop />
    </>
  )
}
