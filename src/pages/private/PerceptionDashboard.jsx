/**
 * ConvoHubAI – Perception & Sentiment Analytics Dashboard
 * Real-time emotion, sentiment, engagement and lead-score insights
 */

import { useState, useEffect, useCallback } from 'react'
import { analyticsApi, agentsApi } from '@/services/api'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Zap,
  AlertCircle,
  BarChart3,
  Users,
  Target,
  RefreshCw,
  ChevronDown,
  Award,
  Sparkles,
  MessageSquare,
  Activity,
} from 'lucide-react'

// ─── tiny helpers ────────────────────────────────────────────────────────────

const SENTIMENT_COLORS = {
  positive: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', bar: '#10b981', ring: 'ring-emerald-500/40' },
  neutral:  { bg: 'bg-slate-500/20',   text: 'text-slate-400',   bar: '#64748b', ring: 'ring-slate-500/40'   },
  negative: { bg: 'bg-rose-500/20',    text: 'text-rose-400',    bar: '#f43f5e', ring: 'ring-rose-500/40'   },
}

const EMOTION_COLORS = {
  happy:      '#10b981',
  excited:    '#f59e0b',
  neutral:    '#64748b',
  confused:   '#8b5cf6',
  frustrated: '#f97316',
  angry:      '#ef4444',
  sad:        '#3b82f6',
}

const EMOTION_ICONS = {
  happy:      '😊',
  excited:    '🤩',
  neutral:    '😐',
  confused:   '😕',
  frustrated: '😤',
  angry:      '😠',
  sad:        '😢',
}

function pct(n) { return `${n}%` }

// ─── sub-components ──────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = 'blue', trend }) {
  const colors = {
    blue:    'from-blue-600/30 to-blue-800/10 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-600/30 to-emerald-800/10 border-emerald-500/20 text-emerald-400',
    amber:   'from-amber-600/30 to-amber-800/10 border-amber-500/20 text-amber-400',
    rose:    'from-rose-600/30 to-rose-800/10 border-rose-500/20 text-rose-400',
    violet:  'from-violet-600/30 to-violet-800/10 border-violet-500/20 text-violet-400',
  }[color]

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colors} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-white/5`}>
          <Icon size={20} className={colors.split(' ').find(c => c.startsWith('text-'))} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend > 0 ? <TrendingUp size={12} className="text-emerald-400" /> :
           trend < 0 ? <TrendingDown size={12} className="text-rose-400" /> :
                       <Minus size={12} className="text-slate-400" />}
          <span className={trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-slate-400'}>
            {trend > 0 ? '+' : ''}{trend}% vs prev period
          </span>
        </div>
      )}
    </div>
  )
}

function SentimentGauge({ positive = 0, neutral = 0, negative = 0 }) {
  return (
    <div className="space-y-3">
      {[
        { label: 'Positive', value: positive, color: '#10b981' },
        { label: 'Neutral',  value: neutral,  color: '#64748b' },
        { label: 'Negative', value: negative, color: '#f43f5e' },
      ].map(({ label, value, color }) => (
        <div key={label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">{label}</span>
            <span className="text-white font-bold">{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: pct(value), backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmotionWheel({ emotions = [] }) {
  if (!emotions.length) return (
    <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No data</div>
  )
  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map((e) => (
        <div
          key={e.name}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border border-white/10"
          style={{ backgroundColor: `${EMOTION_COLORS[e.name.toLowerCase()] || '#64748b'}22`, color: EMOTION_COLORS[e.name.toLowerCase()] || '#94a3b8' }}
        >
          <span>{EMOTION_ICONS[e.name.toLowerCase()] || '💬'}</span>
          <span>{e.name}</span>
          <span className="opacity-60">{e.pct}%</span>
        </div>
      ))}
    </div>
  )
}

function MiniBarChart({ data = [], xKey, bars }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No data yet</div>
  )

  const maxVal = Math.max(...data.flatMap(d => bars.map(b => d[b.key] || 0)), 1)

  return (
    <div className="flex items-end gap-1 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
          <div className="flex items-end gap-0.5 w-full h-28">
            {bars.map((b) => (
              <div
                key={b.key}
                className="flex-1 rounded-t transition-all duration-500"
                style={{
                  height: `${Math.round(((d[b.key] || 0) / maxVal) * 100)}%`,
                  minHeight: d[b.key] > 0 ? '3px' : '0',
                  backgroundColor: b.color,
                }}
                title={`${b.label}: ${d[b.key]}`}
              />
            ))}
          </div>
          <span className="text-[9px] text-slate-500 truncate w-full text-center">{d[xKey]}</span>
        </div>
      ))}
    </div>
  )
}

function IntentBadges({ intents = [] }) {
  if (!intents.length) return <span className="text-slate-500 text-sm">No intents detected</span>
  return (
    <div className="flex flex-wrap gap-2">
      {intents.map(({ name, count }) => (
        <div
          key={name}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs"
        >
          <span className="text-slate-300 font-medium">{name}</span>
          <span className="bg-violet-500/30 text-violet-300 rounded-full px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
        </div>
      ))}
    </div>
  )
}

function LeaderboardRow({ rank, agent, conversations, avg_lead_score, positive_rate }) {
  const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-600']
  const scoreColor =
    avg_lead_score >= 75 ? 'text-emerald-400' :
    avg_lead_score >= 50 ? 'text-amber-400' :
    'text-rose-400'

  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <span className={`w-6 text-center font-black text-sm ${rankColors[rank - 1] || 'text-slate-500'}`}>
        {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{agent}</p>
        <p className="text-xs text-slate-500">{conversations} conversations</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${scoreColor}`}>{avg_lead_score}</p>
        <p className="text-[10px] text-slate-500">lead score</p>
      </div>
      <div className="text-right w-14">
        <p className="text-sm font-bold text-emerald-400">{positive_rate}%</p>
        <p className="text-[10px] text-slate-500">positive</p>
      </div>
    </div>
  )
}

