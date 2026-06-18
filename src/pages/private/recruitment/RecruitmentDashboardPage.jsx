import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recruitmentApi } from '@/services/api'
import {
  AlertCircle, X, Briefcase, UserSquare2, ClipboardList, CheckCircle2, Award, ShieldAlert, ArrowRight,
} from 'lucide-react'

const STAGE_ORDER = ['applied', 'screening', 'interview', 'review', 'advanced', 'rejected', 'on_hold', 'withdrawn']
const STAGE_LABEL = {
  applied: 'Applied', screening: 'Screening', interview: 'Interview', review: 'Review',
  advanced: 'Advanced', rejected: 'Rejected', on_hold: 'On hold', withdrawn: 'Withdrawn',
}
const REC_STYLE = {
  strong: 'bg-green-100 text-green-700', moderate: 'bg-amber-100 text-amber-700',
  weak: 'bg-red-100 text-red-700', insufficient: 'bg-neutral-100 text-neutral-500',
}

const StatCard = ({ icon: Icon, label, value, accent = 'text-primary-600' }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-5">
    <div className="flex items-center gap-2 text-neutral-400 mb-2"><Icon className={`w-4 h-4 ${accent}`} /><span className="text-xs font-medium uppercase tracking-wide">{label}</span></div>
    <div className="text-3xl font-bold text-neutral-900">{value}</div>
  </div>
)

const RecruitmentDashboardPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try { setData(await recruitmentApi.dashboard.get()) }
      catch (err) { setError(err.message) } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  const maxStage = data ? Math.max(1, ...Object.values(data.applications_by_stage || {})) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Recruitment Overview</h1>
        <p className="text-neutral-500">Your hiring pipeline at a glance</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Briefcase} label="Open jobs" value={data.jobs_open} />
            <StatCard icon={UserSquare2} label="Candidates" value={data.candidates_total} />
            <StatCard icon={ClipboardList} label="Published interviews" value={data.interviews_published} />
            <StatCard icon={CheckCircle2} label="Completed" value={data.sessions_completed} accent="text-green-600" />
            <StatCard icon={Award} label="Scored" value={data.scored_count} />
            <StatCard icon={Award} label="Average score" value={data.avg_score != null ? data.avg_score : '—'} />
            <StatCard icon={ShieldAlert} label="Needs review" value={data.needs_review_count} accent="text-amber-600" />
            <StatCard icon={UserSquare2} label="Applications" value={data.applications_total} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pipeline funnel */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pipeline</h2>
              {Object.keys(data.applications_by_stage || {}).length === 0 ? (
                <p className="text-sm text-neutral-500">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {STAGE_ORDER.filter((s) => data.applications_by_stage[s]).map((s) => (
                    <div key={s}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-neutral-700">{STAGE_LABEL[s] || s}</span>
                        <span className="text-neutral-500">{data.applications_by_stage[s]}</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(data.applications_by_stage[s] / maxStage) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Recent interviews</h2>
                <button onClick={() => navigate('/dashboard/results')} className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
              {data.recent.length === 0 ? (
                <p className="text-sm text-neutral-500">No completed interviews yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.recent.map((r) => (
                    <button key={r.session_id} onClick={() => navigate('/dashboard/results')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 truncate">{r.candidate_name || 'Candidate'}</div>
                        <div className="text-xs text-neutral-400 truncate">{r.job_title || 'Interview'}</div>
                      </div>
                      {r.overall_score != null && <span className="text-sm font-semibold text-neutral-800">{Math.round(r.overall_score)}</span>}
                      {r.recommendation && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${REC_STYLE[r.recommendation] || ''}`}>{r.recommendation}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RecruitmentDashboardPage
