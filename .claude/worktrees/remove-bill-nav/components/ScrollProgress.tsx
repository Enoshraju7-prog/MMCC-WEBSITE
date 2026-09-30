'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    gsap.set(bar, { scaleX: 0, transformOrigin: 'left' })

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(255,255,255,0.05)',
        zIndex: 9997,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: '#000',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  )
}
