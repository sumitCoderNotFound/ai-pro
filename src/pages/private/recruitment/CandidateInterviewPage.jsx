import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Room, RoomEvent, Track } from 'livekit-client'
import { publicInterviewApi } from '@/services/api'
import { Bot, ShieldCheck, AlertCircle, Send, CheckCircle2, Loader2, Mic, Keyboard, PhoneOff } from 'lucide-react'

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

const VoiceInterview = ({ sessionToken, onSwitchToText, onDone }) => {
  const [status, setStatus] = useState('connecting') // connecting|connected|error|ending
  const [error, setError] = useState('')
  const roomRef = useRef(null)
  const audioContainerRef = useRef(null)
  const didInit = useRef(false)
  const connectedRef = useRef(false)
  const endingRef = useRef(false)

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
      }
    })
    room.on(RoomEvent.TrackUnsubscribed, (track) => { track.detach().forEach((el) => el.remove()) })
    room.on(RoomEvent.Disconnected, () => {
      if (endingRef.current) return
      // A disconnect AFTER we were connected means the interview ended (or the worker left):
      // send the candidate to their completion screen rather than an error.
      if (connectedRef.current) { onDone() }
      else { setStatus('error'); setError('The voice service is not reachable right now.') }
    })

    ;(async () => {
      try {
        const { token, livekit_url } = await publicInterviewApi.voiceToken(sessionToken)
        await room.connect(livekit_url, token)
        await room.localParticipant.setMicrophoneEnabled(true)
        connectedRef.current = true
        setStatus('connected')
      } catch (e) {
        setStatus('error')
        setError(e.message || 'Could not connect to the voice service.')
      }
    })()
    // Intentionally no disconnect in cleanup: that is what cut audio under StrictMode.
    // We disconnect explicitly on End / Switch to typing.
  }, [sessionToken, onDone])

  const end = async () => {
    endingRef.current = true
    setStatus('ending')
    try { roomRef.current?.disconnect() } catch { /* ignore */ }
    // Give the voice worker a few seconds to post the captured answers and finalize
    // the session before we complete it as a safety net (completing too early would
    // drop answers still in flight).
    await new Promise((r) => setTimeout(r, 4000))
    try { await publicInterviewApi.complete(sessionToken) } catch { /* ignore */ }
    onDone()
  }

  const switchToText = () => {
    endingRef.current = true
    try { roomRef.current?.disconnect() } catch { /* ignore */ }
    onSwitchToText()
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
      <div ref={audioContainerRef} className="hidden" />
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
        <Mic className="w-8 h-8 text-white" />
      </div>

      {status === 'connecting' && (
        <>
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-600">Connecting you to the AI interviewer…</p>
        </>
      )}
      {status === 'connected' && (
        <>
          <h1 className="text-lg font-semibold text-neutral-900 mb-1">You're connected</h1>
          <p className="text-neutral-600">The AI interviewer is speaking. Answer out loud, naturally. Your microphone is on.</p>
          <button onClick={end} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium">
            <PhoneOff className="w-4 h-4" /> End interview
          </button>
          <button onClick={switchToText} className="mt-3 block mx-auto text-sm text-neutral-400 hover:text-neutral-600">Switch to typing instead</button>
        </>
      )}
      {status === 'ending' && (
        <>
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-600">Wrapping up…</p>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-neutral-900 mb-1">Voice unavailable</h1>
          <p className="text-neutral-600">{error || 'The voice service is not reachable right now.'}</p>
          <button onClick={switchToText} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
            <Keyboard className="w-4 h-4" /> Switch to typing
          </button>
        </>
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
  const startedAt = useRef(Date.now())
  const [result, setResult] = useState(null)
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
    if (!sessionToken || (phase !== 'interview' && phase !== 'voice')) return
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
      if (st.finished) { await finish(st.session_token) }
      else {
        setState(st)
        const voiceCapable = invite.mode && invite.mode !== 'text_practice'
        setPhase(voiceCapable ? 'choose' : 'interview')
      }
    } catch (err) { setError(err.message || 'Could not start the interview') } finally { setSubmitting(false) }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    setSubmitting(true); setError('')
    const duration = (Date.now() - startedAt.current) / 1000
    try {
      const st = await publicInterviewApi.submitAnswer(sessionToken, {
        question_id: state.current_question.id, transcript_text: answer, duration_seconds: duration,
        risk_signals: integrity.current,
      })
      setAnswer('')
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
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">{invite.interview_name}</h1>
        {invite.expected_duration_minutes && <p className="text-neutral-500 mb-4">About {invite.expected_duration_minutes} minutes</p>}
        {invite.introduction && <p className="text-neutral-700 mb-4">{invite.introduction}</p>}

        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 mb-6">
          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{invite.ai_identity_disclosure}</span>
        </div>

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

  if (phase === 'choose') {
    return <Shell brand={invite?.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">How would you like to answer?</h1>
        <p className="text-neutral-500 mb-6">You can speak with the AI interviewer, or type your answers.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => setPhase('voice')} className="flex flex-col items-center gap-2 p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50">
            <Mic className="w-8 h-8 text-primary-600" />
            <span className="font-medium text-neutral-900">Voice</span>
            <span className="text-xs text-neutral-500">Speak with the AI interviewer</span>
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

  if (phase === 'voice') {
    return <Shell brand={invite?.brand_name}>
      <VoiceInterview sessionToken={sessionToken} onSwitchToText={() => setPhase('interview')} onDone={() => finish(sessionToken)} />
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

      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Type your answer…"
        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />

      <div className="flex justify-end mt-4">
        <button onClick={submitAnswer} disabled={submitting || !answer.trim()} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit answer</>}
        </button>
      </div>
    </div>
    <p className="text-center text-xs text-neutral-400 mt-4">You're speaking with an AI interviewer. Your responses are assessed for this role, and the session is monitored for integrity.</p>
  </Shell>
}

export default CandidateInterviewPage
