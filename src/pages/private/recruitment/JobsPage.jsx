import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  Plus, Search, MoreVertical, Edit2, Trash2, Copy, Briefcase, Trophy,
  AlertCircle, X, Sparkles, MapPin, Building2, Archive, XCircle,
} from 'lucide-react'

const STATUS_CONFIG = {
  draft: { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
  open: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  paused: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  closed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  archived: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400' },
}

const StatusBadge = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft'}
    </span>
  )
}

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
]

const emptyForm = {
  title: '', description: '', department: '', location: '',
  employment_type: 'full_time', status: 'draft',
  competency_profile: { skills: [], responsibilities: [], experience: [] },
  required_criteria: [],
}

const JobModal = ({ isOpen, onClose, job, onSave }) => {
  const [form, setForm] = useState(emptyForm)
  const [jd, setJd] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseNote, setParseNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || '',
        description: job.description || '',
        department: job.department || '',
        location: job.location || '',
        employment_type: job.employment_type || 'full_time',
        status: job.status || 'draft',
        competency_profile: job.competency_profile || { skills: [], responsibilities: [], experience: [] },
        required_criteria: job.required_criteria || [],
      })
    } else {
      setForm(emptyForm)
    }
    setJd(''); setParseNote(''); setError('')
  }, [job, isOpen])

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleParse = async () => {
    if (jd.trim().length < 20) { setError('Paste a longer job description to auto-fill (20+ characters).'); return }
    setParsing(true); setError(''); setParseNote('')
    try {
      const res = await recruitmentApi.jobs.parseDescription(jd)
      const cp = res.competency_profile || {}
      setForm((p) => ({
        ...p,
        description: p.description || jd,
        competency_profile: {
          skills: cp.skills || [],
          responsibilities: cp.responsibilities || [],
          experience: cp.experience || [],
        },
        required_criteria: (res.suggested_criteria || []).map((c) => c.name).filter(Boolean),
      }))
      setParseNote(
        res.source === 'ai'
          ? 'Auto-filled from the description. Edit the extracted skills below as needed.'
          : 'No AI provider configured, so nothing was extracted — fill the fields in manually (configure a key for auto-extraction).'
      )
    } catch (err) {
      setError(err.message || 'Could not parse the description')
    } finally {
      setParsing(false)
    }
  }

  const removeSkill = (idx) =>
    setForm((p) => ({
      ...p,
      competency_profile: { ...p.competency_profile, skills: p.competency_profile.skills.filter((_, i) => i !== idx) },
    }))

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.title.trim()) { setError('Job title is required'); return }
    setIsLoading(true)
    try {
      const payload = { ...form }
      if (!job) delete payload.status // status only editable on update
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save job')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null
  const skills = form.competency_profile?.skills || []

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">{job ? 'Edit Job' : 'Create New Job'}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
              </div>
            )}

            {/* JD auto-fill */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <h3 className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Paste a job description to auto-fill
              </h3>
              <textarea
                value={jd} onChange={(e) => setJd(e.target.value)} rows={4}
                placeholder="Paste the full job description here, then click Auto-fill…"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
              />
              <button
                type="button" onClick={handleParse} disabled={parsing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />{parsing ? 'Analysing…' : 'Auto-fill from description'}
              </button>
              {parseNote && <p className="text-xs text-neutral-600">{parseNote}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Job Title *</label>
              <input
                name="title" value={form.title} onChange={change} placeholder="e.g., Senior Frontend Engineer"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Department</label>
                <input name="department" value={form.department} onChange={change} placeholder="Engineering"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                <input name="location" value={form.location} onChange={change} placeholder="Remote / London"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Employment Type</label>
                <select name="employment_type" value={form.employment_type} onChange={change}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {job && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                  <select name="status" value={form.status} onChange={change}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {['draft', 'open', 'paused', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={change} rows={4}
                placeholder="Role summary, responsibilities, requirements…"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            {skills.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Extracted skills (click × to remove)</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                      {s}
                      <button type="button" onClick={() => removeSkill(i)} className="hover:text-primary-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors">
                {isLoading ? 'Saving…' : (job ? 'Save Changes' : 'Create Job')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const DeleteModal = ({ isOpen, onClose, job, onConfirm, isLoading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Archive Job</h3>
          <p className="text-neutral-600 mb-6">Archive <span className="font-medium">{job?.title}</span>? It will be hidden from the active list.</p>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
              {isLoading ? 'Archiving…' : 'Archive'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const JobCard = ({ job, onEdit, onDelete, onDuplicate, onClose, onShortlist }) => {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{job.title}</h3>
              <p className="text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
                {job.department && <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.department}</span>}
                {job.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>}
              </p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-neutral-400" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20">
                  <button onClick={() => { onShortlist(job); setShowMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><Trophy className="w-4 h-4" />View shortlist</button>
                  <button onClick={() => { onEdit(job); setShowMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><Edit2 className="w-4 h-4" />Edit</button>
                  <button onClick={() => { onDuplicate(job); setShowMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><Copy className="w-4 h-4" />Duplicate</button>
                  {job.status !== 'closed' && (
                    <button onClick={() => { onClose(job); setShowMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><XCircle className="w-4 h-4" />Close</button>
                  )}
                  <hr className="my-1 border-neutral-200" />
                  <button onClick={() => { onDelete(job); setShowMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Archive className="w-4 h-4" />Archive</button>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{job.description || 'No description'}</p>
        <div className="flex items-center justify-between">
          <StatusBadge status={job.status} />
          <span className="text-xs text-neutral-400">{(job.required_criteria || []).length} criteria</span>
        </div>
      </div>
    </div>
  )
}

const JobsPage = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchJobs = async () => {
    try {
      setIsLoading(true); setError('')
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter) params.status = statusFilter
      const res = await recruitmentApi.jobs.list(params)
      setJobs(res.items || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [searchQuery, statusFilter])

  const handleCreate = async (data) => { await recruitmentApi.jobs.create(data); await fetchJobs() }
  const handleUpdate = async (data) => { await recruitmentApi.jobs.update(editing.id, data); setEditing(null); await fetchJobs() }
  const handleDelete = async () => {
    setIsDeleting(true)
    try { await recruitmentApi.jobs.remove(deleting.id); setDeleting(null); await fetchJobs() }
    catch (err) { setError(err.message) } finally { setIsDeleting(false) }
  }
  const handleDuplicate = async (job) => { try { await recruitmentApi.jobs.duplicate(job.id); await fetchJobs() } catch (err) { setError(err.message) } }
  const handleClose = async (job) => { try { await recruitmentApi.jobs.close(job.id); await fetchJobs() } catch (err) { setError(err.message) } }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Jobs</h1>
          <p className="text-neutral-500">Define roles and competencies that interviews and scoring are built from</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
          <Plus className="w-5 h-5" /> Create Job
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input type="text" placeholder="Search jobs…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">All Status</option>
          {['draft', 'open', 'paused', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : jobs.length === 0 ? (
        <EmptyState
          emoji="💼" variant="default" title="Create your first job"
          description="A job holds the role details and competencies. Paste a job description and we'll draft the competency profile for you to edit."
          primaryAction={{ label: 'Create your first Job', onClick: () => setIsCreateOpen(true) }}
          tips={[
            'Paste a real job description — the AI extracts skills you can edit as chips.',
            'You can duplicate a job to spin up a similar role quickly.',
            'Link an interview to a job so generated questions match the role.',
          ]}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={setEditing} onDelete={setDeleting} onDuplicate={handleDuplicate} onClose={handleClose} onShortlist={(j) => navigate(`/dashboard/jobs/${j.id}/shortlist`)} />
          ))}
        </div>
      )}

      <JobModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} job={null} onSave={handleCreate} />
      <JobModal isOpen={!!editing} onClose={() => setEditing(null)} job={editing} onSave={handleUpdate} />
      <DeleteModal isOpen={!!deleting} onClose={() => setDeleting(null)} job={deleting} onConfirm={handleDelete} isLoading={isDeleting} />
    </div>
  )
}

export default JobsPage
