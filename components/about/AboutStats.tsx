'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { raw: 25, display: '25+', label: 'Years in Business', suffix: '+' },
  { raw: 1000, display: '1000+', label: 'Loyal, Trusted Customers', suffix: '+' },
  { raw: null, display: 'Full', label: 'Service Garage', suffix: '' },
  { raw: 100, display: '100%', label: 'Mobile Capable', suffix: '%' },
]

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState(stat.display)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })

      if (stat.raw !== null) {
        const counter = { val: 0 }
        gsap.to(counter, {
          val: stat.raw,
          duration: 2,
          ease: 'power2.out',
          delay: index * 0.1 + 0.2,
          onUpdate: () => setDisplayed(Math.round(counter.val) + stat.suffix),
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [stat, index])

  return (
    <div ref={ref}>
      <div
        style={{
          fontFamily: 'var(--font-big-shoulders, sans-serif)',
          fontSize: 'clamp(48px, 6vw, 80px)',
          fontWeight: 400,
          lineHeight: 1,
          textTransform: 'uppercase',
          color: '#fff',
          marginBottom: '12px',
        }}
      >
        {displayed}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-space-mono, monospace)',
          fontSize: '9px',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: '#555',
        }}
      >
        {stat.label}
      </div>
    </div>
  )
}

export default function AboutStats() {
  return (
    <section
      style={{
        background: '#000',
        padding: 'clamp(64px, 8vw, 100px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid #111',
        borderBottom: '1px solid #111',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '64px',
        }}
      >
        {STATS.map((s, i) => (
          <StatItem key={i} stat={s} index={i} />
        ))}
      </div>
    </section>
  )
}
