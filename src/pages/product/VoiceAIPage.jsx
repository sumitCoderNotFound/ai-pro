import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Phone, Mic, Globe, Zap, Shield, BarChart3, Clock, Users } from 'lucide-react'

const VoiceAIPage = () => {
  const features = [
    {
      icon: Mic,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Natural Conversations',
      description: 'AI that sounds human with natural pauses, intonation, and emotional intelligence.',
      points: ['Sub-500ms latency', 'Natural interruption handling', 'Emotion detection']
    },
    {
      icon: Globe,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Multilingual Support',
      description: 'Speak to customers in their native language with real-time translation.',
      points: ['50+ languages', 'Accent adaptation', 'Cultural nuance awareness']
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Real-Time Actions',
      description: 'Book appointments, process payments, and update records during calls.',
      points: ['CRM integration', 'Payment processing', 'Calendar booking']
    },
    {
      icon: Shield,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with global privacy regulations.',
      points: ['SOC 2 Type II', 'GDPR compliant', 'HIPAA ready']
    },
  ]

  const useCases = [
    {
      icon: Phone,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Inbound Call Handling',
      description: 'Never miss a call. AI agents answer 24/7, qualify leads, and route to the right team.'
    },
    {
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Outbound Campaigns',
      description: 'Scale your outreach with AI-powered calling campaigns that sound human.'
    },
    {
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Appointment Reminders',
      description: 'Reduce no-shows with automated reminder calls that can reschedule on the spot.'
    },
    {
      icon: BarChart3,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Survey & Feedback',
      description: 'Collect voice feedback at scale with conversational surveys that feel natural.'
    },
  ]

  return (
    <>
      <PageHero
        badge="Voice AI"
        badgeColor="primary"
        title="Phone conversations"
        titleHighlight="that feel human."
        description="Deploy AI agents that handle phone calls with natural conversation, real-time actions, and seamless human handoff when needed."
        primaryCta="Start Free Trial"
        secondaryCta="Watch Demo"
        gradient="from-blue-600 via-blue-700 to-indigo-900"
        features={['Sub-500ms latency', '50+ languages', '24/7 availability']}
        stats={[
          { value: '10M+', label: 'Calls handled' },
          { value: '95%', label: 'Resolution rate' },
          { value: '<1s', label: 'Response time' },
        ]}
      />

      <FeatureSection
        badge="Capabilities"
        title="Everything you need for"
        titleHighlight="voice automation"
        description="Build sophisticated voice AI agents without any coding required."
        features={features}
        layout="alternating"
      />

      <Section background="gray" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 mb-4">
              Use Cases
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Built for every <span className="text-primary-600">voice interaction</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} hover padding="lg">
                <div className={`w-12 h-12 ${useCase.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <useCase.icon className={`w-6 h-6 ${useCase.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{useCase.title}</h3>
                <p className="text-neutral-600 text-sm">{useCase.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  See Voice AI in action
                </h3>
                <p className="text-white/80 mb-6">
                  Watch how ConvoAI handles a complete student inquiry call, from initial greeting to appointment booking.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                    Play Demo Call
                  </button>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Incoming Call</p>
                    <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-white/80 text-sm">🤖 "Hi, thank you for calling State University. How can I help you today?"</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 ml-8">
                    <p className="text-white text-sm">👤 "I'd like to know about the MBA program..."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to transform your phone support?"
        description="Start handling calls with AI today. Free trial includes 100 minutes."
        variant="gradient"
      />
    </>
  )
}

export default VoiceAIPage
