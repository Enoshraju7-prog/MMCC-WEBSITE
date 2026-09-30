'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

const FEATURED = [
  {
    id: 'combo',
    title: 'Full Wash Combo',
    desc: 'Exterior wash and complete interior clean in one visit. The most popular treatment — leave with a car that feels factory-fresh inside and out.',
    duration: '90 min',
    highlight: true,
  },
  {
    id: 'oil',
    title: 'Oil Change',
    desc: 'Correct-grade engine oil, OEM-spec filter, and a full fluid top-up check. Done right, without shortcuts.',
    duration: '30 min',
  },
  {
    id: 'engine',
    title: 'Engine Service',
    desc: 'Spark plugs, air filter, throttle body, belt condition, and cooling system. Identifies issues before they become breakdowns.',
    duration: '2–3 hrs',
  },
  {
    id: 'rebore',
    title: 'Engine Reboring',
    desc: 'For high-mileage engines where cylinders have worn beyond tolerance. Precision reboring, honing, and oversized piston fitment — restoring full compression.',
    duration: '3–5 days',
  },
  {
    id: 'ecm',
    title: 'ECM Diagnostics',
    desc: 'Full OBD-II scan across engine, ABS, airbag, and transmission modules. Reads, clears, and verifies fault codes after repair.',
    duration: '30–45 min',
  },
  {
    id: 'ac',
    title: 'AC Service',
    desc: 'Refrigerant check and recharge, compressor inspection, cabin filter replacement, and duct cleaning. Cool cabin, clean air.',
    duration: '1–2 hrs',
  },
  {
    id: 'dent',
    title: 'Dent & Scratch Work',
    desc: 'Panel beating, filler work, and paint matching for dents, scratches, and scrapes. Colour-matched finish so the repair disappears.',
    duration: 'Assessed on-site',
  },
  {
    id: 'headlight',
    title: 'Headlight Restoration',
    desc: 'Oxidised, yellowed lenses sanded back and polished clear. Restores full light output and gives the front of your car a sharp look again.',
    duration: '45 min',
  },
  {
    id: 'brakes',
    title: 'Brake Service',
    desc: 'Brake pad wear check, disc inspection, and brake fluid moisture test. Replaced if due — no guessing, no upselling.',
    duration: '1–2 hrs',
  },
  {
    id: 'bumper',
    title: 'Bumper Repair',
    desc: 'Cracked, dented, or scraped bumpers repaired and colour-matched on-site. Plastic welding for cracks, filler for dents — saves the cost of a full replacement.',
    duration: '1–3 hrs',
  },
  {
    id: 'ceramic',
    title: 'Ceramic Coating',
    desc: 'Professional 9H ceramic application with two-stage paint decontamination. Long-term hydrophobic protection — water beads off, dirt doesn\'t stick.',
    duration: '2 days',
  },
]

export default function HomeServicesPreview() {
  const { open } = useBooking()
  const [active, setActive] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('.hsvc-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      })
      gsap.from('.hsvc-card', {
        y: 50, opacity: 0, duration: 0.65,
        stagger: { amount: 0.5, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.hsvc-grid', start: 'top 78%', once: true },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <section
        style={{
          background: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="hsvc-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#C9A96E',
                marginBottom: '20px',
              }}>
                What We Offer
              </div>
              <h2 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 130px)',
                fontWeight: 700,
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
              }}>
                <span style={{ color: '#ffffff', display: 'block' }}>OUR</span>
                <span style={{ color: '#C9A96E', display: 'block' }}>SERVICES.</span>
              </h2>
            </div>
            <Link
              href="/services"
              style={{
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 250ms ease, border-color 250ms ease, color 250ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
            >
              View All Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: '#0a0a0a', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="hsvc-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* 9 featured services */}
            {FEATURED.map((svc) => (
              <div
                key={svc.id}
                className="hsvc-card"
                onClick={() => setActive(active === svc.id ? null : svc.id)}
                style={{
                  background: active === svc.id ? 'rgba(201,169,110,0.08)' : '#0a0a0a',
                  padding: 'clamp(28px, 3vw, 44px)',
                  cursor: 'pointer',
                  transition: 'background 200ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (active !== svc.id) e.currentTarget.style.background = 'rgba(201,169,110,0.05)' }}
                onMouseLeave={(e) => { if (active !== svc.id) e.currentTarget.style.background = '#0a0a0a' }}
              >
                {svc.highlight && (
                  <div style={{
                    position: 'absolute', top: '24px', right: '24px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '8px', letterSpacing: '1.2px', textTransform: 'uppercase',
                    color: '#0a0a0a', background: '#C9A96E',
                    padding: '4px 10px', borderRadius: '9999px',
                  }}>
                    Popular
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    fontFamily: 'var(--font-big-shoulders, sans-serif)',
                    fontSize: 'clamp(24px, 2.5vw, 32px)',
                    fontWeight: 400, textTransform: 'uppercase', color: '#fff', lineHeight: 1,
                  }}>
                    {svc.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: '#C9A96E',
                  }}>
                    {svc.duration}
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px', lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.45)', marginBottom: '20px',
                }}>
                  {svc.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); open() }}
                    style={{
                      background: 'transparent', color: '#C9A96E',
                      border: '1px solid #C9A96E', borderRadius: '9999px',
                      padding: '8px 20px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase',
                      transition: 'background 250ms ease, color 250ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}

            {/* Others card */}
            <div
              className="hsvc-card"
              style={{
                background: 'rgba(201,169,110,0.04)',
                padding: 'clamp(28px, 3vw, 44px)',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '28px',
              }}
            >
              <div>
                <div style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px', letterSpacing: '1.4px', textTransform: 'uppercase',
                  color: '#C9A96E', marginBottom: '14px',
                }}>
                  Something else?
                </div>
                <div style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(24px, 2.5vw, 32px)',
                  fontWeight: 400, textTransform: 'uppercase', color: '#fff',
                  lineHeight: 1.1, marginBottom: '14px',
                }}>
                  Other Services
                </div>
                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px', lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.45)',
                }}>
                  Wheel alignment, tyre balancing, ceramic coating, paint polish, seat covers, audio & infotainment, battery service, and more. Or just tell us what your car needs.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/services"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: '#C9A96E', color: '#0a0a0a',
                    borderRadius: '9999px', padding: '11px 20px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase',
                    textDecoration: 'none', fontWeight: 700,
                    transition: 'background 250ms ease, color 250ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E'; (e.currentTarget as HTMLElement).style.outline = '1px solid #C9A96E' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a'; (e.currentTarget as HTMLElement).style.outline = 'none' }}
                >
                  View All Services →
                </Link>
                <button
                  onClick={open}
                  style={{
                    background: 'transparent', color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '9999px', padding: '11px 20px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase',
                    transition: 'border-color 250ms ease, color 250ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  Describe Your Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
