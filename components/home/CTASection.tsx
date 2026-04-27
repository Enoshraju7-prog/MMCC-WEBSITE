'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const { open } = useBooking()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.cta-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })

      gsap.from('.cta-heading-line', {
        y: '105%',
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        delay: 0.1,
      })

      gsap.from('.cta-sub', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        delay: 0.4,
      })

      gsap.from('.cta-btns > *', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        delay: 0.55,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#fff',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid #ebebeb',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          className="cta-label"
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#555',
            marginBottom: '24px',
          }}
        >
          Ready to book?
        </div>

        <h2 style={{ lineHeight: 1, marginBottom: '36px' }}>
          {['Book Your', 'Visit.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                className="cta-heading-line"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(48px, 9vw, 110px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#000',
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </h2>

        <p
          className="cta-sub"
          style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#555',
            marginBottom: '48px',
          }}
        >
          At our Kakinada studio, or we come to you.
        </p>

        <div className="cta-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={open}
            style={{
              background: 'transparent',
              color: '#000',
              border: '1px solid #000',
              borderRadius: '9999px',
              padding: '16px 40px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '13px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              transition: 'background 250ms ease, color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000' }}
          >
            Book a Service
          </button>
          <Link
            href="/contact"
            style={{
              background: 'transparent',
              color: '#999',
              border: '1px solid #ddd',
              borderRadius: '9999px',
              padding: '16px 40px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '13px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 200ms ease, color 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#dddddd'; e.currentTarget.style.color = '#999' }}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
