/**
 * ConvoHubAI – Onboarding Context
 * Tracks setup checklist progress. Persists in localStorage.
 * Import useOnboarding() anywhere to read/update checklist state.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'convohubai_onboarding_v1'

// ─── Step definitions ────────────────────────────────────────────────────────
export const ONBOARDING_STEPS = [
  {
    id: 'create_agent',
    title: 'Create your first AI Agent',
    description: 'Build an agent with a name, persona and instructions',
    href: '/dashboard/agents',
    cta: 'Create Agent',
    icon: '🤖',
    estimatedTime: '2 min',
  },
  {
    id: 'test_chat',
    title: 'Test your agent in Chat',
    description: 'Send a message and watch your agent reply in real time',
    href: '/dashboard/chat',
    cta: 'Open Chat',
    icon: '💬',
    estimatedTime: '1 min',
  },
  {
    id: 'add_knowledge',
    title: 'Add a Knowledge Base',
    description: 'Upload docs or a website so your agent knows your business',
    href: '/dashboard/knowledge',
    cta: 'Add Knowledge',
    icon: '📚',
    estimatedTime: '3 min',
  },
  {
    id: 'connect_phone',
    title: 'Connect a Phone Number',
    description: 'Give your agent a real phone number for voice calls',
    href: '/dashboard/phone-numbers',
    cta: 'Add Number',
    icon: '📞',
    estimatedTime: '2 min',
  },
  {
    id: 'invite_team',
    title: 'Invite a team member',
    description: 'Collaborate with your team on agents and conversations',
    href: '/dashboard/settings',
    cta: 'Invite Team',
    icon: '👥',
    estimatedTime: '1 min',
  },
]

// ─── Default state ───────────────────────────────────────────────────────────
const defaultState = {
  completed: {},       // { step_id: true }
  dismissed: false,    // user closed the checklist permanently
  welcomeSeen: false,  // user has seen the welcome modal
  checklistOpen: true, // collapsed/expanded in sidebar
}

// ─── Context ─────────────────────────────────────────────────────────────────
const OnboardingContext = createContext(null)

export const OnboardingProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })

  // Persist every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const markComplete = useCallback((stepId) => {
    setState(prev => ({
      ...prev,
      completed: { ...prev.completed, [stepId]: true },
    }))
  }, [])

  const dismiss = useCallback(() => {
    setState(prev => ({ ...prev, dismissed: true }))
  }, [])

  const markWelcomeSeen = useCallback(() => {
    setState(prev => ({ ...prev, welcomeSeen: true }))
  }, [])

  const toggleChecklist = useCallback(() => {
    setState(prev => ({ ...prev, checklistOpen: !prev.checklistOpen }))
  }, [])

  const reset = useCallback(() => {
    setState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const completedCount = Object.values(state.completed).filter(Boolean).length
  const totalSteps = ONBOARDING_STEPS.length
  const progressPct = Math.round((completedCount / totalSteps) * 100)
  const allDone = completedCount === totalSteps
  const isStepDone = (id) => !!state.completed[id]

  return (
    <OnboardingContext.Provider value={{
      ...state,
      completedCount,
      totalSteps,
      progressPct,
      allDone,
      isStepDone,
      markComplete,
      dismiss,
      markWelcomeSeen,
      toggleChecklist,
      reset,
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider')
  return ctx
}