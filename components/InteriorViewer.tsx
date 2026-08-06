'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

const INTERIOR_SHOTS = [
  { src: '/cars/interior-dashboard.jpeg', label: 'Dashboard View' },
  { src: '/cars/interior-infotainment.jpeg', label: 'Console & Screen' },
  { src: '/cars/interior-driving.jpeg', label: 'Driver POV' },
]

export default function InteriorViewer() {
  const [activeShot, setActiveShot] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const startPos = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  // Preload
  useEffect(() => {
    let loaded = 0
    INTERIOR_SHOTS.forEach(shot => {
      const img = new Image()
      img.onload = () => {
        loaded++
        if (loaded === INTERIOR_SHOTS.length) setIsLoading(false)
      }
      img.src = shot.src
    })
  }, [])

  // Auto slow pan on idle
  useEffect(() => {
    let angle = 0
    let userInteracted = false
    const stopAuto = () => { userInteracted = true }
    window.addEventListener('pointerdown', stopAuto, { once: true })
    const loop = setInterval(() => {
      if (userInteracted) { clearInterval(loop); return }
      angle += 0.3
      const x = Math.sin(angle * Math.PI / 180) * 8
      const y = Math.sin(angle * Math.PI / 180 * 0.5) * 3
      setOffset({ x, y })
      currentOffset.current = { x, y }
    }, 30)
    return () => { clearInterval(loop); window.removeEventListener('pointerdown', stopAuto) }
  }, [activeShot])

  // Momentum loop
  const momentumLoop = useCallback(() => {
    velocity.current.x *= 0.88
    velocity.current.y *= 0.88
    currentOffset.current.x = Math.max(-25, Math.min(25,
      currentOffset.current.x + velocity.current.x))
    currentOffset.current.y = Math.max(-15, Math.min(15,
      currentOffset.current.y + velocity.current.y))
    setOffset({ ...currentOffset.current })
    if (Math.abs(velocity.current.x) > 0.1 ||
        Math.abs(velocity.current.y) > 0.1) {
      rafId.current = requestAnimationFrame(momentumLoop)
    }
  }, [])

  const onDown = (x: number, y: number) => {
    cancelAnimationFrame(rafId.current)
    setIsDragging(true)
    startPos.current = { x, y }
    velocity.current = { x: 0, y: 0 }
  }
  const onMove = (x: number, y: number) => {
    if (!isDragging) return
    const dx = (x - startPos.current.x) * 0.12
    const dy = (y - startPos.current.y) * 0.06
    velocity.current = { x: dx * 0.3, y: dy * 0.3 }
    const nx = Math.max(-25, Math.min(25, currentOffset.current.x + dx))
    const ny = Math.max(-15, Math.min(15, currentOffset.current.y + dy))
    currentOffset.current = { x: nx, y: ny }
    setOffset({ x: nx, y: ny })
    startPos.current = { x, y }
  }
  const onUp = () => {
    setIsDragging(false)
    rafId.current = requestAnimationFrame(momentumLoop)
  }

  return (
    <div>
      {/* Main viewer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(204,0,0,0.3)',
          background: '#080808',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={e => { e.preventDefault(); onDown(e.clientX, e.clientY) }}
        onMouseMove={e => onMove(e.clientX, e.clientY)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={e => { e.preventDefault(); onDown(e.touches[0].clientX, e.touches[0].clientY) }}
        onTouchMove={e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY) }}
        onTouchEnd={onUp}
      >
        {/* Loading */}
        {isLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: '#080808',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(204,0,0,0.2)',
              borderTopColor: '#CC0000',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 12 }}>
              Loading interior...
            </p>
          </div>
        )}

        {/* Image with parallax transform */}
        <img
          src={INTERIOR_SHOTS[activeShot].src}
          alt={INTERIOR_SHOTS[activeShot].label}
          style={{
            position: 'absolute',
            width: '130%',
            height: '130%',
            top: '-15%',
            left: '-15%',
            objectFit: 'cover',
            transform: `translate(${offset.x}%, ${offset.y}%)`,
            transition: isDragging ? 'none' : 'transform 0.05s ease',
            pointerEvents: 'none',
            filter: 'brightness(0.95)',
          }}
        />

        {/* Vignette overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 85% 80% at 50% 50%,
            transparent 40%, rgba(0,0,0,0.55) 100%)`,
        }} />

        {/* Hint */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(0,0,0,0.65)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '6px 14px',
          fontSize: 12, color: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)', pointerEvents: 'none',
        }}>🖱 Drag to look around</div>

        {/* Shot label */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(204,0,0,0.2)',
          border: '1px solid rgba(204,0,0,0.4)',
          borderRadius: 8, padding: '5px 12px',
          fontSize: 12, color: '#fff',
          backdropFilter: 'blur(8px)',
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
        }}>{INTERIOR_SHOTS[activeShot].label}</div>

        {/* Car badge bottom */}
        <div style={{
          position: 'absolute', bottom: 14, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(204,0,0,0.3)',
          borderRadius: 8, padding: '6px 18px',
          fontSize: 13, color: '#fff',
          backdropFilter: 'blur(10px)',
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          letterSpacing: '0.06em', whiteSpace: 'nowrap',
        }}>Interior View — Grand i10 TS27 1087</div>
      </div>

      {/* Shot selector tabs */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: 10, marginTop: 16,
      }}>
        {INTERIOR_SHOTS.map((shot, i) => (
          <button key={i}
            onClick={() => { setActiveShot(i); setOffset({ x: 0, y: 0 }); currentOffset.current = { x: 0, y: 0 } }}
            style={{
              background: i === activeShot ? '#CC0000' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${i === activeShot ? '#CC0000' : 'rgba(255,255,255,0.15)'}`,
              color: '#fff', padding: '7px 18px',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600, fontSize: 13,
              transition: 'all 0.2s',
            }}
          >{shot.label}</button>
        ))}
      </div>

      <p style={{
        textAlign: 'center', marginTop: 10,
        fontSize: 12, color: 'rgba(255,255,255,0.25)',
      }}>
        Drag left/right to pan around the cabin · Switch views above
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
