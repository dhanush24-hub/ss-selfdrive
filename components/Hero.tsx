'use client'
import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const carControls = useAnimation()
  const glowControls = useAnimation()

  useEffect(() => {
    const run = async () => {
      carControls.set({
        scale: 0.22,
        opacity: 0,
        x: 120,
        y: 60,
        filter: 'blur(10px)',
      })
      glowControls.set({ opacity: 0 })

      await new Promise(r => setTimeout(r, 250))

      // Drive in toward camera from far right
      carControls.start({
        scale: 1.05,
        opacity: 1,
        x: 0,
        y: -8,
        filter: 'blur(0px)',
        transition: {
          duration: 1.1,
          ease: [0.08, 0.82, 0.17, 1.0],
        },
      })
      glowControls.start({
        opacity: 1,
        transition: { duration: 1.2, delay: 0.3, ease: 'easeOut' },
      })

      await new Promise(r => setTimeout(r, 1120))

      // Brake rock
      await carControls.start({
        scale: 0.97,
        y: 5,
        transition: { duration: 0.16, ease: 'easeOut' },
      })
      await carControls.start({
        scale: 1.01,
        y: -3,
        transition: { duration: 0.13, ease: 'easeInOut' },
      })
      await carControls.start({
        scale: 1.0,
        y: 0,
        transition: { duration: 0.18, ease: 'easeOut' },
      })
    }
    run()
  }, [carControls, glowControls])

  const textContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.0 } },
  }
  const textItem = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  }

  return (
    <section style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #080808 0%, #160000 55%, #080808 100%)',
    }}>

      {/* ── BACKGROUND: subtle red fog left side ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 70% at 20% 60%,
            rgba(204,0,0,0.08) 0%, transparent 65%)
        `,
      }} />

      {/* Car image — hero-poster, car portion only */}
      <motion.div
        animate={carControls}
        style={{
          position: 'absolute',
          right: '-3%',
          top: '0',
          width: '60%',
          height: '100%',
          zIndex: 2,
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* The image — show only car section */}
          <img
            src="/cars/hero-poster.jpeg"
            alt="Hyundai Grand i10 TS27 1087"
            style={{
              position: 'absolute',
              bottom: '-5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110%',
              height: '130%',
              objectFit: 'cover',
              objectPosition: 'center 72%',
              /* objectPosition 72% shows the CAR portion
                 of the portrait image, not the "1087" numbers.
                 Adjust between 65%-80% to taste. */
            }}
          />

          {/* Top fade — kills the "1087" numbers completely */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: `linear-gradient(to bottom,
              #080808 0%,
              rgba(8,8,8,0.98) 8%,
              rgba(8,8,8,0.85) 20%,
              rgba(8,8,8,0.40) 38%,
              rgba(8,8,8,0.10) 52%,
              transparent 65%
            )`,
          }} />

          {/* Left fade — blends into text */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: `linear-gradient(to right,
              #080808 0%,
              rgba(8,8,8,0.97) 6%,
              rgba(8,8,8,0.80) 20%,
              rgba(8,8,8,0.35) 38%,
              rgba(8,8,8,0.08) 56%,
              transparent 70%
            )`,
          }} />

          {/* Bottom fade */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: `linear-gradient(to top,
              #080808 0%,
              rgba(8,8,8,0.75) 12%,
              rgba(8,8,8,0.20) 30%,
              transparent 50%
            )`,
          }} />

          {/* Right fade */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: `linear-gradient(to left,
              rgba(8,8,8,0.60) 0%,
              transparent 30%
            )`,
          }} />

          {/* Red dramatic lighting overlay — 
              matches the poster's existing red glow
              and ties it to the website's red theme */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 4,
            background: `
              radial-gradient(
                ellipse 65% 55% at 62% 70%,
                rgba(204,0,0,0.12) 0%,
                rgba(204,0,0,0.04) 50%,
                transparent 70%
              )
            `,
            pointerEvents: 'none',
          }} />
        </div>
      </motion.div>

      {/* Red atmospheric glow — background layer */}
      <motion.div
        animate={glowControls}
        style={{
          position: 'absolute',
          right: '0', top: '0',
          width: '65%', height: '100%',
          zIndex: 1, pointerEvents: 'none',
          background: `
            radial-gradient(
              ellipse 75% 65% at 68% 60%,
              rgba(204,0,0,0.13) 0%,
              rgba(204,0,0,0.04) 50%,
              transparent 72%
            )
          `,
        }}
      />

      {/* ── LEFT SIDE: text content ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 48px 60px',
      }}>
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '500px' }}
        >
          {/* Pill badge */}
          <motion.div variants={textItem} style={{ marginBottom: '24px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(204,0,0,0.14)',
              border: '1px solid rgba(204,0,0,0.42)',
              color: '#CC0000',
              fontSize: '11px',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '5px 16px',
              borderRadius: '100px',
            }}>
              Hyderabad&apos;s Premium Self-Drive
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1 variants={textItem} style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(50px, 6.5vw, 80px)',
            lineHeight: 1.0,
            color: '#fff',
            margin: '0 0 22px',
          }}>
            Drive The<br />
            <span style={{
              background: 'linear-gradient(90deg, #FF2200, #CC0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Flagship.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={textItem} style={{
            color: '#888888',
            fontSize: '17px',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.7,
            margin: '0 0 34px',
            maxWidth: '440px',
          }}>
            One car. Zero compromise. The Grand i10 is cleaned,
            inspected, and reserved exclusively for you — the most
            personal self-drive experience in Hyderabad.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={textItem}
            style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '34px' }}>
            <Link href="/book">
              <button className="btn-red"
                style={{ fontSize: '14px', padding: '14px 34px' }}>
                BOOK NOW
              </button>
            </Link>
            <button className="btn-glass"
              style={{ fontSize: '14px', padding: '13px 28px' }}
              onClick={() =>
                document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })
              }>
              VIEW OFFERS
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={textItem}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['✓ Zero Hidden Charges', '✓ Fully Insured', '✓ 24/7 Support'].map(b => (
              <span key={b} style={{
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.11)',
                borderRadius: '100px',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                padding: '6px 14px',
                whiteSpace: 'nowrap',
              }}>{b}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating badge — bottom right, fades in after car parks */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '52px', right: '40px',
          zIndex: 11,
          background: 'rgba(0,0,0,0.78)',
          border: '1px solid rgba(204,0,0,0.32)',
          borderRadius: '12px',
          padding: '10px 16px',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: '#CC0000',
          animation: 'hpulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <div>
          <div style={{
            color: '#fff',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: '14px', lineHeight: 1.2,
          }}>Hyundai Grand i10</div>
          <div style={{
            color: 'rgba(255,255,255,0.42)',
            fontSize: '11px', fontFamily: 'Inter, sans-serif',
          }}>Flagship Model · TS27 1087</div>
        </div>
      </motion.div>

      {/* Mobile: stack layout */}
      <style>{`
        @keyframes hpulse {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.5); opacity:0.6; }
        }
        @media (max-width: 768px) {
          .hero-car-abs {
            position: relative !important;
            width: 100% !important;
            height: 260px !important;
            right: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
