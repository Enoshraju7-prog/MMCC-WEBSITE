import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Booking Confirmed | MM Car Care Kakinada',
  description: 'Your booking request has been sent to MM Car Care Kakinada. We will call you back shortly.',
  robots: { index: false, follow: false },
}

export default function BookingConfirmedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
      `}</style>

      {/* WhatsApp icon */}
      <div style={{ marginBottom: '28px' }}>
        <svg viewBox="0 0 32 32" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path d="M22.6 9.4A9.17 9.17 0 0 0 16 6.8C11.5 6.8 7.8 10.5 7.8 15c0 1.5.4 2.9 1.1 4.1L7.8 25.2l6.3-1.7c1.2.6 2.5 1 3.9 1 4.5 0 8.2-3.7 8.2-8.2 0-2.2-.9-4.3-2.6-5.9zm-6.6 12.6c-1.3 0-2.5-.4-3.6-1l-.3-.2-2.9.8.8-2.8-.2-.3c-.7-1.1-1-2.3-1-3.6 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.7 1.9 1.3 1.3 2 3 2 4.8.1 3.7-3 6.8-6.7 6.1zm3.7-5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.5l.3-.4c.1-.2.1-.3.2-.5 0-.2 0-.3-.1-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z" fill="#fff"/>
        </svg>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-big-shoulders, sans-serif)',
          fontSize: 'clamp(48px, 10vw, 88px)',
          fontWeight: 700,
          lineHeight: 1,
          textTransform: 'uppercase',
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        Booking<br />Confirmed.
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          fontSize: '16px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.5)',
          maxWidth: '400px',
          marginBottom: '36px',
        }}
      >
        Your WhatsApp message is on its way to MM Car Care.
      </p>

      {/* AI Call notification */}
      <div style={{
        background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.2)',
        borderRadius: '12px',
        padding: '20px 28px',
        maxWidth: '400px',
        width: '100%',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        textAlign: 'left',
      }}>
        <span style={{
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: '#C9A96E',
          flexShrink: 0,
          marginTop: '5px',
          animation: 'pulse-ring 1.6s ease-in-out infinite',
          display: 'inline-block',
        }} />
        <div>
          <div style={{
            fontFamily: 'var(--font-space-mono, monospace)',
            fontSize: '9px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#C9A96E',
            marginBottom: '6px',
          }}>
            AI Agent Calling You Now
          </div>
          <p style={{
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            margin: 0,
          }}>
            You&apos;ll receive a call from{' '}
            <strong style={{ color: '#fff' }}>+1 (541) 981-6853</strong>.
            Please pick up — it&apos;s MM Car Care&apos;s AI assistant confirming your booking details.
          </p>
        </div>
      </div>

      {/* Back to site */}
      <Link
        href="/"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '400px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '9999px',
          padding: '14px 24px',
          fontFamily: 'var(--font-space-mono, monospace)',
          fontSize: '11px',
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        Back to Site
      </Link>
    </div>
  )
}
