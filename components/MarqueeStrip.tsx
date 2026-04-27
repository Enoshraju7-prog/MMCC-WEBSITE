'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const TEXT = 'TRAINED HANDS · PROFESSIONAL GRADE · MOBILE SERVICE · KAKINADA · MM CAR CARE · '

export default function MarqueeStrip({ inverted = false }: { inverted?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    animRef.current = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 28,
      repeat: -1,
    })

    const container = track.parentElement
    const pause = () => animRef.current?.pause()
    const play = () => animRef.current?.play()

    container?.addEventListener('mouseenter', pause)
    container?.addEventListener('mouseleave', play)

    return () => {
      animRef.current?.kill()
      container?.removeEventListener('mouseenter', pause)
      container?.removeEventListener('mouseleave', play)
    }
  }, [])

  const repeated = Array(8).fill(TEXT).join('')

  return (
    <div
      style={{
        background: inverted ? '#fff' : '#000',
        borderTop: `1px solid ${inverted ? 'rgba(0,0,0,0.1)' : '#111'}`,
        borderBottom: `1px solid ${inverted ? 'rgba(0,0,0,0.1)' : '#111'}`,
        padding: '16px 0',
        overflow: 'hidden',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}
      >
        {/* Two copies for seamless loop */}
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
              color: inverted ? '#000' : '#333',
              paddingRight: '0',
            }}
          >
            {repeated}
          </span>
        ))}
      </div>
    </div>
  )
}
