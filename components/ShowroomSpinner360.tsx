'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const CLOSED_FRAMES = Array.from({length:36},
  (_,i) => `https://imgd.aeplcdn.com/800x450/cw/360/hyundai/1081/5065/closed-door/cb062b/${i+1}.jpg`)

const OPEN_FRAMES = Array.from({length:36},
  (_,i) => `https://imgd.aeplcdn.com/800x450/cw/360/hyundai/1081/5065/open-door/${i+1}.jpg`)

export default function ShowroomSpinner360() {
  const TOTAL = 36

  // State
  const [mode, setMode] = useState<'closed'|'open'>('closed')
  const [frameIdx, setFrameIdx] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoSpin, setIsAutoSpin] = useState(true)
  const [degree, setDegree] = useState(0)

  // Refs
  const frameF = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const isDown = useRef(false)
  const rafId = useRef<number>(0)
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const closedImgs = useRef<HTMLImageElement[]>([])
  const openImgs = useRef<HTMLImageElement[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const frames = mode === 'closed' ? CLOSED_FRAMES : OPEN_FRAMES
  const imgCache = mode === 'closed' ? closedImgs : openImgs

  // Draw current frame to canvas with SS SELF DRIVE plate overlay
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imgs = imgCache.current
    const img = imgs[idx]
    if (!img || !img.complete) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // ── SS SELF DRIVE badge overlay (covers CarWale plate watermark) ──
    const plateX = canvas.width * 0.38
    const plateY = canvas.height * 0.72
    const plateW = canvas.width * 0.24
    const plateH = canvas.height * 0.09
    const radius = 4

    // roundRect polyfill
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    // White plate background
    ctx.fillStyle = '#FFFFFF'
    roundRect(plateX, plateY, plateW, plateH, radius)
    ctx.fill()

    // Red left accent bar
    ctx.fillStyle = '#CC0000'
    ctx.fillRect(plateX + 4, plateY + 4, plateW * 0.08, plateH - 8)

    // "SS SELF DRIVE" text on plate
    ctx.fillStyle = '#111111'
    ctx.font = `bold ${canvas.height * 0.038}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      'SS SELF DRIVE',
      plateX + plateW * 0.55,
      plateY + plateH * 0.5
    )

    // Reset alignment
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  }, [imgCache])

  // Preload all 36 frames for both modes
  useEffect(() => {
    let loaded = 0
    const total = TOTAL * 2

    const loadSet = (urls: string[], cache: React.MutableRefObject<HTMLImageElement[]>) => {
      cache.current = urls.map(src => {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          loaded++
          setLoadedCount(loaded)
          if (loaded >= total) setAllLoaded(true)
          if (loaded === TOTAL) drawFrame(0)
        }
        img.onerror = () => { loaded++; setLoadedCount(loaded) }
        img.src = src
        return img
      })
    }

    loadSet(CLOSED_FRAMES, closedImgs)
    loadSet(OPEN_FRAMES, openImgs)
  }, [TOTAL, drawFrame])

  // Redraw when frame changes
  useEffect(() => {
    drawFrame(frameIdx)
  }, [frameIdx, mode, drawFrame])

  // Resize canvas to container
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const resize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawFrame(frameIdx)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame, frameIdx])

  // Momentum loop
  const momentumLoop = useCallback(() => {
    velocity.current *= 0.90
    frameF.current = ((frameF.current - velocity.current * 0.5) + TOTAL) % TOTAL
    const idx = Math.round(frameF.current) % TOTAL
    setFrameIdx(idx)
    setDegree(Math.round((idx / TOTAL) * 360))
    if (Math.abs(velocity.current) > 0.08) {
      rafId.current = requestAnimationFrame(momentumLoop)
    }
  }, [TOTAL])

  // Auto spin
  useEffect(() => {
    if (!allLoaded || !isAutoSpin) return
    autoRef.current = setInterval(() => {
      frameF.current = (frameF.current + 1) % TOTAL
      const idx = Math.round(frameF.current) % TOTAL
      setFrameIdx(idx)
      setDegree(Math.round((idx / TOTAL) * 360))
    }, 80)
    return () => clearInterval(autoRef.current)
  }, [allLoaded, isAutoSpin, TOTAL])

  const stopAuto = () => {
    clearInterval(autoRef.current)
    setIsAutoSpin(false)
  }

  const onPointerDown = (x: number) => {
    stopAuto()
    cancelAnimationFrame(rafId.current)
    isDown.current = true
    lastX.current = x
    velocity.current = 0
    setIsDragging(true)
  }

  const onPointerMove = (x: number) => {
    if (!isDown.current) return
    const delta = x - lastX.current
    velocity.current = delta * 0.5
    frameF.current = ((frameF.current - delta / 12) + TOTAL) % TOTAL
    const idx = Math.round(frameF.current) % TOTAL
    setFrameIdx(idx)
    setDegree(Math.round((idx / TOTAL) * 360))
    lastX.current = x
  }

  const onPointerUp = () => {
    if (!isDown.current) return
    isDown.current = false
    setIsDragging(false)
    rafId.current = requestAnimationFrame(momentumLoop)
  }

  const loadPercent = Math.round((loadedCount / (TOTAL * 2)) * 100)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Mode switcher — Closed / Open doors */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: 8, marginBottom: 16,
      }}>
        {(['closed', 'open'] as const).map(m => (
          <button key={m}
            onClick={() => { setMode(m); frameF.current = 0; setFrameIdx(0) }}
            style={{
              background: mode === m ? '#CC0000' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${mode === m ? '#CC0000' : 'rgba(255,255,255,0.2)'}`,
              color: '#fff',
              padding: '7px 20px',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}>
            {m === 'closed' ? '🚗 Doors Closed' : '🚪 Doors Open'}
          </button>
        ))}
      </div>

      {/* Main 360 viewer */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(204,0,0,0.3)',
          background: '#0a0a0a',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onMouseDown={e => { e.preventDefault(); onPointerDown(e.clientX) }}
        onMouseMove={e => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={e => { e.preventDefault(); onPointerDown(e.touches[0].clientX) }}
        onTouchMove={e => { e.preventDefault(); onPointerMove(e.touches[0].clientX) }}
        onTouchEnd={onPointerUp}
      >

        {/* Canvas — renders car frames */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
          }}
        />

        {/* Loading overlay */}
        {!allLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
            {/* Spinner ring */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
                {/* Track */}
                <circle cx="40" cy="40" r="34"
                  fill="none" stroke="rgba(204,0,0,0.15)" strokeWidth="5" />
                {/* Progress */}
                <circle cx="40" cy="40" r="34"
                  fill="none" stroke="#CC0000" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - loadPercent/100)}`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px',
                    transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: 'Rajdhani, sans-serif',
              }}>{loadPercent}%</div>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.6)', fontSize: 13,
              marginTop: 14, letterSpacing: '0.05em',
            }}>Loading 360° View...</p>
            <p style={{
              color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4,
            }}>Hyundai Grand i10 · {loadedCount}/{TOTAL * 2} frames</p>
          </div>
        )}

        {/* Drag hint — top left */}
        {allLoaded && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(0,0,0,0.70)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, color: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>↔</span>
            <span>Drag to rotate</span>
          </div>
        )}

        {/* SVG Circular degree ring — top right */}
        {allLoaded && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 56 56" style={{ width: 56, height: 56 }}>
              <circle cx="28" cy="28" r="22"
                fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <circle cx="28" cy="28" r="22"
                fill="none" stroke="#CC0000" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - degree/360)}`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '28px 28px',
                  transition: 'stroke-dashoffset 0.05s linear' }}
              />
              <text x="28" y="33"
                textAnchor="middle"
                fill="white" fontSize="11"
                fontFamily="monospace" fontWeight="700">
                {degree}°
              </text>
            </svg>
          </div>
        )}

        {/* Frame counter bottom left */}
        {allLoaded && (
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            background: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, padding: '4px 10px',
            fontSize: 11, color: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'monospace',
            pointerEvents: 'none',
          }}>{frameIdx + 1} / {TOTAL}</div>
        )}

        {/* Car badge bottom center */}
        {allLoaded && (
          <div style={{
            position: 'absolute', bottom: 14, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(204,0,0,0.35)',
            borderRadius: 8, padding: '6px 18px',
            fontSize: 13, color: '#fff',
            backdropFilter: 'blur(10px)',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>Hyundai Grand i10 · TS27 1087 · 360° View</div>
        )}

        {/* Left / Right arrows */}
        {allLoaded && (
          <>
            {[{dir:-1,label:'‹',side:'left'}, {dir:1,label:'›',side:'right'}].map(({dir,label,side}) => (
              <button key={side}
                onClick={() => {
                  stopAuto()
                  frameF.current = ((frameF.current + dir) + TOTAL) % TOTAL
                  const idx = Math.round(frameF.current) % TOTAL
                  setFrameIdx(idx)
                  setDegree(Math.round((idx / TOTAL) * 360))
                }}
                style={{
                  position: 'absolute', top: '50%',
                  [side]: 12,
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', width: 42, height: 42,
                  borderRadius: '50%', cursor: 'pointer',
                  fontSize: 24, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(204,0,0,0.5)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.55)'
                }}
              >{label}</button>
            ))}
          </>
        )}
      </div>

      {/* Controls row below viewer */}
      {allLoaded && (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 14, marginTop: 16,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => {
              if (isAutoSpin) { stopAuto() }
              else {
                setIsAutoSpin(true)
                cancelAnimationFrame(rafId.current)
              }
            }}
            style={{
              background: isAutoSpin ? '#CC0000' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${isAutoSpin ? '#CC0000' : 'rgba(255,255,255,0.2)'}`,
              color: '#fff', padding: '9px 24px',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, fontSize: 14,
              letterSpacing: '0.06em',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
            }}>
            {isAutoSpin ? '⏸ Stop Spin' : '▶ Auto Spin'}
          </button>
          <span style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 13,
          }}>or drag the car to rotate</span>
        </div>
      )}

      {/* Dot strip (36 dots = full rotation) */}
      {allLoaded && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 3, marginTop: 14, flexWrap: 'wrap',
          maxWidth: 600, margin: '14px auto 0',
        }}>
          {Array.from({length: TOTAL}, (_, i) => (
            <div key={i}
              onClick={() => {
                stopAuto()
                frameF.current = i
                setFrameIdx(i)
                setDegree(Math.round((i / TOTAL) * 360))
              }}
              style={{
                width: i === frameIdx ? 14 : 5,
                height: 5, borderRadius: 3,
                background: i === frameIdx
                  ? '#CC0000' : 'rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>
      )}



    </div>
  )
}
