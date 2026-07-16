'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STORAGE_KEY = 'mm_bill_auth'

export default function BillHomePage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { router.replace('/bill'); return }
      const { expiry } = JSON.parse(raw)
      if (Date.now() >= expiry) { router.replace('/bill'); return }
    } catch { router.replace('/bill'); return }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <div style={{
      background: '#0a0a0a', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <div style={{
          fontFamily: 'var(--font-space-mono, monospace)',
          fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: '14px',
        }}>
          MM Car Care
        </div>
        <h1 style={{
          fontFamily: 'var(--font-big-shoulders, sans-serif)',
          fontSize: '38px', fontWeight: 700, color: '#fff',
          textTransform: 'uppercase', letterSpacing: '1px', margin: 0,
        }}>
          Bill Generator
        </h1>
        <p style={{
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '10px',
        }}>
          Choose which version to use
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '680px' }}>

        {/* New Bill Generator */}
        <Link href="/bill/create" style={{ textDecoration: 'none', flex: '1 1 280px' }}>
          <div
            style={{
              background: '#C9A96E', borderRadius: '3px',
              padding: '32px 28px', cursor: 'pointer',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            <div style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
              color: '#0a0a0a', opacity: 0.55, marginBottom: '10px',
            }}>
              Recommended
            </div>
            <div style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: '22px', fontWeight: 800, color: '#0a0a0a',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
            }}>
              Bill Generator
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '13px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.6,
            }}>
              3 sections · PDF download · WhatsApp share · parts memory · live preview
            </div>
            <div style={{
              marginTop: '20px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#0a0a0a',
            }}>
              Open →
            </div>
          </div>
        </Link>

        {/* Old Bill Generator */}
        <Link href="/bill/old" style={{ textDecoration: 'none', flex: '1 1 280px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: '3px', padding: '32px 28px', cursor: 'pointer',
              transition: 'border-color 200ms, background 200ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.45)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.2)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.4)', marginBottom: '10px',
            }}>
              Legacy
            </div>
            <div style={{
              fontFamily: 'var(--font-big-shoulders, sans-serif)',
              fontSize: '22px', fontWeight: 800, color: '#fff',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
            }}>
              Old Bill Generator
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
            }}>
              Original Netlify version — basic form, familiar layout
            </div>
            <div style={{
              marginTop: '20px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.5)',
            }}>
              Open →
            </div>
          </div>
        </Link>

      </div>
    </div>
  )
}
