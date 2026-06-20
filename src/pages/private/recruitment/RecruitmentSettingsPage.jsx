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
            <input value={form.interviewer_avatar_url || ''} onChange={(e) => set('interviewer_avatar_url', e.target.value)} placeholder="Interviewer avatar photo URL (optional)"
              className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 sm:col-span-2" />
          </div>
          <p className="text-xs text-neutral-400 -mt-2">The avatar photo appears as the AI interviewer in voice and video interviews, with light animation. Leave blank for a default animated face. Use a photo only with the person's consent.</p>
        </div>

        <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>

      <EmailTemplatesEditor onError={setError} />
    </div>
  )
}

const KIND_LABEL = {
  invite: 'Interview invite', selected: 'Selected', advance: 'Advanced',
  rejected: 'Not selected', reminder: 'Reminder', completed: 'Completed', score_ready: 'Score ready',
}

const EmailTemplatesEditor = ({ onError }) => {
  const [data, setData] = useState(null)
  const [active, setActive] = useState('invite')
  const [draft, setDraft] = useState({ subject: '', body_html: '', enabled: true })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const load = async () => {
    try {
      const res = await recruitmentApi.emailTemplates.list()
      setData(res)
      const t = res.templates.find((x) => x.kind === active) || res.templates[0]
      if (t) setDraft({ subject: t.subject, body_html: t.body_html, enabled: t.enabled })
    } catch (err) { onError(err.message) }
  }
  useEffect(() => { load() }, [])

  const pick = (kind) => {
    setActive(kind); setNotice('')
    const t = data?.templates.find((x) => x.kind === kind)
    if (t) setDraft({ subject: t.subject, body_html: t.body_html, enabled: t.enabled })
  }

  const save = async () => {
    setSaving(true); setNotice('')
    try { await recruitmentApi.emailTemplates.upsert(active, draft); await load(); setNotice('Saved.') }
    catch (err) { onError(err.message) } finally { setSaving(false) }
  }
  const reset = async () => {
    setSaving(true); setNotice('')
    try { await recruitmentApi.emailTemplates.reset(active); await load(); setNotice('Reverted to default.') }
    catch (err) { onError(err.message) } finally { setSaving(false) }
  }

  if (!data) return null
  const current = data.templates.find((x) => x.kind === active)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Email templates</h2>
        <p className="text-sm text-neutral-500">Customise the emails candidates receive. Emails only send when SMTP is configured.</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.templates.map((t) => (
          <button key={t.kind} onClick={() => pick(t.kind)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${active === t.kind ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
            {KIND_LABEL[t.kind] || t.kind}{t.is_custom ? ' •' : ''}
          </button>
        ))}
      </div>
      {notice && <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">{notice}</div>}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
        <input value={draft.subject} onChange={(e) => setDraft((p) => ({ ...p, subject: e.target.value }))}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Body (HTML)</label>
        <textarea value={draft.body_html} onChange={(e) => setDraft((p) => ({ ...p, body_html: e.target.value }))} rows={6}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs" />
      </div>
      <p className="text-xs text-neutral-400">Variables: {data.variables.map((v) => `{${v}}`).join(', ')}</p>
      <div className="flex items-center gap-2">
        <button onClick={save} disabled={saving} className="px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 text-sm">{saving ? 'Saving…' : 'Save template'}</button>
        {current?.is_custom && <button onClick={reset} disabled={saving} className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 text-sm">Reset to default</button>}
      </div>
    </div>
  )
}

export default RecruitmentSettingsPage
