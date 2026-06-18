/**
 * ConvoHubAI – Billing & Usage Page (Point 11)
 * Full production billing page: plan cards, usage meters, invoice history,
 * payment method management. Looks like Stripe's own billing portal.
 */
import { useState } from 'react'
import {
  CreditCard, Download, Check, Zap, Phone, MessageSquare,
  Bot, Clock, ArrowRight, AlertCircle, CheckCircle2,
  TrendingUp, Plus, Shield, Star, Sparkles, ChevronRight,
  Receipt, Calendar, RefreshCw,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Try ConvoHubAI risk-free',
    color: 'neutral',
    features: [
      '1 AI Agent',
      '100 conversations/month',
      '50 voice minutes/month',
      'Chat & voice channels',
      'Basic analytics',
      'Community support',
    ],
    limits: { conversations: 100, voice_mins: 50, agents: 1 },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    description: 'For small teams getting started',
    color: 'blue',
    popular: false,
    features: [
      '3 AI Agents',
      '2,000 conversations/month',
      '500 voice minutes/month',
      'All channels (voice, chat, video)',
      'Full analytics + Perception AI',
      'Email & chat support',
      'Knowledge Base (3 docs)',
      'Webhook integrations',
    ],
    limits: { conversations: 2000, voice_mins: 500, agents: 3 },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 149,
    period: 'month',
    description: 'For growing businesses',
    color: 'indigo',
    popular: true,
    features: [
      '10 AI Agents',
      '10,000 conversations/month',
      '2,000 voice minutes/month',
      'All channels + WhatsApp',
      'Perception AI + Lead scoring',
      'Priority support (4h SLA)',
      'Unlimited Knowledge Bases',
      'CRM integrations (HubSpot, Salesforce)',
      'Human Handoff queue',
      'White-label embed',
    ],
    limits: { conversations: 10000, voice_mins: 2000, agents: 10 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    period: 'month',
    description: 'Custom for large organisations',
    color: 'neutral',
    features: [
      'Unlimited Agents',
      'Unlimited conversations',
      'Unlimited voice minutes',
      'Dedicated infrastructure',
      'Custom SLA (99.99% uptime)',
      'Dedicated account manager',
      'SSO / SAML',
      'On-premise deployment option',
      'Custom integrations',
      'HIPAA / SOC2 compliance docs',
    ],
    limits: { conversations: Infinity, voice_mins: Infinity, agents: Infinity },
  },
]

const INVOICES = [
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: 149.00, status: 'paid', plan: 'Professional' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: 149.00, status: 'paid', plan: 'Professional' },
  { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: 49.00, status: 'paid', plan: 'Starter' },
  { id: 'INV-2025-011', date: 'Nov 1, 2025', amount: 49.00, status: 'paid', plan: 'Starter' },
  { id: 'INV-2025-010', date: 'Oct 1, 2025', amount: 49.00, status: 'paid', plan: 'Starter' },
]

