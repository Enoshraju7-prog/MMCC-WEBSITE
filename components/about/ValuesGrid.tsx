'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  { num: '01', title: 'Precision', desc: 'Every step of the process is deliberate. We follow a method, not a mood.' },
  { num: '02', title: 'Consistency', desc: 'The same standard on every car. Hatchback or luxury SUV — identical attention.' },
  { num: '03', title: 'Honesty', desc: 'We tell you what your car needs. Not what earns us the most.' },
  { num: '04', title: 'Craft', desc: 'Car care done by hand, with professional products. Not automated shortcuts.' },
]

export default function ValuesGrid() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.values-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      })

      gsap.from('.value-card', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.values-grid', start: 'top 78%', once: true },
        delay: 0.1,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: '#fff', padding: 'clamp(64px, 8vw, 120px) clamp(24px, 5vw, 80px)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="values-label"
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#555',
            marginBottom: '48px',
          }}
        >
          What We Stand For
        </div>

        <div
          className="values-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            borderTop: '1px solid #ebebeb',
            borderLeft: '1px solid #ebebeb',
          }}
        >
          {VALUES.map((v) => (
            <div
              key={v.num}
              className="value-card"
              style={{
                padding: 'clamp(28px, 3vw, 44px)',
                borderRight: '1px solid #ebebeb',
                borderBottom: '1px solid #ebebeb',
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f8f8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: '#333',
                  marginBottom: '18px',
                }}
              >
                {v.num}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(26px, 2.5vw, 32px)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: '#000',
                  marginBottom: '14px',
                  lineHeight: 1,
                }}
              >
                {v.title}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: '#555',
                }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
