import { useState, useEffect } from 'react'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  AlertCircle, X, BarChart3, RefreshCw, ShieldAlert, ChevronRight, FileText, Award, Download,
} from 'lucide-react'

const STATUS_STYLE = {
  created: 'bg-neutral-100 text-neutral-600',
  consented: 'bg-neutral-100 text-neutral-600',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  abandoned: 'bg-red-100 text-red-700',
}
const REC_STYLE = {
  strong: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  weak: 'bg-red-100 text-red-700',
  insufficient: 'bg-neutral-100 text-neutral-500',
}
const RISK_LABEL = {
  tab_switches: 'Tab switches',
  focus_loss: 'Lost focus',
  paste_count: 'Pastes',
  copy_count: 'Copies',
  very_short_answers: 'Avg words/answer',
  implausibly_fast_answers: 'Very fast answers',
  no_answers: 'No answers',
  knockout: 'Knockout triggered',
}

const ScoreBadge = ({ score }) => {
  if (!score || score.overall_score == null) return <span className="text-xs text-neutral-400">—</span>
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
      <Award className="w-4 h-4 text-primary-500" />{Math.round(score.overall_score)}
    </span>
  )
}

const SessionDrawer = ({ session, candidateName, onClose, onError }) => {
  const [detail, setDetail] = useState(null)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rescoring, setRescoring] = useState(false)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [speech, setSpeech] = useState(null)
  const [reviewForm, setReviewForm] = useState({ override_recommendation: '', override_score: '', note: '' })
  const [savingReview, setSavingReview] = useState(false)

  const loadReviews = async () => {
    try { setReviews(await recruitmentApi.sessions.reviews(session.id)) } catch { /* ignore */ }
  }

  const submitReview = async () => {
    const f = reviewForm
    if (!f.override_recommendation && !f.override_score && !f.note.trim()) return
    setSavingReview(true)
    try {
      await recruitmentApi.sessions.addReview(session.id, {
        override_recommendation: f.override_recommendation || null,
        override_score: f.override_score ? Number(f.override_score) : null,
        note: f.note || null,
      })
      setReviewForm({ override_recommendation: '', override_score: '', note: '' })
      await loadReviews()
    } catch (err) { onError(err.message) } finally { setSavingReview(false) }
  }

  const loadDocs = async () => {
    if (!session.candidate_id) return
    try { setDocuments(await recruitmentApi.candidates.documents(session.candidate_id)) } catch { /* ignore */ }
  }

  const load = async () => {
    try {
      setLoading(true)
      const d = await recruitmentApi.sessions.get(session.id)
      setDetail(d)
      try { setScore(await recruitmentApi.sessions.getScore(session.id)) } catch { setScore(null) }
      await loadDocs()
      await loadReviews()
      try { setSpeech(await recruitmentApi.sessions.speechAnalytics(session.id)) } catch { setSpeech(null) }
    } catch (err) { onError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [session])

  const uploadDoc = async (e, kind) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { await recruitmentApi.candidates.uploadDocument(session.candidate_id, file, kind); await loadDocs() }
    catch (err) { onError(err.message) } finally { setUploading(false); e.target.value = '' }
  }

  const downloadDoc = async (doc) => {
    try {
      const blob = await recruitmentApi.candidates.downloadDocument(doc.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = doc.filename
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
    } catch (err) { onError(err.message) }
  }

  const rescore = async () => {
    setRescoring(true)
    try { setScore(await recruitmentApi.sessions.rescore(session.id)) }
    catch (err) { onError(err.message) } finally { setRescoring(false) }
  }

  const downloadReport = async () => {
    try {
      const blob = await recruitmentApi.sessions.downloadReport(session.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interview_report_${(candidateName || 'candidate').replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
    } catch (err) { onError(err.message) }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">{candidateName || 'Candidate'}</h2>
            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[session.status] || STATUS_STYLE.created}`}>{session.status.replace('_', ' ')}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-600" /></div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Score summary */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-neutral-900">Score</h3>
                <div className="flex items-center gap-2">
                  <button onClick={downloadReport} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50">
                    <Download className="w-3.5 h-3.5" /> Report
                  </button>
                  <button onClick={rescore} disabled={rescoring} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">
                    <RefreshCw className={`w-3.5 h-3.5 ${rescoring ? 'animate-spin' : ''}`} /> Re-run scoring
                  </button>
                </div>
              </div>
              {!score ? (
                <p className="text-sm text-neutral-500">Not scored yet. If you've just added an AI key, click Re-run scoring.</p>
              ) : score.status !== 'completed' ? (
                <p className="text-sm text-amber-700">Scoring {score.status}. {score.error || 'Add an AI provider key and re-run.'}</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-neutral-900">{Math.round(score.overall_score)}<span className="text-lg text-neutral-400">/100</span></div>
                    {score.recommendation && <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${REC_STYLE[score.recommendation]}`}>{score.recommendation}</span>}
                    {score.needs_human_review && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><ShieldAlert className="w-3.5 h-3.5" />review</span>}
                  </div>
                  {score.risk_level && score.risk_level !== 'low' && score.risk_signals && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800 mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Integrity risk: {score.risk_level}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-700">
                        {Object.entries(score.risk_signals).map(([k, v]) => (
                          <span key={k}>{RISK_LABEL[k] || k.replace(/_/g, ' ')}: <strong>{String(v)}</strong></span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(() => {
                    const cs = (score.criterion_scores || []).filter((c) => c.raw_score != null)
                    if (!cs.length) return null
                    const sorted = [...cs].sort((a, b) => b.raw_score - a.raw_score)
                    let strengths = sorted.filter((c) => c.raw_score >= 60).slice(0, 3)
                    let concerns = [...sorted].reverse().filter((c) => c.raw_score < 60).slice(0, 3)
                    if (!strengths.length) strengths = sorted.slice(0, 3)
                    return (
                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div className="rounded-lg bg-green-50 border border-green-100 p-3">
                          <div className="text-xs font-semibold text-green-700 mb-1.5">Key strengths</div>
                          {strengths.length ? strengths.map((c) => (
                            <div key={c.id} className="text-xs text-neutral-700 mb-1">{c.criterion_name} <span className="text-neutral-400">({Math.round(c.raw_score)})</span></div>
                          )) : <div className="text-xs text-neutral-400">—</div>}
                        </div>
                        <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                          <div className="text-xs font-semibold text-amber-700 mb-1.5">Areas to probe</div>
                          {concerns.length ? concerns.map((c) => (
                            <div key={c.id} className="text-xs text-neutral-700 mb-1">{c.criterion_name} <span className="text-neutral-400">({Math.round(c.raw_score)})</span></div>
                          )) : <div className="text-xs text-neutral-400">None flagged</div>}
                        </div>
                      </div>
                    )
                  })()}
                  <div className="space-y-2">
                    {(score.criterion_scores || []).map((c) => (
                      <div key={c.id} className="border border-neutral-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-800">{c.criterion_name}</span>
                          <span className="text-sm text-neutral-600">{Math.round(c.raw_score)} <span className="text-neutral-400">× {c.weight}%</span></span>
                        </div>
                        {c.evidence && <p className="text-xs text-neutral-500 mt-1"><span className="font-medium text-neutral-600">Evidence:</span> {c.evidence}</p>}
                        {c.reasoning && <p className="text-xs text-neutral-500 mt-0.5">{c.reasoning}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery & sentiment (advisory) */}
            {speech && speech.total_words > 0 && (
              <div className="rounded-xl border border-neutral-200 p-4">
                <h3 className="text-sm font-medium text-neutral-900 mb-3">Delivery &amp; sentiment <span className="text-xs font-normal text-neutral-400">advisory</span></h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div><div className="text-lg font-semibold text-neutral-900">{speech.words_per_minute ?? '—'}</div><div className="text-xs text-neutral-400">words/min</div></div>
                  <div><div className="text-lg font-semibold text-neutral-900 capitalize">{speech.pace_label}</div><div className="text-xs text-neutral-400">pace</div></div>
                  <div><div className="text-lg font-semibold text-neutral-900">{speech.filler_count}</div><div className="text-xs text-neutral-400">filler words</div></div>
                  <div><div className={`text-lg font-semibold capitalize ${speech.sentiment_label === 'positive' ? 'text-green-600' : speech.sentiment_label === 'negative' ? 'text-amber-600' : 'text-neutral-900'}`}>{speech.sentiment_label}</div><div className="text-xs text-neutral-400">tone</div></div>
                </div>
                <p className="text-xs text-neutral-400 mt-3">Advisory only. These signals should not by themselves drive a hiring decision.</p>
              </div>
            )}

            {/* Human review / override */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-neutral-400" /> Human review</h3>
              {reviews.length > 0 && (
                <div className="mb-3 space-y-2">
                  {reviews.map((r) => (
                    <div key={r.id} className="text-xs border border-neutral-100 rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        {r.override_recommendation && <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium capitalize">{r.override_recommendation}</span>}
                        {r.override_score != null && <span className="text-neutral-600">{Math.round(r.override_score)}/100</span>}
                        <span className="text-neutral-400 ml-auto">{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                      {r.note && <p className="text-neutral-600 mt-1">{r.note}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select value={reviewForm.override_recommendation} onChange={(e) => setReviewForm((p) => ({ ...p, override_recommendation: e.target.value }))}
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Override recommendation…</option>
                    <option value="strong">Strong</option>
                    <option value="moderate">Moderate</option>
                    <option value="weak">Weak</option>
                    <option value="insufficient">Insufficient</option>
                  </select>
                  <input type="number" min={0} max={100} value={reviewForm.override_score} onChange={(e) => setReviewForm((p) => ({ ...p, override_score: e.target.value }))}
                    placeholder="Override score (optional)" className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <textarea value={reviewForm.note} onChange={(e) => setReviewForm((p) => ({ ...p, note: e.target.value }))} rows={2}
                  placeholder="Reviewer note / rationale" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <div className="flex justify-end">
                  <button onClick={submitReview} disabled={savingReview} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{savingReview ? 'Saving…' : 'Record review'}</button>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-neutral-900 flex items-center gap-2"><FileText className="w-4 h-4 text-neutral-400" /> Documents</h3>
                <label className="text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 cursor-pointer">
                  {uploading ? 'Uploading…' : '+ Resume'}
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" disabled={uploading} onChange={(e) => uploadDoc(e, 'resume')} />
                </label>
              </div>
              {documents.length === 0 ? (
                <p className="text-sm text-neutral-400">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((d) => (
                    <button key={d.id} onClick={() => downloadDoc(d)} className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                      <span className="text-sm text-neutral-800 truncate">{d.filename}</span>
                      <span className="text-xs text-neutral-400 capitalize ml-2 flex-shrink-0">{d.kind.replace('_', ' ')} · {Math.max(1, Math.round((d.size || 0) / 1024))} KB</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transcript */}
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-neutral-400" /> Transcript</h3>
              <div className="space-y-3">
                {(detail?.answers || []).length === 0 ? (
                  <p className="text-sm text-neutral-500">No answers recorded.</p>
                ) : (detail.answers).map((a) => (
                  <div key={a.id} className="border border-neutral-100 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-1">{a.question_text_snapshot}</p>
                    <p className="text-sm text-neutral-800">{a.transcript_text || '(no answer)'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ResultsPage = () => {
  const [sessions, setSessions] = useState([])
  const [scoresById, setScoresById] = useState({})
  const [candidates, setCandidates] = useState({})
  const [interviews, setInterviews] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawer, setDrawer] = useState(null)

  const load = async () => {
    try {
      setLoading(true); setError('')
      const [s, c, iv] = await Promise.all([
        recruitmentApi.sessions.list(),
        recruitmentApi.candidates.list({ page_size: 100 }),
        recruitmentApi.interviews.list({ page_size: 100 }),
      ])
      const sess = s || []
      setSessions(sess)
      const cmap = {}; (c.items || []).forEach((x) => { cmap[x.id] = x.full_name || x.email || 'Candidate' })
      setCandidates(cmap)
      const vmap = {}; (iv.items || []).forEach((t) => (t.versions || []).forEach((v) => { vmap[v.id] = t.name }))
      setInterviews(vmap)
      // fetch scores for completed sessions
      const entries = await Promise.all(sess.filter((x) => x.status === 'completed').map(async (x) => {
        try { return [x.id, await recruitmentApi.sessions.getScore(x.id)] } catch { return [x.id, null] }
      }))
      setScoresById(Object.fromEntries(entries))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Interview Results</h1>
        <p className="text-neutral-500">Completed and in-progress candidate interviews, with scores and transcripts</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : sessions.length === 0 ? (
        <EmptyState
          emoji="📊" variant="calls" title="No interview results yet"
          description="Once you invite candidates and they complete an interview, their scored results show up here."
          tips={['Open an interview, publish it, then use Invite to generate a candidate link.', 'Scores need an AI provider key — without one, results land as “needs review” and you can re-run scoring.']}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs font-medium text-neutral-400 border-b border-neutral-100">
            <div className="col-span-4">Candidate</div>
            <div className="col-span-4">Interview</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Score</div>
          </div>
          {sessions.map((s) => (
            <button key={s.id} onClick={() => setDrawer(s)} className="w-full grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-neutral-50 border-b border-neutral-50 text-left">
              <div className="col-span-4 font-medium text-neutral-900 truncate">{candidates[s.candidate_id] || 'Candidate'}</div>
              <div className="col-span-4 text-sm text-neutral-600 truncate">{interviews[s.version_id] || '—'}</div>
              <div className="col-span-2"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[s.status] || STATUS_STYLE.created}`}>{s.status.replace('_', ' ')}</span></div>
              <div className="col-span-2 flex items-center justify-end gap-2"><ScoreBadge score={scoresById[s.id]} /><ChevronRight className="w-4 h-4 text-neutral-300" /></div>
            </button>
          ))}
        </div>
      )}

      {drawer && <SessionDrawer session={drawer} candidateName={candidates[drawer.candidate_id]} onClose={() => { setDrawer(null); load() }} onError={setError} />}
    </div>
  )
}

export default ResultsPage
