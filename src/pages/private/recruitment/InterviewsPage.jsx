import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  Plus, Search, AlertCircle, X, ClipboardList, Trash2, ChevronRight, CheckCircle2, FileEdit,
  Link2, BarChart3,
} from 'lucide-react'
import InviteModal from '@/components/recruitment/InviteModal'

const MODES = [
  { value: 'voice_only', label: 'Voice only' },
  { value: 'avatar_interactive', label: 'Avatar (interactive)' },
  { value: 'avatar_non_interactive', label: 'Avatar (non-interactive)' },
  { value: 'text_practice', label: 'Text practice' },
]

const CreateModal = ({ isOpen, onClose, jobs, onCreate }) => {
  const [form, setForm] = useState({ name: '', description: '', job_position_id: '', mode: 'voice_only', language: 'en' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({ name: '', description: '', job_position_id: '', mode: 'voice_only', language: 'en' })
    setError('')
  }, [isOpen])

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.name.trim()) { setError('Interview name is required'); return }
    setIsLoading(true)
    try {
      const payload = { ...form, job_position_id: form.job_position_id || null }
      await onCreate(payload)
    } catch (err) { setError(err.message || 'Failed to create interview') }
    finally { setIsLoading(false) }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Create Interview</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
              <input name="name" value={form.name} onChange={change} placeholder="e.g., Frontend Engineer — Screening"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Link to a job (optional)</label>
              <select name="job_position_id" value={form.job_position_id} onChange={change}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">No job linked</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
              <p className="text-xs text-neutral-500 mt-1">Linking a job lets the builder generate questions and a rubric from the role.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Mode</label>
              <select name="mode" value={form.mode} onChange={change}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={change} rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
                {isLoading ? 'Creating…' : 'Create & Build'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const InterviewsPage = () => {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [inviteFor, setInviteFor] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true); setError('')
      const [iv, j] = await Promise.all([
        recruitmentApi.interviews.list({ page_size: 100 }),
        recruitmentApi.jobs.list({ page_size: 100 }),
      ])
      setInterviews(iv.items || [])
      setJobs(j.items || [])
    } catch (err) { setError(err.message || 'Failed to load interviews') }
    finally { setIsLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  const handleCreate = async (data) => {
    const created = await recruitmentApi.interviews.create(data)
    navigate(`/dashboard/interviews/${created.id}`)
  }
  const handleDelete = async (iv) => {
    if (!window.confirm(`Archive interview "${iv.name}"?`)) return
    try { await recruitmentApi.interviews.remove(iv.id); await fetchData() } catch (err) { setError(err.message) }
  }

  const filtered = interviews.filter((iv) => iv.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  const jobName = (id) => jobs.find((j) => j.id === id)?.title

  const versionSummary = (iv) => {
    const published = (iv.versions || []).filter((v) => v.status === 'published').length
    const hasDraft = (iv.versions || []).some((v) => v.status === 'draft')
    return { published, hasDraft }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Interviews</h1>
          <p className="text-neutral-500">Build versioned interviews with questions, a scoring rubric, and a live preview</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
          <Plus className="w-5 h-5" /> Create Interview
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input type="text" placeholder="Search interviews…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          emoji="📋" variant="agents" title="Build your first interview"
          description="An interview holds a versioned set of questions and a scoring rubric. Drafts are editable; publishing locks an immutable version."
          primaryAction={{ label: 'Create your first Interview', onClick: () => setIsCreateOpen(true) }}
          tips={[
            'Link a job, then use Generate to draft questions and a rubric automatically.',
            'Rubric weights must total 100 and each criterion needs weak/moderate/strong anchors before publishing.',
            'Preview runs a simulated candidate — no data is stored and no credits are used.',
          ]}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((iv) => {
            const { published, hasDraft } = versionSummary(iv)
            return (
              <div key={iv.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
                <button onClick={() => navigate(`/dashboard/interviews/${iv.id}`)} className="w-full text-left p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">{iv.name}</h3>
                  {jobName(iv.job_position_id) && <p className="text-sm text-neutral-500">{jobName(iv.job_position_id)}</p>}
                  <p className="text-sm text-neutral-600 line-clamp-2 mt-2">{iv.description || 'No description'}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {published > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />{published} published
                      </span>
                    )}
                    {hasDraft && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                        <FileEdit className="w-3.5 h-3.5" />draft
                      </span>
                    )}
                  </div>
                </button>
                <div className="px-5 py-3 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setInviteFor(iv.id)} disabled={published === 0}
                      title={published === 0 ? 'Publish the interview first' : 'Invite candidates'}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-primary-700 hover:bg-primary-50 disabled:opacity-40 disabled:hover:bg-transparent">
                      <Link2 className="w-4 h-4" /> Invite
                    </button>
                    <button onClick={() => navigate('/dashboard/results')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-neutral-600 hover:bg-neutral-100">
                      <BarChart3 className="w-4 h-4" /> Results
                    </button>
                  </div>
                  <button onClick={() => handleDelete(iv)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} jobs={jobs} onCreate={handleCreate} />
      <InviteModal templateId={inviteFor} isOpen={!!inviteFor} onClose={() => setInviteFor(null)} />
    </div>
  )
}

export default InterviewsPage
