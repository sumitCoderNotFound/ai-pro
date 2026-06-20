import { useEffect, useRef, useState } from 'react'

/*
  CPU/browser avatar (Phase 14, prototype).
  - photoUrl set  -> shows the real interviewer photo with idle head sway and an
                     audio-reactive "speaking" overlay (equalizer + glow). Honest:
                     this is a speaking indicator + motion, not true lip shaping.
  - no photoUrl   -> a vector face with real blinking and mouth open/close driven
                     by the AI's audio amplitude.
  Drives motion from an optional Web Audio AnalyserNode connected to the AI audio.
*/
const STYLE = `
@keyframes av-sway { 0%,100%{transform:rotate(-1.2deg) translateY(0)} 50%{transform:rotate(1.2deg) translateY(-2px)} }
@keyframes av-sway-fast { 0%,100%{transform:rotate(-1.8deg) translateY(0)} 50%{transform:rotate(1.8deg) translateY(-3px)} }
.av-idle{ animation: av-sway 5s ease-in-out infinite; transform-origin:50% 80%; }
.av-talk{ animation: av-sway-fast 1.6s ease-in-out infinite; transform-origin:50% 80%; }
`

const AnimatedAvatar = ({ photoUrl, analyser, size = 220 }) => {
  const [speaking, setSpeaking] = useState(false)
  const [blink, setBlink] = useState(false)
  const mouthRef = useRef(null)
  const barsRef = useRef([])
  const glowRef = useRef(null)
  const rafRef = useRef(null)

  // Blink loop (vector face only).
  useEffect(() => {
    if (photoUrl) return
    let t
    const loop = () => {
      const next = 2500 + Math.random() * 3500
      t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 130); loop() }, next)
    }
    loop()
    return () => clearTimeout(t)
  }, [photoUrl])

  // Audio-reactive mouth / equalizer.
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let smooth = 0
    let aboveSince = 0
    const tick = () => {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      const level = Math.min(1, avg / 90)
      smooth = smooth * 0.6 + level * 0.4
      const isSpeaking = smooth > 0.12
      const now = performance.now()
      if (isSpeaking) aboveSince = now
      const stillSpeaking = now - aboveSince < 250
      setSpeaking((prev) => (prev !== stillSpeaking ? stillSpeaking : prev))

      if (mouthRef.current) {
        const open = 1 + smooth * 7
        mouthRef.current.setAttribute('ry', String(2 + smooth * 9))
        mouthRef.current.style.transform = `scaleY(${open / 3})`
      }
      barsRef.current.forEach((b, i) => {
        if (!b) return
        const h = 6 + smooth * 26 * (0.6 + 0.4 * Math.abs(Math.sin(now / 120 + i)))
        b.style.height = `${stillSpeaking ? h : 5}px`
      })
      if (glowRef.current) glowRef.current.style.opacity = String(stillSpeaking ? 0.35 + smooth * 0.4 : 0)
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [analyser])

  const stateLabel = speaking ? 'Speaking' : (analyser ? 'Listening' : 'Ready')

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size }}>
      <style>{STYLE}</style>

      {photoUrl ? (
        <div className="relative" style={{ width: size, height: size }}>
          <div ref={glowRef} className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 40px 10px rgba(99,102,241,0.6)', opacity: 0, transition: 'opacity .1s' }} />
          <img src={photoUrl} alt="Interviewer" className={speaking ? 'av-talk' : 'av-idle'}
            style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.5)' }} />
          {/* speaking equalizer near the chin */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-end gap-1" style={{ bottom: 6, height: 32 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} ref={(el) => (barsRef.current[i] = el)} style={{ width: 4, height: 5, background: '#6366f1', borderRadius: 2, transition: 'height .08s' }} />
            ))}
          </div>
        </div>
      ) : (
        <div className={speaking ? 'av-talk' : 'av-idle'}>
          <svg width={size} height={size} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="#1f2433" />
            <circle cx="100" cy="105" r="62" fill="#f1c9a5" />
            <path d="M44 78 Q100 18 156 78 L156 60 Q100 30 44 60 Z" fill="#3b3145" />
            {/* eyes */}
            <ellipse cx="78" cy="98" rx="9" ry={blink ? 1 : 9} fill="#2b2b2b" style={{ transition: 'ry .08s' }} />
            <ellipse cx="122" cy="98" rx="9" ry={blink ? 1 : 9} fill="#2b2b2b" style={{ transition: 'ry .08s' }} />
            {/* brows */}
            <rect x="68" y="80" width="22" height="4" rx="2" fill="#6b4f3a" />
            <rect x="110" y="80" width="22" height="4" rx="2" fill="#6b4f3a" />
            {/* mouth (audio-reactive) */}
            <ellipse ref={mouthRef} cx="100" cy="135" rx="20" ry="3" fill="#7a3b3b" style={{ transformOrigin: '100px 135px', transition: 'ry .06s' }} />
          </svg>
        </div>
      )}

      <span className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${speaking ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${speaking ? 'bg-primary-500' : 'bg-neutral-400'}`} style={{ animation: speaking ? 'av-sway 1s ease-in-out infinite' : 'none' }} />
        {stateLabel}
      </span>
    </div>
  )
}

export default AnimatedAvatar
