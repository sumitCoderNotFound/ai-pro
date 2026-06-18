/**
 * ConvoHubAI – Contact Profiles
 * Route: /dashboard/contacts
 * CRM-style unified contact view: every caller/visitor with conversation history,
 * lead score, sentiment trend, and intent history.
 */
import { useState, useEffect, useCallback } from 'react'
import { analyticsApi } from '@/services/api'
import {
  User, Phone, MessageSquare, Mail, Search, TrendingUp,
  TrendingDown, Star, Clock, Calendar, ChevronRight,
  Activity, ArrowRight, Filter, Download, MoreVertical,
  RefreshCw, AlertCircle, Globe, Video, Mic,
  CheckCircle2, XCircle, BarChart3,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return 'Never'
  const d = (Date.now() - new Date(dateStr)) / 1000
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.round(d / 60)}m ago`
  if (d < 86400) return `${Math.round(d / 3600)}h ago`
  if (d < 604800) return `${Math.round(d / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function scoreColor(score) {
  if (score >= 70) return { text: 'text-emerald-700', bg: 'bg-emerald-100', bar: 'bg-emerald-500' }
  if (score >= 45) return { text: 'text-amber-700', bg: 'bg-amber-100', bar: 'bg-amber-500' }
  return { text: 'text-rose-700', bg: 'bg-rose-100', bar: 'bg-rose-500' }
}

const SENTIMENT_EMOJI = { positive: '😊', neutral: '😐', negative: '😤' }
const CHANNEL_ICON = { voice: Phone, chat: MessageSquare, video: Video, sms: Mail }

// ─── Build contacts from conversation history ─────────────────────────────────
function buildContactsFromChats(chats) {
  const map = {}
  chats.forEach(chat => {
    const key = chat.visitor || 'anonymous'
    if (!map[key]) {
      map[key] = {
        id: key,
        name: chat.visitor || 'Anonymous',
        email: chat.visitor?.includes('@') ? chat.visitor : null,
        phone: chat.visitor?.startsWith('+') ? chat.visitor : null,
        conversations: [],
        firstSeen: chat.created_at || chat.date,
        lastSeen: chat.created_at || chat.date,
        totalMessages: 0,
        channels: new Set(),
        sentiments: [],
        agents: new Set(),
      }
    }
    const c = map[key]
    c.conversations.push(chat)
    c.totalMessages += parseInt(chat.messages) || 0
    c.channels.add(chat.channel || 'chat')
    c.agents.add(chat.agent || 'Unknown')
    if (chat.sentiment) c.sentiments.push(chat.sentiment)
    if (chat.created_at && chat.created_at > c.lastSeen) c.lastSeen = chat.created_at
    if (chat.created_at && chat.created_at < c.firstSeen) c.firstSeen = chat.created_at
  })

  return Object.values(map).map(c => {
    const posCount = c.sentiments.filter(s => s === 'positive').length
    const negCount = c.sentiments.filter(s => s === 'negative').length
    const total = c.sentiments.length || 1
    const overallSentiment = posCount / total > 0.5 ? 'positive' : negCount / total > 0.4 ? 'negative' : 'neutral'

    // Basic lead score
    let score = 40
    if (c.conversations.length >= 3) score += 15
    if (c.totalMessages >= 20) score += 15
    if (overallSentiment === 'positive') score += 20
    if (c.sentiments.length > 0) score += 10
    score = Math.min(100, score)

    return {
      ...c,
      channels: Array.from(c.channels),
      agents: Array.from(c.agents),
      conversationCount: c.conversations.length,
      overallSentiment,
      leadScore: score,
    }
  }).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ contact, onClick, selected }) {
  const sc = scoreColor(contact.leadScore)
  const sent = SENTIMENT_EMOJI[contact.overallSentiment] || '😐'

  return (
    <button
      onClick={() => onClick(contact)}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
        selected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {(contact.name || 'A')[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-bold text-neutral-900 truncate">{contact.name}</p>
            <span className="text-lg ml-1 flex-shrink-0" title={`Sentiment: ${contact.overallSentiment}`}>{sent}</span>
          </div>

          <p className="text-xs text-neutral-500 truncate mb-2">
            {contact.conversationCount} conversation{contact.conversationCount !== 1 ? 's' : ''} · {timeAgo(contact.lastSeen)}
          </p>

          {/* Lead score bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${sc.bar} transition-all duration-700`} style={{ width: `${contact.leadScore}%` }} />
            </div>
            <span className={`text-xs font-black ${sc.text} tabular-nums w-6 text-right`}>{contact.leadScore}</span>
          </div>
        </div>
      </div>

      {/* Channel icons */}
      <div className="flex gap-1 mt-3">
        {contact.channels.map(ch => {
          const Icon = CHANNEL_ICON[ch] || MessageSquare
          return (
            <div key={ch} className="w-5 h-5 bg-neutral-100 rounded flex items-center justify-center" title={ch}>
              <Icon className="w-3 h-3 text-neutral-500" />
            </div>
          )
        })}
      </div>
    </button>
  )
}

// ─── Contact Detail Panel ─────────────────────────────────────────────────────
function ContactDetail({ contact }) {
  if (!contact) return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-500 font-medium">Select a contact</p>
        <p className="text-sm text-neutral-400 mt-1">Click any contact to view their full profile</p>
      </div>
    </div>
  )

  const sc = scoreColor(contact.leadScore)
  const sent = SENTIMENT_EMOJI[contact.overallSentiment] || '😐'

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile header */}
      <div className="p-6 border-b border-neutral-100 bg-gradient-to-br from-neutral-50 to-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {(contact.name || 'A')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-neutral-900">{contact.name}</h2>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {contact.email && (
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Mail className="w-3 h-3" />{contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Phone className="w-3 h-3" />{contact.phone}
                </span>
              )}
            </div>
          </div>
          <span className="text-2xl">{sent}</span>
        </div>

        {/* Score + sentiment row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className={`text-center p-3 rounded-xl ${sc.bg}`}>
            <p className={`text-2xl font-black ${sc.text}`}>{contact.leadScore}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Lead Score</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-50">
            <p className="text-2xl font-black text-blue-700">{contact.conversationCount}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Conversations</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-violet-50">
            <p className="text-2xl font-black text-violet-700">{contact.totalMessages}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Messages</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="p-6 border-b border-neutral-100 space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Contact Info</h3>
        {[
          { label: 'First seen', value: timeAgo(contact.firstSeen) },
          { label: 'Last active', value: timeAgo(contact.lastSeen) },
          { label: 'Channels used', value: contact.channels.join(', ') },
          { label: 'Agents spoken to', value: contact.agents.slice(0, 3).join(', ') },
          { label: 'Sentiment', value: `${sent} ${contact.overallSentiment}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="text-xs text-neutral-500 flex-shrink-0 w-28">{label}</span>
            <span className="text-xs font-semibold text-neutral-800 text-right capitalize">{value}</span>
          </div>
        ))}
      </div>

      {/* Conversation history */}
      <div className="p-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Conversation History</h3>
        <div className="space-y-2">
          {contact.conversations.slice(0, 8).map((conv, i) => {
            const Icon = CHANNEL_ICON[conv.channel || 'chat'] || MessageSquare
            return (
              <div key={conv.id || i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="w-8 h-8 bg-white rounded-lg border border-neutral-200 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-700 truncate">{conv.agent || 'Unknown Agent'}</p>
                  <p className="text-[10px] text-neutral-400">{conv.messages || 0} messages · {conv.duration || '—'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    conv.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    conv.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-neutral-100 text-neutral-600'
                  }`}>
                    {conv.status || 'completed'}
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{conv.date || timeAgo(conv.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactProfilesPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await analyticsApi.getChatHistory({ limit: 200 })
      const chats = data.chats || []
      const built = buildContactsFromChats(chats)
      setContacts(built)
    } catch (err) {
      setError('Failed to load contacts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  const sorted = [...contacts]
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return b.leadScore - a.leadScore
      if (sortBy === 'conversations') return b.conversationCount - a.conversationCount
      return new Date(b.lastSeen) - new Date(a.lastSeen) // recent
    })

  const topScore = contacts.reduce((m, c) => c.leadScore > m ? c.leadScore : m, 0)
  const avgScore = contacts.length ? Math.round(contacts.reduce((s, c) => s + c.leadScore, 0) / contacts.length) : 0

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel — list */}
      <div className="w-full max-w-sm border-r border-neutral-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-black text-neutral-900">Contacts</h1>
              <p className="text-xs text-neutral-500">{contacts.length} unique visitors</p>
            </div>
            <button onClick={fetchContacts} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
              <RefreshCw className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Total', value: contacts.length },
              { label: 'Avg Score', value: avgScore },
              { label: 'Top Score', value: topScore },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-50 rounded-xl p-2 text-center">
                <p className="text-base font-black text-neutral-900">{value}</p>
                <p className="text-[10px] text-neutral-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts…"
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none bg-white text-neutral-600"
          >
            <option value="recent">Sort: Most Recent</option>
            <option value="score">Sort: Highest Score</option>
            <option value="conversations">Sort: Most Conversations</option>
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border-2 border-neutral-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-neutral-100 rounded w-32" />
                    <div className="h-2.5 bg-neutral-50 rounded w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">{error}</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-6 text-center">
              <User className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">No contacts yet</p>
              <p className="text-xs text-neutral-400 mt-1">Contacts appear when visitors chat with your agents</p>
            </div>
          ) : (
            sorted.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={setSelected}
                selected={selected?.id === contact.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <ContactDetail contact={selected} />
      </div>
    </div>
  )
}