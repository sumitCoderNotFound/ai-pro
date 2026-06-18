/**
 * ConvoHubAI – Welcome Onboarding Modal
 * Shows on first login. Animated, polished, brand-aligned.
 * Matches the existing white/neutral-50 design language of the dashboard.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding, ONBOARDING_STEPS } from '@/context/OnboardingContext'
import { useAuth } from '@/context/AuthContext'
import {
  Bot,
  MessageSquare,
  BookOpen,
  Phone,
  Users,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react'

const STEP_ICONS = { Bot, MessageSquare, BookOpen, Phone, Users }

const FEATURE_HIGHLIGHTS = [
  { icon: '🤖', title: 'AI Agents', desc: 'Voice, chat & video agents that never sleep' },
  { icon: '📊', title: 'Perception AI', desc: 'Real-time emotion & sentiment analysis on every call' },
  { icon: '🔗', title: 'Integrations', desc: 'Connect your CRM, calendar and more' },
  { icon: '🌍', title: 'Global Scale', desc: 'Multi-language agents for any market' },
]

export default function WelcomeModal() {
  const { welcomeSeen, markWelcomeSeen, markComplete } = useOnboarding()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0) // 0 = welcome, 1 = checklist preview
  const [closing, setClosing] = useState(false)

  // Animate in after short delay
  useEffect(() => {
    if (!welcomeSeen) {
      const t = setTimeout(() => setVisible(true), 400)
      return () => clearTimeout(t)
    }
  }, [welcomeSeen])

  if (welcomeSeen || !visible) return null

  const close = (goTo = null) => {
    setClosing(true)
    setTimeout(() => {
      markWelcomeSeen()
      setVisible(false)
      if (goTo) navigate(goTo)
    }, 250)
  }

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={() => close()}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none`}>
        <div
          className={`pointer-events-auto relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            closing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{ animation: !closing ? 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' : undefined }}
        >
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.92) translateY(20px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes shimmer {
              from { background-position: -200% center; }
              to   { background-position: 200% center; }
            }
            .shimmer-text {
              background: linear-gradient(90deg, #111827 0%, #4f46e5 40%, #7c3aed 60%, #111827 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 3s linear infinite;
            }
          `}</style>

          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Close button */}
          <button
            onClick={() => close()}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>

          {step === 0 ? (
            /* ── Step 0: Welcome ── */
            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-0.5">Welcome to</p>
                  <h1 className="text-xl font-black text-neutral-900">ConvoHubAI</h1>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3 leading-tight">
                Hey {firstName}, <br />
                <span className="shimmer-text">let's build something amazing</span>
              </h2>
              <p className="text-neutral-500 text-base mb-8 leading-relaxed">
                You're set up and ready to go. ConvoHubAI lets you deploy AI agents that handle voice, chat and video conversations — 24/7, in any language.
              </p>

              {/* Feature highlights grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {FEATURE_HIGHLIGHTS.map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <span className="text-2xl leading-none">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{f.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 text-white font-semibold rounded-2xl hover:bg-neutral-800 transition-colors"
                >
                  Show me the setup checklist
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => close('/dashboard/agents')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                  <Zap className="w-4 h-4" />
                  Create my first agent
                </button>
              </div>

              {/* Skip */}
              <button
                onClick={() => close()}
                className="w-full mt-4 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Skip for now — I'll explore on my own
              </button>
            </div>

          ) : (
            /* ── Step 1: Checklist preview ── */
            <div className="p-8 sm:p-10">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Getting Started</p>
                <h2 className="text-2xl font-black text-neutral-900">5 steps to your first live agent</h2>
                <p className="text-neutral-500 text-sm mt-1">Takes about 10 minutes total. You can do any step, any time.</p>
              </div>

              {/* Steps list */}
              <div className="space-y-2 mb-8">
                {ONBOARDING_STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group"
                    onClick={() => close(s.href)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 group-hover:border-indigo-300 flex items-center justify-center text-xl shadow-sm flex-shrink-0 transition-colors">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">Step {i + 1}</span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {s.estimatedTime}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-800 mt-0.5">{s.title}</p>
                      <p className="text-xs text-neutral-500 truncate">{s.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-2xl transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => close('/dashboard/agents')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-2xl hover:bg-neutral-800 transition-colors text-sm"
                >
                  Start with Step 1 — Create an Agent
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => close()}
                className="w-full mt-4 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                I'll explore on my own
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}