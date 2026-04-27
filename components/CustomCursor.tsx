'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Position offscreen initially
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 })

    const moveXDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const moveYDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const moveXRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveYRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMouseMove = (e: MouseEvent) => {
      moveXDot(e.clientX)
      moveYDot(e.clientY)
      moveXRing(e.clientX)
      moveYRing(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        gsap.to(ring, { scale: 2.2, duration: 0.3, ease: 'power2.out', opacity: 0.6 })
        gsap.to(dot, { scale: 0.4, duration: 0.2 })
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element
      const related = e.relatedTarget as Element | null
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label') &&
        !related?.closest('a, button, [role="button"], input, textarea, select, label')
      ) {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out', opacity: 1 })
        gsap.to(dot, { scale: 1, duration: 0.2 })
      }
    }

    const onMouseDown = () => gsap.to(ring, { scale: 0.8, duration: 0.1 })
    const onMouseUp = () => gsap.to(ring, { scale: 1, duration: 0.15 })

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#000',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.7)',
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
    </>
  )
}
