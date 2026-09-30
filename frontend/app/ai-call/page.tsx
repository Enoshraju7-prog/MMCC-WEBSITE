'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AiCallPage() {
  const [language, setLanguage] = useState<'en' | 'te'>('en')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) {
      setError(language === 'te' ? 'పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please enter your name and phone number.')
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

  const isTe = language === 'te'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.6); }
        }
        @keyframes success-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        .ai-inp::placeholder { color: rgba(255,255,255,0.75); -webkit-text-fill-color: rgba(255,255,255,0.75); }
        .ai-inp { -webkit-text-fill-color: #fff; }
        .ai-inp:focus { border-color: rgba(201,169,110,0.6) !important; outline: none; }
      `}</style>

      {/* MM Car Care wordmark */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A96E, #e8c98a, #C9A96E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>MM</span>
          </div>
          <span style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '18px', fontWeight: 600 }}>
            <span style={{ color: '#C9A96E' }}>MM</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>CarCare</span>
          </span>
        </div>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#0d0d0d',
        border: '1px solid rgba(201,169,110,0.22)',
        borderRadius: '20px',
        padding: '40px 36px 36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>

        {success ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#4ade80', display: 'inline-block',
                animation: 'success-pulse 1.4s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: '#fff',
              }}>
                {isTe ? 'Calling చేస్తున్నాం!' : 'Calling You Now!'}
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 28px',
            }}>
              {isTe
                ? <>మీకు <strong style={{ color: '#C9A96E' }}>+91 80715 79188</strong> నుండి call వస్తుంది.<br />దయచేసి pick చేయండి — ఇది MM Car Care AI నుండి.</>
                : <>You&apos;ll receive a call from <strong style={{ color: '#C9A96E' }}>+91 80715 79188</strong>.<br />Please pick up — it&apos;s MM Car Care.</>
              }
            </p>
            <Link href="/" style={{
              display: 'block',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px',
              padding: '12px 24px',
            }}>
              Back to Site
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#C9A96E', display: 'inline-block',
                  animation: 'ai-pulse 1.8s ease-in-out infinite',
                }} />
                <span style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px', letterSpacing: '1.4px', textTransform: 'uppercase', color: '#C9A96E',
                }}>
                  AI Schedule — Free
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(34px, 7vw, 44px)', fontWeight: 700,
                textTransform: 'uppercase', color: '#fff',
                lineHeight: 1.05, margin: '0 0 12px',
              }}>
                {isTe ? <>మీ Slot<br /><span style={{ color: '#C9A96E' }}>Book చేయండి.</span></> : <>Book Your<br /><span style={{ color: '#C9A96E' }}>Slot With AI.</span></>}
              </h1>
              <p style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0,
              }}>
                {isTe
                  ? 'AI మీ vehicle service schedule చేస్తుంది. Details ఇవ్వండి — మేము call చేస్తాం.'
                  : 'AI will schedule your vehicle service. Enter your details and we\'ll call you to book your slot.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Language toggle */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px',
                }}>Language</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['en', 'te'] as const).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      style={{
                        fontFamily: 'var(--font-space-mono, monospace)',
                        fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                        padding: '9px 22px', borderRadius: '9999px',
                        border: language === lang ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
                        background: language === lang ? 'rgba(201,169,110,0.12)' : 'transparent',
                        color: language === lang ? '#C9A96E' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', transition: 'all 200ms ease',
                      }}
                    >
                      {lang === 'en' ? 'English' : 'Telugu'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px',
                }}>
                  {isTe ? 'మీ పేరు' : 'Your Name'}
                </label>
                <input
                  type="text"
                  className="ai-inp"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isTe ? 'పేరు టైప్ చేయండి' : 'Your name'}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                    padding: '15px 18px', fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: '15px', color: '#fff', WebkitTextFillColor: '#fff',
                    boxSizing: 'border-box', transition: 'border-color 200ms ease',
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px',
                }}>
                  {isTe ? 'ఫోన్ నంబర్' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  className="ai-inp"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={isTe ? '10 digit mobile number' : '10-digit mobile number'}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                    padding: '15px 18px', fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontSize: '15px', color: '#fff', WebkitTextFillColor: '#fff',
                    boxSizing: 'border-box', transition: 'border-color 200ms ease',
                  }}
                />
              </div>

              {error && (
                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '13px', color: '#f87171', margin: '0 0 16px',
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(201,169,110,0.4)' : '#C9A96E',
                  color: '#0a0a0a', border: 'none', borderRadius: '9999px',
                  padding: '17px', fontFamily: 'var(--font-space-mono, monospace)',
                  fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase',
                  fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  transition: 'background 200ms ease', width: '100%',
                }}
              >
                {loading
                  ? (isTe ? 'Calling...' : 'Calling...')
                  : (isTe ? 'Slot Book చేయండి' : 'Book My Slot')
                }
              </button>
            </form>

            {/* Footer note */}
            <p style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '12px', color: 'rgba(255,255,255,0.25)',
              textAlign: 'center', marginTop: '20px', marginBottom: 0, lineHeight: 1.6,
            }}>
              Call from +91 80715 79188 · MM Car Care Kakinada
            </p>
          </>
        )}
      </div>

      {/* Bottom address */}
      <p style={{
        fontFamily: 'var(--font-space-mono, monospace)',
        fontSize: '10px', letterSpacing: '0.5px',
        color: 'rgba(255,255,255,0.2)', marginTop: '32px', textAlign: 'center',
      }}>
        Opp. APSP Petrol Bunk · Kakinada · 9848377309
      </p>
    </div>
  )
}
