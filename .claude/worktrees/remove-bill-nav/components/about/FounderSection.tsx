'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBooking } from '@/lib/booking-context'

gsap.registerPlugin(ScrollTrigger)

export default function FounderSection() {
  const { open } = useBooking()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.founder-img-wrap',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.3,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.founder-section-inner', start: 'top 70%', once: true },
        }
      )
      gsap.from('.founder-nameplate', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.founder-section-inner', start: 'top 65%', once: true },
        delay: 0.5,
      })
      gsap.from('.founder-quote-line', {
        y: '105%',
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.founder-bio', start: 'top 75%', once: true },
      })
      gsap.from('.founder-para', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.founder-bio', start: 'top 72%', once: true },
        delay: 0.4,
      })
      gsap.from('.founder-bio-label', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.founder-bio', start: 'top 75%', once: true },
        delay: 0.3,
      })
      gsap.from('.founder-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.founder-bio', start: 'top 70%', once: true },
        delay: 0.7,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0a0a0a',
        padding: 'clamp(64px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="founder-section-inner"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'start',
        }}
      >
        {/* Portrait */}
        <div style={{ position: 'relative' }}>
          <div
            className="founder-img-wrap"
            style={{
              width: '100%',
              paddingBottom: '120%',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(201,169,110,0.2)',
            }}
          >
            <Image
              src="/uploads/founder.jpg"
              alt="Devisetty Santosham – Founder & Chairman, MM Car Care"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
              }}
            />
          </div>
          <div
            className="founder-nameplate"
            style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-big-shoulders, sans-serif)',
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '6px',
              }}
            >
              Devisetty Santosham
            </div>
            <div
              style={{
                fontFamily: 'var(--font-space-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#C9A96E',
              }}
            >
              Founder & Chairman
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="founder-bio" style={{ paddingTop: 'clamp(0px, 2vw, 24px)' }}>
          <blockquote style={{ marginBottom: '40px' }}>
            {['"A car says something about', 'the person who drives it.', 'Our job is to make sure', 'it says the right thing."'].map(
              (line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <span
                    className="founder-quote-line"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-big-shoulders, sans-serif)',
                      fontSize: 'clamp(24px, 3vw, 38px)',
                      fontWeight: 400,
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                      color: '#fff',
                    }}
                  >
                    {line}
                  </span>
                </div>
              )
            )}
          </blockquote>

          <div
            className="founder-bio-label"
            style={{
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#C9A96E',
              marginBottom: '20px',
            }}
          >
            The Beginning
          </div>

          {[
            'MM Car Care — Maruthi Mobile Car Care — started with a simple conviction: that every car deserves the same level of care, regardless of brand or budget. Devisetty Santosham built the business from the ground up in Kakinada, Andhra Pradesh, combining a passion for automotive craft with a commitment to professional-grade standards.',
            'With 25+ years in the business, MM Car Care has grown from a mobile detailing service to a full-service garage — without ever compromising on the principles that started it. Trained hands. Professional products. The same meticulous attention to detail that earned the trust of over 1,500 customers across the region.',
            'The mobile service offering remains — because the belief that quality should come to you has never changed.',
          ].map((text, i) => (
            <p
              key={i}
              className="founder-para"
              style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: i < 2 ? '24px' : 0,
              }}
            >
              {text}
            </p>
          ))}

          <button
            className="founder-cta"
            onClick={open}
            style={{
              marginTop: '40px',
              background: '#C9A96E',
              color: '#0a0a0a',
              border: '1px solid #C9A96E',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontFamily: 'var(--font-space-mono, monospace)',
              fontSize: '12px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              transition: 'background 250ms ease, color 250ms ease',
              display: 'block',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#0a0a0a' }}
          >
            Book a Service
          </button>
        </div>
      </div>
    </section>
  )
}
