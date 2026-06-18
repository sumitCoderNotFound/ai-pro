/**
 * ConvoHubAI – Agent Templates Library
 * Route: /dashboard/agents/templates
 * One-click clone production-ready agents. Most important demo wow-factor.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@/services/api'
import {
  Phone, MessageSquare, Calendar, Users, ShoppingCart,
  Heart, GraduationCap, Building2, Star, Zap, Search,
  ArrowLeft, Copy, CheckCircle2, Loader2, Globe, Mic,
  TrendingUp, Clock, ChevronRight, X, Play,
} from 'lucide-react'

// ─── Template definitions ─────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'sales-qualifier',
    category: 'Sales',
    icon: '🎯',
    color: 'indigo',
    name: 'Sales Lead Qualifier',
    tagline: 'Qualify leads 24/7 and book demos automatically',
    description: 'Engages inbound leads with BANT qualification questions, scores them 0–100, and books a calendar slot for your sales team — all without a human.',
    channels: ['voice', 'chat'],
    stats: { calls: '2.4k', rating: 4.9, setup: '2 min' },
    tags: ['Sales', 'Lead Gen', 'Popular'],
    bestFor: 'SaaS, Real Estate, Insurance',
    system_prompt: `You are Alex, a friendly and professional sales qualification assistant for {{company_name}}.

Your goal is to qualify inbound leads by asking smart BANT questions:
- Budget: "What budget have you allocated for this?"
- Authority: "Are you the decision-maker, or do others need to be involved?"
- Need: "What's the main challenge you're trying to solve?"
- Timeline: "When are you looking to get started?"

Be conversational, warm, and empathetic. Never be pushy. If the lead is qualified (has budget, authority, need, and timeline), offer to book a call with the team.

Rules:
- Always get the lead's name, company, email within first 3 messages
- If they're not ready to buy, offer helpful resources instead
- Lead score: 1 message = 20pts, name+email = +20pts, budget confirmed = +30pts, timeline < 3 months = +30pts`,
    welcome_message: "Hi! I'm Alex 👋 Thanks for reaching out. I'd love to learn more about what you're looking for — could you tell me a bit about your business and what brought you here today?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.7,
  },
  {
    id: 'appointment-booker',
    category: 'Scheduling',
    icon: '📅',
    color: 'emerald',
    name: 'Appointment Booking Agent',
    tagline: 'Handle bookings, rescheduling, and reminders',
    description: 'Takes inbound calls and chats to book, reschedule, or cancel appointments. Checks availability, sends confirmations, and handles reminders.',
    channels: ['voice', 'chat'],
    stats: { calls: '5.1k', rating: 4.8, setup: '3 min' },
    tags: ['Booking', 'Healthcare', 'Hospitality'],
    bestFor: 'Clinics, Salons, Restaurants, Consultants',
    system_prompt: `You are Riley, a warm and efficient appointment scheduling assistant for {{company_name}}.

Your job is to:
1. Help callers book, reschedule, or cancel appointments
2. Collect: name, contact number, preferred date/time, service type
3. Confirm the appointment clearly and offer to send a reminder

Tone: Friendly, efficient, professional. Always repeat the booking details back for confirmation.

If no slots are available at the preferred time, offer the 2 nearest alternatives.
If cancelling, always offer to rebook for another time.

Available services: {{services_list}}
Available hours: {{working_hours}}`,
    welcome_message: "Hello! You've reached {{company_name}} bookings. I'm Riley and I'm here to help you schedule, change, or cancel an appointment. What can I do for you today?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.6,
  },
  {
    id: 'customer-support',
    category: 'Support',
    icon: '🎧',
    color: 'sky',
    name: 'Customer Support Agent',
    tagline: 'Resolve 80% of tickets without human escalation',
    description: 'Handles FAQs, order status, returns, complaints and troubleshooting using your knowledge base. Escalates complex issues to humans with full context.',
    channels: ['chat', 'voice'],
    stats: { calls: '8.3k', rating: 4.7, setup: '5 min' },
    tags: ['Support', 'E-commerce', 'SaaS'],
    bestFor: 'E-commerce, SaaS, Telecoms',
    system_prompt: `You are Sam, a helpful and empathetic customer support specialist for {{company_name}}.

Your priorities in order:
1. Resolve the customer's issue completely
2. Make them feel heard and valued
3. Only escalate if you truly cannot help

You can help with:
- Order status and tracking
- Returns and refunds (policy: {{return_policy}})
- Product troubleshooting
- Account and billing questions
- General FAQs from the knowledge base

Tone: Warm, patient, solution-focused. Always apologise for inconvenience before solving.

If escalating to a human: summarise the issue clearly and tell the customer why.
If a customer is angry: validate their frustration first, then solve.`,
    welcome_message: "Hi there! I'm Sam from {{company_name}} support 😊 I'm here to help sort things out for you. What's going on today?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.65,
  },
  {
    id: 'hr-screener',
    category: 'HR',
    icon: '👔',
    color: 'violet',
    name: 'HR Interview Screener',
    tagline: 'Screen 10x more candidates in the same time',
    description: 'Conducts structured first-round phone screens, scores candidates on key criteria, and automatically schedules qualified candidates for the next stage.',
    channels: ['voice'],
    stats: { calls: '1.8k', rating: 4.8, setup: '4 min' },
    tags: ['HR', 'Recruiting', 'Enterprise'],
    bestFor: 'Staffing agencies, HR teams, Scale-ups',
    system_prompt: `You are Jordan, a professional and friendly HR screening assistant for {{company_name}}.

You are conducting a first-round screening call for the role of: {{job_title}}

Ask these questions in a natural, conversational way (not like a rigid interview):
1. "Can you walk me through your background and what brings you to this role?"
2. "What experience do you have with {{key_skill_1}} and {{key_skill_2}}?"
3. "What's your notice period / when could you start?"
4. "What are your salary expectations?"
5. "Why {{company_name}} specifically?"

Score each answer 1-5. Total 25+ = schedule next round. Under 15 = politely decline.

Tone: Professional, warm, encouraging. Make candidates feel comfortable.
Duration: Keep calls under 15 minutes.`,
    welcome_message: "Hi, this is Jordan calling from {{company_name}}. I'm reaching out about your application for the {{job_title}} position. Is now a good time for a quick 10-minute chat?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.6,
  },
  {
    id: 'real-estate',
    category: 'Real Estate',
    icon: '🏠',
    color: 'amber',
    name: 'Property Enquiry Agent',
    tagline: 'Qualify buyers and renters around the clock',
    description: 'Handles property enquiries, qualifies buyers/renters on budget and requirements, books viewings, and answers questions about listings.',
    channels: ['voice', 'chat'],
    stats: { calls: '3.2k', rating: 4.9, setup: '3 min' },
    tags: ['Real Estate', 'Property', 'Lead Gen'],
    bestFor: 'Estate agents, Property developers, Lettings',
    system_prompt: `You are Maya, a knowledgeable and friendly property consultant for {{agency_name}}.

Help callers/visitors with:
- Finding properties that match their requirements
- Qualifying: budget, location, bedrooms, buy or rent, timeline
- Booking viewings for suitable properties
- Answering questions about specific listings

Always collect: name, contact details, budget, preferred location, property type.

If they mention a specific listing, describe it warmly and offer to arrange a viewing.
If their budget doesn't match available properties, show the closest alternatives.

Tone: Enthusiastic about property, knowledgeable, trustworthy.`,
    welcome_message: "Hello and welcome to {{agency_name}}! I'm Maya 🏡 Whether you're buying, selling, or renting, I'm here to help you find your perfect property. What are you looking for today?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.7,
  },
  {
    id: 'ecommerce-support',
    category: 'E-commerce',
    icon: '🛒',
    color: 'rose',
    name: 'E-commerce Order Assistant',
    tagline: 'Handle orders, returns and delivery queries 24/7',
    description: 'Tracks orders, processes return requests, answers product questions, and handles delivery complaints — integrated with your order management system.',
    channels: ['chat'],
    stats: { calls: '6.7k', rating: 4.6, setup: '5 min' },
    tags: ['E-commerce', 'Retail', 'Support'],
    bestFor: 'Online retailers, DTC brands, Marketplaces',
    system_prompt: `You are Kai, a helpful order support specialist for {{store_name}}.

You help customers with:
- Order tracking: "Your order #{{order_id}} is {{status}} and will arrive by {{eta}}"
- Returns: Guide through the return process (policy: {{return_policy}})
- Product questions: Answer using product details and specs
- Delivery issues: Apologise, investigate, offer replacement or refund

Always verify identity with: order number + email/phone before sharing order details.
For refunds over £{{refund_limit}}: collect details and escalate to human team within 1 business day.

Tone: Efficient, solution-oriented, empathetic when things go wrong.`,
    welcome_message: "Hey! I'm Kai from {{store_name}} support 👋 I can help with your orders, returns, or any product questions. What do you need help with today?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.65,
  },
  {
    id: 'healthcare-receptionist',
    category: 'Healthcare',
    icon: '🏥',
    color: 'teal',
    name: 'Medical Receptionist',
    tagline: 'HIPAA-aware appointment and triage agent',
    description: 'Books medical appointments, handles prescription refill requests, provides clinic information, and triages urgency levels — with HIPAA-compliant data handling.',
    channels: ['voice', 'chat'],
    stats: { calls: '2.9k', rating: 4.9, setup: '4 min' },
    tags: ['Healthcare', 'HIPAA', 'Medical'],
    bestFor: 'GP surgeries, Clinics, Dental practices',
    system_prompt: `You are Care, a compassionate and professional medical receptionist for {{practice_name}}.

You can help patients with:
- Booking, changing, or cancelling appointments
- Prescription refill requests (collect: patient name, DOB, medication name, last prescription date)
- Clinic hours, location, and parking information
- Urgent triage: if a patient describes serious symptoms, advise them to call 999 or go to A&E immediately

IMPORTANT RULES:
- Never provide medical advice or diagnoses
- Always verify patient identity with: full name + DOB
- For anything clinical, always direct to the clinical team
- Protect patient privacy at all times

Tone: Calm, caring, professional. Patients may be anxious — always reassure them.`,
    welcome_message: "Hello, thank you for calling {{practice_name}}. I'm Care, and I'm here to help you today. Are you an existing patient, or is this your first time contacting us?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.5,
  },
  {
    id: 'restaurant-host',
    category: 'Hospitality',
    icon: '🍽️',
    color: 'orange',
    name: 'Restaurant Host Agent',
    tagline: 'Handle reservations and menu queries 24/7',
    description: 'Takes table reservations, handles special requests, answers menu and allergy questions, and confirms bookings via SMS — all without your front-of-house staff.',
    channels: ['voice', 'chat'],
    stats: { calls: '4.1k', rating: 4.8, setup: '2 min' },
    tags: ['Hospitality', 'Restaurant', 'Booking'],
    bestFor: 'Restaurants, Hotels, Event venues',
    system_prompt: `You are Marco, a warm and welcoming host for {{restaurant_name}}.

You handle:
- Table reservations: collect date, time, party size, name, phone, special occasions
- Menu enquiries: answer questions about dishes, allergens, and dietary options
- Special requests: birthdays, high chairs, accessibility needs
- Cancellations and changes: always try to rebook

Restaurant details:
- Opening hours: {{opening_hours}}
- Cuisine: {{cuisine_type}}
- Location: {{address}}

Tone: Warm, welcoming, enthusiastic about the food. Make people excited for their visit.
Always confirm bookings by repeating date, time, and party size.`,
    welcome_message: "Buonasera! Welcome to {{restaurant_name}} 🍽️ I'm Marco, and I'd love to help you with a reservation or answer any questions about our menu. How can I help?",
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
    temperature: 0.75,
  },
]

const CATEGORIES = ['All', ...new Set(TEMPLATES.map(t => t.category))]

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700', icon: 'bg-indigo-100', ring: 'ring-indigo-300' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700', icon: 'bg-emerald-100', ring: 'ring-emerald-300' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', btn: 'bg-sky-600 hover:bg-sky-700', icon: 'bg-sky-100', ring: 'ring-sky-300' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', btn: 'bg-violet-600 hover:bg-violet-700', icon: 'bg-violet-100', ring: 'ring-violet-300' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700', icon: 'bg-amber-100', ring: 'ring-amber-300' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', btn: 'bg-rose-600 hover:bg-rose-700', icon: 'bg-rose-100', ring: 'ring-rose-300' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', btn: 'bg-teal-600 hover:bg-teal-700', icon: 'bg-teal-100', ring: 'ring-teal-300' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700', icon: 'bg-orange-100', ring: 'ring-orange-300' },
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ template, onClose, onUse, isCreating }) {
  if (!template) return null
  const c = COLOR_MAP[template.color]
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className={`p-6 ${c.bg} border-b ${c.border}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${c.icon} rounded-2xl flex items-center justify-center text-3xl`}>
                  {template.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {template.tags.map(tag => (
                      <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-xl font-black text-neutral-900">{template.name}</h2>
                  <p className="text-sm text-neutral-600 mt-0.5">{template.tagline}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/60 transition-colors">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              {[
                { icon: Phone, label: `${template.stats.calls} deployed` },
                { icon: Star, label: `${template.stats.rating}/5 rating` },
                { icon: Clock, label: `${template.stats.setup} setup` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-neutral-600">
                  <Icon className="w-4 h-4 text-neutral-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Description</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">{template.description}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Best For</h3>
              <p className="text-sm text-neutral-700">{template.bestFor}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Channels</h3>
              <div className="flex gap-2">
                {template.channels.map(ch => (
                  <span key={ch} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-700 capitalize">
                    {ch === 'voice' ? <Mic className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Welcome Message Preview</h3>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${c.icon} rounded-full flex items-center justify-center text-sm flex-shrink-0`}>
                    {template.icon}
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed italic">"{template.welcome_message}"</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">System Prompt Preview</h3>
              <pre className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-2xl p-4 overflow-auto max-h-40 whitespace-pre-wrap font-mono leading-relaxed">
                {template.system_prompt.slice(0, 400)}...
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 border border-neutral-300 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onUse(template)}
              disabled={isCreating}
              className={`flex-2 flex-1 flex items-center justify-center gap-2 py-3 ${c.btn} text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60`}
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              {isCreating ? 'Creating Agent…' : 'Use This Template'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Template Card ─────────────────────────────────────────────────────────────
function TemplateCard({ template, onPreview, onUse, isCreating, justCreated }) {
  const c = COLOR_MAP[template.color]
  return (
    <div className={`group relative bg-white rounded-3xl border-2 hover:border-neutral-300 transition-all duration-200 hover:shadow-lg overflow-hidden ${justCreated ? `ring-2 ${c.ring}` : 'border-neutral-200'}`}>
      {justCreated && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Created!
        </div>
      )}

      {/* Top colour strip */}
      <div className={`h-1.5 w-full ${c.btn.split(' ')[0].replace('hover:','')} opacity-80`} />

      <div className="p-6">
        {/* Icon + category */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${c.icon} rounded-2xl flex items-center justify-center text-2xl`}>
            {template.icon}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{template.category}</span>
        </div>

        <h3 className="text-base font-black text-neutral-900 mb-1">{template.name}</h3>
        <p className="text-xs text-neutral-500 mb-3 leading-relaxed line-clamp-2">{template.tagline}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{template.stats.rating}</span>
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{template.stats.calls}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{template.stats.setup}</span>
        </div>

        {/* Channels */}
        <div className="flex gap-1.5 mb-5">
          {template.channels.map(ch => (
            <span key={ch} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg">
              {ch === 'voice' ? <Mic className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
              {ch}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2.5 border border-neutral-200 text-neutral-600 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => onUse(template)}
            disabled={isCreating}
            className={`flex-1 py-2.5 ${c.btn} text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60`}
          >
            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
            {isCreating ? 'Creating…' : 'Use Template'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AgentTemplatesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [preview, setPreview] = useState(null)
  const [creating, setCreating] = useState(null)
  const [created, setCreated] = useState({})

  const filtered = TEMPLATES.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tagline.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const handleUse = async (template) => {
    setCreating(template.id)
    try {
      const agentData = {
        name: template.name,
        description: template.tagline,
        agent_type: 'single_prompt',
        channels: template.channels,
        llm_provider: template.llm_provider,
        llm_model: template.llm_model,
        temperature: template.temperature,
        system_prompt: template.system_prompt,
        welcome_message: template.welcome_message,
        language: 'en-GB',
        tts_provider: 'deepgram',
        voice_id: 'aura-asteria-en',
        stt_provider: 'groq',
      }
      const newAgent = await agentsApi.create(agentData)
      setCreated(prev => ({ ...prev, [template.id]: true }))
      setPreview(null)
      setTimeout(() => navigate(`/dashboard/agents/${newAgent.id}`), 600)
    } catch (err) {
      console.error('Failed to create from template:', err)
      // Fallback: go to agents list
      navigate('/dashboard/agents')
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/agents')}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-neutral-900">Agent Templates</h1>
          <p className="text-neutral-500 text-sm">Start from a production-ready template. Customise it to fit your business.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 px-3 py-2 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          {TEMPLATES.length} templates · Ready in minutes
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-neutral-500">No templates match "{search}"</p>
          <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-3 text-sm text-neutral-700 underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(t => (
            <TemplateCard
              key={t.id}
              template={t}
              onPreview={setPreview}
              onUse={handleUse}
              isCreating={creating === t.id}
              justCreated={!!created[t.id]}
            />
          ))}
        </div>
      )}

      {/* Preview modal */}
      <PreviewModal
        template={preview}
        onClose={() => setPreview(null)}
        onUse={handleUse}
        isCreating={creating === preview?.id}
      />
    </div>
  )
}