'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'mm_bill_auth'
const EXPIRY_DAYS = 90

export default function BillPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const { expiry } = JSON.parse(raw)
        if (Date.now() < expiry) {
          setAuthed(true)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {}
    setChecking(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/bill-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiry }))
        setAuthed(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }

    setLoading(false)
  }

  if (checking) return null

  if (authed) {
    return (
      <iframe
        src="https://mmcarcare-kakinada.netlify.app/"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
        title="MM Car Care Bill Generator"
      />
    )
  }

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo / title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C9A96E',
            marginBottom: '16px',
          }}>
            MM Car Care
          </div>
          <h1 style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Bill Generator
          </h1>
          <p style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '12px',
          }}>
            Staff access only. Enter your password to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Password"
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? 'rgba(220,80,80,0.6)' : 'rgba(201,169,110,0.2)'}`,
                borderRadius: '2px',
                padding: '14px 16px',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '15px',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 200ms',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.55)' }}
              onBlur={e => { e.currentTarget.style.borderColor = error ? 'rgba(220,80,80,0.6)' : 'rgba(201,169,110,0.2)' }}
            />
            {error && (
              <p style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '12px',
                color: 'rgba(220,80,80,0.85)',
                marginTop: '8px',
              }}>
                Wrong password. Try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              background: loading || !password ? 'rgba(201,169,110,0.35)' : '#C9A96E',
              border: 'none',
              borderRadius: '2px',
              padding: '14px',
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'background 200ms',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
