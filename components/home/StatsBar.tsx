'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { raw: 1000, display: '1000+', label: 'Loyal Customers', suffix: '+' },
  { raw: 25, display: '25', label: 'Years Experience', suffix: '' },
  { raw: null, display: 'Full', label: 'Range of Services', suffix: '' },
  { raw: 6, display: '6', label: 'Days a Week', suffix: '' },
]

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState(stat.display)

  useEffect(() => {
    const el = ref.current
    const numEl = numRef.current
    if (!el || !numEl) return

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
    <div
      ref={ref}
      style={{
        padding: 'clamp(28px, 3vw, 44px) clamp(16px, 2vw, 32px)',
        textAlign: 'center',
        borderRight: index < STATS.length - 1 ? '1px solid #ebebeb' : 'none',
      }}
    >
      <div
        ref={numRef}
        style={{
          fontFamily: 'var(--font-big-shoulders, sans-serif)',
          fontSize: 'clamp(36px, 4vw, 56px)',
          fontWeight: 400,
          lineHeight: 1,
          textTransform: 'uppercase',
          color: '#000',
          marginBottom: '8px',
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

export default function StatsBar() {
  return (
    <div
      style={{
        background: '#fff',
        borderTop: '1px solid #ebebeb',
        borderBottom: '1px solid #ebebeb',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
    >
      {STATS.map((s, i) => (
        <StatItem key={i} stat={s} index={i} />
      ))}
    </div>
  )
}
