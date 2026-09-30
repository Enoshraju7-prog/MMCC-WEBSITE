'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CarAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.6 }
    )
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="car-wrapper"
      style={{
        position: 'absolute',
        right: '2%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '52%',
        maxWidth: '700px',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <svg
        viewBox="0 0 460 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="carClip">
            <rect x="0" y="0" width="460" height="340" />
          </clipPath>
        </defs>

        <g className="car-body">
          {/* Ground reflection */}
          <ellipse className="car-reflect" cx="230" cy="314" rx="180" ry="10" fill="#fff" />

          {/* Body */}
          <path
            d="M 55 270 L 55 230 Q 60 190 100 178 L 165 148 Q 205 118 255 112 Q 295 108 335 118 L 375 140 Q 410 160 420 200 L 430 240 L 430 270 Z"
            fill="#000"
            stroke="#fff"
            strokeWidth="1.5"
          />
          {/* Roofline */}
          <path d="M 165 148 Q 205 118 255 112 Q 295 108 335 118 L 375 140" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          {/* Windshield */}
          <path d="M 168 152 L 175 200 L 250 200 L 268 142 Q 240 118 210 126 Z" fill="rgba(0,0,0,0.04)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          {/* Rear window */}
          <path d="M 280 140 L 275 200 L 350 200 L 360 148 Q 340 128 308 118 Z" fill="rgba(0,0,0,0.04)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          {/* B-pillar */}
          <line x1="272" y1="138" x2="275" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          {/* Hood */}
          <path d="M 375 140 L 415 168" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          {/* Door crease */}
          <path d="M 90 230 Q 180 218 340 224 L 410 232" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* Skirt */}
          <path d="M 78 260 L 395 260" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Front bumper */}
          <path d="M 420 200 Q 440 220 438 254 L 430 270" fill="none" stroke="#fff" strokeWidth="1.5" />
          {/* Rear bumper */}
          <path d="M 55 230 Q 42 240 40 260 L 55 270" fill="none" stroke="#fff" strokeWidth="1.5" />

          {/* Headlight */}
          <g className="headlight" filter="url(#glow)">
            <path d="M 415 195 L 440 208 L 438 225 L 415 222 Z" fill="rgba(0,0,0,0.08)" stroke="#fff" strokeWidth="1" />
            <line x1="418" y1="205" x2="436" y2="212" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="headlight" filter="url(#softGlow)">
            <path d="M 440 210 L 480 195 L 480 230 L 440 222 Z" fill="rgba(0,0,0,0.04)" />
          </g>

          {/* Tail light */}
          <path d="M 55 230 L 38 236 L 38 258 L 55 262 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(0,0,0,0.6)" strokeWidth="1" />
          <line x1="41" y1="240" x2="41" y2="254" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Wheel arches */}
          <path d="M 88 272 Q 88 248 122 248 Q 156 248 156 272" fill="#000" stroke="#fff" strokeWidth="1.5" />
          <path d="M 303 272 Q 303 248 338 248 Q 373 248 373 272" fill="#000" stroke="#fff" strokeWidth="1.5" />

          {/* Rear wheel */}
          <circle cx="122" cy="295" r="28" fill="#000" stroke="#fff" strokeWidth="1.5" />
          <g className="wheel-rear">
            <circle cx="122" cy="295" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx="122" cy="295" r="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1={122 + 8 * Math.cos((angle * Math.PI) / 180)}
                y1={295 + 8 * Math.sin((angle * Math.PI) / 180)}
                x2={122 + 17 * Math.cos((angle * Math.PI) / 180)}
                y2={295 + 17 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle cx="122" cy="295" r="3" fill="#fff" />

          {/* Front wheel */}
          <circle cx="338" cy="295" r="28" fill="#000" stroke="#fff" strokeWidth="1.5" />
          <g className="wheel-front">
            <circle cx="338" cy="295" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx="338" cy="295" r="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1={338 + 8 * Math.cos((angle * Math.PI) / 180)}
                y1={295 + 8 * Math.sin((angle * Math.PI) / 180)}
                x2={338 + 17 * Math.cos((angle * Math.PI) / 180)}
                y2={295 + 17 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle cx="338" cy="295" r="3" fill="#fff" />

          {/* Scan line */}
          <rect className="scan-line" x="55" y="180" width="4" height="90" fill="rgba(255,255,255,0.06)" clipPath="url(#carClip)" />

          {/* Mirror */}
          <path d="M 375 172 L 390 165 L 392 175 L 376 178 Z" fill="#000" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          {/* Antenna */}
          <line x1="300" y1="112" x2="308" y2="88" stroke="rgba(0,0,0,0.3)" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
