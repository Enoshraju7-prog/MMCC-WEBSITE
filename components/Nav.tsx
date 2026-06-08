'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useBooking } from '@/lib/booking-context'

const SECTIONS = ['home', 'services', 'about', 'contact']

const MAPS_URL = 'https://maps.app.goo.gl/SRBWNggKuSY9ge8k7'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { open } = useBooking()
  const navRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState('home')
  const isHome = pathname === '/'

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  // Scroll-spy: track which section is in view on the home page
  useEffect(() => {
    if (!isHome) return

    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [isHome])

  function handleNavClick(e: React.MouseEvent, section: string) {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    // If not on home, let the Link navigate normally (href="/#section")
  }

  function isActive(section: string) {
    if (isHome) return activeSection === section
    return pathname.startsWith(`/${section}`) && section !== 'home'
  }

  const navLinks = [
    { label: 'Home', href: '/#home', section: 'home' },
    { label: 'Services', href: '/#services', section: 'services' },
    { label: 'About', href: '/#about', section: 'about' },
    { label: 'Contact', href: '/#contact', section: 'contact' },
  ]

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 56px)',
        height: '110px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Logo */}
      <Link
        href="/#home"
        onClick={(e) => handleNavClick(e, 'home')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A96E, #e8c98a, #C9A96E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.5px' }}>MM</span>
        </div>
        <span style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '17px', fontWeight: 600, letterSpacing: '0.02em' }}>
          <span style={{ color: '#C9A96E' }}>MM</span>
          <span style={{ color: 'rgba(255,255,255,0.9)' }}>CarCare</span>
        </span>
      </Link>

      {/* Centre: main nav links + blog separated */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 48px)' }}>
        {navLinks.map(({ label, href, section }) => (
          <Link
            key={section}
            href={href}
            onClick={(e) => handleNavClick(e, section)}
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#fff',
              textDecoration: 'none',
              opacity: isActive(section) ? 1 : 0.4,
              transition: 'opacity 200ms ease',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive(section) ? '1' : '0.4')}
          >
            {label}
            {/* Active underline dot */}
            {isActive(section) && (
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: '#C9A96E',
                display: 'block',
              }} />
            )}
          </Link>
        ))}

        {/* Separator */}
        <span style={{
          width: '1px',
          height: '16px',
          background: 'rgba(255,255,255,0.12)',
          display: 'inline-block',
          flexShrink: 0,
        }} />

        {/* Blog — separate */}
        <Link
          href="/blog"
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#fff',
            textDecoration: 'none',
            opacity: pathname.startsWith('/blog') ? 1 : 0.4,
            transition: 'opacity 200ms ease',
            whiteSpace: 'nowrap',
            position: 'relative',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = pathname.startsWith('/blog') ? '1' : '0.4')}
        >
          Blog
          {pathname.startsWith('/blog') && (
            <span style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: '#C9A96E',
              display: 'block',
            }} />
          )}
        </Link>
      </div>

      {/* Right — location pin + book */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={() => window.open(MAPS_URL, '_blank')}
          title="Find us on Google Maps"
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '9999px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 200ms ease, background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#C9A96E'
            e.currentTarget.style.borderColor = '#C9A96E'
            const svg = e.currentTarget.querySelector('svg')
            if (svg) svg.style.color = '#0a0a0a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            const svg = e.currentTarget.querySelector('svg')
            if (svg) svg.style.color = '#fff'
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: '#fff', transition: 'color 200ms ease' }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>

        <button
          onClick={open}
          style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '9999px',
            padding: '8px 20px',
            whiteSpace: 'nowrap',
            transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#C9A96E'
            e.currentTarget.style.color = '#0a0a0a'
            e.currentTarget.style.borderColor = '#C9A96E'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          }}
        >
          BOOK
        </button>
      </div>
    </nav>
  )
}