function EngagementRings({ high = 0, medium = 0, low = 0 }) {
  const total = high + medium + low
  const rings = [
    { label: 'High',   value: high,   color: '#10b981', r: 38 },
    { label: 'Medium', value: medium, color: '#f59e0b', r: 28 },
    { label: 'Low',    value: low,    color: '#f43f5e', r: 18 },
  ]
  const cx = 60

  return (
    <div className="flex items-center gap-6">
      <svg width={120} height={120} className="flex-shrink-0">
        <circle cx={cx} cy={cx} r={45} fill="none" stroke="#ffffff08" strokeWidth={12} />
        {rings.map(({ value, color, r }) => {
          const pctVal = total > 0 ? value / 100 : 0
          const circ = 2 * Math.PI * r
          return (
            <circle
              key={r}
              cx={cx} cy={cx} r={r}
              fill="none"
              stroke={color}
              strokeWidth={8}
              strokeDasharray={`${pctVal * circ} ${circ}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cx})`}
              opacity={0.85}
            />
          )
        })}
        <text x={cx} y={cx + 5} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold">
          {total > 0 ? `${high}%` : '—'}
        </text>
        <text x={cx} y={cx + 18} textAnchor="middle" fill="#64748b" fontSize={8}>
          high eng.
        </text>
      </svg>
      <div className="space-y-2 text-xs">
        {rings.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-slate-400">{label}</span>
            <span className="ml-auto font-bold text-white">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

const TIME_RANGES = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days',   value: '7d'  },
  { label: '30 Days',  value: '30d' },
  { label: '90 Days',  value: '90d' },
]

export default function PerceptionDashboard() {
  const [timeRange, setTimeRange]   = useState('7d')
  const [agentFilter, setAgentFilter] = useState('')
  const [agents, setAgents]         = useState([])
  const [data, setData]             = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [overview, lb, agentsRes] = await Promise.all([
        analyticsApi.getPerceptionOverview(timeRange, agentFilter || null),
        analyticsApi.getPerceptionLeaderboard(timeRange),
        agentsApi.list({}),
      ])
      setData(overview)
      setLeaderboard(lb.leaderboard || [])
      setAgents(agentsRes.items || [])
      setLastRefresh(new Date())
    } catch (err) {
      console.error(err)
      setError('Failed to load perception analytics.')
    } finally {
      setLoading(false)
    }
  }, [timeRange, agentFilter])

  useEffect(() => { fetchData() }, [fetchData])

  // ── loading / error states ────────────────────────────────────────
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle size={40} className="text-rose-400" />
      <p className="text-slate-300">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition">
        Retry
      </button>
    </div>
  )

  const s = data?.sentiment || {}
  const e = data?.emotions || []
  const eng = data?.engagement || {}
  const timeline = data?.sentiment_timeline || []
  const intents  = data?.top_intents || []

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 sm:px-6 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-violet-600/20">
              <Brain size={18} className="text-violet-400" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Perception Analytics</h1>
            <span className="text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
              LIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Emotion · Sentiment · Engagement · Lead Intelligence
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Agent filter */}
          <div className="relative">
            <select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">All Agents</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Time range */}
          <div className="flex rounded-lg border border-white/10 overflow-hidden bg-white/5 text-xs">
            {TIME_RANGES.map(tr => (
              <button
                key={tr.value}
                onClick={() => setTimeRange(tr.value)}
                className={`px-3 py-2 font-semibold transition ${
                  timeRange === tr.value
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            <RefreshCw size={14} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-slate-400 text-sm">Analysing conversations…</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Stat cards row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={MessageSquare}
              label="Conversations"
              value={data?.total_conversations?.toLocaleString() ?? '—'}
              sub={`${data?.analyzed_conversations ?? 0} analysed`}
              color="blue"
            />
            <StatCard
              icon={Target}
              label="Avg Lead Score"
              value={data?.avg_lead_score ?? '—'}
              sub="out of 100"
              color={data?.avg_lead_score >= 70 ? 'emerald' : data?.avg_lead_score >= 45 ? 'amber' : 'rose'}
            />
            <StatCard
              icon={Heart}
              label="Positive Rate"
              value={s.positive != null ? `${s.positive}%` : '—'}
              sub="of user messages"
              color="emerald"
            />
            <StatCard
              icon={Zap}
              label="High Engagement"
              value={eng.high != null ? `${eng.high}%` : '—'}
              sub="of conversations"
              color="amber"
            />
          </div>

          {/* ── Middle row: sentiment + emotions + engagement ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Sentiment breakdown */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={15} className="text-violet-400" />
                <h2 className="text-sm font-bold text-slate-200">Sentiment Breakdown</h2>
              </div>
              <SentimentGauge
                positive={s.positive ?? 0}
                neutral={s.neutral ?? 0}
                negative={s.negative ?? 0}
              />
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
                <span>+: {s.counts?.positive ?? 0}</span>
                <span>~: {s.counts?.neutral ?? 0}</span>
                <span>–: {s.counts?.negative ?? 0}</span>
              </div>
            </div>

            {/* Emotion wheel */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200">Dominant Emotions</h2>
              </div>
              <EmotionWheel emotions={e} />
              {!e.length && (
                <p className="text-xs text-slate-500 mt-2">
                  Send messages through agents to generate emotion data
                </p>
              )}
            </div>

            {/* Engagement rings */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={15} className="text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-200">Engagement Levels</h2>
              </div>
              <EngagementRings
                high={eng.high ?? 0}
                medium={eng.medium ?? 0}
                low={eng.low ?? 0}
              />
            </div>
          </div>

          {/* ── Sentiment timeline ── */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-blue-400" />
                <h2 className="text-sm font-bold text-slate-200">Sentiment Over Time</h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                {[
                  { label: 'Positive', color: '#10b981' },
                  { label: 'Neutral',  color: '#64748b' },
                  { label: 'Negative', color: '#f43f5e' },
                ].map(l => (
                  <span key={l.label} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
            <MiniBarChart
              data={timeline}
              xKey="date"
              bars={[
                { key: 'positive', color: '#10b981', label: 'Positive' },
                { key: 'neutral',  color: '#475569', label: 'Neutral'  },
                { key: 'negative', color: '#f43f5e', label: 'Negative' },
              ]}
            />
          </div>

          {/* ── Bottom row: intents + leaderboard ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Intent distribution */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={15} className="text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200">Detected Intents</h2>
              </div>
              <IntentBadges intents={intents} />
              {!intents.length && (
                <p className="text-xs text-slate-500 mt-2">
                  Intent data will appear once conversations are logged
                </p>
              )}
            </div>

            {/* Agent leaderboard */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award size={15} className="text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200">Agent Leaderboard</h2>
                <span className="ml-auto text-[10px] text-slate-500">by lead score</span>
              </div>
              {leaderboard.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-slate-500 text-sm">
                  No agent data yet
                </div>
              ) : (
                <div>
                  {leaderboard.slice(0, 6).map((row, i) => (
                    <LeaderboardRow key={row.agent_id} rank={i + 1} {...row} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-600">
            {lastRefresh && `Last updated ${lastRefresh.toLocaleTimeString()}`}
            {' · '}Perception analysis powered by ConvoHubAI NLP engine
          </p>
        </>
      )}
    </div>
  )
}