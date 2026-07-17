'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useBooking } from '@/lib/booking-context'
import { useCallback } from '@/lib/callback-context'

const SECTIONS = ['home', 'services', 'about', 'contact']
const MAPS_URL = 'https://maps.app.goo.gl/SRBWNggKuSY9ge8k7'

export default function Nav() {
  const pathname = usePathname()
  const { open } = useBooking()
  const { open: openCallback } = useCallback()
  const navRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const [utilOpen, setUtilOpen] = useState(false)
  const callRef = useRef<HTMLDivElement>(null)
  const utilRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/'

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (callRef.current && !callRef.current.contains(e.target as Node)) {
        setCallOpen(false)
      }
      if (utilRef.current && !utilRef.current.contains(e.target as Node)) {
        setUtilOpen(false)
      }
    }
    if (callOpen || utilOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [callOpen, utilOpen])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

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
    setMenuOpen(false)
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function isActive(section: string) {
    if (isHome) return activeSection === section
    return pathname.startsWith(`/${section}`) && section !== 'home'
  }

  const navLinks = [
    { label: 'Home', href: '/', section: 'home' },
    { label: 'Services', href: '/#services', section: 'services' },
    { label: 'About', href: '/#about', section: 'about' },
    { label: 'Contact', href: '/#contact', section: 'contact' },
  ]

  const allLinks = [
    ...navLinks,
    { label: 'Reviews', href: '/reviews', section: 'reviews' },
    { label: 'Blog', href: '/blog', section: 'blog' },
    { label: 'AI Schedule', href: '/ai-call', section: 'ai-call' },
  ]

  const desktopLinkStyle = {
    fontFamily: 'var(--font-space-mono, monospace)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1.2px',
    textTransform: 'uppercase' as const,
    color: '#fff',
    textDecoration: 'none',
    transition: 'color 200ms ease',
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
  }

  return (
    <>
      <style>{`
        @keyframes nav-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.6); }
        }
        @media (max-width: 768px) {
          .nav-ai-btn { display: none !important; }
        }
      `}</style>
      <nav
        ref={navRef}
        className="main-nav"
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
          href="/"
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

        {/* Desktop centre: nav links + blog */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 48px)' }}>
          {navLinks.map(({ label, href, section }) => (
            <Link
              key={section}
              href={href}
              onClick={(e) => handleNavClick(e, section)}
              style={{ ...desktopLinkStyle, color: isActive(section) ? '#C9A96E' : '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive(section) ? '#C9A96E' : '#fff')}
            >
              {label}
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

          <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.12)', display: 'inline-block', flexShrink: 0 }} />

          <Link
            href="/reviews"
            style={{ ...desktopLinkStyle, color: pathname.startsWith('/reviews') ? '#C9A96E' : '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = pathname.startsWith('/reviews') ? '#C9A96E' : '#fff')}
          >
            Reviews
            {pathname.startsWith('/reviews') && (
              <span style={{
                position: 'absolute', bottom: '-4px', left: '50%',
                transform: 'translateX(-50%)', width: '3px', height: '3px',
                borderRadius: '50%', background: '#C9A96E', display: 'block',
              }} />
            )}
          </Link>

          <Link
            href="/blog"
            style={{ ...desktopLinkStyle, color: pathname.startsWith('/blog') ? '#C9A96E' : '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = pathname.startsWith('/blog') ? '#C9A96E' : '#fff')}
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

        {/* Right: location + book + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Call button with dropdown */}
          <div ref={callRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setCallOpen(v => !v)}
              title="Call us"
              style={{
                background: callOpen ? '#C9A96E' : 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={(e) => { if (!callOpen) { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E' } }}
              onMouseLeave={(e) => { if (!callOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: callOpen ? '#0a0a0a' : '#fff' }}>
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            </button>

            {callOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                background: '#0d0d0d',
                border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '200px',
                zIndex: 300,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}>
                {/* AI Schedule option */}
                <button
                  onClick={() => { setCallOpen(false); openCallback() }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: 'rgba(201,169,110,0.07)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    cursor: 'pointer',
                    marginBottom: '6px',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.14)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#C9A96E',
                    flexShrink: 0,
                    animation: 'nav-pulse 1.8s ease-in-out infinite',
                  }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '8px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#C9A96E',
                      marginBottom: '1px',
                    }}>
                      AI Schedule
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.8)',
                    }}>
                      We call you in seconds
                    </div>
                  </div>
                </button>

                <div style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '8px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  padding: '6px 10px 8px',
                }}>
                  Call Us Directly
                </div>
                {[
                  { label: 'Primary', number: '9848377309' },
                  { label: 'Secondary', number: '6304104489' },
                ].map(({ label, number }) => (
                  <a
                    key={number}
                    href={`tel:+91${number}`}
                    onClick={() => setCallOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '8px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#C9A96E',
                      marginBottom: '2px',
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff',
                      letterSpacing: '0.5px',
                    }}>
                      {number}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            className="nav-location"
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fff', transition: 'color 200ms ease' }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>

          {/* AI Schedule — desktop only */}
          <Link
            href="/ai-call"
            className="nav-ai-btn"
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              background: 'transparent',
              border: '1px solid rgba(201,169,110,0.45)',
              borderRadius: '9999px',
              padding: '8px 18px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'background 250ms ease, border-color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; e.currentTarget.style.borderColor = '#C9A96E' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.45)' }}
          >
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#C9A96E', display: 'inline-block', flexShrink: 0,
              animation: 'nav-pulse 1.8s ease-in-out infinite',
            }} />
            AI Schedule
          </Link>

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

          {/* Utility menu — Bill, Location, AI, Reviews */}
          <div ref={utilRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setUtilOpen(v => !v); setCallOpen(false) }}
              title="More"
              aria-label="More options"
              style={{
                background: utilOpen ? '#C9A96E' : 'none',
                border: `1px solid ${utilOpen ? '#C9A96E' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 200ms ease, border-color 200ms ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (!utilOpen) { e.currentTarget.style.background = 'rgba(201,169,110,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)' } }}
              onMouseLeave={(e) => { if (!utilOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
            >
              {/* 2×2 grid dots icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill={utilOpen ? '#0a0a0a' : '#fff'} />
                <rect x="8.5" y="1" width="4.5" height="4.5" rx="1" fill={utilOpen ? '#0a0a0a' : '#fff'} />
                <rect x="1" y="8.5" width="4.5" height="4.5" rx="1" fill={utilOpen ? '#0a0a0a' : 'rgba(255,255,255,0.5)'} />
                <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" fill={utilOpen ? '#0a0a0a' : 'rgba(255,255,255,0.5)'} />
              </svg>
            </button>

            {utilOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                background: '#0d0d0d',
                border: '1px solid rgba(201,169,110,0.22)',
                borderRadius: '10px',
                padding: '6px',
                minWidth: '210px',
                zIndex: 300,
                boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              }}>
                {/* Bill Generator */}
                <Link
                  href="/bill"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    background: 'rgba(201,169,110,0.06)',
                    border: '1px solid rgba(201,169,110,0.14)',
                    marginBottom: '4px',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.13)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.06)')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(201,169,110,0.12)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '2px' }}>
                      Staff Only
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                      Bill Generator
                    </div>
                  </div>
                </Link>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2px 0 4px' }} />

                {/* Location */}
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      Kakinada
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      Find Us on Maps
                    </div>
                  </div>
                </a>

                {/* AI Schedule */}
                <button
                  onClick={() => { setUtilOpen(false); openCallback() }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '7px',
                    background: 'transparent', border: 'none', width: '100%',
                    cursor: 'pointer', transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#C9A96E', display: 'block',
                      animation: 'nav-pulse 1.8s ease-in-out infinite',
                    }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      AI · Instant call
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      AI Schedule
                    </div>
                  </div>
                </button>

                {/* Reviews */}
                <Link
                  href="/reviews"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      71 verified
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      Google Reviews
                    </div>
                  </div>
                </Link>

                {/* Leave a Review */}
                <a
                  href="https://search.google.com/local/writereview?placeid=ChIJWwlCBNkpODoROIMxVQQbd2w"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      Google Maps
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      Leave a Review
                    </div>
                  </div>
                </a>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                {/* Call Us section label */}
                <div style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '8px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                  padding: '6px 12px 4px',
                }}>
                  Call Us
                </div>

                {/* Primary number */}
                <a
                  href="tel:+919848377309"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '9px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(201,169,110,0.08)',
                    border: '1px solid rgba(201,169,110,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A96E">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '2px' }}>
                      Primary
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '0.3px' }}>
                      98483 77309
                    </div>
                  </div>
                </a>

                {/* Secondary number */}
                <a
                  href="tel:+916304104489"
                  onClick={() => setUtilOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '9px 12px', borderRadius: '7px',
                    textDecoration: 'none',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      Secondary
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>
                      63041 04489
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Hamburger — shown on mobile via CSS */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              width: '38px',
              height: '38px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: 0,
            }}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <>
                <span style={{ width: '16px', height: '1.5px', background: '#fff', display: 'block' }} />
                <span style={{ width: '16px', height: '1.5px', background: '#fff', display: 'block' }} />
                <span style={{ width: '10px', height: '1.5px', background: '#fff', display: 'block' }} />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 199,
            background: '#0a0a0a',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 28px 40px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {allLinks.map(({ label, href, section }) => (
            <Link
              key={section}
              href={href}
              onClick={section !== 'blog' && section !== 'reviews' && section !== 'ai-call'
                ? (e) => handleNavClick(e as React.MouseEvent, section)
                : () => setMenuOpen(false)
              }
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(40px, 12vw, 56px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                lineHeight: 1,
                color: section === 'blog' || section === 'ai-call'
                  ? '#C9A96E'
                  : (isActive(section) ? '#C9A96E' : '#fff'),
                textDecoration: 'none',
                padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'block',
              }}
            >
              {label}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/ai-call"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: '#C9A96E',
                background: 'none',
                border: '1px solid rgba(201,169,110,0.4)',
                borderRadius: '9999px',
                padding: '10px 20px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#C9A96E', display: 'inline-block',
                animation: 'nav-pulse 1.8s ease-in-out infinite',
              }} />
              AI Schedule
            </Link>
            <button
              onClick={() => { open(); setMenuOpen(false) }}
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                background: '#C9A96E',
                border: '1px solid #C9A96E',
                borderRadius: '9999px',
                padding: '10px 24px',
              }}
            >
              Book a Service
            </button>
          </div>
        </div>
      )}
    </>
  )
}
