import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Room, RoomEvent, Track } from 'livekit-client'
import { publicInterviewApi } from '@/services/api'
import { Bot, ShieldCheck, AlertCircle, Send, CheckCircle2, Loader2, Mic, Keyboard, PhoneOff, Video } from 'lucide-react'
import AnimatedAvatar from '@/components/recruitment/AnimatedAvatar'
import AIInterviewerAvatar from '@/components/interview/AIInterviewerAvatar'
import SeatedInterviewer from '@/components/interview/SeatedInterviewer'
import ThreeAIInterviewer from '@/components/interview/ThreeAIInterviewer'

const Shell = ({ brand, children }) => (
  <div className="min-h-screen bg-neutral-50 flex flex-col">
    <div className="border-b border-neutral-200 bg-white">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-neutral-900">{brand || 'AI Interview'}</span>
      </div>
    </div>
    <div className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-8">{children}</div>
    </div>
  </div>
)

const DeviceLobby = ({ withVideo, onReady, onCancel }) => {
  const [micOk, setMicOk] = useState(false)
  const [camOk, setCamOk] = useState(false)
  const [error, setError] = useState('')
  const [level, setLevel] = useState(0)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const acRef = useRef(null)

  useEffect(() => {
    let stopped = false
    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo })
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        setMicOk(stream.getAudioTracks().length > 0)
        if (withVideo) {
          setCamOk(stream.getVideoTracks().length > 0)
          if (videoRef.current) videoRef.current.srcObject = stream
        }
        // mic level meter
        const AC = window.AudioContext || window.webkitAudioContext
        const ac = new AC(); acRef.current = ac
        const src = ac.createMediaStreamSource(stream)
        const analyser = ac.createAnalyser(); analyser.fftSize = 256
        src.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        const tick = () => {
          analyser.getByteFrequencyData(data)
          const avg = data.reduce((a, b) => a + b, 0) / data.length
          setLevel(Math.min(100, Math.round((avg / 140) * 100)))
          rafRef.current = requestAnimationFrame(tick)
        }
        tick()
      } catch (e) {
        setError(withVideo ? 'We could not access your camera and microphone. Check browser permissions.' : 'We could not access your microphone. Check browser permissions.')
      }
    })()
    return () => {
      stopped = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      try { acRef.current?.close() } catch { /* ignore */ }
      try { streamRef.current?.getTracks().forEach((t) => t.stop()) } catch { /* ignore */ }
    }
  }, [withVideo])

  const start = () => {
    // Release lobby devices so the interview can re-acquire them cleanly.
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    try { acRef.current?.close() } catch { /* ignore */ }
    try { streamRef.current?.getTracks().forEach((t) => t.stop()) } catch { /* ignore */ }
    onReady()
  }

  const ready = micOk && (!withVideo || camOk)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8">
      <h1 className="text-xl font-semibold text-neutral-900 mb-1">Device check</h1>
      <p className="text-neutral-500 mb-6">Let's make sure your {withVideo ? 'camera and microphone are' : 'microphone is'} working before you start.</p>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 mb-4"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}

      {withVideo && (
        <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-sm mx-auto aspect-video rounded-xl bg-neutral-900 object-cover mb-4" />
      )}

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${micOk ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
            {micOk ? <CheckCircle2 className="w-5 h-5" /> : <Mic className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-neutral-800">Microphone</div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-primary-500 transition-all" style={{ width: `${level}%` }} /></div>
          </div>
        </div>
        {withVideo && (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${camOk ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
              {camOk ? <CheckCircle2 className="w-5 h-5" /> : <Video className="w-4 h-4" />}
            </div>
            <div className="text-sm font-medium text-neutral-800">Camera</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="text-sm text-neutral-400 hover:text-neutral-600">Type instead</button>
        <button onClick={start} disabled={!ready} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
          {ready ? 'Start interview' : 'Waiting for devices…'}
        </button>
      </div>
    </div>
  )
}

const LANG_LABEL = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', hi: 'हिन्दी', pt: 'Português', it: 'Italiano', nl: 'Nederlands', ja: '日本語', zh: '中文', ar: 'العربية', ru: 'Русский' }

// If the 3D avatar (WebGL / Three) fails for any reason, fall back to the
// photo/seated avatar instead of crashing the whole interview screen.
class AvatarBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('[AvatarBoundary] 3D avatar failed, using fallback:', err?.message) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

const LiveInterview = ({ sessionToken, withVideo, avatarUrl, language, onSwitchToText, onDone }) => {
  const [status, setStatus] = useState('connecting') // connecting|connected|error|ending
  const [error, setError] = useState('')
  const [analyser, setAnalyser] = useState(null)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [candidateSpeaking, setCandidateSpeaking] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [lines, setLines] = useState([])           // best-effort transcript segments
  const [showTranscript, setShowTranscript] = useState(false)
  const [bgError, setBgError] = useState(false)
  const [seatedOk, setSeatedOk] = useState(true)   // false → fall back to centered avatar
  const [camTrack, setCamTrack] = useState(null)
  const [avatarSize, setAvatarSize] = useState(typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : 340)
  const roomRef = useRef(null)
  const audioContainerRef = useRef(null)
  const avatarAcRef = useRef(null)
  const localAnalyserRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false)
  const didInit = useRef(false)
  const connectedRef = useRef(false)
  const endingRef = useRef(false)

  useEffect(() => {
    const onResize = () => setAvatarSize(window.innerWidth < 640 ? 240 : 340)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (didInit.current) return // StrictMode runs effects twice in dev; only connect once
    didInit.current = true

    const room = new Room()
    roomRef.current = room

    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        const el = track.attach()
        el.autoplay = true
        audioContainerRef.current?.appendChild(el)
        // Build an analyser from the AI audio so the avatar can react to speech.
        try {
          const AC = window.AudioContext || window.webkitAudioContext
          const ac = new AC()
          const ms = new MediaStream([track.mediaStreamTrack])
          const srcNode = ac.createMediaStreamSource(ms)
          const an = ac.createAnalyser()
          an.fftSize = 256
          srcNode.connect(an)
          avatarAcRef.current = ac
          setAnalyser(an)
        } catch { /* analyser is optional */ }
      } else if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
        track.attach(remoteVideoRef.current)
        setHasRemoteVideo(true)
      }
    })
    room.on(RoomEvent.TrackUnsubscribed, (track) => { track.detach().forEach((el) => el.remove()) })

    // Best-effort: capture interviewer transcript if the worker publishes it.
    const pushLine = (role, text, final = true) => {
      if (!text) return
      setLines((prev) => {
        const next = [...prev]
        if (!final && next.length && next[next.length - 1].role === role && !next[next.length - 1].final) {
          next[next.length - 1] = { role, text, final }
        } else {
          next.push({ role, text, final })
        }
        return next.slice(-30)
      })
    }
    if (RoomEvent.TranscriptionReceived) {
      room.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        const role = participant?.isLocal ? 'candidate' : 'interviewer'
        segments?.forEach((s) => pushLine(role, s.text, s.final))
      })
    }
    room.on(RoomEvent.DataReceived, (payload) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload))
        if (msg && msg.text) pushLine(msg.role === 'candidate' ? 'candidate' : 'interviewer', msg.text, msg.final !== false)
      } catch { /* not transcript data */ }
    })

    room.on(RoomEvent.Disconnected, () => {
      if (endingRef.current) return
      if (connectedRef.current) { onDone() }
      else { setStatus('error'); setError('The interview service is not reachable right now.') }
    })

    ;(async () => {
      try {
        const { token, livekit_url } = await publicInterviewApi.voiceToken(sessionToken)
        await room.connect(livekit_url, token)
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        })
        // Analyser on the candidate's mic so the avatar can show a 'listening' state.
        try {
          const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone)
          if (micPub?.track) {
            const ac = avatarAcRef.current || new (window.AudioContext || window.webkitAudioContext)()
            avatarAcRef.current = ac
            const ms = new MediaStream([micPub.track.mediaStreamTrack])
            const an = ac.createAnalyser(); an.fftSize = 256
            ac.createMediaStreamSource(ms).connect(an)
            localAnalyserRef.current = an
          }
        } catch { /* optional */ }
        if (withVideo) {
          const pub = await room.localParticipant.setCameraEnabled(true)
          if (pub?.track) setCamTrack(pub.track)
        }
        connectedRef.current = true
        setStatus('connected')
      } catch (e) {
        setStatus('error')
        setError(e.message || 'Could not connect to the interview service.')
      }
    })()
  }, [sessionToken, onDone, withVideo])

  // Drive avatar states from AI + candidate audio levels.
  useEffect(() => {
    if (status !== 'connected') return
    let raf, thinkTimer
    const aiData = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
    let localData = null
    let prevAi = false
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
    const loop = () => {
      let ai = false, cand = false
      if (analyser && aiData) { analyser.getByteFrequencyData(aiData); ai = avg(aiData) > 12 }
      if (localAnalyserRef.current) {
        if (!localData) localData = new Uint8Array(localAnalyserRef.current.frequencyBinCount)
        localAnalyserRef.current.getByteFrequencyData(localData)
        cand = avg(localData) > 20
      }
      if (prevAi && !ai) { setThinking(true); clearTimeout(thinkTimer); thinkTimer = setTimeout(() => setThinking(false), 1300) }
      prevAi = ai
      setAiSpeaking((p) => (p !== ai ? ai : p))
      setCandidateSpeaking((p) => (p !== cand ? cand : p))
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); clearTimeout(thinkTimer) }
  }, [status, analyser])

  // Attach the candidate camera once the tile is actually on screen (it only
  // mounts after status === 'connected', so attaching during connect was too early).
  useEffect(() => {
    if (camTrack && localVideoRef.current) {
      try { camTrack.attach(localVideoRef.current) } catch { /* ignore */ }
    }
  }, [camTrack, status])

  const end = async () => {
    endingRef.current = true
    setStatus('ending')
    try { roomRef.current?.disconnect() } catch { /* ignore */ }
    await new Promise((r) => setTimeout(r, 4000))
    try { await publicInterviewApi.complete(sessionToken) } catch { /* ignore */ }
    onDone()
  }

  const switchToText = () => {
    endingRef.current = true
    try { roomRef.current?.disconnect() } catch { /* ignore */ }
    onSwitchToText()
  }

  const avatarState = status !== 'connected' ? 'idle'
    : aiSpeaking ? 'speaking'
    : thinking ? 'thinking'
    : candidateSpeaking ? 'listening'
    : 'idle'
  const statusLabel = status !== 'connected' ? 'Connecting'
    : aiSpeaking ? 'Speaking' : thinking ? 'Thinking' : candidateSpeaking ? 'Listening' : 'Connected'
  const instruction = aiSpeaking ? 'The interviewer is speaking…'
    : thinking ? 'Preparing the next question…'
    : 'Answer out loud, naturally.'

  const PILL = {
    Speaking: 'bg-indigo-500/20 text-indigo-200 ring-indigo-400/40',
    Listening: 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/40',
    Thinking: 'bg-amber-500/20 text-amber-200 ring-amber-400/40',
    Connected: 'bg-white/10 text-white/70 ring-white/20',
    Connecting: 'bg-white/10 text-white/70 ring-white/20',
  }

  const lastInterviewer = [...lines].reverse().find((l) => l.role === 'interviewer')?.text
  const transcriptText = lastInterviewer || instruction
  const langLabel = LANG_LABEL[language] || (language ? language.toUpperCase() : null)

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden"
      style={{ width: '100vw', height: '100vh', background: 'radial-gradient(1200px 600px at 50% 0%, #131a33 0%, #0b1020 55%, #080b18 100%)' }}>
      <div ref={audioContainerRef} className="hidden" />

      {/* Office/meeting-room background. Drop a file at:
          public/assets/interview/interview-room-bg.jpg
          If missing, the image hides itself and the gradient below shows. */}
      {!bgError && (
        <img src="/assets/interview/interview-room-bg.jpg" alt="" onError={() => setBgError(true)}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(3px) brightness(0.55)' }} />
      )}
      {/* warm light + dark overlay for readability */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(900px 520px at 38% 30%, rgba(255,196,140,0.10), transparent 62%), linear-gradient(to bottom, rgba(8,11,24,0.45), rgba(8,11,24,0.78))' }} />

      {/* 3D interviewer (rendered over the room background). Falls back to the photo/seated avatar if Three/WebGL fails. */}
      {status === 'connected' && (
        <div className="absolute inset-0 pointer-events-none flex items-end justify-center md:pr-72">
          <div style={{ width: 'min(78vw, 680px)', height: 'min(82vh, 760px)' }}>
            <AvatarBoundary fallback={<SeatedInterviewer state={avatarState} analyser={analyser} onMissing={() => setSeatedOk(false)} />}>
              <ThreeAIInterviewer avatarState={avatarState} analyser={analyser} />
            </AvatarBoundary>
          </div>
        </div>
      )}

      {/* bottom scrim so controls stay readable over the figure */}
      {status === 'connected' && (
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(8,11,24,0.85), transparent)' }} />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* top overlay */}
        <div className="flex items-center justify-between px-5 py-4 text-white/70">
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            AI Interview
          </div>
          <span className="text-xs text-white/40">{withVideo ? 'Camera & mic on' : 'Mic on'}</span>
        </div>

        {/* center stage */}
        <div className="flex-1 relative flex items-center justify-center px-4 md:pr-80 -mt-4">
          {status === 'connecting' && (
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-white/70 animate-spin mx-auto mb-4" />
              <p className="text-white/70">Connecting you to the AI interviewer…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="text-center max-w-sm">
              <AlertCircle className="w-9 h-9 text-amber-400 mx-auto mb-3" />
              <h1 className="text-lg font-semibold text-white mb-1">Interview unavailable</h1>
              <p className="text-white/60 mb-6">{error || 'The interview service is not reachable right now.'}</p>
              <button onClick={switchToText} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-xl hover:bg-white/90 font-medium">
                <Keyboard className="w-4 h-4" /> Switch to typing
              </button>
            </div>
          )}
          {status === 'ending' && (
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-white/70 animate-spin mx-auto mb-4" />
              <p className="text-white/70">Wrapping up…</p>
            </div>
          )}
          {status === 'connected' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ring-1 backdrop-blur-sm transition-colors ${PILL[statusLabel] || PILL.Connected}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {statusLabel}
              </div>
            </div>
          )}

          {/* right-side cards (desktop) */}
          {status === 'connected' && (
            <div className="hidden md:flex flex-col gap-3 absolute right-6 top-20 w-72">
              {/* transcript / question card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Interviewer</span>
                  {langLabel && <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white/70">{langLabel}</span>}
                </div>
                <p className="text-sm text-white/80 leading-relaxed min-h-[40px]">{transcriptText}</p>
                {lines.length > 0 && (
                  <>
                    <button onClick={() => setShowTranscript((v) => !v)} className="mt-2 text-xs text-white/50 hover:text-white/80">
                      {showTranscript ? 'Hide transcript' : 'Show transcript'}
                    </button>
                    {showTranscript && (
                      <div className="mt-2 max-h-40 overflow-y-auto space-y-1.5 border-t border-white/10 pt-2">
                        {lines.map((l, i) => (
                          <p key={i} className={`text-xs ${l.role === 'interviewer' ? 'text-white/80' : 'text-emerald-200/80'}`}>
                            <span className="opacity-60">{l.role === 'interviewer' ? 'AI' : 'You'}: </span>{l.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* bottom controls */}
        {status === 'connected' && (
          <div className="pb-8 flex flex-col items-center gap-3">
            <button onClick={end} className="inline-flex items-center gap-2 px-7 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium shadow-lg shadow-red-900/30">
              <PhoneOff className="w-5 h-5" /> End interview
            </button>
            <button onClick={switchToText} className="text-sm text-white/50 hover:text-white/80">Switch to typing instead</button>
          </div>
        )}
      </div>

      {/* candidate camera preview (floating, responsive) */}
      {withVideo && status === 'connected' && (
        <div className="absolute z-20" style={{ right: 24, bottom: 116 }}>
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-900 w-36 h-24 sm:w-52 sm:h-32">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!camTrack && (
              <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">Camera off</div>
            )}
            <span className="absolute bottom-1.5 left-2 text-[11px] text-white/90 bg-black/40 px-1.5 py-0.5 rounded">You</span>
          </div>
        </div>
      )}
    </div>
  )
}

