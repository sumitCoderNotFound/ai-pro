import { useEffect, useRef, useState } from 'react'

/*
  SeatedInterviewer (Phase 14 UI)
  Renders a seated, transparent-background interviewer PNG composited into the
  room background (no circle, no crop). Lightweight CSS animation only.

  Asset (transparent background, seated, upper body):
    public/assets/interview/avatar-female-interviewer-seated.png

  This component is intentionally isolated so it can later be swapped for a
  real talking-avatar provider (Tavus / D-ID / HeyGen / MuseTalk): keep the same
  props (state, analyser) and replace the <img> with the provider's <video>.

  Props:
    state:    'idle' | 'listening' | 'speaking' | 'thinking' | 'smile' | 'nod'
    analyser: optional Web Audio AnalyserNode (AI audio) for a subtle speaking bounce
    src:      image url (defaults to the seated asset path)
    onMissing: called if the image fails to load, so the parent can fall back
*/
const STYLE = `
@keyframes si-breathe {0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-7px) scale(1.006)}}
@keyframes si-nod     {0%{transform:translateY(0) rotate(0)}30%{transform:translateY(7px) rotate(1.1deg)}65%{transform:translateY(-2px)}100%{transform:translateY(0) rotate(0)}}
@keyframes si-think   {0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(-1.1deg) translateY(-3px)}}
@keyframes si-glow    {0%,100%{opacity:.22;transform:scale(1)}50%{opacity:.45;transform:scale(1.06)}}
@keyframes si-glow-on {0%,100%{opacity:.45;transform:scale(1.04)}50%{opacity:.8;transform:scale(1.12)}}
.si-breathe{animation:si-breathe 5.5s ease-in-out infinite}
.si-think{animation:si-think 3.4s ease-in-out infinite}
.si-nod{animation:si-nod .95s ease-in-out}
`

const GLOW = { speaking: '#6366f1', listening: '#10b981', thinking: '#f59e0b', idle: '#6366f1', smile: '#6366f1', nod: '#6366f1' }

const SeatedInterviewer = ({ state = 'idle', analyser = null, onMissing,
  src = '/assets/interview/avatar-female-interviewer-seated.png' }) => {
  const imgRef = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)

  // Subtle speaking bounce driven by the AI audio amplitude.
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let smooth = 0
    const tick = () => {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      const level = Math.min(1, avg / 95)
      smooth = smooth * 0.7 + level * 0.3
      const speaking = state === 'speaking'
      if (imgRef.current) imgRef.current.style.transform = speaking ? `scale(${1 + smooth * 0.018}) translateY(${-smooth * 3}px)` : 'scale(1)'
      if (glowRef.current) glowRef.current.style.opacity = String(speaking ? 0.4 + smooth * 0.4 : '')
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [analyser, state])

  const wrapClass = state === 'thinking' ? 'si-think' : state === 'nod' ? 'si-nod' : 'si-breathe'
  const glowColor = GLOW[state] || GLOW.idle
  const glowAnim = state === 'speaking' ? 'si-glow-on 1.7s ease-in-out infinite' : 'si-glow 4s ease-in-out infinite'

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-center">
      <style>{STYLE}</style>
      {/* soft floor glow behind the figure */}
      <div ref={glowRef} className="absolute"
        style={{
          bottom: '4%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(46vw, 520px)', height: '40vh',
          background: `radial-gradient(ellipse at center, ${glowColor}55 0%, ${glowColor}00 70%)`,
          animation: glowAnim,
        }} />
      <div className={wrapClass} style={{ transformOrigin: '50% 100%', height: 'min(82vh, 760px)', display: 'flex', alignItems: 'flex-end' }}>
        <img ref={imgRef} src={src} alt="AI interviewer" onError={() => onMissing && onMissing()}
          style={{ height: '100%', width: 'auto', maxWidth: '90vw', objectFit: 'contain', transition: 'transform .08s linear', filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))' }} />
      </div>
    </div>
  )
}

export default SeatedInterviewer
