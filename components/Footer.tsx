'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

const colHead: React.CSSProperties = {
  fontFamily: 'var(--font-big-shoulders, sans-serif)',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#C9A96E',
  marginBottom: '18px',
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans, sans-serif)',
  fontSize: '13px',
  lineHeight: 1.5,
  color: 'rgba(255,255,255,0.55)',
  textDecoration: 'none',
  transition: 'color 200ms ease',
  display: 'block',
}

export default function Footer() {
  const { open } = useBooking()
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    const ctx = gsap.context(() => {
      gsap.from('.footer-brand', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
      })
      gsap.from('.footer-col', {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
        delay: 0.15,
      })
      gsap.from('.footer-bottom', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 85%', once: true },
        delay: 0.3,
      })
    }, footer)
    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(201,169,110,0.2)',
        padding: 'clamp(60px, 8vw, 80px) clamp(24px, 5vw, 64px) 48px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '64px',
          flexWrap: 'wrap',
          marginBottom: '64px',
        }}>
          {/* Brand */}
          <div className="footer-brand" style={{ maxWidth: '320px' }}>
            <div style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              marginBottom: '14px',
            }}>
              MM Car Care
            </div>
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.5)',
              whiteSpace: 'pre-line',
            }}>
              {'Every car, treated the same.\nKakinada · Mobile service available.'}
            </p>
          </div>

          {/* Columns */}
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            {/* Navigate */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={colHead}>Navigate</div>
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/#services' },
                { label: 'About', href: '/#about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/#contact' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Services */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={colHead}>Services</div>
              {[
                'Exterior Wash',
                'Ceramic Coating',
                'Engine Service',
                'AC Service',
                'Wheel Alignment',
                'Audio & Infotainment',
                '& Others',
              ].map((s) => (
                <div key={s} style={linkStyle}>{s}</div>
              ))}
            </div>

            {/* Hours */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={colHead}>Hours</div>
              <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                Mon – Sat
              </div>
              <div style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#C9A96E',
              }}>
                9:00 AM – 9:00 PM
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '8px',
                display: 'flex',
                gap: '10px',
              }}>
                <span>Sunday</span><span>Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(201,169,110,0.15)', marginBottom: '28px' }} />

        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.5px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            © 2026 MM Car Care · Kakinada, Andhra Pradesh
          </span>
          <button
            onClick={open}
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              background: 'none',
              border: '1px solid rgba(201,169,110,0.4)',
              borderRadius: '9999px',
              padding: '8px 20px',
              transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C9A96E'
              e.currentTarget.style.color = '#0a0a0a'
              e.currentTarget.style.borderColor = '#C9A96E'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = '#C9A96E'
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'
            }}
          >
            BOOK A SERVICE →
          </button>
        </div>
      </div>
    </footer>
  )
}
