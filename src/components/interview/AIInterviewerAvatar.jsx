import { useEffect, useRef, useState } from 'react'

/*
  AIInterviewerAvatar (Phase 14 UI) - a clean, professional, semi-realistic
  female interviewer rendered in SVG with CSS animation. No external/paid API.

  Props:
    state:    'idle' | 'listening' | 'speaking' | 'thinking' | 'smile' | 'nod'
    analyser: optional Web Audio AnalyserNode (AI audio) to drive mouth movement
    photoUrl: optional real photo; if set, shows the photo with motion + glow
    size:     px

  Honest note: with a real photo the mouth can't be shaped, so it shows motion +
  a speaking glow/equalizer. The SVG face does real blink + mouth open/close.
*/

const STYLE = `
@keyframes aii-sway      {0%,100%{transform:rotate(-1deg) translateY(0)}50%{transform:rotate(1deg) translateY(-1px)}}
@keyframes aii-sway-fast {0%,100%{transform:rotate(-1.6deg) translateY(0)}50%{transform:rotate(1.6deg) translateY(-3px)}}
@keyframes aii-tilt      {0%,100%{transform:rotate(0)}50%{transform:rotate(-3deg) translateY(1px)}}
@keyframes aii-nod       {0%{transform:translateY(0)}30%{transform:translateY(8px) rotate(2deg)}65%{transform:translateY(-2px)}100%{transform:translateY(0)}}
@keyframes aii-glow      {0%,100%{opacity:.30;transform:scale(1)}50%{opacity:.6;transform:scale(1.05)}}
@keyframes aii-glow-strong{0%,100%{opacity:.55;transform:scale(1.03)}50%{opacity:.95;transform:scale(1.09)}}
@keyframes aii-dot       {0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1}}
.aii-idle{animation:aii-sway 5.5s ease-in-out infinite}
.aii-listen{animation:aii-sway 4s ease-in-out infinite}
.aii-speak{animation:aii-sway-fast 2.1s ease-in-out infinite}
.aii-think{animation:aii-tilt 3.2s ease-in-out infinite}
.aii-nod{animation:aii-nod .9s ease-in-out}
`

const GLOW = {
  speaking: '#6366f1', listening: '#10b981', thinking: '#f59e0b',
  smile: '#6366f1', nod: '#6366f1', idle: '#6366f1',
}

