import { useState, useEffect } from 'react'
import { recruitmentApi } from '@/services/api'
import { AlertCircle, X, Check, Shield, Scale, Eye, Building2 } from 'lucide-react'

const JURISDICTIONS = [
  { value: 'uk', label: 'United Kingdom (UK GDPR)' },
  { value: 'eu', label: 'European Union (EU GDPR)' },
  { value: 'us', label: 'United States' },
  { value: 'other', label: 'Other' },
]

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-neutral-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

const RecruitmentSettingsPage = () => {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    try { setLoading(true); setForm(await recruitmentApi.settings.get()) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const updated = await recruitmentApi.settings.update({
        jurisdiction: form.jurisdiction,
        consent_text: form.consent_text || null,
        default_recording_enabled: form.default_recording_enabled,
        candidates_see_scores: form.candidates_see_scores,
        brand_name: form.brand_name || null,
        brand_logo_url: form.brand_logo_url || null,
      })
      setForm(updated)
      setSuccess('Settings saved'); setTimeout(() => setSuccess(''), 2500)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  if (loading || !form) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Recruitment Settings</h1>
        <p className="text-neutral-500">Compliance and candidate-experience defaults for this workspace</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"><Check className="w-5 h-5 flex-shrink-0" />{success}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
        {/* Jurisdiction */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 mb-2"><Scale className="w-4 h-4 text-primary-500" /> Jurisdiction</label>
          <p className="text-xs text-neutral-500 mb-2">Sets the default consent wording shown to candidates.</p>
          <select value={form.jurisdiction} onChange={(e) => set('jurisdiction', e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            {JURISDICTIONS.map((j) => <option key={j.value} value={j.value}>{j.label}</option>)}
          </select>
        </div>

        {/* Consent override */}
        <div>
          <label className="text-sm font-medium text-neutral-900 mb-2 block">Custom consent text (optional)</label>
          <p className="text-xs text-neutral-500 mb-2">Leave blank to use the jurisdiction default.</p>
          <textarea value={form.consent_text || ''} onChange={(e) => set('consent_text', e.target.value)} rows={3}
            placeholder="Override the consent wording candidates must agree to…"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>

        {/* Recording default */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-neutral-900">Record interviews by default</div>
              <div className="text-xs text-neutral-500">Off is safest. Applies to new interview versions; each interview can still override it.</div>
            </div>
          </div>
          <Toggle checked={form.default_recording_enabled} onChange={(v) => set('default_recording_enabled', v)} />
        </div>

        {/* Candidates see scores */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-neutral-900">Show candidates their score</div>
              <div className="text-xs text-neutral-500">When off, candidates only see a “submitted” confirmation on completion.</div>
            </div>
          </div>
          <Toggle checked={form.candidates_see_scores} onChange={(v) => set('candidates_see_scores', v)} />
        </div>

        {/* Branding */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 mb-2"><Building2 className="w-4 h-4 text-primary-500" /> Candidate portal branding</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.brand_name || ''} onChange={(e) => set('brand_name', e.target.value)} placeholder="Brand name"
              className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input value={form.brand_logo_url || ''} onChange={(e) => set('brand_logo_url', e.target.value)} placeholder="Logo URL"
              className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}

export default RecruitmentSettingsPage
