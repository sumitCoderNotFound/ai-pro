import { useState, useEffect } from 'react'
import { recruitmentApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  AlertCircle, X, Plug, Plus, Check, Trash2, Download, Briefcase, UserSquare2, Loader2, RefreshCw,
} from 'lucide-react'

const PROVIDER_LABEL = { greenhouse: 'Greenhouse', lever: 'Lever', workable: 'Workable' }

const AddModal = ({ isOpen, onClose, providers, onCreate }) => {
  const [form, setForm] = useState({ provider: 'greenhouse', name: '', api_key: '', subdomain: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { if (isOpen) { setForm({ provider: providers[0] || 'greenhouse', name: '', api_key: '', subdomain: '' }); setError('') } }, [isOpen, providers])
  if (!isOpen) return null
  const submit = async () => {
    if (!form.api_key) { setError('Enter the API key from your ATS.'); return }
    setBusy(true); setError('')
    try { await onCreate(form); onClose() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-neutral-900">Connect an ATS</h2><button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button></div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Provider</label>
          <select value={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))} className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            {providers.map((p) => <option key={p} value={p}>{PROVIDER_LABEL[p] || p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name (optional)</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">API key</label>
          <input value={form.api_key} onChange={(e) => setForm((p) => ({ ...p, api_key: e.target.value }))} type="password" placeholder="From your ATS admin settings" className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        {form.provider === 'workable' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subdomain</label>
            <input value={form.subdomain} onChange={(e) => setForm((p) => ({ ...p, subdomain: e.target.value }))} placeholder="yourcompany" className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl">Cancel</button>
          <button onClick={submit} disabled={busy} className="px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">{busy ? 'Connecting…' : 'Connect'}</button>
        </div>
      </div>
    </div></div>
  )
}

const ConnectionCard = ({ conn, jobs, onTest, onImportJobs, onImportCandidates, onDelete, onNotice }) => {
  const [testing, setTesting] = useState(false)
  const [importing, setImporting] = useState('')
  const [jobId, setJobId] = useState('')

  const test = async () => { setTesting(true); try { const r = await onTest(conn.id); onNotice(r.ok ? `✓ ${r.message}` : `✗ ${r.message}`) } finally { setTesting(false) } }
  const impJobs = async () => { setImporting('jobs'); try { const r = await onImportJobs(conn.id); onNotice(`Jobs: ${r.created} created, ${r.matched} matched (of ${r.total_seen}).`) } catch (e) { onNotice(e.message) } finally { setImporting('') } }
  const impCands = async () => { setImporting('cands'); try { const r = await onImportCandidates(conn.id, jobId); onNotice(`Candidates: ${r.created} created, ${r.matched} matched${r.applications_created ? `, ${r.applications_created} applications` : ''} (of ${r.total_seen}).`) } catch (e) { onNotice(e.message) } finally { setImporting('') } }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><Plug className="w-5 h-5 text-primary-600" /></div>
          <div>
            <div className="font-medium text-neutral-900">{conn.name || PROVIDER_LABEL[conn.provider] || conn.provider}</div>
            <div className="text-xs text-neutral-400">{PROVIDER_LABEL[conn.provider] || conn.provider}{conn.has_key ? ' · key set' : ' · no key'}{conn.last_sync_at ? ` · synced ${new Date(conn.last_sync_at).toLocaleDateString()}` : ''}</div>
          </div>
        </div>
        <button onClick={() => onDelete(conn.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={test} disabled={testing} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Test
        </button>
        <button onClick={impJobs} disabled={importing === 'jobs'} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">
          {importing === 'jobs' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />} Import jobs
        </button>
        <div className="flex items-center gap-1.5">
          <button onClick={impCands} disabled={importing === 'cands'} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">
            {importing === 'cands' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserSquare2 className="w-4 h-4" />} Import candidates
          </button>
          <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="px-2 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">to job: none</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

const IntegrationsPage = () => {
  const [connections, setConnections] = useState([])
  const [providers, setProviders] = useState(['greenhouse', 'lever', 'workable'])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const load = async () => {
    try {
      setLoading(true); setError('')
      const [conns, jl] = await Promise.all([recruitmentApi.ats.list(), recruitmentApi.jobs.list({ page_size: 100 })])
      setConnections(conns || [])
      setJobs(jl.items || [])
      try { const p = await recruitmentApi.ats.providers(); setProviders(p.providers || providers) } catch { /* keep default */ }
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const showNotice = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 5000) }
  const create = async (data) => { await recruitmentApi.ats.create(data); await load(); showNotice('Connection added. Use Test to verify the key.') }
  const remove = async (id) => { if (!window.confirm('Remove this connection?')) return; await recruitmentApi.ats.remove(id); await load() }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
          <p className="text-neutral-500">Sync jobs and candidates from your ATS, and push interview scores back</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"><Plus className="w-5 h-5" /> Connect ATS</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {notice && <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">{notice}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : connections.length === 0 ? (
        <EmptyState emoji="🔌" variant="default" title="No ATS connected yet"
          description="Connect Greenhouse, Lever, or Workable to import jobs and candidates, and push interview scores back automatically."
          tips={['You will need an API key from your ATS admin settings.', 'After connecting, click Test to verify, then Import jobs or candidates.']}
          primaryAction={{ label: 'Connect ATS', onClick: () => setAddOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {connections.map((c) => (
            <ConnectionCard key={c.id} conn={c} jobs={jobs}
              onTest={recruitmentApi.ats.test}
              onImportJobs={recruitmentApi.ats.importJobs}
              onImportCandidates={(id, jobId) => recruitmentApi.ats.importCandidates(id, { limit: 100, job_position_id: jobId || null })}
              onDelete={remove} onNotice={showNotice} />
          ))}
        </div>
      )}

      <AddModal isOpen={addOpen} onClose={() => setAddOpen(false)} providers={providers} onCreate={create} />
    </div>
  )
}

export default IntegrationsPage
