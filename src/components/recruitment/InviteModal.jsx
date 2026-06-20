import { useState, useEffect } from 'react'
import { recruitmentApi } from '@/services/api'
import { X, AlertCircle, Link2, Copy, Check, Ban, Send, Mail, Users } from 'lucide-react'

const STATUS_STYLE = {
  pending: 'bg-neutral-100 text-neutral-600',
  registered: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  expired: 'bg-neutral-100 text-neutral-500',
  revoked: 'bg-red-100 text-red-700',
}

const fullUrl = (path) => `${window.location.origin}${path}`

const InviteModal = ({ templateId, isOpen, onClose }) => {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [deadline, setDeadline] = useState('')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(null)
  const [bulkEmails, setBulkEmails] = useState('')
  const [bulkSend, setBulkSend] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [sendingId, setSendingId] = useState(null)
  const [notice, setNotice] = useState('')

  const load = async () => {
    try {
      setLoading(true); setError('')
      const res = await recruitmentApi.invites.list(templateId)
      setInvites(res.items || [])
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { if (isOpen) { load(); setEmail(''); setName(''); setMaxAttempts(1); setDeadline(''); setBulkEmails(''); setNotice(''); setError('') } }, [isOpen, templateId])

  const create = async () => {
    setCreating(true); setError('')
    try {
      await recruitmentApi.invites.create(templateId, {
        email: email || null,
        candidate_name: name || null,
        max_attempts: Math.max(1, Number(maxAttempts) || 1),
        expires_at: deadline ? new Date(deadline).toISOString() : null,
      })
      await load()
    } catch (err) {
      setError(err.message?.includes('publish') ? 'Publish the interview before creating invites.' : err.message)
    } finally { setCreating(false) }
  }

  const revoke = async (id) => { try { await recruitmentApi.invites.revoke(id); await load() } catch (err) { setError(err.message) } }

  const bulkCreate = async () => {
    const emails = bulkEmails.split(/[\s,;\n]+/).map((e) => e.trim()).filter((e) => e.includes('@'))
    if (emails.length === 0) { setError('Add at least one valid email.'); return }
    setBulkBusy(true); setError(''); setNotice('')
    try {
      const res = await recruitmentApi.invites.bulk(templateId, { emails, send_email: bulkSend, base_url: window.location.origin })
      const sent = (res.items || []).filter((i) => i.email_sent).length
      setNotice(`${(res.items || []).length} invites created${bulkSend ? `, ${sent} emailed` : ''}.`)
      setBulkEmails('')
      await load()
    } catch (err) {
      setError(err.message?.includes('publish') ? 'Publish the interview before creating invites.' : err.message)
    } finally { setBulkBusy(false) }
  }

  const sendOne = async (inv) => {
    setSendingId(inv.id); setError(''); setNotice('')
    try {
      const res = await recruitmentApi.invites.sendEmail(inv.id, { base_url: window.location.origin })
      setNotice(res.message)
    } catch (err) { setError(err.message) } finally { setSendingId(null) }
  }

  const copy = async (inv) => {
    const url = inv.invite_url ? fullUrl(inv.invite_url) : fullUrl(`/candidate/interview/${inv.token}`)
    try { await navigator.clipboard.writeText(url); setCopied(inv.id); setTimeout(() => setCopied(null), 1500) } catch { /* ignore */ }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2"><Link2 className="w-5 h-5 text-primary-600" /> Invite candidates</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-5">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>}
            {notice && <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm"><Check className="w-4 h-4 flex-shrink-0" />{notice}</div>}

            <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
              <p className="text-sm text-neutral-600">Generate a unique link for a candidate. They open it, consent, and take the interview — no login needed.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Candidate name (optional)"
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)"
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Attempts allowed</label>
                  <input type="number" min={1} value={maxAttempts} onChange={(e) => setMaxAttempts(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Deadline (optional)</label>
                  <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <p className="text-xs text-neutral-400">Add an email to lock this invite to that one candidate. Leave it empty for a shareable link anyone can use.</p>
              <button onClick={create} disabled={creating} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
                <Send className="w-4 h-4" /> {creating ? 'Generating…' : 'Generate invite link'}
              </button>
            </div>

            <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
              <p className="text-sm text-neutral-600 flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-500" /> Invite many at once. Paste emails (comma, space, or newline separated).</p>
              <textarea value={bulkEmails} onChange={(e) => setBulkEmails(e.target.value)} rows={3}
                placeholder={'a@example.com, b@example.com\nc@example.com'}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-2 text-sm text-neutral-600">
                  <input type="checkbox" checked={bulkSend} onChange={(e) => setBulkSend(e.target.checked)} className="w-4 h-4 accent-primary-600" />
                  Email the links (needs SMTP configured)
                </label>
                <button onClick={bulkCreate} disabled={bulkBusy} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium">
                  <Users className="w-4 h-4" /> {bulkBusy ? 'Working…' : 'Generate for all'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Invites</h3>
              {loading ? (
                <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" /></div>
              ) : invites.length === 0 ? (
                <p className="text-sm text-neutral-500">No invites yet.</p>
              ) : (
                <div className="space-y-2">
                  {invites.map((inv) => (
                    <div key={inv.id} className="flex items-center gap-3 border border-neutral-200 rounded-xl p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[inv.status] || STATUS_STYLE.pending}`}>{inv.status.replace('_', ' ')}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-neutral-800 truncate">{inv.candidate_name || inv.email || 'Unnamed invite'}</div>
                        <div className="text-xs text-neutral-400 truncate font-mono">{fullUrl(inv.invite_url || `/candidate/interview/${inv.token}`)}</div>
                      </div>
                      <button onClick={() => copy(inv)} className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 rounded-lg" title="Copy link">
                        {copied === inv.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {inv.email && inv.status !== 'revoked' && inv.status !== 'completed' && (
                        <button onClick={() => sendOne(inv)} disabled={sendingId === inv.id} className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 rounded-lg disabled:opacity-40" title={`Email ${inv.email}`}><Mail className="w-4 h-4" /></button>
                      )}
                      {inv.status !== 'revoked' && inv.status !== 'completed' && (
                        <button onClick={() => revoke(inv.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Revoke"><Ban className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteModal
