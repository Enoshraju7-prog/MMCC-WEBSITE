'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { tag: '01', title: 'Exterior Wash', desc: 'Pressure rinse, foam wash, hand dry. Your car, spotless.' },
  { tag: '02', title: 'Interior Clean', desc: 'Vacuumed, wiped, deodorised. Every surface addressed.' },
  { tag: '03', title: 'Full Combo', desc: 'Complete inside-out treatment. One visit, total refresh.' },
  { tag: '04', title: 'Ceramic Coat', desc: '9H professional ceramic for lasting paint protection.' },
  { tag: '05', title: 'Paint Polish', desc: 'Machine polish to restore clarity and remove surface defects.' },
  { tag: '06', title: 'Oil Change', desc: 'Right grade, right quantity. Done correctly, every time.' },
]

export default function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from('.services-heading-line', {
        y: '105%',
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })

      gsap.from('.services-link-btn', {
        opacity: 0,
        x: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        delay: 0.3,
      })

      // Card stagger
      gsap.from('.service-card', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: { amount: 0.5, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 78%', once: true },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#fff', padding: 'clamp(64px, 8vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div
          ref={headingRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '64px',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <h2 style={{ lineHeight: 1 }}>
            {['What We', 'Do Best'].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <span
                  className="services-heading-line"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-big-shoulders, sans-serif)',
                    fontSize: 'clamp(40px, 6vw, 80px)',
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
          <Link
            href="/services"
            className="services-link-btn"
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#999',
              textDecoration: 'none',
              alignSelf: 'flex-end',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
          >
            ALL SERVICES →
          </Link>
        </div>

        {/* Grid */}
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            borderTop: '1px solid #ebebeb',
            borderLeft: '1px solid #ebebeb',
          }}
        >
          {SERVICES.map((s, i) => (
            <Link
              key={i}
              href="/services"
              className="service-card"
              style={{
                padding: '40px 32px',
                borderRight: '1px solid #ebebeb',
                borderBottom: '1px solid #ebebeb',
                textDecoration: 'none',
                display: 'block',
                transition: 'background 200ms ease',
                background: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: '#C9A96E',
                  marginBottom: '20px',
                }}
              >
                {s.tag}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(22px, 2.5vw, 28px)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: '#000',
                  marginBottom: '12px',
                  lineHeight: 1,
                }}
              >
                {s.title}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#555',
                }}
              >
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