const CURRENT_PLAN_ID = 'professional'
const USAGE = {
  conversations: { used: 3847, limit: 10000, label: 'Conversations', icon: MessageSquare, color: 'blue' },
  voice_mins:    { used: 612,  limit: 2000,  label: 'Voice Minutes', icon: Phone,         color: 'emerald' },
  agents:        { used: 4,    limit: 10,    label: 'Active Agents', icon: Bot,           color: 'violet' },
  knowledge:     { used: 8,    limit: null,  label: 'Knowledge Docs', icon: Zap,          color: 'amber' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(used, limit) {
  if (!limit) return null
  return Math.min(100, Math.round((used / limit) * 100))
}
function barColor(p) {
  if (p >= 90) return 'bg-rose-500'
  if (p >= 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}
const COLOR_MAP = {
  blue:    { badge: 'bg-blue-100 text-blue-700',     ring: 'ring-blue-400',    btn: 'bg-blue-600 hover:bg-blue-700',       border: 'border-blue-300',    bg: 'bg-blue-50'    },
  indigo:  { badge: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-400',  btn: 'bg-indigo-600 hover:bg-indigo-700',   border: 'border-indigo-400',  bg: 'bg-indigo-50'  },
  neutral: { badge: 'bg-neutral-100 text-neutral-700', ring: 'ring-neutral-300', btn: 'bg-neutral-900 hover:bg-neutral-800', border: 'border-neutral-300', bg: 'bg-neutral-50' },
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, current, onUpgrade, onDowngrade, onContact }) {
  const isCurrent = plan.id === current
  const currentPlan = PLANS.find(p => p.id === current)
  const isUpgrade = plan.price > (currentPlan?.price || 0)
  const c = COLOR_MAP[plan.color] || COLOR_MAP.neutral

  return (
    <div className={`relative rounded-3xl border-2 flex flex-col transition-all duration-200 overflow-hidden ${
      isCurrent
        ? `${c.border} ring-2 ${c.ring} shadow-lg`
        : plan.popular
          ? 'border-indigo-300 shadow-md hover:shadow-lg'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
    }`}>
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-black text-center py-1.5 tracking-widest uppercase">
          ⭐ Most Popular
        </div>
      )}
      {isCurrent && !plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-xs font-black text-center py-1.5 tracking-widest uppercase">
          ✓ Your Current Plan
        </div>
      )}

      <div className={`p-6 flex-1 ${(plan.popular || isCurrent) ? 'pt-8' : ''} ${c.bg}`}>
        {/* Name + price */}
        <div className="mb-5">
          <h3 className="text-lg font-black text-neutral-900">{plan.name}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">{plan.description}</p>
          <div className="mt-3 flex items-baseline gap-1">
            {plan.price !== null ? (
              <>
                <span className="text-4xl font-black text-neutral-900">${plan.price}</span>
                <span className="text-neutral-500 text-sm">/{plan.period}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-neutral-900">Custom pricing</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-5 pt-0 bg-white border-t border-neutral-100">
        {isCurrent ? (
          <div className="w-full py-3 bg-neutral-100 text-neutral-500 rounded-2xl text-sm font-semibold text-center">
            Current Plan
          </div>
        ) : plan.id === 'enterprise' ? (
          <button
            onClick={onContact}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-neutral-900 text-neutral-900 rounded-2xl text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-all"
          >
            Contact Sales <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => isUpgrade ? onUpgrade(plan) : onDowngrade(plan)}
            className={`w-full flex items-center justify-center gap-2 py-3 ${c.btn} text-white rounded-2xl text-sm font-semibold transition-all`}
          >
            {isUpgrade ? (
              <><TrendingUp className="w-4 h-4" /> Upgrade to {plan.name}</>
            ) : (
              <>Downgrade</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Usage Meter ──────────────────────────────────────────────────────────────
function UsageMeter({ label, used, limit, icon: Icon, color }) {
  const p = pct(used, limit)
  const unlimited = limit === null

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-4 h-4 text-${color}-600`} />
          </div>
          <span className="text-sm font-semibold text-neutral-700">{label}</span>
        </div>
        <span className="text-sm font-black text-neutral-900 tabular-nums">
          {used.toLocaleString()}
          {!unlimited && <span className="text-neutral-400 font-normal"> / {limit.toLocaleString()}</span>}
        </span>
      </div>
      {unlimited ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
          </div>
          <span className="text-xs font-bold text-emerald-600">Unlimited</span>
        </div>
      ) : (
        <>
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor(p)}`}
              style={{ width: `${p}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className={`text-xs font-semibold ${p >= 90 ? 'text-rose-600' : p >= 70 ? 'text-amber-600' : 'text-neutral-400'}`}>
              {p}% used
            </span>
            <span className="text-xs text-neutral-400">{(limit - used).toLocaleString()} remaining</span>
          </div>
          {p >= 90 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Almost at limit — consider upgrading
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Upgrade Modal ─────────────────────────────────────────────────────────────
function UpgradeModal({ plan, onClose, onConfirm }) {
  if (!plan) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h2 className="text-2xl font-black">Upgrade to {plan.name}</h2>
            <p className="text-indigo-200 text-sm mt-1">${plan.price}/month, billed monthly</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              {plan.features.slice(0, 5).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Cancel anytime. No long-term contracts. Prorated if you upgrade mid-cycle.
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
              <button onClick={() => onConfirm(plan)} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState(CURRENT_PLAN_ID)
  const [upgradeModal, setUpgradeModal] = useState(null)
  const [upgraded, setUpgraded] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const SECTIONS = ['overview', 'plans', 'invoices']
  const currentPlanData = PLANS.find(p => p.id === currentPlan)

  const handleUpgrade = (plan) => setUpgradeModal(plan)
  const handleConfirmUpgrade = (plan) => {
    setCurrentPlan(plan.id)
    setUpgradeModal(null)
    setUpgraded(true)
    setTimeout(() => setUpgraded(false), 4000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Billing & Usage</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Manage your plan, track usage, and download invoices</p>
        </div>
        {upgraded && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-xl text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            Plan upgraded successfully!
          </div>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-2xl w-fit">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              activeSection === s ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >{s}</button>
        ))}
      </div>

      {/* ── Overview section ── */}
      {activeSection === 'overview' && (
        <div className="space-y-6">

          {/* Current plan + payment side by side */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Current plan card */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Current Plan</p>
                    <h2 className="text-2xl font-black">{currentPlanData.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black">
                      {currentPlanData.price !== null ? `$${currentPlanData.price}` : 'Custom'}
                    </p>
                    {currentPlanData.price !== null && <p className="text-xs text-neutral-400">/month</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-300 mb-5">
                  <Calendar className="w-4 h-4" />
                  Next billing: March 1, 2026
                </div>

                <button
                  onClick={() => setActiveSection('plans')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-xl text-sm font-bold hover:bg-neutral-100 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-widest">Payment Method</h3>
                <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 underline">Edit</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-14 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">Visa •••• 4242</p>
                  <p className="text-xs text-neutral-500">Expires 12/27</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-300 rounded-2xl text-sm font-semibold text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add another payment method
              </button>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Shield className="w-3.5 h-3.5" />
                Secured by Stripe. We never store card details.
              </div>
            </div>
          </div>

          {/* Usage meters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-widest">Usage This Month</h3>
              <span className="text-xs text-neutral-400">Resets March 1, 2026</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(USAGE).map(([key, data]) => (
                <UsageMeter key={key} {...data} />
              ))}
            </div>
          </div>

          {/* Quick invoice preview */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-700">Recent Invoices</h3>
              <button onClick={() => setActiveSection('invoices')} className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {INVOICES.slice(0, 3).map(inv => (
              <div key={inv.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                <Receipt className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">{inv.id}</p>
                  <p className="text-xs text-neutral-400">{inv.date} · {inv.plan}</p>
                </div>
                <span className="text-sm font-black text-neutral-900">${inv.amount.toFixed(2)}</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  {inv.status}
                </span>
                <button className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors">
                  <Download className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Plans section ── */}
      {activeSection === 'plans' && (
        <div className="space-y-6">
          <div className="text-center py-2">
            <p className="text-neutral-500 text-sm">All plans include a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                current={currentPlan}
                onUpgrade={handleUpgrade}
                onDowngrade={() => {}}
                onContact={() => window.location.href = 'mailto:sales@convohubai.com'}
              />
            ))}
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-center">
            <p className="text-sm text-neutral-600">
              Need a <strong>custom plan</strong> for your organisation? Talk to our team — we'll build exactly what you need.
            </p>
            <button className="mt-3 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      )}

      {/* ── Invoices section ── */}
      {activeSection === 'invoices' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-widest">Invoice History</h3>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download All
            </button>
          </div>
          <div className="divide-y divide-neutral-100">
            {INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">{inv.id}</p>
                  <p className="text-xs text-neutral-500">{inv.date} · {inv.plan} plan</p>
                </div>
                <span className="text-base font-black text-neutral-900 tabular-nums">${inv.amount.toFixed(2)}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                  {inv.status}
                </span>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      <UpgradeModal plan={upgradeModal} onClose={() => setUpgradeModal(null)} onConfirm={handleConfirmUpgrade} />
    </div>
  )
}