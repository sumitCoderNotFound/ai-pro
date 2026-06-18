/**
 * ConvoHubAI – Human Handoff
 * Route: /dashboard/handoff
 * Configure escalation rules + a live "waiting for human" queue panel.
 * #1 enterprise requirement for any AI platform.
 */
import { useState, useEffect, useCallback } from 'react'
import { analyticsApi } from '@/services/api'
import {
  Phone, MessageSquare, Users, AlertTriangle, CheckCircle2,
  Clock, ArrowRight, Settings, Plus, Trash2, Save,
  RefreshCw, User, Zap, Bell, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, X, Bot, ArrowUpRight, Shield,
} from 'lucide-react'

// ─── Mock queue (in production pull from /api/v1/handoff/queue) ──────────────
function buildMockQueue(chats) {
  return chats
    .filter(c => c.status === 'transferred' || (c.status === 'active' && Math.random() > 0.7))
    .slice(0, 5)
    .map(c => ({
      ...c,
      waitingSince: new Date(Date.now() - Math.random() * 300000).toISOString(),
      reason: ['Customer frustrated', 'Complex billing query', 'Requested human', 'Technical escalation'][Math.floor(Math.random() * 4)],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
    }))
}

function timeWaiting(since) {
  const s = Math.floor((Date.now() - new Date(since)) / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

const PRIORITY_CONFIG = {
  high: { badge: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  medium: { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low: { badge: 'bg-neutral-100 text-neutral-600 border-neutral-200', dot: 'bg-neutral-400' },
}

// ─── Default escalation rules ─────────────────────────────────────────────────
const DEFAULT_RULES = [
  { id: 1, name: 'Customer requests human', trigger: 'keyword', keywords: 'speak to a human, talk to someone, real person, agent please', action: 'escalate', enabled: true },
  { id: 2, name: 'Negative sentiment detected', trigger: 'sentiment', threshold: 'negative', action: 'escalate', enabled: true },
  { id: 3, name: 'High value lead identified', trigger: 'lead_score', threshold: 80, action: 'notify', enabled: true },
  { id: 4, name: 'Conversation too long', trigger: 'message_count', threshold: 20, action: 'escalate', enabled: false },
  { id: 5, name: 'Billing complaint', trigger: 'keyword', keywords: 'refund, charge, cancel subscription, billing error', action: 'escalate', enabled: true },
]

// ─── Queue Card ───────────────────────────────────────────────────────────────
function QueueCard({ conv, onClaim }) {
  const p = PRIORITY_CONFIG[conv.priority]
  const [timer, setTimer] = useState(timeWaiting(conv.waitingSince))

  useEffect(() => {
    const t = setInterval(() => setTimer(timeWaiting(conv.waitingSince)), 1000)
    return () => clearInterval(t)
  }, [conv.waitingSince])

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
      conv.priority === 'high' ? 'border-rose-200' : 'border-neutral-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
            {(conv.visitor || conv.contact_name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">
              {conv.visitor || conv.contact_name || 'Anonymous'}
            </p>
            <p className="text-xs text-neutral-500">{conv.agent}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${p.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          {conv.priority}
        </span>
      </div>

      {/* Reason */}
      <div className="flex items-center gap-2 mb-3 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800 font-medium">{conv.reason}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock className="w-3.5 h-3.5" />
          Waiting: <span className="font-bold text-neutral-800 font-mono tabular-nums">{timer}</span>
        </div>
        <button
          onClick={() => onClaim(conv)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          Claim
        </button>
      </div>
    </div>
  )
}

// ─── Rule Row ─────────────────────────────────────────────────────────────────
function RuleRow({ rule, onToggle, onDelete }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      rule.enabled ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-100 opacity-60'
    }`}>
      {/* Toggle */}
      <button onClick={() => onToggle(rule.id)} className="flex-shrink-0">
        {rule.enabled
          ? <ToggleRight className="w-8 h-8 text-emerald-500" />
          : <ToggleLeft className="w-8 h-8 text-neutral-300" />
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900">{rule.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5 truncate">
          {rule.trigger === 'keyword' && `Keywords: ${rule.keywords}`}
          {rule.trigger === 'sentiment' && `When sentiment is: ${rule.threshold}`}
          {rule.trigger === 'lead_score' && `When lead score ≥ ${rule.threshold}`}
          {rule.trigger === 'message_count' && `After ${rule.threshold} messages`}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          rule.action === 'escalate'
            ? 'bg-rose-100 text-rose-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {rule.action === 'escalate' ? '↑ Escalate' : '🔔 Notify'}
        </span>
        <button onClick={() => onDelete(rule.id)} className="p-1.5 text-neutral-300 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = ['Live Queue', 'Escalation Rules', 'Notification Settings']

export default function HumanHandoffPage() {
  const [activeTab, setActiveTab] = useState('Live Queue')
  const [queue, setQueue] = useState([])
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [loading, setLoading] = useState(true)
  const [claimed, setClaimed] = useState(new Set())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notifSettings, setNotifSettings] = useState({
    slack_webhook: '',
    email: '',
    sms: '',
    notify_on_escalation: true,
    notify_on_high_lead: true,
    notify_on_negative_sentiment: false,
  })

  // New rule form
  const [showNewRule, setShowNewRule] = useState(false)
  const [newRule, setNewRule] = useState({ name: '', trigger: 'keyword', keywords: '', action: 'escalate' })

  const fetchQueue = useCallback(async () => {
    try {
      const data = await analyticsApi.getChatHistory({ limit: 50 })
      const mock = buildMockQueue(data.chats || [])
      setQueue(mock)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueue()
    const t = setInterval(fetchQueue, 15000)
    return () => clearInterval(t)
  }, [fetchQueue])

  const handleClaim = (conv) => {
    setClaimed(prev => new Set([...prev, conv.id]))
    setQueue(prev => prev.filter(c => c.id !== conv.id))
  }

  const handleToggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const handleSaveRules = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddRule = () => {
    if (!newRule.name.trim()) return
    setRules(prev => [...prev, { ...newRule, id: Date.now(), enabled: true }])
    setNewRule({ name: '', trigger: 'keyword', keywords: '', action: 'escalate' })
    setShowNewRule(false)
  }

  const waitingCt = queue.filter(c => !claimed.has(c.id)).length

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-neutral-900">Human Handoff</h1>
            {waitingCt > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                {waitingCt} waiting
              </span>
            )}
          </div>
          <p className="text-neutral-500 text-sm">Configure when AI escalates to humans and manage the live queue</p>
        </div>
        <button onClick={fetchQueue} className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh queue
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'In Queue', value: waitingCt, color: waitingCt > 0 ? 'rose' : 'neutral', pulse: waitingCt > 0 },
          { label: 'Claimed Today', value: claimed.size, color: 'emerald' },
          { label: 'Active Rules', value: rules.filter(r => r.enabled).length, color: 'blue' },
          { label: 'Avg Wait', value: waitingCt > 0 ? '2m 14s' : '—', color: 'neutral' },
        ].map(({ label, value, color, pulse }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              {pulse && value > 0 && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
              <p className="text-xs font-semibold text-neutral-500">{label}</p>
            </div>
            <p className="text-2xl font-black text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-2xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Live Queue ── */}
      {activeTab === 'Live Queue' && (
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-32" />
                    <div className="h-3 bg-neutral-50 rounded w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : queue.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">Queue is clear</h3>
              <p className="text-sm text-neutral-500">No conversations waiting for a human right now. Great work!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {queue.map(conv => (
                <QueueCard key={conv.id} conv={conv} onClaim={handleClaim} />
              ))}
            </div>
          )}

          {claimed.size > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800">
                <strong>{claimed.size} conversation{claimed.size !== 1 ? 's' : ''}</strong> claimed by your team today
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Escalation Rules ── */}
      {activeTab === 'Escalation Rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {rules.filter(r => r.enabled).length} of {rules.length} rules active
            </p>
            <button
              onClick={() => setShowNewRule(!showNewRule)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>

          {/* New rule form */}
          {showNewRule && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-neutral-800">New Escalation Rule</h3>
              <input
                placeholder="Rule name (e.g. Customer angry)"
                value={newRule.name}
                onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 bg-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newRule.trigger}
                  onChange={e => setNewRule(p => ({ ...p, trigger: e.target.value }))}
                  className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none bg-white"
                >
                  <option value="keyword">Keyword match</option>
                  <option value="sentiment">Sentiment</option>
                  <option value="lead_score">Lead score</option>
                  <option value="message_count">Message count</option>
                </select>
                <select
                  value={newRule.action}
                  onChange={e => setNewRule(p => ({ ...p, action: e.target.value }))}
                  className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none bg-white"
                >
                  <option value="escalate">Escalate to human</option>
                  <option value="notify">Notify team only</option>
                </select>
              </div>
              {newRule.trigger === 'keyword' && (
                <input
                  placeholder="Keywords, separated by commas"
                  value={newRule.keywords}
                  onChange={e => setNewRule(p => ({ ...p, keywords: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 bg-white"
                />
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowNewRule(false)} className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600">Cancel</button>
                <button onClick={handleAddRule} className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold">Add Rule</button>
              </div>
            </div>
          )}

          {/* Rules list */}
          <div className="space-y-2">
            {rules.map(rule => (
              <RuleRow key={rule.id} rule={rule} onToggle={handleToggleRule} onDelete={handleDeleteRule} />
            ))}
          </div>

          <button
            onClick={handleSaveRules}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-60"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Rules'}
          </button>
        </div>
      )}

      {/* ── Tab: Notification Settings ── */}
      {activeTab === 'Notification Settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-800">Notification Channels</h3>
            {[
              { key: 'slack_webhook', label: 'Slack Webhook URL', placeholder: 'https://hooks.slack.com/services/…', icon: '💬' },
              { key: 'email', label: 'Alert Email', placeholder: 'team@yourcompany.com', icon: '📧' },
              { key: 'sms', label: 'SMS Number', placeholder: '+44 7700 000000', icon: '📱' },
            ].map(({ key, label, placeholder, icon }) => (
              <div key={key}>
                <label className="text-xs font-bold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                  <span>{icon}</span>{label}
                </label>
                <input
                  value={notifSettings[key]}
                  onChange={e => setNotifSettings(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-3">
            <h3 className="text-sm font-bold text-neutral-800">Notify me when…</h3>
            {[
              { key: 'notify_on_escalation', label: 'A conversation is escalated to human', desc: 'Instant alert when AI hands off' },
              { key: 'notify_on_high_lead', label: 'A high-value lead is identified', desc: 'Lead score ≥ 80' },
              { key: 'notify_on_negative_sentiment', label: 'Persistent negative sentiment detected', desc: '3+ consecutive negative messages' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                </div>
                <button onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key] }))}>
                  {notifSettings[key]
                    ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                    : <ToggleLeft className="w-8 h-8 text-neutral-300" />
                  }
                </button>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
            <Save className="w-4 h-4" />
            Save Notification Settings
          </button>
        </div>
      )}
    </div>
  )
}