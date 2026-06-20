import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  AlertCircle, X, ArrowLeft, Award, ShieldAlert, Check, Ban, Trophy, ChevronRight, Filter,
} from 'lucide-react'

const REC_STYLE = {
  strong: 'bg-green-100 text-green-700', moderate: 'bg-amber-100 text-amber-700',
  weak: 'bg-red-100 text-red-700', insufficient: 'bg-neutral-100 text-neutral-500',
}
const STAGE_STYLE = {
  advanced: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
  review: 'bg-blue-100 text-blue-700', interview: 'bg-amber-100 text-amber-700',
}
const RANK_BADGE = ['bg-yellow-100 text-yellow-700', 'bg-neutral-200 text-neutral-700', 'bg-orange-100 text-orange-700']

const ShortlistPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acting, setActing] = useState(null)
  const [notice, setNotice] = useState('')
  const [elig, setElig] = useState(null)          // { item, result|null, loading, note }
  const [savingElig, setSavingElig] = useState(false)

  const openEligibility = async (item) => {
    setElig({ item, result: null, loading: true, note: '' })
    try {
      const result = await recruitmentApi.applications.prescreenResult(item.application_id)
      setElig({ item, result, loading: false, note: result.override_note || '' })
    } catch {
      setElig({ item, result: null, loading: false, note: '' })  // 404 = no pre-screening
    }
  }

  const overrideElig = async (makeEligible) => {
    if (!elig?.result) return
    setSavingElig(true)
    try {
      const updated = await recruitmentApi.applications.prescreenOverride(elig.result.id, { eligible: makeEligible, note: elig.note })
      setElig((p) => ({ ...p, result: updated }))
      setNotice(`Eligibility set to ${makeEligible ? 'eligible' : 'not eligible'}.`)
      await load()
    } catch (err) { setError(err.message) } finally { setSavingElig(false) }
  }

  const load = async () => {
    try { setLoading(true); setError(''); setData(await recruitmentApi.jobs.shortlist(jobId)) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [jobId])

  const decide = async (item, toStage) => {
    setActing(item.application_id); setNotice('')
    try {
      await recruitmentApi.applications.decide(item.application_id, toStage,
        toStage === 'advanced' ? 'Advanced from shortlist' : 'Rejected from shortlist')
      await load()
      try {
        const res = await recruitmentApi.applications.notify(item.application_id, toStage === 'advanced' ? 'advance' : 'rejected')
        setNotice(res.message)
      } catch { /* notification is best-effort */ }
    } catch (err) { setError(err.message) } finally { setActing(null) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/dashboard/jobs')} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"><ArrowLeft className="w-4 h-4" /> Back to jobs</button>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2"><Trophy className="w-6 h-6 text-primary-500" /> Shortlist</h1>
          <p className="text-neutral-500">{data?.job_title} · ranked by interview score</p>
        </div>
        {data && data.not_interviewed > 0 && (
          <span className="text-sm text-neutral-400">{data.not_interviewed} not yet interviewed</span>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {notice && <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">{notice}</div>}

      {!data || data.items.length === 0 ? (
        <EmptyState
          emoji="🏆" variant="default" title="No ranked candidates yet"
          description="Once candidates complete an interview for this job and are scored, they appear here ranked best to worst."
          tips={['Make sure invites point to an interview linked to this job.', 'Scores need an AI key; re-run scoring from Results if needed.']}
        />
      ) : (
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={item.application_id} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${RANK_BADGE[i] || 'bg-neutral-100 text-neutral-500'}`}>{i + 1}</div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-neutral-900 truncate">{item.candidate_name || 'Candidate'}</div>
                <div className="text-xs text-neutral-400 truncate">{item.candidate_email}</div>
              </div>

              <div className="flex items-center gap-2">
                {item.needs_human_review && <span title="Needs human review" className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><ShieldAlert className="w-3.5 h-3.5" />review</span>}
                {item.risk_level && item.risk_level !== 'low' && <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">{item.risk_level} risk</span>}
                {item.recommendation && <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${REC_STYLE[item.recommendation] || ''}`}>{item.recommendation}</span>}
                <div className="flex items-center gap-1.5 w-16 justify-end">
                  <Award className="w-4 h-4 text-primary-500" />
                  <span className="text-lg font-bold text-neutral-900">{item.overall_score != null ? Math.round(item.overall_score) : '—'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-neutral-100">
                {item.stage === 'advanced' || item.stage === 'rejected' ? (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STAGE_STYLE[item.stage]}`}>{item.stage}</span>
                ) : (
                  <>
                    <button onClick={() => decide(item, 'advanced')} disabled={acting === item.application_id} title="Advance"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40"><Check className="w-4 h-4" /></button>
                    <button onClick={() => decide(item, 'rejected')} disabled={acting === item.application_id} title="Reject"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"><Ban className="w-4 h-4" /></button>
                  </>
                )}
                <button onClick={() => openEligibility(item)} title="Pre-screening eligibility" className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg"><Filter className="w-4 h-4" /></button>
                <button onClick={() => navigate('/dashboard/results')} title="View result" className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {elig && (
        <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setElig(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2"><Filter className="w-5 h-5 text-primary-600" /> Pre-screening</h2>
              <button onClick={() => setElig(null)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-neutral-500">{elig.item.candidate_name || elig.item.candidate_email || 'Candidate'}</div>

            {elig.loading ? (
              <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" /></div>
            ) : !elig.result ? (
              <p className="text-sm text-neutral-600">No pre-screening was recorded for this candidate.</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${elig.result.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {elig.result.eligible ? 'Eligible' : 'Not eligible'}
                  </span>
                  {elig.result.overridden && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">overridden</span>}
                  {!elig.result.overridden && <span className="text-xs text-neutral-400">auto decision</span>}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(elig.result.answers || []).map((a, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-neutral-700">{a.prompt}</div>
                      <div className="text-neutral-500">{String(a.value ?? '—')}</div>
                    </div>
                  ))}
                </div>

                <textarea value={elig.note} onChange={(e) => setElig((p) => ({ ...p, note: e.target.value }))} rows={2}
                  placeholder="Override note (optional)" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => overrideElig(false)} disabled={savingElig} className="px-4 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">Mark not eligible</button>
                  <button onClick={() => overrideElig(true)} disabled={savingElig} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">Mark eligible</button>
                </div>
              </>
            )}
          </div>
        </div></div>
      )}
    </div>
  )
}

export default ShortlistPage
