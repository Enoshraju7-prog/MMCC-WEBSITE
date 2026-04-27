'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const SERVICES = [
  { id: 'exterior', label: 'Exterior Wash' },
  { id: 'interior', label: 'Interior Clean' },
  { id: 'combo', label: 'Full Wash Combo' },
  { id: 'polish', label: 'Paint Polish' },
  { id: 'ceramic', label: 'Ceramic Coating' },
  { id: 'oil', label: 'Oil Change' },
  { id: 'battery', label: 'Battery Check' },
  { id: 'detailing', label: 'Full Detailing' },
  { id: 'headlight', label: 'Headlight Restore' },
  { id: 'other', label: 'Other / Not Sure' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#000',
  color: '#fff',
  border: '1px solid #222',
  borderRadius: '6px',
  padding: '14px 16px',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
  fontSize: '15px',
  outline: 'none',
  marginBottom: '10px',
  display: 'block',
  transition: 'border-color 250ms ease',
}

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', message: '' })
  const [timeSlot, setTimeSlot] = useState<string | null>(null)

  useLayoutEffect(() => {
    const backdrop = backdropRef.current
    const modal = modalRef.current
    if (!backdrop || !modal) return

    const tl = gsap.timeline()
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    tl.fromTo(modal, { scale: 0.93, opacity: 0, y: 24 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.15')
  }, [])

  const handleClose = () => {
    const backdrop = backdropRef.current
    const modal = modalRef.current
    if (!modal) { onClose(); return }

    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(modal, { scale: 0.93, opacity: 0, y: 16, duration: 0.25, ease: 'power2.in' })
    tl.to(backdrop, { opacity: 0, duration: 0.2 }, '-=0.1')
  }

  // Animate step change
  const contentRef = useRef<HTMLDivElement>(null)
  const goToStep = (n: number) => {
    if (!contentRef.current) { setStep(n); return }
    gsap.to(contentRef.current, {
      opacity: 0,
      x: n > step ? -20 : 20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setStep(n)
        gsap.fromTo(contentRef.current!, { opacity: 0, x: n > step ? 20 : -20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })
      },
    })
  }

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '580px',
          border: '1px solid #1a1a1a',
          borderRadius: '6px',
          background: '#000',
          padding: 'clamp(32px, 5vw, 56px)',
          position: 'relative',
          margin: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: '#555',
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
        >
          CLOSE ×
        </button>

        {/* Step indicator */}
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
          STEP {step} OF 3
        </div>

        {/* Step progress bar */}
        <div style={{ height: '1px', background: '#111', marginBottom: '28px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: '#fff',
              width: `${(step / 3) * 100}%`,
              transition: 'width 400ms ease',
            }}
          />
        </div>

        <div ref={contentRef}>
          {/* Step 1 — Select Service */}
          {step === 1 && (
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(36px, 6vw, 52px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '28px',
                }}
              >
                Select Service
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    style={{
                      background: 'transparent',
                      border: selected === s.id ? '1px solid #fff' : '1px solid #222',
                      borderRadius: '6px',
                      padding: '16px',
                      textAlign: 'left',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-big-shoulders, sans-serif)',
                        fontSize: '17px',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        color: '#fff',
                      }}
                    >
                      {s.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => selected && goToStep(2)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: selected ? '#fff' : '#444',
                  border: `1px solid ${selected ? '#fff' : '#222'}`,
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '12px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  transition: 'all 250ms ease',
                }}
                onMouseEnter={(e) => { if (selected) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = selected ? '#fff' : '#444' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — Your Details */}
          {step === 2 && (
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(36px, 6vw, 52px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '28px',
                }}
              >
                Your Details
              </h2>
              {(['name', 'phone', 'vehicle'] as const).map((field) => (
                <input
                  key={field}
                  style={inputStyle}
                  placeholder={
                    field === 'name' ? 'Your name' : field === 'phone' ? 'Phone number (WhatsApp preferred)' : 'Vehicle make & model'
                  }
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = '#fff')}
                  onBlur={(e) => (e.target.style.borderColor = '#222')}
                />
              ))}

              {/* Time slot */}
              <div
                style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: '8px',
                }}
              >
                Preferred Time
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                {[
                  { id: 'morning', label: 'Morning', sub: '9am – 12pm' },
                  { id: 'afternoon', label: 'Afternoon', sub: '2pm – 5pm' },
                  { id: 'evening', label: 'Evening', sub: '5pm – 8pm' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeSlot(t.id)}
                    style={{
                      background: 'transparent',
                      border: timeSlot === t.id ? '1px solid #fff' : '1px solid #222',
                      borderRadius: '6px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-big-shoulders, sans-serif)', fontSize: '14px', textTransform: 'uppercase', color: '#fff' }}>{t.label}</div>
                    <div style={{ fontFamily: 'var(--font-space-mono, monospace)', fontSize: '8px', color: '#555', marginTop: '2px' }}>{t.sub}</div>
                  </button>
                ))}
              </div>

              {/* Message */}
              <textarea
                style={{ ...inputStyle, resize: 'none', height: '80px' }}
                placeholder="Anything you'd like us to know? (optional)"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = '#fff')}
                onBlur={(e) => (e.target.style.borderColor = '#222')}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => goToStep(1)}
                  style={{
                    background: 'transparent',
                    color: '#555',
                    border: '1px solid #222',
                    borderRadius: '9999px',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    const serviceName = SERVICES.find((s) => s.id === selected)?.label ?? selected ?? ''
                    const timeLabel = timeSlot === 'morning' ? 'Morning (9am–12pm)' : timeSlot === 'afternoon' ? 'Afternoon (2pm–5pm)' : timeSlot === 'evening' ? 'Evening (5pm–8pm)' : 'Not specified'
                    const msg = encodeURIComponent(
                      `Hi MM Car Care! I want to book a service.\nName: ${form.name}\nPhone: ${form.phone}\nVehicle: ${form.vehicle}\nService: ${serviceName}\nTime: ${timeLabel}${form.message ? `\nNote: ${form.message}` : ''}`
                    )
                    window.open(`https://wa.me/919848377309?text=${msg}`, '_blank')
                    goToStep(3)
                  }}
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid #fff',
                    borderRadius: '9999px',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '1.4px',
                    textTransform: 'uppercase',
                    transition: 'background 250ms ease, color 250ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirmation + Google Form */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              {/* WhatsApp icon */}
              <div style={{ marginBottom: '24px' }}>
                <svg viewBox="0 0 32 32" width="52" height="52" style={{ display: 'inline-block' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#25D366" />
                  <path d="M22.6 9.4A9.17 9.17 0 0 0 16 6.8C11.5 6.8 7.8 10.5 7.8 15c0 1.5.4 2.9 1.1 4.1L7.8 25.2l6.3-1.7c1.2.6 2.5 1 3.9 1 4.5 0 8.2-3.7 8.2-8.2 0-2.2-.9-4.3-2.6-5.9zm-6.6 12.6c-1.3 0-2.5-.4-3.6-1l-.3-.2-2.9.8.8-2.8-.2-.3c-.7-1.1-1-2.3-1-3.6 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.7 1.9 1.3 1.3 2 3 2 4.8.1 3.7-3 6.8-6.7 6.1zm3.7-5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.5l.3-.4c.1-.2.1-.3.2-.5 0-.2 0-.3-.1-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z" fill="#fff"/>
                </svg>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-big-shoulders, sans-serif)',
                  fontSize: 'clamp(40px, 7vw, 72px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '16px',
                }}
              >
                WhatsApp Sent.
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#555',
                  maxWidth: '360px',
                  margin: '0 auto 32px',
                }}
              >
                Your message is on its way. Now complete your booking by filling in the short form below.
              </p>

              {/* Google Form button — separate click, no popup blocker */}
              <button
                onClick={() => window.open('https://forms.gle/YYXPoCavW6TMMpReA', '_blank')}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #fff',
                  borderRadius: '9999px',
                  padding: '16px 24px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '12px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  transition: 'background 250ms ease, color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e0e0e0' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
              >
                Fill Booking Form →
              </button>

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#444',
                  border: '1px solid #222',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
              >
                Back to Site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
