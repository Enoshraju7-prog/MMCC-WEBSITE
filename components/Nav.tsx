'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useBooking } from '@/lib/booking-context'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const MAPS_URL = 'https://maps.app.goo.gl/SRBWNggKuSY9ge8k7'

export default function Nav() {
  const pathname = usePathname()
  const { open } = useBooking()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 56px)',
        height: '110px',
        borderBottom: '1px solid #ebebeb',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
        <Image
          src="/uploads/logo.png"
          alt="MM Car Care"
          width={400}
          height={110}
          style={{ objectFit: 'contain', height: '95px', width: 'auto' }}
          priority
        />
      </Link>

      {/* Centre nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 48px)' }}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#000',
              textDecoration: 'none',
              opacity: pathname === href ? 1 : 0.4,
              transition: 'opacity 200ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = pathname === href ? '1' : '0.4')}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right — location pin + book */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Location pin */}
        <button
          onClick={() => window.open(MAPS_URL, '_blank')}
          title="Find us on Google Maps"
          style={{
            background: 'none',
            border: '1px solid #ebebeb',
            borderRadius: '9999px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 200ms ease, background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#000'
            e.currentTarget.style.borderColor = '#000'
            const svg = e.currentTarget.querySelector('svg')
            if (svg) svg.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.borderColor = '#ebebeb'
            const svg = e.currentTarget.querySelector('svg')
            if (svg) svg.style.color = '#000'
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: '#000', transition: 'color 200ms ease' }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>

        {/* Book */}
        <button
          onClick={open}
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#000',
            background: 'transparent',
            border: '1px solid #000',
            borderRadius: '9999px',
            padding: '8px 20px',
            whiteSpace: 'nowrap',
            transition: 'background 250ms ease, color 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#000'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#000'
          }}
        >
          BOOK
        </button>
      </div>
    </nav>
  )
}
