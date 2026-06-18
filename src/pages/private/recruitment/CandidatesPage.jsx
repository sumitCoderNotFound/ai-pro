import { useState, useEffect } from 'react'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  Plus, Search, AlertCircle, X, UserSquare2, Mail, Phone,
  Edit2, Trash2, Briefcase, Clock, ChevronRight, History, Upload,
} from 'lucide-react'
import ImportCandidatesModal from '@/components/recruitment/ImportCandidatesModal'

const STAGES = ['applied', 'screening', 'interview', 'review', 'advanced', 'rejected', 'on_hold', 'withdrawn']
const STAGE_STYLE = {
  applied: 'bg-neutral-100 text-neutral-700',
  screening: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  review: 'bg-amber-100 text-amber-700',
  advanced: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  withdrawn: 'bg-neutral-100 text-neutral-500',
}

const StageBadge = ({ stage }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STAGE_STYLE[stage] || STAGE_STYLE.applied}`}>
    {(stage || 'applied').replace('_', ' ')}
  </span>
)

const emptyCandidate = { full_name: '', email: '', phone: '', language: 'en', notes: '' }

const CandidateModal = ({ isOpen, onClose, candidate, onSave }) => {
  const [form, setForm] = useState(emptyCandidate)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(candidate
      ? { full_name: candidate.full_name || '', email: candidate.email || '', phone: candidate.phone || '', language: candidate.language || 'en', notes: candidate.notes || '' }
      : emptyCandidate)
    setError('')
  }, [candidate, isOpen])

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.full_name.trim() && !form.email.trim()) { setError('Provide at least a name or an email'); return }
    setIsLoading(true)
    try { await onSave(form); onClose() }
    catch (err) { setError(err.message || 'Failed to save candidate') }
    finally { setIsLoading(false) }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">{candidate ? 'Edit Candidate' : 'Add Candidate'}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Full name</label>
              <input name="full_name" value={form.full_name} onChange={change} placeholder="Jane Doe"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                <input name="email" type="email" value={form.email} onChange={change} placeholder="jane@example.com"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                <input name="phone" value={form.phone} onChange={change} placeholder="+44…"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Notes</label>
              <textarea name="notes" value={form.notes} onChange={change} rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
                {isLoading ? 'Saving…' : (candidate ? 'Save' : 'Add Candidate')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const CandidateDrawer = ({ candidate, jobs, onClose, onError }) => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobId, setJobId] = useState('')
  const [creating, setCreating] = useState(false)
  const [historyFor, setHistoryFor] = useState(null)
  const [history, setHistory] = useState([])

  const load = async () => {
    try {
      setLoading(true)
      const res = await recruitmentApi.applications.list({ /* listed for whole workspace */ })
      setApps((res.items || []).filter((a) => a.candidate_id === candidate.id))
    } catch (err) { onError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [candidate])

  const createApp = async () => {
    setCreating(true)
    try {
      await recruitmentApi.applications.create({ candidate_id: candidate.id, job_position_id: jobId || null })
      setJobId(''); await load()
    } catch (err) { onError(err.message) } finally { setCreating(false) }
  }

  const decide = async (app, toStage) => {
    const reason = window.prompt(`Reason for moving to "${toStage}" (optional):`, '') ?? ''
    try { await recruitmentApi.applications.decide(app.id, toStage, reason); await load() }
    catch (err) { onError(err.message) }
  }

  const viewHistory = async (app) => {
    setHistoryFor(app.id)
    try { setHistory(await recruitmentApi.applications.history(app.id)) }
    catch (err) { onError(err.message) }
  }

  const jobName = (id) => jobs.find((j) => j.id === id)?.title || 'General application'

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">{candidate.full_name || candidate.email || 'Candidate'}</h2>
            <p className="text-sm text-neutral-500 flex items-center gap-3 mt-1">
              {candidate.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{candidate.email}</span>}
              {candidate.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{candidate.phone}</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Add to a job</label>
              <select value={jobId} onChange={(e) => setJobId(e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">General application</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>
            <button onClick={createApp} disabled={creating} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
              {creating ? '…' : 'Apply'}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-3">Applications</h3>
            {loading ? (
              <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" /></div>
            ) : apps.length === 0 ? (
              <p className="text-sm text-neutral-500">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {apps.map((app) => (
                  <div key={app.id} className="border border-neutral-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-800 inline-flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-neutral-400" />{jobName(app.job_position_id)}</span>
                      <StageBadge stage={app.stage} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <select value="" onChange={(e) => e.target.value && decide(app, e.target.value)}
                        className="text-xs px-2 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">Move to…</option>
                        {STAGES.filter((s) => s !== app.stage).map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                      <button onClick={() => viewHistory(app)} className="text-xs inline-flex items-center gap-1 px-2 py-1.5 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50">
                        <History className="w-3.5 h-3.5" /> History
                      </button>
                    </div>
                    {historyFor === app.id && (
                      <div className="mt-3 pl-3 border-l-2 border-neutral-200 space-y-2">
                        {history.length === 0 ? <p className="text-xs text-neutral-400">No history.</p> : history.map((h) => (
                          <div key={h.id} className="text-xs text-neutral-600">
                            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-neutral-400" />
                              {h.from_stage ? `${h.from_stage} → ` : ''}<span className="font-medium">{h.to_stage}</span></span>
                            {h.reason && <span className="text-neutral-400"> — {h.reason}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [drawer, setDrawer] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true); setError('')
      const params = {}
      if (searchQuery) params.search = searchQuery
      const [c, j] = await Promise.all([
        recruitmentApi.candidates.list(params),
        recruitmentApi.jobs.list({ page_size: 100 }),
      ])
      setCandidates(c.items || [])
      setJobs(j.items || [])
    } catch (err) { setError(err.message || 'Failed to load candidates') }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchData() }, [searchQuery])

  const handleCreate = async (data) => { await recruitmentApi.candidates.create(data); await fetchData() }
  const handleUpdate = async (data) => { await recruitmentApi.candidates.update(editing.id, data); setEditing(null); await fetchData() }
  const handleDelete = async (c) => { if (!window.confirm(`Delete ${c.full_name || c.email}?`)) return; try { await recruitmentApi.candidates.remove(c.id); await fetchData() } catch (err) { setError(err.message) } }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Candidates</h1>
          <p className="text-neutral-500">People in your pipeline and their applications</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsImportOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 font-medium">
            <Upload className="w-5 h-5" /> Import
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
            <Plus className="w-5 h-5" /> Add Candidate
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input type="text" placeholder="Search candidates…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
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
      ) : candidates.length === 0 ? (
        <EmptyState
          emoji="🧑‍💼" variant="chat" title="No candidates yet"
          description="Add candidates manually, then attach them to a job and move them through your pipeline."
          primaryAction={{ label: 'Add your first Candidate', onClick: () => setIsCreateOpen(true) }}
          tips={['Adding a candidate with an existing email updates that record instead of duplicating it.', 'Open a candidate to create an application and record stage decisions with reasons.']}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {candidates.map((c, i) => (
            <div key={c.id} className={`flex items-center gap-4 p-4 hover:bg-neutral-50 ${i > 0 ? 'border-t border-neutral-100' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white">
                <UserSquare2 className="w-5 h-5" />
              </div>
              <button onClick={() => setDrawer(c)} className="flex-1 text-left">
                <div className="font-medium text-neutral-900">{c.full_name || '(no name)'}</div>
                <div className="text-sm text-neutral-500 flex items-center gap-3">
                  {c.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{c.email}</span>}
                  {c.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{c.phone}</span>}
                </div>
              </button>
              <button onClick={() => setEditing(c)} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(c)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => setDrawer(c)} className="p-2 text-neutral-400 hover:text-neutral-700"><ChevronRight className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      )}

      <CandidateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} candidate={null} onSave={handleCreate} />
      <CandidateModal isOpen={!!editing} onClose={() => setEditing(null)} candidate={editing} onSave={handleUpdate} />
      {drawer && <CandidateDrawer candidate={drawer} jobs={jobs} onClose={() => setDrawer(null)} onError={setError} />}
      <ImportCandidatesModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} jobs={jobs} onImported={fetchData} />
    </div>
  )
}

export default CandidatesPage