const AIInterviewerAvatar = ({ state = 'idle', analyser = null, photoUrl = null, size = 320,
  // Drop a real headshot here later: public/assets/interview/avatar-female-interviewer.png
  defaultImage = '/assets/interview/avatar-female-interviewer.png' }) => {
  const [blink, setBlink] = useState(false)
  const [imgError, setImgError] = useState(false)
  const mouthRef = useRef(null)
  const barsRef = useRef([])
  const rafRef = useRef(null)

  const imageSrc = photoUrl || defaultImage
  const usePhoto = !!imageSrc && !imgError

  // Blink loop
  useEffect(() => {
    let t
    const loop = () => {
      t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 120); loop() }, 2400 + Math.random() * 3200)
    }
    loop()
    return () => clearTimeout(t)
  }, [])

  // Audio-reactive mouth / equalizer
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let smooth = 0
    const tick = () => {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      const level = Math.min(1, avg / 90)
      smooth = smooth * 0.6 + level * 0.4
      const speaking = state === 'speaking'
      if (mouthRef.current) mouthRef.current.setAttribute('ry', String(speaking ? 2 + smooth * 12 : 1.5))
      barsRef.current.forEach((b, i) => {
        if (!b) return
        const h = 5 + smooth * 26 * (0.55 + 0.45 * Math.abs(Math.sin(performance.now() / 130 + i)))
        b.style.height = `${speaking ? h : 4}px`
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [analyser, state])

  const headClass = state === 'speaking' ? 'aii-speak'
    : state === 'thinking' ? 'aii-think'
    : state === 'nod' ? 'aii-nod'
    : state === 'listening' ? 'aii-listen' : 'aii-idle'
  const glowColor = GLOW[state] || GLOW.idle
  const glowAnim = state === 'speaking' ? 'aii-glow-strong 1.6s ease-in-out infinite' : 'aii-glow 3.5s ease-in-out infinite'
  const mouthSmile = state === 'smile' || state === 'nod'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <style>{STYLE}</style>

      {/* glow ring */}
      <div className="absolute rounded-full" style={{
        width: size * 0.82, height: size * 0.82,
        background: `radial-gradient(circle, ${glowColor}66 0%, ${glowColor}00 70%)`,
        animation: glowAnim,
      }} />

      {usePhoto ? (
        <div className="relative" style={{ width: size * 0.78, height: size * 0.78 }}>
          <img src={imageSrc} alt="Interviewer" onError={() => setImgError(true)} className={headClass}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.35)', transformOrigin: '50% 85%' }} />
          <div className="absolute left-1/2 -translate-x-1/2 flex items-end gap-1" style={{ bottom: 8, height: 30 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} ref={(el) => (barsRef.current[i] = el)} style={{ width: 4, height: 4, background: glowColor, borderRadius: 2, transition: 'height .08s' }} />
            ))}
          </div>
        </div>
      ) : (
        <svg className={headClass} width={size} height={size} viewBox="0 0 280 300" style={{ transformOrigin: '50% 88%' }}>
          <defs>
            <radialGradient id="aii-skin" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#f2c6a0" />
              <stop offset="100%" stopColor="#dca47a" />
            </radialGradient>
            <linearGradient id="aii-hair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a4031" />
              <stop offset="100%" stopColor="#3a2820" />
            </linearGradient>
            <linearGradient id="aii-blazer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a3658" />
              <stop offset="100%" stopColor="#1d2742" />
            </linearGradient>
          </defs>

          {/* shoulders / blazer */}
          <path d="M40 300 Q40 232 92 214 L188 214 Q240 232 240 300 Z" fill="url(#aii-blazer)" />
          <path d="M120 214 L140 250 L160 214 Z" fill="#eef1f6" />
          <path d="M120 214 L140 250 L160 214 L150 214 L140 238 L130 214 Z" fill="#cdd3df" />
          {/* neck */}
          <path d="M118 196 Q118 224 140 226 Q162 224 162 196 Z" fill="#dca47a" />
          {/* hair back */}
          <path d="M70 120 Q70 40 140 40 Q210 40 210 120 L210 210 Q196 188 188 196 L188 120 Q188 96 140 96 Q92 96 92 120 L92 196 Q84 188 70 210 Z" fill="url(#aii-hair)" />
          {/* face */}
          <path d="M92 116 Q92 70 140 70 Q188 70 188 116 Q188 176 140 196 Q92 176 92 116 Z" fill="url(#aii-skin)" />
          {/* ears + studs */}
          <ellipse cx="92" cy="132" rx="8" ry="12" fill="#dca47a" />
          <ellipse cx="188" cy="132" rx="8" ry="12" fill="#dca47a" />
          <circle cx="92" cy="144" r="2.4" fill="#e6e8ee" />
          <circle cx="188" cy="144" r="2.4" fill="#e6e8ee" />
          {/* hair front fringe */}
          <path d="M92 116 Q96 84 140 84 Q184 84 188 116 Q170 100 140 100 Q110 100 92 116 Z" fill="url(#aii-hair)" />
          {/* eyebrows */}
          <path d="M104 120 Q116 113 128 119" stroke="#4a3528" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M152 119 Q164 113 176 120" stroke="#4a3528" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* eyes */}
          <g>
            <ellipse cx="116" cy="134" rx="11" ry="7" fill="#ffffff" />
            <ellipse cx="164" cy="134" rx="11" ry="7" fill="#ffffff" />
            <circle cx={state === 'thinking' ? 113 : 116} cy={state === 'thinking' ? 131 : 134} r="4.6" fill="#5b3b2a" style={{ transition: 'all .4s' }} />
            <circle cx={state === 'thinking' ? 161 : 164} cy={state === 'thinking' ? 131 : 134} r="4.6" fill="#5b3b2a" style={{ transition: 'all .4s' }} />
            <circle cx={state === 'thinking' ? 113 : 116} cy={state === 'thinking' ? 131 : 134} r="2" fill="#2a1d14" style={{ transition: 'all .4s' }} />
            <circle cx={state === 'thinking' ? 161 : 164} cy={state === 'thinking' ? 131 : 134} r="2" fill="#2a1d14" style={{ transition: 'all .4s' }} />
            {/* eyelids (blink) */}
            <ellipse cx="116" cy="134" rx="12" ry={blink ? 7 : 0.5} fill="url(#aii-skin)" style={{ transition: 'ry .09s' }} />
            <ellipse cx="164" cy="134" rx="12" ry={blink ? 7 : 0.5} fill="url(#aii-skin)" style={{ transition: 'ry .09s' }} />
          </g>
          {/* nose */}
          <path d="M140 138 Q136 152 140 156 Q144 156 144 154" stroke="#c79068" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* cheeks */}
          <ellipse cx="112" cy="158" rx="9" ry="5" fill="#e8a98a" opacity="0.45" />
          <ellipse cx="168" cy="158" rx="9" ry="5" fill="#e8a98a" opacity="0.45" />
          {/* mouth */}
          {mouthSmile ? (
            <path d="M124 168 Q140 184 156 168 Q140 176 124 168 Z" fill="#b9685e" />
          ) : (
            <>
              <path d="M124 170 Q140 176 156 170" stroke="#9e5247" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <ellipse ref={mouthRef} cx="140" cy="172" rx="11" ry="1.5" fill="#7a3b3b" style={{ transition: 'ry .06s' }} />
              <path d="M124 170 Q140 164 156 170" stroke="#c47a6d" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* thinking dots */}
          {state === 'thinking' && (
            <g>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={196 + i * 12} cy="96" r="3.5" fill="#f59e0b" style={{ animation: `aii-dot 1s ${i * 0.18}s ease-in-out infinite` }} />
              ))}
            </g>
          )}
        </svg>
      )}
    </div>
  )
}

export default AIInterviewerAvatar
