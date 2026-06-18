import { useState } from 'react'
import { recruitmentApi } from '@/services/api'
import { X, AlertCircle, Upload, CheckCircle2, FileText } from 'lucide-react'

// Parse simple CSV text into rows of {full_name, email, phone}.
// Accepts "name,email,phone" lines. Skips a header row if present. Tolerant of quotes.
const parseCsv = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const rows = []
  const errors = []
  lines.forEach((line, idx) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
    const joined = line.toLowerCase()
    if (idx === 0 && (joined.includes('email') && (joined.includes('name') || joined.includes('phone')))) return // header
    const [name, email, phone] = cols
    if (!email || !email.includes('@')) { errors.push(`Line ${idx + 1}: missing or invalid email`); return }
    rows.push({ full_name: name || email.split('@')[0], email, phone: phone || null })
  })
  return { rows, errors }
}

const ImportCandidatesModal = ({ isOpen, onClose, jobs = [], onImported }) => {
  const [text, setText] = useState('')
  const [jobId, setJobId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  if (!isOpen) return null

  const preview = parseCsv(text)

  const run = async () => {
    setError(''); setResult(null)
    if (preview.rows.length === 0) { setError('Add at least one row with a valid email.'); return }
    setBusy(true)
    try {
      const res = await recruitmentApi.candidates.bulkImport({
        job_position_id: jobId || null,
        rows: preview.rows,
      })
      setResult(res)
      onImported?.()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const reset = () => { setText(''); setResult(null); setError(''); setJobId('') }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2"><Upload className="w-5 h-5 text-primary-600" /> Import candidates</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-4">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}

            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Import complete</div>
                    <div>{result.created} created, {result.matched} matched existing{result.applications_created ? `, ${result.applications_created} applications added` : ''}{result.skipped ? `, ${result.skipped} skipped` : ''}.</div>
                  </div>
                </div>
                {result.errors?.length > 0 && (
                  <div className="text-xs text-neutral-500 space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((e, i) => <div key={i}>• {e}</div>)}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button onClick={reset} className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl">Import more</button>
                  <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700">Done</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-neutral-600">Paste rows as <span className="font-mono text-neutral-800">name, email, phone</span> (one per line). A header row is detected and skipped automatically.</p>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7}
                  placeholder={'Jane Doe, jane@example.com, +44 7700 900000\nSam Lee, sam@example.com'}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-none" />

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-neutral-500"><FileText className="w-4 h-4" /> {preview.rows.length} valid {preview.rows.length === 1 ? 'row' : 'rows'}{preview.errors.length ? `, ${preview.errors.length} issue(s)` : ''}</div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-neutral-600">Add to job:</label>
                    <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">None</option>
                      {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={onClose} className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl">Cancel</button>
                  <button onClick={run} disabled={busy || preview.rows.length === 0} className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
                    <Upload className="w-4 h-4" /> {busy ? 'Importing…' : `Import ${preview.rows.length || ''}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportCandidatesModal
