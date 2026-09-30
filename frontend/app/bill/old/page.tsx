'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STORAGE_KEY = 'mm_bill_auth'

export default function BillOldPage() {
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
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(201,169,110,0.12)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 200,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-big-shoulders, sans-serif)',
            fontSize: '15px', fontWeight: 700, color: '#C9A96E',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>MM Car Care</span>
          <span style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)', paddingLeft: '12px',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}>Old Bill Generator</span>
        </div>
        <Link href="/bill/home" style={{
          fontFamily: 'var(--font-space-mono, monospace)',
          fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'rgba(201,169,110,0.5)', textDecoration: 'none',
          border: '1px solid rgba(201,169,110,0.18)', borderRadius: '2px',
          padding: '6px 12px',
        }}>
          Back
        </Link>
      </div>

      {/* Netlify iframe */}
      <iframe
        src="https://mmcarcare-kakinada.netlify.app/"
        style={{ flex: 1, width: '100%', border: 'none', display: 'block', minHeight: 'calc(100vh - 45px)' }}
        title="MM Car Care Old Bill Generator"
      />
    </div>
  )
}
