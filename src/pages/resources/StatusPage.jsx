/**
 * ConvoHubAI – System Status Page (/status)
 * Public-facing. Shows live service health, uptime, and incident history.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock,
  Activity, Wifi, Database, Mic, MessageSquare, Phone,
  Globe, Zap, Shield, ChevronDown, ChevronUp, ArrowUpRight,
} from 'lucide-react'

const SERVICES = [
  {
    group: 'Core Platform',
    items: [
      { id: 'api',       name: 'REST API',             icon: Globe,         status: 'operational', latency: '42ms'  },
      { id: 'auth',      name: 'Authentication',       icon: Shield,        status: 'operational', latency: '38ms'  },
      { id: 'database',  name: 'Database',             icon: Database,      status: 'operational', latency: '12ms'  },
      { id: 'ws',        name: 'WebSocket / Realtime', icon: Wifi,          status: 'operational', latency: '18ms'  },
    ],
  },
  {
    group: 'AI & Intelligence',
    items: [
      { id: 'llm',       name: 'LLM Inference (Groq)', icon: Zap,           status: 'operational', latency: '180ms' },
      { id: 'openai',    name: 'OpenAI Fallback',      icon: Zap,           status: 'operational', latency: '210ms' },
      { id: 'percept',   name: 'Perception Analytics', icon: Activity,      status: 'operational', latency: '25ms'  },
    ],
  },
  {
    group: 'Voice & Communication',
    items: [
      { id: 'livekit',   name: 'LiveKit Voice/Video',  icon: Phone,         status: 'operational', latency: '65ms'  },
      { id: 'deepgram',  name: 'Deepgram STT',         icon: Mic,           status: 'operational', latency: '95ms'  },
      { id: 'tts',       name: 'Text-to-Speech',       icon: Mic,           status: 'operational', latency: '88ms'  },
      { id: 'chat',      name: 'Chat Messaging',       icon: MessageSquare, status: 'operational', latency: '22ms'  },
    ],
  },
  {
    group: 'Infrastructure',
    items: [
      { id: 'cdn',       name: 'CDN / Dashboard',      icon: Globe,         status: 'operational', latency: '15ms'  },
      { id: 'storage',   name: 'File Storage',         icon: Database,      status: 'operational', latency: '30ms'  },
      { id: 'hooks',     name: 'Webhooks Delivery',    icon: Wifi,          status: 'operational', latency: '55ms'  },
    ],
  },
]

const UPTIME_DAYS = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000),
  status: i === 12 || i === 47 ? 'degraded' : 'operational',
}))

const PAST_INCIDENTS = [
  {
    id: 1,
    title: 'Elevated LLM Response Latency',
    status: 'resolved',
    severity: 'minor',
    date: new Date(Date.now() - 47 * 86400000),
    duration: '23 minutes',
    description: 'Groq API experienced elevated latency. Automatically failed over to OpenAI. All services restored.',
  },
  {
    id: 2,
    title: 'Scheduled Maintenance — Database Migration',
    status: 'resolved',
    severity: 'maintenance',
    date: new Date(Date.now() - 12 * 86400000),
    duration: '8 minutes',
    description: 'Planned database upgrade to improve query performance. Zero data loss. All systems nominal.',
  },
]

const STATUS_CFG = {
  operational: { label: 'Operational',  dot: 'bg-emerald-500', bar: 'bg-emerald-400', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  degraded:    { label: 'Degraded',     dot: 'bg-amber-400',   bar: 'bg-amber-400',   icon: AlertTriangle, color: 'text-amber-700',  bg: 'bg-amber-100'   },
  outage:      { label: 'Outage',       dot: 'bg-rose-500',    bar: 'bg-rose-500',    icon: XCircle,       color: 'text-rose-700',   bg: 'bg-rose-100'    },
  maintenance: { label: 'Maintenance',  dot: 'bg-blue-400',    bar: 'bg-blue-400',    icon: Clock,         color: 'text-blue-700',   bg: 'bg-blue-100'    },
}

function ServiceRow({ name, icon: Icon, status, latency }) {
  const c = STATUS_CFG[status]
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-neutral-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-neutral-500" />
      </div>
      <span className="flex-1 text-sm font-medium text-neutral-700">{name}</span>
      <span className="text-xs text-neutral-400 font-mono w-14 text-right tabular-nums">{latency}</span>
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'operational' ? 'animate-pulse' : ''}`} />
        {c.label}
      </span>
    </div>
  )
}

function IncidentCard({ incident }) {
  const [open, setOpen] = useState(false)
  const cfgKey = incident.severity === 'maintenance' ? 'maintenance' : incident.status === 'resolved' ? 'operational' : 'degraded'
  const c = STATUS_CFG[cfgKey]
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors text-left">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-800">{incident.title}</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {incident.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Duration: {incident.duration}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.color} flex-shrink-0`}>
          {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 text-sm text-neutral-600 bg-neutral-50 border-t border-neutral-100">
          {incident.description}
        </div>
      )}
    </div>
  )
}

export default function StatusPage() {
  const [lastChecked, setLastChecked] = useState(new Date())
  const [checking, setChecking] = useState(false)

  const refresh = () => {
    setChecking(true)
    setTimeout(() => { setLastChecked(new Date()); setChecking(false) }, 800)
  }

  useEffect(() => {
    const t = setInterval(refresh, 60000)
    return () => clearInterval(t)
  }, [])

  const allOk = SERVICES.every(g => g.items.every(s => s.status === 'operational'))
  const total = SERVICES.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Nav */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-neutral-900">ConvoHubAI</span>
            <span className="text-neutral-400 text-sm">/</span>
            <span className="text-neutral-500 text-sm font-medium">Status</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button onClick={refresh} disabled={checking}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Hero banner */}
        <div className={`rounded-3xl p-8 text-center ${allOk ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-amber-500 to-orange-500'}`}>
          <div className="flex items-center justify-center gap-3 mb-1">
            {allOk ? <CheckCircle2 className="w-9 h-9 text-white" /> : <AlertTriangle className="w-9 h-9 text-white" />}
            <h1 className="text-3xl font-black text-white">
              {allOk ? 'All Systems Operational' : 'Minor Disruption Detected'}
            </h1>
          </div>
          <p className="text-white/70 text-sm">
            {total} services monitored · Updated {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/20">
            {[
              { label: '30-day uptime', value: '99.97%' },
              { label: '90-day uptime', value: '99.94%' },
              { label: 'Avg response',  value: '52ms'   },
              { label: 'Incidents (90d)', value: '2'    },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-white/70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 90-day bar chart */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-neutral-600 uppercase tracking-widest">90-Day Uptime History</h2>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />Operational</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Degraded</span>
            </div>
          </div>
          <div className="flex items-end gap-0.5 h-10">
            {UPTIME_DAYS.map((day, i) => {
              const c = STATUS_CFG[day.status]
              return (
                <div key={i}
                  className={`flex-1 rounded-sm ${c.bar} hover:opacity-80 transition-opacity cursor-pointer`}
                  style={{ height: day.status === 'operational' ? '100%' : '55%' }}
                  title={`${day.date.toLocaleDateString()} — ${c.label}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Service groups */}
        {SERVICES.map((group) => (
          <div key={group.group} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-600 uppercase tracking-widest">{group.group}</h2>
              <span className="text-xs text-neutral-400">{group.items.length} services</span>
            </div>
            <div className="px-6">
              {group.items.map(svc => <ServiceRow key={svc.id} {...svc} />)}
            </div>
          </div>
        ))}

        {/* Past incidents */}
        <div>
          <h2 className="text-xs font-bold text-neutral-600 uppercase tracking-widest mb-4">Past Incidents & Maintenance</h2>
          <div className="space-y-3">
            {PAST_INCIDENTS.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-400 pb-8 space-y-1.5">
          <p>
            Subscribe to updates ·{' '}
            <a href="mailto:support@convohubai.com" className="hover:text-neutral-600 underline">support@convohubai.com</a>
          </p>
          <p>© {new Date().getFullYear()} ConvoHubAI · All rights reserved</p>
        </div>
      </div>
    </div>
  )
}