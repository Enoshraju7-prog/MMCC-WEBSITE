'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = ['Inspection', 'Decontamination', 'Treatment', 'Protection', 'Final Check']

export default function ProcessStrip() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.process-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      })

      gsap.from('.process-step', {
        x: -40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.process-grid', start: 'top 80%', once: true },
        delay: 0.15,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid #0a0a0a',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="process-label"
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#555',
            marginBottom: '36px',
          }}
        >
          Our Process
        </div>

        <div
          className="process-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            borderTop: '1px solid #111',
            borderLeft: '1px solid #111',
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="process-step"
              style={{
                padding: 'clamp(20px, 2vw, 36px) clamp(16px, 2vw, 28px)',
                borderRight: '1px solid #111',
                borderBottom: '1px solid #111',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: '#333',
                  marginBottom: '14px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#fff',
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
