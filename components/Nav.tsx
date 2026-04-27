'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useBooking } from '@/lib/booking-context'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const { open } = useBooking()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  // Menu open/close with GSAP
  useEffect(() => {
    const drawer = drawerRef.current
    const links = linksRef.current
    if (!drawer) return

    if (menuOpen) {
      gsap.set(drawer, { display: 'flex' })
      gsap.fromTo(drawer, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      if (links) {
        gsap.fromTo(
          links.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
        )
      }
      document.body.style.overflow = 'hidden'
    } else {
      gsap.to(drawer, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => gsap.set(drawer, { display: 'none' }),
      })
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNav = () => setMenuOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          height: '72px',
          borderBottom: '1px solid #111',
        }}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '12px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'none',
            border: 'none',
            minWidth: '60px',
            textAlign: 'left',
            padding: '8px 0',
            transition: 'opacity 200ms ease',
          }}
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>

        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: '26px',
            fontWeight: 400,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: '#fff',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          MM CAR CARE
        </Link>

        <button
          onClick={open}
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '12px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'transparent',
            border: '1px solid #fff',
            borderRadius: '9999px',
            padding: '8px 20px',
            transition: 'background 250ms ease, color 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = '#000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#fff'
          }}
        >
          BOOK
        </button>
      </nav>

      {/* Full-screen menu drawer */}
      <div
        ref={drawerRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          zIndex: 199,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 64px',
          borderTop: '1px solid #111',
        }}
      >
        <div ref={linksRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={handleNav}
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(48px, 8vw, 80px)',
                fontWeight: 400,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                opacity: pathname === href ? 1 : 0.3,
                transition: 'opacity 200ms ease',
                display: 'block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = pathname === href ? '1' : '0.3')}
            >
              {label.toUpperCase()}
            </Link>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '36px',
            borderTop: '1px solid #111',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#555',
            }}
          >
            Kakinada · Andhra Pradesh
          </span>
          <span
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#555',
            }}
          >
            9AM – 9PM · Mon – Sat
          </span>
        </div>
      </div>
    </>
  )
}
