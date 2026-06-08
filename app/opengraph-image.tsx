import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MM Car Care – Kakinada'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Gold top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '4px', background: '#C9A96E', display: 'flex',
        }} />

        {/* MM circle badge */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#C9A96E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', fontFamily: 'serif' }}>MM</span>
        </div>

        {/* Business name */}
        <div style={{
          fontSize: 72, fontWeight: 700, color: '#ffffff',
          lineHeight: 1.0, marginBottom: 16, display: 'flex',
        }}>
          MM<span style={{ color: '#C9A96E' }}>Car</span>Care
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28, color: 'rgba(255,255,255,0.55)',
          marginBottom: 48, display: 'flex',
        }}>
          Premium Car Care · Kakinada, Andhra Pradesh
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { num: '25+', label: 'Years in Business' },
            { num: '1500+', label: 'Loyal Customers' },
            { num: '9848377309', label: 'Call Us' },
          ].map(s => (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#C9A96E' }}>{s.num}</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom gold line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px', background: 'rgba(201,169,110,0.3)', display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  )
}
