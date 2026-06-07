'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const { open } = useBooking()
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const ctx = gsap.context(() => {
      gsap.from('.footer-brand', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
      })
      gsap.from('.footer-col', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
        delay: 0.15,
      })
      gsap.from('.footer-bottom', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
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
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: 'clamp(60px, 8vw, 80px) clamp(24px, 5vw, 64px) 48px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '64px',
            flexWrap: 'wrap',
            marginBottom: '64px',
          }}
        >
          {/* Brand */}
          <div className="footer-brand" style={{ maxWidth: '320px' }}>
            <div
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '24px',
                fontWeight: 400,
                letterSpacing: '5px',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '16px',
              }}
            >
              MM CAR CARE
            </div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.4)',
                whiteSpace: 'pre-line',
              }}
            >
              {'Every car, treated the same.\nKakinada · Mobile service available.'}
            </p>
          </div>

          {/* Columns */}
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            {/* Navigate */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '6px',
                }}
              >
                Navigate
              </div>
              {[
                { label: 'HOME', href: '/' },
                { label: 'SERVICES', href: '/services' },
                { label: 'ABOUT', href: '/about' },
                { label: 'CONTACT', href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Services */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '6px',
                }}
              >
                Services
              </div>
              {['Exterior Wash', 'Interior Clean', 'Full Combo', 'Ceramic Coating'].map((s) => (
                <div
                  key={s}
                  style={{
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '6px',
                }}
              >
                Hours
              </div>
              <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.4)' }}>Mon – Sat</div>
              <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', lineHeight: 1.5, color: '#fff' }}>9:00 AM – 9:00 PM</div>
              <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Sunday</div>
              <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.4)' }}>Closed</div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />

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
          <span
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.5px',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            © 2026 MM Car Care · Kakinada, Andhra Pradesh
          </span>
          <button
            onClick={open}
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              background: 'none',
              border: 'none',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            BOOK A SERVICE →
          </button>
        </div>
      </div>
    </footer>
  )
}
