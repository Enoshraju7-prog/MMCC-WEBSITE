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
  background: '#111',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '14px 16px',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
  fontSize: '14px',
  outline: 'none',
  display: 'block',
  transition: 'border-color 250ms ease',
  marginBottom: '8px',
}

const placeholderStyle = `
  .contact-inp::placeholder { color: rgba(255,255,255,0.7); }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`

export default function ContactGrid() {
  const [form, setForm] = useState({ name: '', phone: '', language: 'en', vehicle: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
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
      <style>{placeholderStyle}</style>
      {/* Header */}
      <section
        ref={headerRef}
        style={{
          background: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              color: 'rgba(255,255,255,0.6)',
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
      <section style={{ background: '#0a0a0a', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 80px)' }}>
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
            <div className="contact-info-block" style={{ marginBottom: '56px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#fff',
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
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '9px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#C9A96E',
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
                      color: '#fff',
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
                  background: '#C9A96E',
                  color: '#0a0a0a',
                  border: '1px solid #C9A96E',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 250ms ease, color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
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
                  color: '#fff',
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
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: isToday ? '#C9A96E' : '#fff',
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
                            background: '#C9A96E',
                            color: '#0a0a0a',
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
                        color: h.open ? (isToday ? '#C9A96E' : '#fff') : 'rgba(255,255,255,0.35)',
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
                  color: '#fff',
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
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#111',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                  }}
                />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', left: '38%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />
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
                      background: '#C9A96E',
                      boxShadow: '0 0 12px rgba(201,169,110,0.5)',
                    }}
                  />
                  <div style={{ width: '1px', height: '14px', background: 'rgba(201,169,110,0.5)' }} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '38%',
                    transform: 'translate(8px, -80%)',
                    background: '#C9A96E',
                    color: '#0a0a0a',
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
                    color: '#fff',
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
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
                >
                  Open Maps →
                </a>
              </div>
            </div>

            {/* AI Callback form */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '4px',
                }}
              >
                Request a Callback
              </div>
              <p style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', lineHeight: 1.5 }}>
                Our AI agent calls you within seconds.
              </p>

              {sent ? (
                <div style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: '48px',
                      fontWeight: 400,
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      color: '#C9A96E',
                      marginBottom: '16px',
                    }}
                  >
                    Calling You Now.
                  </div>
                  <p style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>
                    {form.language === 'te'
                      ? 'కొన్ని సెకన్లలో మీకు call వస్తుంది.'
                      : 'You will receive a call within seconds.'}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(201,169,110,0.08)',
                    border: '1px solid rgba(201,169,110,0.25)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A96E', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                    <p style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '11px', letterSpacing: '0.5px', color: '#C9A96E', margin: 0 }}>
                      {form.language === 'te'
                        ? '+1 (541) 981 6853 నుండి call వస్తుంది — దయచేసి తీసుకోండి, అది మేమే!'
                        : 'Call coming from +1 (541) 981 6853 — please pick up, it\'s us!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Language toggle */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                      Preferred Language
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {[{ code: 'en', label: 'English' }, { code: 'te', label: 'తెలుగు' }].map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, language: lang.code }))}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            background: form.language === lang.code ? '#C9A96E' : 'transparent',
                            color: form.language === lang.code ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                            border: `1px solid ${form.language === lang.code ? '#C9A96E' : 'rgba(255,255,255,0.15)'}`,
                            borderRadius: '6px',
                            fontFamily: 'var(--font-space-mono, monospace)',
                            fontSize: '11px',
                            letterSpacing: '0.8px',
                            cursor: 'pointer',
                            transition: 'all 200ms ease',
                          }}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    className="contact-inp"
                    style={inp}
                    placeholder={form.language === 'te' ? 'మీ పేరు' : 'Your name'}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <input
                    className="contact-inp"
                    style={inp}
                    placeholder={form.language === 'te' ? 'ఫోన్ నంబర్' : 'Phone number'}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <input
                    className="contact-inp"
                    style={inp}
                    placeholder={form.language === 'te' ? 'వాహనం (ఐచ్ఛికం)' : 'Vehicle (optional)'}
                    value={form.vehicle}
                    onChange={(e) => setForm((f) => ({ ...f, vehicle: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <textarea
                    className="contact-inp"
                    style={{ ...inp, minHeight: '80px', resize: 'vertical', marginBottom: '16px' }}
                    placeholder={form.language === 'te' ? 'సమస్య వివరించండి (ఐచ్ఛికం)' : 'Describe your issue (optional)'}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <button
                    disabled={loading || !form.name || !form.phone}
                    onClick={async () => {
                      if (!form.name || !form.phone || loading) return
                      setLoading(true)
                      try {
                        await fetch('/api/callback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(form),
                        })
                      } catch {
                        // fail silently — customer still sees success
                      } finally {
                        setLoading(false)
                        setSent(true)
                      }
                    }}
                    style={{
                      width: '100%',
                      background: form.name && form.phone && !loading ? '#C9A96E' : 'transparent',
                      color: form.name && form.phone && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${form.name && form.phone && !loading ? '#C9A96E' : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '9999px',
                      padding: '14px 24px',
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '12px',
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      transition: 'all 250ms ease',
                      cursor: form.name && form.phone && !loading ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => {
                      if (form.name && form.phone && !loading) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#C9A96E'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (form.name && form.phone && !loading) {
                        e.currentTarget.style.background = '#C9A96E'
                        e.currentTarget.style.color = '#0a0a0a'
                      }
                    }}
                  >
                    {loading
                      ? (form.language === 'te' ? 'కాల్ చేస్తున్నాము...' : 'Calling...')
                      : (form.language === 'te' ? 'కాల్ కోసం అభ్యర్థించండి' : 'Call Me Now')}
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
