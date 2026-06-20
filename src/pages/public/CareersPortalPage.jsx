import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicInterviewApi } from '@/services/api'
import { Loader2, AlertCircle, Briefcase, MapPin, Clock, X, ArrowRight, Mic, Keyboard } from 'lucide-react'

const MODE_LABEL = { voice_only: 'Voice', text_practice: 'Typed', avatar_interactive: 'Video', video: 'Video' }

const ApplyModal = ({ slug, role, onClose }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const apply = async () => {
    if (!form.full_name.trim() || !form.email.trim()) { setError('Please enter your name and email.'); return }
    setBusy(true); setError('')
    try {
      const res = await publicInterviewApi.portalApply(slug, role.template_id, form)
      navigate(`/candidate/interview/${res.token}`)
    } catch (err) { setError(err.message || 'Could not start your application.'); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Apply: {role.job_title || role.name}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
          <input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button onClick={apply} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start application <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div></div>
  )
}

const CareersPortalPage = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await publicInterviewApi.portal(slug)
        if (active) setData(res)
      } catch (err) {
        if (active) setError(err.message || 'This careers page is not available.')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [slug])

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><Loader2 className="w-7 h-7 text-primary-600 animate-spin" /></div>
  }
  if (error) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center max-w-md">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">Page unavailable</h1>
        <p className="text-neutral-600">{error}</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          {data.brand_logo_url && <img src={data.brand_logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
          <h1 className="text-2xl font-bold text-neutral-900">{data.brand_name} careers</h1>
        </div>
        <p className="text-neutral-500 mb-8">Open roles you can apply to. Each starts a short AI interview.</p>

        {data.roles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">No open roles right now. Please check back later.</div>
        ) : (
          <div className="space-y-3">
            {data.roles.map((r) => (
              <div key={r.template_id} className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-neutral-900">{r.job_title || r.name}</h2>
                  {r.description && <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{r.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-neutral-400">
                    {r.department && <span className="inline-flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {r.department}</span>}
                    {r.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.location}</span>}
                    <span className="inline-flex items-center gap-1">{r.mode === 'text_practice' ? <Keyboard className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />} {MODE_LABEL[r.mode] || 'Interview'}</span>
                    {r.expected_duration_minutes && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{r.expected_duration_minutes} min</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(r)} className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && <ApplyModal slug={slug} role={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default CareersPortalPage
