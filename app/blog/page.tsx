'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BLOG_POSTS, BlogPost } from '@/lib/blog'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BlogCard({ post }: { post: BlogPost }) {
  const [thumb, setThumb] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/pexels?q=${encodeURIComponent(post.pexelsQuery)}`)
      .then(r => r.json())
      .then(data => { if (data.small) setThumb(data.small) })
      .catch(() => {})
  }, [post.pexelsQuery])

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'rgba(201,169,110,0.03)',
          border: '1px solid rgba(201,169,110,0.1)',
          transition: 'background 250ms ease, border-color 250ms ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.06)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.03)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.1)'
        }}
      >
        {/* Thumbnail */}
        <div style={{
          width: '100%',
          height: '220px',
          background: '#111',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {thumb ? (
            <img
              src={thumb}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #111 0%, #181208 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '11px',
                letterSpacing: '3px',
                color: 'rgba(201,169,110,0.25)',
                textTransform: 'uppercase',
              }}>MM Car Care</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category + read time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '9px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              background: 'rgba(201,169,110,0.1)',
              padding: '4px 10px',
              borderRadius: '2px',
            }}>
              {post.category}
            </span>
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '9px',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.25)',
            }}>
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 14px',
          }}>
            {post.title}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '14px',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 24px',
            flex: 1,
          }}>
            {post.description}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.5px',
            }}>
              {formatDate(post.date)}
            </span>
            <span style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1px',
              color: '#C9A96E',
              textTransform: 'uppercase',
            }}>
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,169,110,0.15)',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 60px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C9A96E',
            marginBottom: '20px',
          }}>
            Car Care Knowledge
          </div>
          <h1 style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 700,
            lineHeight: 1.0,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: 0,
          }}>
            Tips &<br />
            <span style={{ color: '#C9A96E' }}>Guides</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.45)',
            marginTop: '24px',
            maxWidth: '480px',
          }}>
            Practical advice for car owners in Kakinada — from our team at MM Car Care.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div
        className="blog-grid"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2px',
        }}
      >
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
