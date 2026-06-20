import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recruitmentApi } from '@/services/api'
import {
  ArrowLeft, AlertCircle, X, Sparkles, Plus, Trash2, ChevronUp, ChevronDown,
  Check, Play, Send, Lock, FileEdit, Settings as SettingsIcon, ListChecks, Scale, MessageSquare, Filter,
} from 'lucide-react'

const QUESTION_TYPES = [
  { value: 'open_response', label: 'Open response' },
  { value: 'scripted', label: 'Scripted' },
  { value: 'adaptive', label: 'Adaptive' },
  { value: 'knockout', label: 'Knockout' },
  { value: 'information', label: 'Information' },
]

const Banner = ({ type = 'error', children, onClose }) => {
  const styles = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-green-50 border-green-200 text-green-700'
  return (
    <div className={`p-4 border rounded-xl flex items-center gap-3 ${styles}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">{children}</div>
      {onClose && <button onClick={onClose}><X className="w-4 h-4" /></button>}
    </div>
  )
}

// ---------------- Questions tab ----------------
const QuestionRow = ({ q, index, total, editable, onMove, onDelete, onSave }) => {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(q.prompt_text)
  useEffect(() => setText(q.prompt_text), [q.prompt_text])

  return (
    <div className="border border-neutral-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 w-6 h-6 flex-shrink-0 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium flex items-center justify-center">{index + 1}</span>
        <div className="flex-1 min-w-0">
          {editing ? (
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" />
          ) : (
            <p className="text-sm text-neutral-800">{q.prompt_text}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">{(q.question_type || 'open_response').replace('_', ' ')}</span>
            {q.is_knockout && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">knockout</span>}
          </div>
        </div>
        {editable && (
          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <button onClick={() => { onSave(q, { prompt_text: text }); setEditing(false) }} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                <button onClick={() => { setText(q.prompt_text); setEditing(false) }} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <button disabled={index === 0} onClick={() => onMove(index, -1)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button disabled={index === total - 1} onClick={() => onMove(index, 1)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => setEditing(true)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"><FileEdit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(q)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const RESPONSE_TYPES = [
  { value: 'text', label: 'Free text (spoken or typed)' },
  { value: 'yes_no', label: 'Yes / No' },
  { value: 'single_select', label: 'Single choice' },
  { value: 'multi_select', label: 'Multiple choice' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating' },
  { value: 'info', label: 'Information only (no answer)' },
]

const QuestionsTab = ({ version, editable, questions, reload, onError }) => {
  const [type, setType] = useState('open_response')
  const [text, setText] = useState('')
  const [responseType, setResponseType] = useState('text')
  const [options, setOptions] = useState('')
  const [scale, setScale] = useState(5)
  const [adding, setAdding] = useState(false)

  const add = async () => {
    if (!text.trim()) return
    setAdding(true)
    try {
      const config = { required: true, probing_depth: 1, response_type: responseType }
      if (responseType === 'single_select' || responseType === 'multi_select') {
        config.options = options.split(',').map((s) => s.trim()).filter(Boolean)
      }
      if (responseType === 'rating') config.scale = Math.max(2, Math.min(10, Number(scale) || 5))
      await recruitmentApi.versions.addQuestion(version.id, {
        question_type: type, prompt_text: text, is_knockout: type === 'knockout', config,
      })
      setText(''); setOptions(''); await reload()
    } catch (err) { onError(err.message) } finally { setAdding(false) }
  }

  const save = async (q, data) => { try { await recruitmentApi.versions.updateQuestion(version.id, q.id, data); await reload() } catch (err) { onError(err.message) } }
  const del = async (q) => { try { await recruitmentApi.versions.deleteQuestion(version.id, q.id); await reload() } catch (err) { onError(err.message) } }
  const move = async (idx, dir) => {
    const next = [...questions]
    const target = idx + dir
    ;[next[idx], next[target]] = [next[target], next[idx]]
    try { await recruitmentApi.versions.reorderQuestions(version.id, next.map((q) => q.id)); await reload() } catch (err) { onError(err.message) }
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 && <p className="text-sm text-neutral-500">No questions yet. Add one below{editable ? '' : ' (create a draft to edit)'}.</p>}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionRow key={q.id} q={q} index={i} total={questions.length} editable={editable} onMove={move} onDelete={del} onSave={save} />
        ))}
      </div>
      {editable && (
        <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Type a question prompt…"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" />
          <div className="grid sm:grid-cols-2 gap-2">
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={responseType} onChange={(e) => setResponseType(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              {RESPONSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {(responseType === 'single_select' || responseType === 'multi_select') && (
            <input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Options, comma separated"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )}
          {responseType === 'rating' && (
            <input type="number" min={2} max={10} value={scale} onChange={(e) => setScale(e.target.value)} placeholder="Max rating (e.g. 5)"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )}
          <div className="flex justify-end">
            <button onClick={add} disabled={adding || !text.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add question
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------- Rubric tab ----------------
const RubricTab = ({ version, editable, rubric, reload, onError }) => {
  const [form, setForm] = useState({ name: '', weight: 0, description: '', weak: '', moderate: '', strong: '' })
  const [adding, setAdding] = useState(false)

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const add = async () => {
    if (!form.name.trim()) { onError('Criterion name is required'); return }
    setAdding(true)
    try {
      await recruitmentApi.versions.addCriterion(version.id, {
        name: form.name, description: form.description, weight: parseFloat(form.weight) || 0,
        anchors: [
          { level: 'weak', descriptor: form.weak || 'Below expectations' },
          { level: 'moderate', descriptor: form.moderate || 'Meets expectations' },
          { level: 'strong', descriptor: form.strong || 'Exceeds expectations' },
        ],
      })
      setForm({ name: '', weight: 0, description: '', weak: '', moderate: '', strong: '' })
      await reload()
    } catch (err) { onError(err.message) } finally { setAdding(false) }
  }

  const del = async (c) => { try { await recruitmentApi.versions.deleteCriterion(version.id, c.id); await reload() } catch (err) { onError(err.message) } }
  const updateWeight = async (c, weight) => { try { await recruitmentApi.versions.updateCriterion(version.id, c.id, { weight: parseFloat(weight) || 0 }); await reload() } catch (err) { onError(err.message) } }

  const criteria = rubric?.criteria || []
  const total = rubric?.total_weight ?? 0
  const valid = rubric?.weights_valid

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between p-3 rounded-xl border ${valid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
        <span className="text-sm font-medium">Total weight: {total}%</span>
        <span className="text-xs">{valid ? 'Weights total 100% ✓' : 'Weights must total 100% to publish'}</span>
      </div>

      <div className="space-y-3">
        {criteria.map((c) => (
          <div key={c.id} className="border border-neutral-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{c.name}</span>
                  {c.is_blocked_sensitive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">blocked: sensitive</span>}
                </div>
                {c.description && <p className="text-sm text-neutral-500 mt-0.5">{c.description}</p>}
                <div className="grid sm:grid-cols-3 gap-2 mt-3">
                  {['weak', 'moderate', 'strong'].map((lvl) => {
                    const a = (c.anchors || []).find((x) => x.level === lvl)
                    return (
                      <div key={lvl} className="text-xs bg-neutral-50 rounded-lg p-2">
                        <div className="uppercase tracking-wide text-neutral-400 mb-0.5">{lvl}</div>
                        <div className="text-neutral-600">{a?.descriptor || '—'}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {editable ? (
                  <input type="number" defaultValue={c.weight} onBlur={(e) => updateWeight(c, e.target.value)} min="0" max="100"
                    className="w-20 px-2 py-1.5 border border-neutral-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <span className="text-sm font-medium text-neutral-700">{c.weight}%</span>
                )}
                {editable && <button onClick={() => del(c)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
          </div>
        ))}
        {criteria.length === 0 && <p className="text-sm text-neutral-500">No criteria yet.</p>}
      </div>

      {editable && (
        <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <input name="name" value={form.name} onChange={change} placeholder="Criterion name"
              className="col-span-2 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input name="weight" value={form.weight} onChange={change} type="number" min="0" max="100" placeholder="Weight %"
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <input name="description" value={form.description} onChange={change} placeholder="What this measures (optional)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <div className="grid sm:grid-cols-3 gap-2">
            <input name="weak" value={form.weak} onChange={change} placeholder="Weak anchor"
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input name="moderate" value={form.moderate} onChange={change} placeholder="Moderate anchor"
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input name="strong" value={form.strong} onChange={change} placeholder="Strong anchor"
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={add} disabled={adding} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add criterion
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------- Settings tab ----------------
const SettingsTab = ({ version, editable, onSave, onError }) => {
  const [form, setForm] = useState({
    introduction: version.introduction || '', instructions: version.instructions || '',
    expected_duration_minutes: version.expected_duration_minutes || '', attempt_limit: version.attempt_limit || 1,
    language: version.language || 'en', recording_enabled: !!version.recording_enabled,
    ai_identity_disclosure: version.ai_identity_disclosure || '',
  })
  const [saving, setSaving] = useState(false)
  const change = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }
  const save = async () => {
    setSaving(true)
    try {
      await onSave({
        introduction: form.introduction, instructions: form.instructions,
        expected_duration_minutes: form.expected_duration_minutes ? parseInt(form.expected_duration_minutes) : null,
        attempt_limit: parseInt(form.attempt_limit) || 1, language: form.language,
        recording_enabled: form.recording_enabled, ai_identity_disclosure: form.ai_identity_disclosure,
      })
    } catch (err) { onError(err.message) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Introduction (first thing the candidate hears)</label>
        <textarea name="introduction" value={form.introduction} onChange={change} disabled={!editable} rows={2}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-neutral-50" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Instructions</label>
        <textarea name="instructions" value={form.instructions} onChange={change} disabled={!editable} rows={2}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-neutral-50" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Duration (min)</label>
          <input name="expected_duration_minutes" type="number" value={form.expected_duration_minutes} onChange={change} disabled={!editable}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Attempts</label>
          <input name="attempt_limit" type="number" min="1" value={form.attempt_limit} onChange={change} disabled={!editable}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
          <select name="language" value={form.language} onChange={change} disabled={!editable}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="pt">Portuguese</option>
            <option value="it">Italian</option>
            <option value="nl">Dutch</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
          </select>
          <p className="text-xs text-neutral-400 mt-1">Questions are generated in this language. Voice speech-to-text supports it; voice output is best in English.</p>
        </div>
      </div>
      <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl">
        <input name="recording_enabled" type="checkbox" checked={form.recording_enabled} onChange={change} disabled={!editable} className="w-4 h-4 accent-primary-600" />
        <span className="text-sm text-neutral-700">Enable recording <span className="text-neutral-400">(off by default — confirm your consent/jurisdiction policy first)</span></span>
      </label>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">AI identity disclosure</label>
        <textarea name="ai_identity_disclosure" value={form.ai_identity_disclosure} onChange={change} disabled={!editable} rows={2}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-neutral-50" />
        <p className="text-xs text-neutral-500 mt-1">Shown so candidates always know they're speaking with an AI.</p>
      </div>
      {editable && (
        <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      )}
    </div>
  )
}

// ---------------- Preview tab ----------------
const PreviewTab = ({ version, onError }) => {
  const [persona, setPersona] = useState('an average, reasonably qualified candidate')
  const [turns, setTurns] = useState(null)
  const [note, setNote] = useState('')
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true); setTurns(null)
    try {
      const res = await recruitmentApi.versions.simulate(version.id, persona)
      setTurns(res.turns || []); setNote(res.note || '')
    } catch (err) { onError(err.message) } finally { setRunning(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Candidate persona for the preview</label>
          <input value={persona} onChange={(e) => setPersona(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button onClick={run} disabled={running} className="inline-flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium">
          <Play className="w-4 h-4" />{running ? 'Running…' : 'Run preview'}
        </button>
      </div>
      {note && <p className="text-xs text-neutral-500">{note}</p>}
      {turns && (
        <div className="space-y-3">
          {turns.map((t, i) => (
            <div key={i} className={`flex ${t.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${t.role === 'interviewer' ? 'bg-neutral-100 text-neutral-800' : 'bg-primary-600 text-white'}`}>
                <div className={`text-xs mb-0.5 ${t.role === 'interviewer' ? 'text-neutral-400' : 'text-primary-100'}`}>{t.role === 'interviewer' ? 'AI interviewer' : 'Candidate (simulated)'}</div>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------- Main builder ----------------
// ---------------- Pre-screening tab ----------------
const PS_TYPES = [
  { value: 'yes_no', label: 'Yes / No' },
  { value: 'single_select', label: 'Single select' },
  { value: 'number', label: 'Number' },
  { value: 'text', label: 'Text' },
]
const PS_OPS = [
  { value: '', label: 'No knockout (just collect)' },
  { value: 'equals', label: 'Reject if answer equals' },
  { value: 'not_equals', label: 'Reject if answer is not' },
  { value: 'min', label: 'Reject if less than' },
  { value: 'max', label: 'Reject if more than' },
]

const PrescreenTab = ({ version, editable, onError }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ prompt: '', qtype: 'yes_no', options: '', op: '', value: '', required: true })

  const load = async () => {
    try { setLoading(true); setItems(await recruitmentApi.versions.listPrescreen(version.id)) }
    catch (err) { onError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [version.id])

  const add = async () => {
    if (!form.prompt.trim()) { onError('Enter a question.'); return }
    const knockout = form.op ? { op: form.op, value: form.op === 'min' || form.op === 'max' ? Number(form.value) : form.value } : null
    try {
      await recruitmentApi.versions.addPrescreen(version.id, {
        prompt: form.prompt, qtype: form.qtype,
        options: form.qtype === 'single_select' ? form.options.split(',').map((s) => s.trim()).filter(Boolean) : [],
        knockout, required: form.required, order_index: items.length,
      })
      setForm({ prompt: '', qtype: 'yes_no', options: '', op: '', value: '', required: true })
      await load()
    } catch (err) { onError(err.message) }
  }
  const del = async (id) => { try { await recruitmentApi.versions.deletePrescreen(id); await load() } catch (err) { onError(err.message) } }

  const describe = (q) => {
    if (!q.knockout || !q.knockout.op) return 'No knockout'
    const m = { equals: 'rejects if =', not_equals: 'rejects if ≠', min: 'rejects if <', max: 'rejects if >' }
    return `${m[q.knockout.op] || q.knockout.op} ${q.knockout.value}`
  }

  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" /></div>

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">Eligibility questions are asked before the interview. A knockout rule auto-rejects a candidate (you can override later).</p>
      {items.length === 0 && <p className="text-sm text-neutral-500">No pre-screening questions{editable ? '' : ' (create a draft to edit)'}.</p>}
      {items.map((q) => (
        <div key={q.id} className="flex items-start justify-between p-3 border border-neutral-200 rounded-xl">
          <div>
            <div className="text-sm font-medium text-neutral-800">{q.prompt}{q.required && <span className="text-red-500"> *</span>}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{PS_TYPES.find((t) => t.value === q.qtype)?.label} · {describe(q)}</div>
          </div>
          {editable && <button onClick={() => del(q.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
        </div>
      ))}
      {editable && (
        <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
          <input value={form.prompt} onChange={(e) => setForm((p) => ({ ...p, prompt: e.target.value }))} placeholder="Question, e.g. Are you eligible to work in the UK?"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <div className="grid sm:grid-cols-2 gap-2">
            <select value={form.qtype} onChange={(e) => setForm((p) => ({ ...p, qtype: e.target.value }))} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              {PS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={form.op} onChange={(e) => setForm((p) => ({ ...p, op: e.target.value }))} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              {PS_OPS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {form.qtype === 'single_select' && (
            <input value={form.options} onChange={(e) => setForm((p) => ({ ...p, options: e.target.value }))} placeholder="Options, comma separated"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )}
          {form.op && (
            <input value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} placeholder={form.op === 'min' || form.op === 'max' ? 'Threshold number' : 'Failing answer (e.g. no)'}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )}
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" checked={form.required} onChange={(e) => setForm((p) => ({ ...p, required: e.target.checked }))} className="w-4 h-4 accent-primary-600" /> Required
          </label>
          <button onClick={add} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add question
          </button>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { key: 'prescreen', label: 'Pre-screening', icon: Filter },
  { key: 'questions', label: 'Questions', icon: ListChecks },
  { key: 'rubric', label: 'Rubric', icon: Scale },
  { key: 'preview', label: 'Preview', icon: MessageSquare },
]

const InterviewBuilderPage = () => {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [draft, setDraft] = useState(null)
  const [questions, setQuestions] = useState([])
  const [rubric, setRubric] = useState(null)
  const [tab, setTab] = useState('settings')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  const loadDraftContent = useCallback(async (versionId) => {
    const [q, r] = await Promise.all([
      recruitmentApi.versions.listQuestions(versionId),
      recruitmentApi.versions.getRubric(versionId),
    ])
    setQuestions(q || [])
    setRubric(r || { criteria: [], total_weight: 0, weights_valid: false })
  }, [])

  const load = useCallback(async () => {
    setIsLoading(true); setError('')
    try {
      const tpl = await recruitmentApi.interviews.get(templateId)
      setTemplate(tpl)
      try {
        const d = await recruitmentApi.interviews.getDraft(templateId)
        setDraft(d)
        await loadDraftContent(d.id)
      } catch {
        setDraft(null); setQuestions([]); setRubric(null)
      }
    } catch (err) { setError(err.message || 'Failed to load interview') }
    finally { setIsLoading(false) }
  }, [templateId, loadDraftContent])

  useEffect(() => { load() }, [load])

  const editable = !!draft && draft.status === 'draft' && !draft.is_immutable

  const reloadContent = async () => { if (draft) await loadDraftContent(draft.id) }

  const saveSettings = async (data) => {
    await recruitmentApi.interviews.updateDraft(templateId, data)
    const d = await recruitmentApi.interviews.getDraft(templateId)
    setDraft(d)
    setSuccess('Settings saved'); setTimeout(() => setSuccess(''), 2500)
  }

  const handleGenerate = async () => {
    if (!draft) return
    setBusy(true); setError('')
    try {
      await recruitmentApi.interviews.generate(templateId, { num_questions: 5 })
      await reloadContent()
      setSuccess('Generated questions and rubric from the role'); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const handlePublish = async () => {
    setBusy(true); setError('')
    try {
      const res = await recruitmentApi.interviews.publish(templateId)
      if (res.published) {
        setSuccess(`Published version ${res.version_number}. It's now locked.`)
        await load()
      } else {
        setError('Cannot publish yet: ' + (res.errors || []).join(' '))
      }
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const handleNewDraft = async () => {
    setBusy(true); setError('')
    try {
      await recruitmentApi.interviews.newDraft(templateId)
      await load()
      setSuccess('New editable draft created'); setTimeout(() => setSuccess(''), 2500)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  }
  if (!template) {
    return <Banner type="error">Interview not found. <button className="underline" onClick={() => navigate('/dashboard/interviews')}>Back to interviews</button></Banner>
  }

  const publishedVersions = (template.versions || []).filter((v) => v.status === 'published')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard/interviews')} className="p-2 hover:bg-neutral-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-neutral-500" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">{template.name}</h1>
          <p className="text-neutral-500">{template.description || 'Build the questions and scoring rubric, then publish.'}</p>
        </div>
        <div className="flex items-center gap-2">
          {editable && (
            <button onClick={handleGenerate} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 disabled:opacity-50 text-sm font-medium">
              <Sparkles className="w-4 h-4" /> Generate from job
            </button>
          )}
          {editable ? (
            <button onClick={handlePublish} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm font-medium">
              <Send className="w-4 h-4" /> Publish
            </button>
          ) : (
            <button onClick={handleNewDraft} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
              <FileEdit className="w-4 h-4" /> New draft
            </button>
          )}
        </div>
      </div>

      {/* status strip */}
      <div className="flex items-center gap-3 text-sm">
        {draft ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600"><FileEdit className="w-3.5 h-3.5" />Editing draft v{draft.version_number}</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700"><Lock className="w-3.5 h-3.5" />No draft — published versions are read-only</span>
        )}
        {publishedVersions.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700"><Check className="w-3.5 h-3.5" />{publishedVersions.length} published</span>
        )}
      </div>

      {error && <Banner type="error" onClose={() => setError('')}>{error}</Banner>}
      {success && <Banner type="success" onClose={() => setSuccess('')}>{success}</Banner>}

      {!draft && publishedVersions.length === 0 ? (
        <Banner type="error">This interview has no versions. Use “New draft” to start building.</Banner>
      ) : (
        <>
          <div className="flex items-center gap-1 border-b border-neutral-200">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            {!draft ? (
              <p className="text-sm text-neutral-500">Showing the latest published version is read-only. Create a new draft to make changes.</p>
            ) : tab === 'settings' ? (
              <SettingsTab version={draft} editable={editable} onSave={saveSettings} onError={setError} />
            ) : tab === 'prescreen' ? (
              <PrescreenTab version={draft} editable={editable} onError={setError} />
            ) : tab === 'questions' ? (
              <QuestionsTab version={draft} editable={editable} questions={questions} reload={reloadContent} onError={setError} />
            ) : tab === 'rubric' ? (
              <RubricTab version={draft} editable={editable} rubric={rubric} reload={reloadContent} onError={setError} />
            ) : (
              <PreviewTab version={draft} onError={setError} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default InterviewBuilderPage
