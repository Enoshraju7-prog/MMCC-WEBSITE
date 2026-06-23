'use client'

import { useState, useEffect } from 'react'

interface Props {
  onClose: () => void
}

export default function CallbackModal({ onClose }: Props) {
  const [language, setLanguage] = useState<'en' | 'te'>('en')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), language }),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please call us directly at 9848377309.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '14px 16px',
    fontFamily: 'var(--font-dm-sans, sans-serif)',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 200ms ease',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-space-mono, monospace)',
    fontSize: '9px',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    display: 'block',
    marginBottom: '8px',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: '#0d0d0d',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: '16px',
          padding: '36px 32px 32px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
                animation: 'pulse-dot 1.4s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '28px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#fff',
              }}>
                Calling You Now
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              You&apos;ll receive a call from <strong style={{ color: '#C9A96E' }}>+1 (541) 981-6853</strong>.<br />
              Please pick up — it&apos;s MM Car Care.
            </p>
            <style>{`
              @keyframes pulse-dot {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.4); }
              }
            `}</style>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '9px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#C9A96E',
                marginBottom: '10px',
              }}>
                AI Callback
              </div>
              <h2 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
                lineHeight: 1.1,
              }}>
                We&apos;ll Call You<br />
                <span style={{ color: '#C9A96E' }}>In Seconds.</span>
              </h2>
              <p style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '10px',
                marginBottom: 0,
              }}>
                Tell us your issue over the phone. Our AI agent books your slot.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Language toggle */}
              <div>
                <span style={labelStyle}>Language</span>
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

              {/* Name */}
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={language === 'te' ? 'మీ పేరు' : 'Your name'}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,169,110,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={language === 'te' ? 'మీ ఫోన్ నంబర్' : '10-digit mobile number'}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,169,110,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>

              {error && (
                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px',
                  color: '#f87171',
                  margin: 0,
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(201,169,110,0.4)' : '#C9A96E',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '16px',
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  cursor: loading ? 'wait' : 'pointer',
                  fontWeight: 700,
                  transition: 'background 200ms ease',
                }}
              >
                {loading ? 'Calling...' : 'Request Call'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
