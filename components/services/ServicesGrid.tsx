'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    id: 'exterior',
    title: 'Exterior Wash',
    desc: 'Pressure rinse to remove loose dirt, pH-neutral foam bath, hand wash with microfibre mitts, and a final blow-dry. Streak-free, spot-free finish every time.',
    detail: ['Pressure rinse', 'pH-neutral foam wash', 'Microfibre hand wash', 'Blow dry & wipe'],
    duration: '45 min',
  },
  {
    id: 'interior',
    title: 'Interior Clean',
    desc: 'Full vacuum of seats, mats, and boot. Wipe-down of dash, console, and door cards. Glass cleaning inside. Odour-neutralising finish.',
    detail: ['Full vacuum', 'Dashboard & console wipe', 'Interior glass clean', 'Odour neutralisation'],
    duration: '60 min',
  },
  {
    id: 'combo',
    title: 'Full Wash Combo',
    desc: 'Exterior Wash and Interior Clean combined into a single visit. The most popular treatment. Leave with a car that feels factory-fresh inside and out.',
    detail: ['Full exterior wash', 'Complete interior clean', 'Tyre dressing', 'Dashboard protectant'],
    duration: '90 min',
    highlight: true,
  },
  {
    id: 'polish',
    title: 'Paint Polish',
    desc: 'Machine polish using professional-grade compound and finishing polish. Removes light swirl marks, water spots, and surface oxidation. Restores depth and gloss.',
    detail: ['Clay bar decontamination', 'Compound polish', 'Finishing polish', 'Gloss sealant'],
    duration: '3–4 hrs',
  },
  {
    id: 'ceramic',
    title: 'Ceramic Coating',
    desc: 'Professional 9H ceramic application. Two-stage paint decontamination, paint correction where needed, and a 48-hour cure. Long-term hydrophobic protection.',
    detail: ['Paint decontamination', 'Two-stage correction', '9H ceramic application', '48-hour cure · 2-year protection'],
    duration: '2 days',
  },
  {
    id: 'oil',
    title: 'Oil Change',
    desc: "Correct-grade engine oil, OEM-spec filter, and a full fluid top-up check. Done right, without shortcuts. We consult your vehicle manual — not guesswork.",
    detail: ['Correct-grade engine oil', 'OEM-spec filter replacement', 'Fluid level check', 'Oil life reset'],
    duration: '30 min',
  },
  {
    id: 'battery',
    title: 'Battery Check',
    desc: 'Full battery health diagnostic using a calibrated load tester. Voltage, cold cranking amps, and charge state — all measured and reported to you clearly.',
    detail: ['Load test', 'Voltage reading', 'CCA measurement', 'Written health report'],
    duration: '15 min',
  },
  {
    id: 'tyre',
    title: 'Tyre Pressure',
    desc: "All four tyres checked and inflated to manufacturer specification. Spare checked too. Simple, but most garages skip it. We don't.",
    detail: ['All 4 tyres checked', 'Inflated to spec', 'Spare tyre included', 'Visual tread inspection'],
    duration: '10 min',
  },
]

export default function ServicesGrid() {
  const { open } = useBooking()
  const [active, setActive] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Header
      gsap.from('.svc-header-line', {
        y: '105%',
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.svc-header', start: 'top 80%', once: true },
      })
      gsap.from('.svc-header-sub', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-header', start: 'top 80%', once: true },
        delay: 0.3,
      })

      // Cards
      gsap.from('.svc-card', {
        y: 50,
        opacity: 0,
        duration: 0.65,
        stagger: { amount: 0.6, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 78%', once: true },
      })

      // Bottom note
      gsap.from('.svc-note', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-note', start: 'top 85%', once: true },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <section
        className="svc-header"
        style={{
          background: '#000',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid #111',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#555',
              marginBottom: '20px',
            }}
          >
            Every Service
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h1
              className="svc-header-line"
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 130px)',
                fontWeight: 400,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '28px',
                display: 'block',
              }}
            >
              Services
            </h1>
          </div>
          <p
            className="svc-header-sub"
            style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.6,
              color: '#555',
              maxWidth: '520px',
            }}
          >
            Eight services. All performed by trained hands using professional-grade products. No shortcuts. No exceptions.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: '#000', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="svc-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1px',
              background: '#111',
              border: '1px solid #111',
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="svc-card"
                onClick={() => setActive(active === svc.id ? null : svc.id)}
                style={{
                  background: active === svc.id ? '#050505' : '#000',
                  padding: 'clamp(28px, 3vw, 44px)',
                  cursor: 'pointer',
                  transition: 'background 200ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (active !== svc.id) e.currentTarget.style.background = '#040404' }}
                onMouseLeave={(e) => { if (active !== svc.id) e.currentTarget.style.background = '#000' }}
              >
                {svc.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '8px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: '#000',
                      background: '#fff',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    Popular
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {svc.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '9px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#333',
                    }}
                  >
                    {svc.duration}
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: '#555',
                    marginBottom: '20px',
                  }}
                >
                  {svc.desc}
                </p>

                {/* Expandable details */}
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: active === svc.id ? '200px' : '0',
                    transition: 'max-height 380ms ease',
                  }}
                >
                  <div style={{ borderTop: '1px solid #111', paddingTop: '16px', marginBottom: '20px' }}>
                    {svc.detail.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: 'var(--font-space-mono, monospace)',
                          fontSize: '10px',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#555',
                          padding: '6px 0',
                          borderBottom: i < svc.detail.length - 1 ? '1px solid #0d0d0d' : 'none',
                        }}
                      >
                        → {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '9px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: '#555',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
                  >
                    {active === svc.id ? '− Hide Details' : "+ What's Included"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); open() }}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: '1px solid #fff',
                      borderRadius: '9999px',
                      padding: '8px 20px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '10px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      transition: 'background 250ms ease, color 250ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section
        className="svc-note"
        style={{
          background: '#000',
          padding: 'clamp(48px, 5vw, 80px) clamp(24px, 5vw, 80px)',
          borderTop: '1px solid #111',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#555',
            maxWidth: '560px',
            margin: '0 auto 32px',
          }}
        >
          All prices vary based on vehicle size and condition. Hatchback, sedan, SUV — we assess and quote before we begin. No surprises.
        </p>
        <button
          onClick={open}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '9999px',
            padding: '14px 36px',
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '12px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            transition: 'background 250ms ease, color 250ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
        >
          Book a Service
        </button>
      </section>
    </div>
  )
}
