/**
 * ConvoHubAI – Onboarding Checklist (Sidebar Widget)
 * Persistent, collapsible progress tracker in the sidebar.
 * Auto-hides when dismissed or all steps are complete.
 */
import { useNavigate } from 'react-router-dom'
import { useOnboarding, ONBOARDING_STEPS } from '@/context/OnboardingContext'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react'

export default function OnboardingChecklist({ collapsed = false }) {
  const navigate = useNavigate()
  const {
    dismissed,
    checklistOpen,
    completedCount,
    totalSteps,
    progressPct,
    allDone,
    isStepDone,
    dismiss,
    toggleChecklist,
    markComplete,
  } = useOnboarding()

  // Don't render if dismissed
  if (dismissed) return null
  // In collapsed sidebar, just show a dot indicator
  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          {completedCount < totalSteps && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
              {totalSteps - completedCount}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-neutral-100 bg-white">
      {/* Header row — always visible */}
      <div className="px-3 pt-2 pb-1">
        <button
          onClick={toggleChecklist}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-neutral-50 transition-colors group"
        >
          {allDone ? (
            <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700 truncate">
                {allDone ? '🎉 Setup complete!' : 'Getting started'}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 ml-1 flex-shrink-0">
                {completedCount}/{totalSteps}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: allDone
                    ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                    : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {checklistOpen
              ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              : <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
            }
          </div>
        </button>
      </div>

      {/* Steps — collapsible */}
      {checklistOpen && (
        <div className="px-3 pb-3">
          <div className="space-y-0.5">
            {ONBOARDING_STEPS.map((step) => {
              const done = isStepDone(step.id)
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (!done) markComplete(step.id) // optimistic
                    navigate(step.href)
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all group ${
                    done
                      ? 'opacity-60 hover:opacity-80'
                      : 'hover:bg-indigo-50'
                  }`}
                >
                  {/* Check icon */}
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                  )}

                  {/* Emoji + text */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm leading-none">{step.icon}</span>
                    <span className={`text-xs font-medium truncate ${done ? 'line-through text-neutral-400' : 'text-neutral-700 group-hover:text-indigo-700'}`}>
                      {step.title}
                    </span>
                  </div>

                  {/* Arrow */}
                  {!done && (
                    <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Dismiss link */}
          <button
            onClick={dismiss}
            className="w-full mt-2 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors py-1"
          >
            <X className="w-3 h-3" />
            {allDone ? 'Close checklist' : 'Dismiss — I know what I\'m doing'}
          </button>
        </div>
      )}
    </div>
  )
}