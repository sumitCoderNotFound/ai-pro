/**
 * ConvoHubAI – Integrations Marketplace
 * Route: /dashboard/integrations
 * Visual integration marketplace. Makes product look like a platform.
 */
import { useState } from 'react'
import {
  Search, CheckCircle2, Clock, Zap, ArrowRight,
  Globe, Database, Phone, MessageSquare, Mail,
  BarChart3, Calendar, ShoppingCart, CreditCard,
  Briefcase, Users, Star, ExternalLink, ChevronRight,
} from 'lucide-react'

const INTEGRATIONS = [
  // CRM
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', icon: '🟠', description: 'Sync contacts, log calls, update deals automatically', status: 'available', popular: true, color: 'orange' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', icon: '☁️', description: 'Bi-directional sync with Salesforce CRM and Service Cloud', status: 'available', popular: true, color: 'blue' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', icon: '🟢', description: 'Auto-create deals and log activities from conversations', status: 'available', color: 'emerald' },
  { id: 'zoho', name: 'Zoho CRM', category: 'CRM', icon: '🔴', description: 'Connect leads and contacts to your Zoho workspace', status: 'coming_soon', color: 'red' },

  // Calendar & Scheduling
  { id: 'cal', name: 'Cal.com', category: 'Scheduling', icon: '📅', description: 'Let agents book meetings directly into your calendar', status: 'available', popular: true, color: 'neutral' },
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', icon: '🔵', description: 'Automatically schedule appointments via your Calendly links', status: 'available', color: 'blue' },
  { id: 'gcal', name: 'Google Calendar', category: 'Scheduling', icon: '📆', description: 'Check availability and create events in real time', status: 'available', color: 'blue' },

  // Communication
  { id: 'slack', name: 'Slack', category: 'Communication', icon: '💬', description: 'Get notified in Slack when agents escalate to humans', status: 'available', popular: true, color: 'violet' },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'Communication', icon: '📱', description: 'Deploy your agents on WhatsApp Business API', status: 'available', color: 'emerald' },
  { id: 'sms-twilio', name: 'Twilio SMS', category: 'Communication', icon: '📨', description: 'Send SMS follow-ups and confirmations after calls', status: 'available', color: 'red' },
  { id: 'teams', name: 'Microsoft Teams', category: 'Communication', icon: '💼', description: 'Route escalations and alerts to Teams channels', status: 'coming_soon', color: 'blue' },

  // E-commerce
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', icon: '🛍️', description: 'Look up orders, inventory and customer data in real time', status: 'available', popular: true, color: 'emerald' },
  { id: 'woocommerce', name: 'WooCommerce', category: 'E-commerce', icon: '🛒', description: 'Connect your WooCommerce store for order support', status: 'available', color: 'violet' },
  { id: 'stripe', name: 'Stripe', category: 'E-commerce', icon: '💳', description: 'Look up payments, subscriptions and invoices', status: 'coming_soon', color: 'indigo' },

  // Analytics
  { id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', icon: '📊', description: 'Track conversation events as GA4 custom events', status: 'available', color: 'amber' },
  { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', icon: '📈', description: 'Send conversation data to Mixpanel for user analytics', status: 'coming_soon', color: 'violet' },

  // Helpdesk
  { id: 'zendesk', name: 'Zendesk', category: 'Helpdesk', icon: '🎫', description: 'Create and update tickets directly from conversations', status: 'available', popular: true, color: 'emerald' },
  { id: 'freshdesk', name: 'Freshdesk', category: 'Helpdesk', icon: '🌿', description: 'Auto-create tickets and log conversations as notes', status: 'available', color: 'emerald' },
  { id: 'intercom', name: 'Intercom', category: 'Helpdesk', icon: '💬', description: 'Sync chat conversations with your Intercom inbox', status: 'coming_soon', color: 'blue' },

  // Automation
  { id: 'zapier', name: 'Zapier', category: 'Automation', icon: '⚡', description: 'Connect to 6,000+ apps via Zapier webhooks', status: 'available', popular: true, color: 'amber' },
  { id: 'make', name: 'Make (Integromat)', category: 'Automation', icon: '🔮', description: 'Build complex workflows triggered by conversations', status: 'available', color: 'violet' },
  { id: 'n8n', name: 'n8n', category: 'Automation', icon: '🔗', description: 'Self-hosted automation with n8n workflows', status: 'available', color: 'rose' },
]

const CATEGORIES = ['All', 'CRM', 'Scheduling', 'Communication', 'E-commerce', 'Helpdesk', 'Analytics', 'Automation']

const STATUS_CONFIG = {
  available: { label: 'Available', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', btn: 'bg-neutral-900 hover:bg-neutral-800 text-white' },
  coming_soon: { label: 'Coming Soon', badge: 'bg-neutral-100 text-neutral-600 border-neutral-200', btn: 'bg-neutral-100 text-neutral-500 cursor-not-allowed' },
  connected: { label: 'Connected', badge: 'bg-blue-100 text-blue-700 border-blue-200', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
}

function IntegrationCard({ integration, onConnect, connected }) {
  const cfg = STATUS_CONFIG[connected ? 'connected' : integration.status]
  const isAvailable = integration.status === 'available'

  return (
    <div className={`group bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
      connected ? 'border-emerald-300 shadow-emerald-100 shadow-md' :
      isAvailable ? 'border-neutral-200 hover:border-neutral-300 hover:shadow-md' :
      'border-neutral-100 opacity-70'
    }`}>
      {/* Top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-neutral-200 to-neutral-100" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl leading-none">{integration.icon}</div>
          <div className="flex items-center gap-2">
            {integration.popular && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />Popular
              </span>
            )}
            {connected && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>

        <h3 className="text-sm font-black text-neutral-900 mb-1">{integration.name}</h3>
        <p className="text-xs text-neutral-400 mb-1 font-semibold uppercase tracking-widest">{integration.category}</p>
        <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">{integration.description}</p>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
            {connected ? '✓ Connected' : cfg.label}
          </span>
          <button
            onClick={() => isAvailable && onConnect(integration)}
            disabled={!isAvailable && !connected}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${cfg.btn}`}
          >
            {connected ? 'Manage' : isAvailable ? 'Connect' : 'Notify Me'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [connected, setConnected] = useState(new Set(['zapier', 'slack', 'cal']))
  const [showModal, setShowModal] = useState(null)

  const filtered = INTEGRATIONS.filter(i => {
    const matchCat = category === 'All' || i.category === category
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleConnect = (integration) => {
    setShowModal(integration)
  }

  const confirmConnect = () => {
    if (showModal) {
      setConnected(prev => new Set([...prev, showModal.id]))
      setShowModal(null)
    }
  }

  const available = INTEGRATIONS.filter(i => i.status === 'available').length
  const connectedCt = connected.size

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Integrations</h1>
          <p className="text-neutral-500 text-sm mt-1">Connect your favourite tools. Make ConvoHubAI the centre of your stack.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-700">{connectedCt} connected</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl">
            <Zap className="w-4 h-4 text-neutral-500" />
            <span className="font-semibold text-neutral-600">{available} available</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search integrations…"
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                category === cat ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Connected banner */}
      {connectedCt > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800">
            <strong>{connectedCt} integration{connectedCt !== 1 ? 's' : ''}</strong> connected and sending data
          </p>
          <button className="ml-auto text-xs font-semibold text-emerald-700 hover:underline">Manage all</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={handleConnect}
            connected={connected.has(integration.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-neutral-500">No integrations match "{search}"</p>
        </div>
      )}

      {/* Webhook/API section */}
      <div className="bg-neutral-900 rounded-3xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-lg">Build your own integration</h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Use our Webhooks API to connect ConvoHubAI to any tool — if it has an API, we can integrate with it. Events fire in real time on every conversation, message, and escalation.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="/docs/webhooks" className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors border border-white/20">
              <ExternalLink className="w-4 h-4" />
              View Docs
            </a>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-sm font-semibold transition-colors">
              <Zap className="w-4 h-4" />
              Set up Webhook
            </button>
          </div>
        </div>
      </div>

      {/* Connect modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(null)} />
          <div className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{showModal.icon}</div>
                <h3 className="text-xl font-black text-neutral-900">Connect {showModal.name}</h3>
                <p className="text-sm text-neutral-500 mt-2">{showModal.description}</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-neutral-50 rounded-xl text-sm text-neutral-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Secure OAuth 2.0 connection — we never store your credentials
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl text-sm text-neutral-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  You can disconnect at any time from Settings
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(null)} className="flex-1 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-600">
                  Cancel
                </button>
                <button onClick={confirmConnect} className="flex-1 py-3 bg-neutral-900 text-white rounded-2xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
                  Connect {showModal.name}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}