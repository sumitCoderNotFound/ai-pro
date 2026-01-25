import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Bot, Puzzle, Wand2, Shield, Layers, GitBranch, TestTube, Rocket } from 'lucide-react'

const AgentBuilderPage = () => {
  const features = [
    {
      icon: Wand2,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Visual Builder',
      description: 'Drag and drop components to build agents without any coding.',
      points: ['Pre-built templates', 'Visual flow editor', 'Real-time preview'],
      emoji: '🎨'
    },
    {
      icon: Layers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Personality Design',
      description: 'Define your agent\'s tone, style, and behavior with simple controls.',
      points: ['Tone customization', 'Brand voice', 'Persona templates'],
      emoji: '🎭'
    },
    {
      icon: Shield,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Built-in Guardrails',
      description: 'Keep conversations on track with automatic topic boundaries.',
      points: ['Topic restrictions', 'Fallback handling', 'Compliance rules'],
      emoji: '🛡️'
    },
    {
      icon: TestTube,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Testing Suite',
      description: 'Test your agents with simulated conversations before going live.',
      points: ['Conversation simulator', 'Edge case testing', 'Performance metrics'],
      emoji: '🧪'
    },
  ]

  const templates = [
    { name: 'Customer Support', icon: '🎧', desc: 'Handle FAQs and support tickets' },
    { name: 'Lead Qualification', icon: '🎯', desc: 'Qualify and route inbound leads' },
    { name: 'Appointment Booking', icon: '📅', desc: 'Schedule meetings and calls' },
    { name: 'Product Guide', icon: '🛍️', desc: 'Help customers find products' },
    { name: 'Survey Bot', icon: '📊', desc: 'Collect feedback conversationally' },
    { name: 'Onboarding', icon: '👋', desc: 'Welcome and guide new users' },
  ]

  return (
    <>
      <PageHero
        badge="Agent Builder"
        badgeColor="primary"
        title="Build AI agents"
        titleHighlight="without code."
        description="Create sophisticated conversational AI agents with our visual builder. No developers required — just drag, drop, and deploy."
        primaryCta="Start Building"
        secondaryCta="See Demo"
        gradient="from-purple-600 via-purple-700 to-indigo-900"
        features={['Visual editor', 'Pre-built templates', 'One-click deploy']}
        stats={[
          { value: '5min', label: 'To build an agent' },
          { value: '50+', label: 'Templates' },
          { value: '0', label: 'Code required' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 mb-4">
              Quick Start
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Start with a <span className="text-purple-600">template</span>
            </h2>
            <p className="text-lg text-neutral-600">
              Choose from 50+ pre-built agent templates and customize to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, idx) => (
              <Card key={idx} hover padding="md" className="flex items-center gap-4 cursor-pointer">
                <div className="text-3xl">{template.icon}</div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{template.name}</h4>
                  <p className="text-sm text-neutral-500">{template.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Features"
        title="Everything you need to"
        titleHighlight="build great agents"
        description="Powerful tools wrapped in a simple interface."
        features={features}
        layout="alternating"
        background="gray"
      />

      <Section background="white" padding="large">
        <Container>
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  See the builder in action
                </h3>
                <p className="text-white/80 mb-6">
                  Watch how to build a complete customer support agent in under 5 minutes.
                </p>
                <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors">
                  Watch Tutorial
                </button>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
                  <div className="flex gap-3">
                    <div className="h-24 bg-white/10 rounded-lg w-1/3"></div>
                    <div className="h-24 bg-white/10 rounded-lg w-1/3"></div>
                    <div className="h-24 bg-white/10 rounded-lg w-1/3"></div>
                  </div>
                  <div className="h-12 bg-white/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              From idea to <span className="text-purple-600">production</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose Template', desc: 'Or start from scratch', icon: Puzzle },
              { step: '2', title: 'Customize', desc: 'Add your content', icon: Wand2 },
              { step: '3', title: 'Test', desc: 'Simulate conversations', icon: TestTube },
              { step: '4', title: 'Deploy', desc: 'Go live instantly', icon: Rocket },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-purple-200"></div>
                )}
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-4 relative z-10">
                  <item.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-sm font-bold text-purple-600 mb-1">Step {item.step}</div>
                <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to build your first agent?"
        description="Start for free. No credit card required."
        primaryCta="Start Building"
        variant="gradient"
      />
    </>
  )
}

export default AgentBuilderPage
