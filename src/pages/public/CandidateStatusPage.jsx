import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { publicInterviewApi } from '@/services/api'
import { Loader2, AlertCircle, CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react'

const Shell = ({ brand, children }) => (
  <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-lg">
      {brand && <div className="text-center mb-6 text-sm font-medium text-neutral-500">{brand}</div>}
      {children}
    </div>
  </div>
)

const StepIcon = ({ state }) => {
  if (state === 'done') return <CheckCircle2 className="w-5 h-5 text-green-600" />
  if (state === 'current') return <Clock className="w-5 h-5 text-primary-600" />
  return <Circle className="w-5 h-5 text-neutral-300" />
}

const CandidateStatusPage = () => {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await publicInterviewApi.status(token)
        if (active) setData(res)
      } catch (err) {
        if (active) setError(err.message || 'We could not find this application.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [token])

  if (loading) {
    return <Shell><div className="flex justify-center py-12"><Loader2 className="w-7 h-7 text-primary-600 animate-spin" /></div></Shell>
  }
  if (error) {
    return <Shell>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">Status unavailable</h1>
        <p className="text-neutral-600">{error}</p>
      </div>
    </Shell>
  }

  return (
    <Shell brand={data.brand_name}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <p className="text-sm text-neutral-400 mb-1">{data.interview_name}{data.candidate_name ? ` · ${data.candidate_name}` : ''}</p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{data.headline}</h1>
        <p className="text-neutral-600 mb-6">{data.message}</p>

        <div className="space-y-3 mb-6">
          {data.steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <StepIcon state={s.state} />
              <span className={`text-sm ${s.state === 'upcoming' ? 'text-neutral-400' : 'text-neutral-800 font-medium'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {(data.attempts_remaining != null || data.expires_at) && (
          <div className="flex flex-wrap gap-2 mb-6 text-xs">
            {data.attempts_remaining != null && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">{data.attempts_remaining} {data.attempts_remaining === 1 ? 'attempt' : 'attempts'} remaining</span>
            )}
            {data.expires_at && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">Closes {new Date(data.expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            )}
          </div>
        )}

        {data.can_resume && (
          <Link to={`/candidate/interview/${token}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
            {data.status === 'in_progress' ? 'Resume interview' : 'Start interview'} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <p className="text-center text-xs text-neutral-400 mt-4">Keep this link to check back on your application.</p>
    </Shell>
  )
}

export default CandidateStatusPage
