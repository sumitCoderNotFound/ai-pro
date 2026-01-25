import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Workflow, GitBranch, Zap, Clock, Repeat, Shield, Settings, BarChart3 } from 'lucide-react'

const WorkflowEnginePage = () => {
  const features = [
    {
      icon: GitBranch,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      title: 'Visual Flow Builder',
      description: 'Design complex conversation flows with an intuitive drag-and-drop canvas.',
      points: ['Branching logic', 'Conditional paths', 'Loop handling']
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Triggers & Actions',
      description: 'Connect conversations to your business processes automatically.',
      points: ['Webhook triggers', 'API actions', 'Database updates']
    },
    {
      icon: Repeat,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Reusable Components',
      description: 'Build once, use everywhere. Create modular conversation blocks.',
      points: ['Shared components', 'Version control', 'Team collaboration']
    },
    {
      icon: BarChart3,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Flow Analytics',
      description: 'See exactly where conversations succeed or fail.',
      points: ['Funnel visualization', 'Drop-off points', 'A/B testing']
    },
  ]

  return (
    <>
      <PageHero
        badge="Workflow Engine"
        badgeColor="primary"
        title="Visual conversation"
        titleHighlight="flows."
        description="Design complex conversation logic with our visual workflow builder. Create branching paths, conditions, and integrations — all without code."
        primaryCta="Try Workflow Builder"
        secondaryCta="See Examples"
        gradient="from-pink-600 via-rose-600 to-red-700"
        features={['Visual canvas', 'Branching logic', 'Real-time testing']}
        stats={[
          { value: '10x', label: 'Faster development' },
          { value: '100+', label: 'Pre-built actions' },
          { value: '50%', label: 'Less maintenance' },
        ]}
      />

      <FeatureSection
        badge="Capabilities"
        title="Build any"
        titleHighlight="conversation flow"
        description="From simple Q&A to complex multi-step processes."
        features={features}
        layout="grid"
        columns={2}
      />

      <CTASection
        title="Ready to streamline your conversations?"
        description="Start building visual workflows today."
        primaryCta="Get Started"
        variant="dark"
      />
    </>
  )
}

export default WorkflowEnginePage
