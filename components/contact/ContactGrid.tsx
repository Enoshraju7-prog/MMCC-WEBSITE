'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HOURS = [
  { day: 'Monday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Tuesday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Wednesday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Thursday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Friday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Saturday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Sunday', time: 'Closed', open: false },
]

const inp: React.CSSProperties = {
  width: '100%',
  background: '#000',
  color: '#fff',
  border: '1px solid #1a1a1a',
  borderRadius: '6px',
  padding: '14px 16px',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
  fontSize: '14px',
  outline: 'none',
  display: 'block',
  transition: 'border-color 250ms ease',
  marginBottom: '8px',
}

export default function ContactGrid() {
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', message: '' })
  const [sent, setSent] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  const today = new Date().getDay()

  useEffect(() => {
    const header = headerRef.current
    if (header) {
      const ctx = gsap.context(() => {
        gsap.from('.contact-label', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 })
        gsap.from('.contact-heading-line', {
          y: '105%',
          duration: 0.95,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.35,
        })
      }, header)
      return () => ctx.revert()
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-left', {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })
      gsap.from('.contact-right', {
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        delay: 0.1,
      })
      gsap.from('.contact-info-row', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-info-block', start: 'top 80%', once: true },
        delay: 0.3,
      })
      gsap.from('.hours-row', {
        y: 12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.hours-block', start: 'top 80%', once: true },
        delay: 0.2,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <>
      {/* Header */}
      <section
        ref={headerRef}
        style={{
          background: '#000',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid #111',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="contact-label"
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#555',
              marginBottom: '20px',
            }}
          >
            Find Us
          </div>
          {['Get in', 'Touch.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <h1
                className="contact-heading-line"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(52px, 10vw, 130px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#fff',
                }}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <section style={{ background: '#000', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}>
        <div
          ref={sectionRef}
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(48px, 6vw, 96px)',
          }}
        >
          {/* Left column */}
          <div className="contact-left">
            {/* Contact info */}
            <div className="contact-info-block" style={{ marginBottom: '56px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: '28px',
                }}
              >
                Contact Details
              </div>
              {[
                { label: 'Phone', value: '+91 98483 77309 / +91 63041 04489' },
                { label: 'WhatsApp', value: '+91 98483 77309 / +91 63041 04489' },
                { label: 'Location', value: 'Kakinada, Andhra Pradesh – 533 001' },
                { label: 'Mobile Svc', value: 'Available across Kakinada district' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="contact-info-row"
                  style={{
                    display: 'flex',
                    gap: '24px',
                    padding: '13px 0',
                    borderBottom: '1px solid #0d0d0d',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '9px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#333',
                      minWidth: '90px',
                      paddingTop: '2px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#888',
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
              <a
                href="https://wa.me/919848377309"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '28px',
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 250ms ease, color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
              >
                Book via WhatsApp
              </a>
            </div>

            {/* Hours */}
            <div className="hours-block">
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: '20px',
                }}
              >
                Working Hours
              </div>
              {HOURS.map((h, i) => {
                const isToday = i === dayIndex
                return (
                  <div
                    key={h.day}
                    className="hours-row"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '11px 0',
                      borderBottom: '1px solid #0d0d0d',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: isToday ? '#fff' : '#444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {h.day}
                      {isToday && (
                        <span
                          style={{
                            fontSize: '7px',
                            background: '#fff',
                            color: '#000',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: h.open ? (isToday ? '#fff' : '#444') : '#2a2a2a',
                      }}
                    >
                      {h.time}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="contact-right">
            {/* Map placeholder */}
            <div style={{ marginBottom: '48px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: '16px',
                }}
              >
                Location – Kakinada, AP
              </div>
              <div
                onClick={() => window.open('https://maps.app.goo.gl/SRBWNggKuSY9ge8k7', '_blank')}
                style={{
                  width: '100%',
                  height: '240px',
                  border: '1px solid #1a1a1a',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#060606',
                  cursor: 'pointer',
                }}
              >
                {/* Grid lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                  }}
                />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', left: '38%', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.07)' }} />
                {/* Pin */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '38%',
                    transform: 'translate(-50%, -100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 0 12px rgba(255,255,255,0.3)',
                    }}
                  />
                  <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '38%',
                    transform: 'translate(8px, -80%)',
                    background: '#fff',
                    color: '#000',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '8px',
                    letterSpacing: '0.5px',
                    padding: '4px 8px',
                    borderRadius: '3px',
                  }}
                >
                  MM Car Care
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '9px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#444',
                  }}
                >
                  Kakinada · Andhra Pradesh
                </div>
                <a
                  href="https://maps.app.goo.gl/SRBWNggKuSY9ge8k7"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '9px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#555',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
                >
                  Open Maps →
                </a>
              </div>
            </div>

            {/* Callback form */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: '20px',
                }}
              >
                Request a Callback
              </div>

              {sent ? (
                <div style={{ padding: '32px 0', borderTop: '1px solid #111' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: '48px',
                      fontWeight: 400,
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      color: '#fff',
                      marginBottom: '12px',
                    }}
                  >
                    Received.
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: '#555',
                    }}
                  >
                    We'll call you back within working hours.
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    style={inp}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#fff')}
                    onBlur={(e) => (e.target.style.borderColor = '#1a1a1a')}
                  />
                  <input
                    style={inp}
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#fff')}
                    onBlur={(e) => (e.target.style.borderColor = '#1a1a1a')}
                  />
                  <input
                    style={inp}
                    placeholder="Vehicle (optional)"
                    value={form.vehicle}
                    onChange={(e) => setForm((f) => ({ ...f, vehicle: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#fff')}
                    onBlur={(e) => (e.target.style.borderColor = '#1a1a1a')}
                  />
                  <textarea
                    style={{ ...inp, minHeight: '80px', resize: 'vertical', marginBottom: '16px' }}
                    placeholder="Any specific request? (optional)"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#fff')}
                    onBlur={(e) => (e.target.style.borderColor = '#1a1a1a')}
                  />
                  <button
                    onClick={() => {
                      if (!form.name || !form.phone) return
                      const msg = encodeURIComponent(
                        `Hi MM Car Care! I'd like to request a callback.\nName: ${form.name}\nPhone: ${form.phone}${form.vehicle ? `\nVehicle: ${form.vehicle}` : ''}${form.message ? `\nNote: ${form.message}` : ''}`
                      )
                      window.open(`https://wa.me/919848377309?text=${msg}`, '_blank')
                      setSent(true)
                    }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      color: form.name && form.phone ? '#fff' : '#444',
                      border: `1px solid ${form.name && form.phone ? '#fff' : '#222'}`,
                      borderRadius: '9999px',
                      padding: '14px 24px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '12px',
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      transition: 'all 250ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (form.name && form.phone) {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.color = '#000'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = form.name && form.phone ? '#fff' : '#444'
                    }}
                  >
                    Request Callback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