const CandidateInterviewPage = () => {
  const { token } = useParams()
  const [phase, setPhase] = useState('loading') // loading|register|interview|finished|error|done
  const [invite, setInvite] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', consent_given: false })
  const [submitting, setSubmitting] = useState(false)

  const [sessionToken, setSessionToken] = useState(null)
  const [state, setState] = useState(null) // session state
  const [answer, setAnswer] = useState('')
  const [multi, setMulti] = useState([])
  const startedAt = useRef(Date.now())
  const [result, setResult] = useState(null)
  const [liveMode, setLiveMode] = useState('voice')
  const [prescreen, setPrescreen] = useState(null)
  const [psAnswers, setPsAnswers] = useState({})
  const [psMsg, setPsMsg] = useState('')
  const [docs, setDocs] = useState({ resume: null, cover_letter: null })
  const integrity = useRef({ tab_switches: 0, focus_loss: 0, paste_count: 0, copy_count: 0 })

  useEffect(() => {
    (async () => {
      try {
        const inv = await publicInterviewApi.getInvite(token)
        setInvite(inv)
        if (inv.already_completed || inv.status === 'completed') { setPhase('done'); setResult({ message: 'This interview has already been completed.' }) }
        else if (inv.status === 'revoked' || inv.status === 'expired') { setPhase('error'); setError('This invite link is no longer valid.') }
        else setPhase('register')
      } catch (err) { setPhase('error'); setError(err.message || 'Invite not found') }
    })()
  }, [token])

  // Integrity monitoring: track tab switches, focus loss, copy/paste during the interview.
  useEffect(() => {
    if (!sessionToken || (phase !== 'interview' && phase !== 'voice' && phase !== 'video')) return
    const report = () => { publicInterviewApi.riskSignals(sessionToken, integrity.current).catch(() => {}) }
    const onVis = () => { if (document.hidden) { integrity.current.tab_switches += 1; report() } }
    const onBlur = () => { integrity.current.focus_loss += 1; report() }
    const onPaste = () => { integrity.current.paste_count += 1; report() }
    const onCopy = () => { integrity.current.copy_count += 1; report() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('blur', onBlur)
    document.addEventListener('paste', onPaste)
    document.addEventListener('copy', onCopy)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('copy', onCopy)
    }
  }, [sessionToken, phase])

  const register = async (e) => {
    e.preventDefault(); setError('')
    if (!form.full_name.trim() || !form.email.trim()) { setError('Please enter your name and email.'); return }
    if (!form.consent_given) { setError('You must agree to continue.'); return }
    setSubmitting(true)
    try {
      const st = await publicInterviewApi.register(token, { ...form, language: invite.language })
      setSessionToken(st.session_token)
      startedAt.current = Date.now()
      // Best-effort document upload (resume / cover letter)
      for (const kind of ['resume', 'cover_letter']) {
        if (docs[kind]) {
          try { await publicInterviewApi.uploadDocument(st.session_token, docs[kind], kind) } catch { /* non-blocking */ }
        }
      }
      if (st.finished) { await finish(st.session_token) }
      else {
        setState(st)
        let ps = null
        try { ps = await publicInterviewApi.getPrescreen(token) } catch { ps = null }
        if (ps && ps.questions && ps.questions.length) {
          setPrescreen(ps.questions)
          setPhase('prescreen')
        } else {
          const voiceCapable = invite.mode && invite.mode !== 'text_practice'
          setPhase(voiceCapable ? 'choose' : 'interview')
        }
      }
    } catch (err) { setError(err.message || 'Could not start the interview') } finally { setSubmitting(false) }
  }

  const submitAnswer = async () => {
    const rt = state?.current_question?.response_type || 'text'
    let value = answer
    if (rt === 'multi_select') value = multi.join(', ')
    if (rt === 'info') value = '(acknowledged)'
    if (rt !== 'info' && (!value || !String(value).trim())) return
    setSubmitting(true); setError('')
    const duration = (Date.now() - startedAt.current) / 1000
    try {
      const st = await publicInterviewApi.submitAnswer(sessionToken, {
        question_id: state.current_question.id, transcript_text: String(value), duration_seconds: duration,
        risk_signals: integrity.current,
      })
      setAnswer(''); setMulti([])
      startedAt.current = Date.now()
      if (st.finished) { await finish(sessionToken) } else { setState(st) }
    } catch (err) { setError(err.message || 'Could not submit your answer') } finally { setSubmitting(false) }
  }

  const finish = async (st) => {
    try { setResult(await publicInterviewApi.getResult(st)) }
    catch { setResult({ message: 'Thank you. Your interview has been submitted.' }) }
    setPhase('finished')
  }

  if (phase === 'loading') {
    return <Shell><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div></Shell>
  }

  if (phase === 'error') {
    return <Shell><div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <h1 className="text-lg font-semibold text-neutral-900 mb-1">Can't open this interview</h1>
      <p className="text-neutral-500">{error}</p>
    </div></Shell>
  }

  if (phase === 'done' || phase === 'finished') {
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">All done</h1>
        <p className="text-neutral-600">{result?.message || 'Thank you for completing your interview.'}</p>
        <a href={`/candidate/status/${token}`} className="inline-block mt-5 text-sm text-primary-600 hover:text-primary-700 font-medium">Check your application status →</a>
        {result?.overall_score != null && (
          <div className="mt-6 inline-flex flex-col items-center">
            <div className="text-4xl font-bold text-neutral-900">{Math.round(result.overall_score)}<span className="text-xl text-neutral-400">/100</span></div>
            {result.recommendation && <span className="mt-1 text-sm text-neutral-500 capitalize">{result.recommendation}</span>}
            {result.summary && <p className="mt-3 text-sm text-neutral-500 max-w-sm">{result.summary}</p>}
          </div>
        )}
      </div>
    </Shell>
  }

  if (phase === 'register') {
    if (invite.attempts_remaining === 0) {
      return <Shell brand={invite?.brand_name}>
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-neutral-900 mb-1">No attempts remaining</h1>
          <p className="text-neutral-600">You've used all attempts for this interview. Please contact the hiring team if you think this is a mistake.</p>
        </div>
      </Shell>
    }
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">{invite.interview_name}</h1>
        {invite.expected_duration_minutes && <p className="text-neutral-500 mb-4">About {invite.expected_duration_minutes} minutes</p>}
        {invite.introduction && <p className="text-neutral-700 mb-4">{invite.introduction}</p>}

        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 mb-6">
          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{invite.ai_identity_disclosure}</span>
        </div>

        {(invite.attempts_remaining != null || invite.expires_at || invite.email_locked) && (
          <div className="flex flex-wrap gap-2 mb-6 text-xs">
            {invite.attempts_remaining != null && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
                {invite.attempts_remaining} {invite.attempts_remaining === 1 ? 'attempt' : 'attempts'} remaining
              </span>
            )}
            {invite.expires_at && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
                Closes {new Date(invite.expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {invite.email_locked && (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">Use the email this invite was sent to</span>
            )}
          </div>
        )}

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 mb-4"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}

        <form onSubmit={register} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Full name *</label>
              <input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Phone (optional)</label>
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Resume / CV (optional)</label>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setDocs((p) => ({ ...p, resume: e.target.files?.[0] || null }))}
                className="w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Cover letter (optional)</label>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setDocs((p) => ({ ...p, cover_letter: e.target.files?.[0] || null }))}
                className="w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer">
            <input type="checkbox" checked={form.consent_given} onChange={(e) => setForm((p) => ({ ...p, consent_given: e.target.checked }))} className="w-4 h-4 mt-0.5 accent-primary-600" />
            <span className="text-sm text-neutral-600 flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />{invite.consent_text}</span>
          </label>

          <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start interview'}
          </button>
        </form>
      </div>
    </Shell>
  }

  const submitPrescreen = async () => {
    setPsMsg('')
    const missing = (prescreen || []).some((q) => q.required && (psAnswers[q.id] === undefined || String(psAnswers[q.id]).trim() === ''))
    if (missing) { setPsMsg('Please answer all required questions.'); return }
    setSubmitting(true)
    try {
      const answers = Object.entries(psAnswers).map(([question_id, value]) => ({ question_id, value }))
      const res = await publicInterviewApi.submitPrescreen(sessionToken, answers)
      if (res.eligible) {
        const voiceCapable = invite.mode && invite.mode !== 'text_practice'
        setPhase(voiceCapable ? 'choose' : 'interview')
      } else {
        setResult({ message: res.message })
        setPhase('ineligible')
      }
    } catch (err) { setPsMsg(err.message || 'Could not submit your responses.') } finally { setSubmitting(false) }
  }

  if (phase === 'ineligible') {
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <CheckCircle2 className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">Thanks for your time</h1>
        <p className="text-neutral-600">{result?.message || "Based on your responses, this role isn't a match right now."}</p>
      </div>
    </Shell>
  }

  if (phase === 'prescreen') {
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">A few quick questions</h1>
        <p className="text-neutral-500 mb-6">Before we begin, please answer these eligibility questions.</p>
        {psMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm mb-4"><AlertCircle className="w-4 h-4 flex-shrink-0" />{psMsg}</div>}
        <div className="space-y-5">
          {(prescreen || []).map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-medium text-neutral-800 mb-2">{q.prompt}{q.required && <span className="text-red-500"> *</span>}</label>
              {q.qtype === 'yes_no' ? (
                <div className="flex gap-2">
                  {['Yes', 'No'].map((opt) => (
                    <button key={opt} onClick={() => setPsAnswers((p) => ({ ...p, [q.id]: opt.toLowerCase() }))}
                      className={`px-4 py-2 rounded-xl border text-sm ${psAnswers[q.id] === opt.toLowerCase() ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>{opt}</button>
                  ))}
                </div>
              ) : q.qtype === 'single_select' ? (
                <select value={psAnswers[q.id] || ''} onChange={(e) => setPsAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select…</option>
                  {(q.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : q.qtype === 'number' ? (
                <input type="number" value={psAnswers[q.id] ?? ''} onChange={(e) => setPsAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              ) : (
                <input value={psAnswers[q.id] || ''} onChange={(e) => setPsAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              )}
            </div>
          ))}
        </div>
        <button onClick={submitPrescreen} disabled={submitting} className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
          {submitting ? 'Checking…' : 'Continue'}
        </button>
      </div>
    </Shell>
  }

  if (phase === 'choose') {
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">How would you like to answer?</h1>
        <p className="text-neutral-500 mb-6">Speak with the AI interviewer, turn on your camera, or type.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <button onClick={() => { setLiveMode('voice'); setPhase('lobby') }} className="flex flex-col items-center gap-2 p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50">
            <Mic className="w-8 h-8 text-primary-600" />
            <span className="font-medium text-neutral-900">Voice</span>
            <span className="text-xs text-neutral-500">Speak, audio only</span>
          </button>
          <button onClick={() => { setLiveMode('video'); setPhase('lobby') }} className="flex flex-col items-center gap-2 p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50">
            <Video className="w-8 h-8 text-primary-600" />
            <span className="font-medium text-neutral-900">Video</span>
            <span className="text-xs text-neutral-500">Camera and mic on</span>
          </button>
          <button onClick={() => setPhase('interview')} className="flex flex-col items-center gap-2 p-6 border-2 border-neutral-200 rounded-2xl hover:border-neutral-400 hover:bg-neutral-50">
            <Keyboard className="w-8 h-8 text-neutral-600" />
            <span className="font-medium text-neutral-900">Type</span>
            <span className="text-xs text-neutral-500">Answer in writing</span>
          </button>
        </div>
      </div>
    </Shell>
  }

  if (phase === 'lobby') {
    return <Shell brand={invite?.brand_name}>
      <DeviceLobby withVideo={liveMode === 'video'} onReady={() => setPhase(liveMode)} onCancel={() => setPhase('interview')} />
    </Shell>
  }

  if (phase === 'voice' || phase === 'video') {
    return <Shell brand={invite?.brand_name}>
      <LiveInterview sessionToken={sessionToken} withVideo={phase === 'video'} avatarUrl={invite?.interviewer_avatar_url} language={invite?.language} onSwitchToText={() => setPhase('interview')} onDone={() => finish(sessionToken)} />
    </Shell>
  }

  // interview phase (text)
  const q = state?.current_question
  const progress = state ? Math.round(((state.current_question_index) / Math.max(state.total_questions, 1)) * 100) : 0
  return <Shell brand={invite?.brand_name}>
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
        <span>Question {Math.min(state.current_question_index + 1, state.total_questions)} of {state.total_questions}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden"><div className="h-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} /></div>
    </div>

    <div className="bg-white rounded-2xl border border-neutral-200 p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>
        <p className="text-lg text-neutral-900 pt-1">{q?.prompt_text}</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 mb-4"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}

      {(() => {
        const rt = q?.response_type || 'text'
        const opts = q?.options || []
        if (rt === 'yes_no') {
          return (
            <div className="flex gap-2">
              {['Yes', 'No'].map((o) => (
                <button key={o} onClick={() => setAnswer(o)} className={`px-5 py-2.5 rounded-xl border ${answer === o ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>{o}</button>
              ))}
            </div>
          )
        }
        if (rt === 'single_select') {
          return (
            <div className="space-y-2">
              {opts.map((o) => (
                <button key={o} onClick={() => setAnswer(o)} className={`w-full text-left px-4 py-3 rounded-xl border ${answer === o ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>{o}</button>
              ))}
            </div>
          )
        }
        if (rt === 'multi_select') {
          const toggle = (o) => setMulti((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o])
          return (
            <div className="space-y-2">
              {opts.map((o) => (
                <button key={o} onClick={() => toggle(o)} className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-2 ${multi.includes(o) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${multi.includes(o) ? 'bg-primary-600 border-primary-600' : 'border-neutral-400'}`}>{multi.includes(o) && <CheckCircle2 className="w-3 h-3 text-white" />}</span>{o}
                </button>
              ))}
            </div>
          )
        }
        if (rt === 'rating') {
          const scale = q?.scale || 5
          return (
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: scale }, (_, i) => String(i + 1)).map((n) => (
                <button key={n} onClick={() => setAnswer(n)} className={`w-12 h-12 rounded-xl border font-medium ${answer === n ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>{n}</button>
              ))}
            </div>
          )
        }
        if (rt === 'number') {
          return (
            <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter a number"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )
        }
        if (rt === 'info') {
          return <p className="text-sm text-neutral-500">Read the above, then continue.</p>
        }
        return (
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Type your answer…"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        )
      })()}

      <div className="flex justify-end mt-4">
        {(() => {
          const rt = q?.response_type || 'text'
          const canSubmit = rt === 'info' ? true : (rt === 'multi_select' ? multi.length > 0 : !!String(answer).trim())
          return (
            <button onClick={submitAnswer} disabled={submitting || !canSubmit} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> {rt === 'info' ? 'Continue' : 'Submit answer'}</>}
            </button>
          )
        })()}
      </div>
    </div>
    <p className="text-center text-xs text-neutral-400 mt-4">You're speaking with an AI interviewer. Your responses are assessed for this role, and the session is monitored for integrity.</p>
  </Shell>
}

export default CandidateInterviewPage
