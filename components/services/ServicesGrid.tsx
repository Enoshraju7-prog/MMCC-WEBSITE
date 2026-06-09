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
    id: 'rebore',
    title: 'Engine Reboring',
    desc: 'For high-mileage engines where cylinders have worn beyond tolerance. Cylinders are precision-bored, honed to specification, and fitted with oversized pistons and rings — restoring full compression and engine life.',
    detail: ['Cylinder bore measurement & assessment', 'Precision reboring & honing', 'Oversized piston & ring fitment', 'Compression test post-rebuild'],
    duration: '3–5 days',
  },
  {
    id: 'seat-mats',
    title: 'Seat Covers & Floor Mats',
    desc: 'Custom-fit leatherette seat covers and 7D floor mats tailored to your vehicle model. Better than showroom accessories — professionally fitted, exact dimensions, with no gaps or loose ends.',
    detail: ['Vehicle-specific leatherette seat covers', '7D custom-fit floor mats', 'Professional fitting & finishing', 'Full cabin coverage'],
    duration: '2–3 hrs',
  },
  {
    id: 'audio',
    title: 'Audio & Infotainment',
    desc: 'Full car audio upgrade and infotainment installation — head unit, component speakers, subwoofer, amplifier, and wiring. Clean factory-level install with no exposed cables.',
    detail: ['Head unit / Android display fitment', 'Component speaker installation', 'Subwoofer & amplifier wiring', 'Clean harness integration'],
    duration: '3–6 hrs',
  },
  {
    id: 'headlight',
    title: 'Headlight Restoration',
    desc: 'Oxidised, yellowed headlights sanded back and polished clear. Restores light output and gives the front of your car a clean, sharp look.',
    detail: ['Multi-stage wet sanding', 'Machine polish', 'UV sealant coat', 'Before & after check'],
    duration: '45 min',
  },
  {
    id: 'oil',
    title: 'Oil Change',
    desc: "Correct-grade engine oil, OEM-spec filter, and a full fluid top-up check. Done right, without shortcuts. We consult your vehicle manual — not guesswork.",
    detail: ['Correct-grade engine oil', 'OEM-spec filter replacement', 'Fluid level check', 'Oil life reset'],
    duration: '30 min',
  },
  {
    id: 'engine',
    title: 'Engine Service',
    desc: 'Complete engine health check — spark plugs, air filter, throttle body, belt condition, and cooling system. Identifies issues before they become breakdowns.',
    detail: ['Spark plug inspection & replacement', 'Air & fuel filter service', 'Throttle body cleaning', 'Cooling system flush & refill'],
    duration: '2–3 hrs',
  },
  {
    id: 'battery',
    title: 'Battery Service',
    desc: 'Full battery health diagnostic using a calibrated load tester. Voltage, cold cranking amps, and charge state checked. Replacement if needed, fitted and tested.',
    detail: ['Load test & CCA measurement', 'Voltage & charge check', 'Terminal cleaning', 'Replacement & fitment if required'],
    duration: '30 min',
  },
  {
    id: 'brakes',
    title: 'Brake Service',
    desc: 'Front and rear brake pads measured for wear. Discs checked for scoring and run-out. Brake fluid tested for moisture content and replaced if needed.',
    detail: ['Pad wear measurement', 'Disc & rotor inspection', 'Brake fluid moisture test', 'Pad & fluid replacement if due'],
    duration: '1–2 hrs',
  },
  {
    id: 'suspension',
    title: 'Suspension & Steering',
    desc: 'Full undercarriage inspection — shocks, struts, ball joints, tie rod ends, and bushings. Identifies the real cause of vibrations, pulling, or uneven tyre wear.',
    detail: ['Shock & strut inspection', 'Ball joint & tie rod check', 'Bushing condition assessment', 'Steering play measurement'],
    duration: '45 min',
  },
  {
    id: 'ac',
    title: 'AC Service',
    desc: 'Complete air conditioning service — refrigerant level check, compressor inspection, cabin filter replacement, and duct cleaning. Cool cabin, clean air.',
    detail: ['Refrigerant check & recharge', 'Compressor & condenser inspection', 'Cabin air filter replacement', 'AC duct & evaporator cleaning'],
    duration: '1–2 hrs',
  },
  {
    id: 'alignment',
    title: 'Wheel Alignment',
    desc: '4-wheel computerised alignment to manufacturer specification. Corrects pulling, uneven tyre wear, and steering drift. Protects tyres and improves fuel efficiency.',
    detail: ['4-wheel computerised alignment', 'Camber, caster & toe adjustment', 'Steering centre check', 'Test drive confirmation'],
    duration: '45 min',
  },
  {
    id: 'balancing',
    title: 'Tyre Balancing',
    desc: 'Dynamic balance of all four wheels using precision equipment. Eliminates steering wheel vibration at speed and prevents uneven tread wear.',
    detail: ['Dynamic balance of all 4 wheels', 'Weight placement & verification', 'Valve stem check', 'Post-balance test drive'],
    duration: '30 min',
  },
  {
    id: 'rotation',
    title: 'Tyre Rotation',
    desc: 'Tyres rotated to the correct pattern for your drivetrain — cross, straight, or rearward. Extends tyre life and keeps wear even across all four corners.',
    detail: ['Drivetrain-correct rotation pattern', 'Torque-spec re-fitment', 'Tread depth measurement', 'Tyre pressure set to spec'],
    duration: '20 min',
  },
  {
    id: 'fluids',
    title: 'Fluid Service',
    desc: 'Full check and top-up of all vehicle fluids: coolant, power steering, brake fluid, windscreen wash, and transmission. The kind of check most owners skip until something fails.',
    detail: ['Coolant level & condition', 'Power steering fluid check', 'Brake fluid moisture test', 'Transmission & windscreen wash top-up'],
    duration: '30 min',
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
      gsap.from('.svc-card', {
        y: 50,
        opacity: 0,
        duration: 0.65,
        stagger: { amount: 0.6, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 78%', once: true },
      })
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
          background: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              marginBottom: '20px',
            }}
          >
            What We Offer
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h1
              className="svc-header-line"
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(52px, 10vw, 130px)',
                fontWeight: 700,
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
                display: 'block',
              }}
            >
              <span style={{ color: '#ffffff', display: 'block' }}>EVERY</span>
              <span style={{ color: '#C9A96E', display: 'block' }}>SERVICE.</span>
            </h1>
          </div>
          <p
            className="svc-header-sub"
            style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '520px',
              marginTop: '28px',
            }}
          >
            Performed by trained hands using professional-grade products. No shortcuts. No exceptions.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: '#0a0a0a', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="svc-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="svc-card"
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
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '8px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: '#0a0a0a',
                      background: '#C9A96E',
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
                      color: '#C9A96E',
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
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '20px',
                  }}
                >
                  {svc.desc}
                </p>

                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: active === svc.id ? '200px' : '0',
                    transition: 'max-height 380ms ease',
                  }}
                >
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginBottom: '20px' }}>
                    {svc.detail.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: 'var(--font-space-mono, monospace)',
                          fontSize: '10px',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.5)',
                          padding: '6px 0',
                          borderBottom: i < svc.detail.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
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
                      color: 'rgba(255,255,255,0.4)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    {active === svc.id ? '− Hide Details' : "+ What's Included"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); open() }}
                    style={{
                      background: 'transparent',
                      color: '#C9A96E',
                      border: '1px solid #C9A96E',
                      borderRadius: '9999px',
                      padding: '8px 20px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '10px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
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
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section
        className="svc-note"
        style={{
          background: '#0a0a0a',
          padding: 'clamp(48px, 5vw, 80px) clamp(24px, 5vw, 80px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '560px',
            margin: '0 auto 32px',
          }}
        >
          All prices vary based on vehicle size and condition. Hatchback, sedan, SUV — we assess and quote before we begin. No surprises.
        </p>
        <button
          onClick={open}
          style={{
            background: '#C9A96E',
            color: '#0a0a0a',
            border: '1px solid #C9A96E',
            borderRadius: '9999px',
            padding: '14px 36px',
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '12px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            transition: 'background 250ms ease, color 250ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
        >
          Book a Service
        </button>
      </section>
    </div>
  )
}
