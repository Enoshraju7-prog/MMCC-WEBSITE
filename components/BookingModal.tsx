'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

const SERVICES = [
  { id: 'exterior',   label: 'Exterior Wash' },
  { id: 'interior',   label: 'Interior Clean' },
  { id: 'combo',      label: 'Full Wash Combo' },
  { id: 'polish',     label: 'Paint Polish' },
  { id: 'ceramic',    label: 'Ceramic Coating' },
  { id: 'headlight',  label: 'Headlight Restoration' },
  { id: 'oil',        label: 'Oil Change' },
  { id: 'engine',     label: 'Engine Service' },
  { id: 'battery',    label: 'Battery Service' },
  { id: 'brakes',     label: 'Brake Service' },
  { id: 'suspension', label: 'Suspension & Steering' },
  { id: 'ac',         label: 'AC Service' },
  { id: 'alignment',  label: 'Wheel Alignment' },
  { id: 'balancing',  label: 'Tyre Balancing' },
  { id: 'rotation',   label: 'Tyre Rotation' },
  { id: 'fluids',     label: 'Fluid Service' },
  { id: 'rebore',     label: 'Engine Reboring' },
  { id: 'seat-mats',  label: 'Seat Covers & Mats' },
  { id: 'audio',      label: 'Audio & Infotainment' },
  { id: 'ecm',        label: 'ECM Diagnostics' },
  { id: 'parts',      label: 'Parts Sourcing' },
  { id: 'other',      label: 'Other / Not Sure' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  WebkitTextFillColor: '#fff',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '6px',
  padding: '14px 16px',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
  fontSize: '15px',
  outline: 'none',
  marginBottom: '10px',
  display: 'block',
  transition: 'border-color 250ms ease',
}

const miniLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-space-mono, monospace)',
  fontSize: '9px',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '8px',
  display: 'block',
}

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', message: '' })
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [language, setLanguage] = useState<'en' | 'te'>('en')

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

  const goToStep = (n: number) => {
    if (!contentRef.current) { setStep(n); return }
    gsap.to(contentRef.current, {
      opacity: 0, x: n > step ? -20 : 20, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setStep(n)
        gsap.fromTo(contentRef.current!, { opacity: 0, x: n > step ? 20 : -20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })
      },
    })
  }

  const handleConfirm = () => {
    const serviceName = SERVICES.find((s) => s.id === selected)?.label ?? selected ?? ''
    const timeLabel = timeSlot === 'morning' ? 'Morning (9am–12pm)' : timeSlot === 'afternoon' ? 'Afternoon (2pm–5pm)' : timeSlot === 'evening' ? 'Evening (5pm–8pm)' : 'Not specified'
    const msg = encodeURIComponent(
      `Hi MM Car Care! I want to book a service.\nName: ${form.name}\nPhone: ${form.phone}\nVehicle: ${form.vehicle}\nService: ${serviceName}\nTime: ${timeLabel}${form.message ? `\nNote: ${form.message}` : ''}`
    )

    // 1. Open WhatsApp
    window.open(`https://wa.me/919848377309?text=${msg}`, '_blank')

    // 2. Trigger AI callback (fire and forget)
    if (form.phone) {
      fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name || 'Customer', phone: form.phone, language }),
      }).catch(() => {})
    }

    // 3. Close modal then navigate to confirmation page
    const backdrop = backdropRef.current
    const modal = modalRef.current
    if (!modal) { onClose(); router.push('/booking-confirmed'); return }
    const tl = gsap.timeline({
      onComplete: () => {
        onClose()
        router.push('/booking-confirmed')
      },
    })
    tl.to(modal, { scale: 0.93, opacity: 0, y: 16, duration: 0.25, ease: 'power2.in' })
    tl.to(backdrop, { opacity: 0, duration: 0.2 }, '-=0.1')
  }

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.97)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <style>{`
        .bk-inp::placeholder { color: rgba(255,255,255,0.75); -webkit-text-fill-color: rgba(255,255,255,0.75); }
        .bk-inp { -webkit-text-fill-color: #fff; }
      `}</style>

      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '580px',
          border: '1px solid rgba(201,169,110,0.25)',
          borderRadius: '6px',
          background: '#0d0d0d',
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
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          CLOSE ×
        </button>

        {/* Step indicator */}
        <div style={{
          fontFamily: 'var(--font-space-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: '#C9A96E',
          marginBottom: '20px',
        }}>
          STEP {step} OF 2
        </div>

        {/* Progress bar */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            background: '#C9A96E',
            width: `${(step / 2) * 100}%`,
            transition: 'width 400ms ease',
          }} />
        </div>

        <div ref={contentRef}>
          {/* ── Step 1: Select Service ── */}
          {step === 1 && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(36px, 6vw, 52px)',
                fontWeight: 700,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '28px',
              }}>
                Select Service
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    style={{
                      background: selected === s.id ? 'rgba(201,169,110,0.1)' : 'transparent',
                      border: selected === s.id ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '14px 16px',
                      textAlign: 'left',
                      transition: 'border-color 200ms ease, background 200ms ease',
                    }}
                    onMouseEnter={(e) => { if (selected !== s.id) e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)' }}
                    onMouseLeave={(e) => { if (selected !== s.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: '16px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: selected === s.id ? '#C9A96E' : '#fff',
                    }}>
                      {s.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => selected && goToStep(2)}
                style={{
                  width: '100%',
                  background: selected ? '#C9A96E' : 'transparent',
                  color: selected ? '#0d0d0d' : 'rgba(255,255,255,0.25)',
                  border: `1px solid ${selected ? '#C9A96E' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '12px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  transition: 'all 250ms ease',
                }}
                onMouseEnter={(e) => { if (selected) { e.currentTarget.style.background = '#e0ba80'; e.currentTarget.style.borderColor = '#e0ba80' } }}
                onMouseLeave={(e) => { if (selected) { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E' } }}
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: Your Details ── */}
          {step === 2 && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(36px, 6vw, 52px)',
                fontWeight: 700,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '28px',
              }}>
                Your Details
              </h2>

              {(['name', 'phone', 'vehicle'] as const).map((field) => (
                <input
                  key={field}
                  className="bk-inp"
                  style={inputStyle}
                  placeholder={
                    field === 'name' ? 'Your name'
                    : field === 'phone' ? 'Phone number (WhatsApp preferred)'
                    : 'Vehicle make & model'
                  }
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              ))}

              {/* Preferred Time */}
              <div style={{ ...miniLabelStyle, marginTop: '4px' }}>Preferred Time</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                {[
                  { id: 'morning',   label: 'Morning',   sub: '9am – 12pm' },
                  { id: 'afternoon', label: 'Afternoon', sub: '2pm – 5pm' },
                  { id: 'evening',   label: 'Evening',   sub: '5pm – 8pm' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeSlot(t.id)}
                    style={{
                      background: timeSlot === t.id ? 'rgba(201,169,110,0.1)' : 'transparent',
                      border: timeSlot === t.id ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      transition: 'border-color 200ms ease, background 200ms ease',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: '14px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: timeSlot === t.id ? '#C9A96E' : '#fff',
                    }}>
                      {t.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-space-mono, monospace)',
                      fontSize: '8px',
                      color: 'rgba(255,255,255,0.35)',
                      marginTop: '2px',
                    }}>
                      {t.sub}
                    </div>
                  </button>
                ))}
              </div>

              <textarea
                className="bk-inp"
                style={{ ...inputStyle, resize: 'none', height: '70px' }}
                placeholder="Anything you'd like us to know? (optional)"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />

              {/* AI Call Language */}
              <div style={{ marginTop: '4px', marginBottom: '16px' }}>
                <span style={miniLabelStyle}>AI Call Language</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['en', 'te'] as const).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        padding: '8px 20px',
                        borderRadius: '9999px',
                        border: language === lang ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
                        background: language === lang ? 'rgba(201,169,110,0.12)' : 'transparent',
                        color: language === lang ? '#C9A96E' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {lang === 'en' ? 'English' : 'Telugu'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => goToStep(1)}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '9999px',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    transition: 'color 200ms ease, border-color 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  style={{
                    background: '#C9A96E',
                    color: '#0d0d0d',
                    border: '1px solid #C9A96E',
                    borderRadius: '9999px',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-space-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '1.4px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    transition: 'background 250ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e0ba80'; e.currentTarget.style.borderColor = '#e0ba80' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.borderColor = '#C9A96E' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
