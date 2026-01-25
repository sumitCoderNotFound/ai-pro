import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Smartphone, MessageSquare, Zap, Clock, Users, Bell, Calendar, BarChart3 } from 'lucide-react'

const SMSAIPage = () => {
  const features = [
    {
      icon: MessageSquare,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Two-Way Conversations',
      description: 'Not just broadcasts — have real conversations via text that feel natural.',
      points: ['Natural language understanding', 'Context awareness', 'Multi-turn conversations']
    },
    {
      icon: Zap,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Automated Actions',
      description: 'Book appointments, send confirmations, and update records via SMS.',
      points: ['Calendar integration', 'CRM sync', 'Payment links']
    },
    {
      icon: Clock,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Smart Timing',
      description: 'AI determines the optimal time to send messages for maximum engagement.',
      points: ['Timezone awareness', 'Engagement optimization', 'Quiet hours respect']
    },
    {
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Mass Personalization',
      description: 'Send personalized messages to thousands while maintaining conversation quality.',
      points: ['Dynamic content', 'Segmentation', 'A/B testing']
    },
  ]

  const useCases = [
    { icon: Bell, title: 'Appointment Reminders', desc: 'Reduce no-shows by 80%' },
    { icon: Calendar, title: 'Scheduling', desc: 'Book via text conversation' },
    { icon: BarChart3, title: 'Surveys', desc: 'Collect feedback via SMS' },
    { icon: Zap, title: 'Alerts', desc: 'Time-sensitive notifications' },
  ]

  return (
    <>
      <PageHero
        badge="SMS AI"
        badgeColor="amber"
        title="Text messaging"
        titleHighlight="that works."
        description="98% of texts are read within 3 minutes. Reach customers where they're most responsive with AI-powered SMS conversations."
        primaryCta="Start Texting"
        secondaryCta="See Demo"
        gradient="from-amber-500 via-orange-600 to-red-700"
        features={['98% open rate', 'Instant delivery', 'Two-way conversations']}
        stats={[
          { value: '98%', label: 'Open rate' },
          { value: '45%', label: 'Response rate' },
          { value: '3min', label: 'Avg read time' },
        ]}
      >
        {/* SMS Preview */}
        <div className="bg-neutral-800 rounded-[40px] p-3 max-w-[280px] mx-auto shadow-2xl">
          <div className="bg-neutral-900 rounded-[32px] overflow-hidden">
            <div className="bg-neutral-800 px-4 py-2 flex justify-center">
              <div className="w-20 h-5 bg-neutral-700 rounded-full"></div>
            </div>
            <div className="p-4 space-y-3 min-h-[300px] bg-neutral-900">
              <div className="text-center text-neutral-500 text-xs mb-4">Today 2:34 PM</div>
              <div className="bg-neutral-700 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                <p className="text-white text-sm">Hi Sarah! This is a reminder about your appointment tomorrow at 2 PM. Reply YES to confirm or RESCHEDULE to pick a new time.</p>
              </div>
              <div className="bg-amber-500 rounded-2xl rounded-tr-none p-3 max-w-[60%] ml-auto">
                <p className="text-white text-sm">RESCHEDULE</p>
              </div>
              <div className="bg-neutral-700 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                <p className="text-white text-sm">No problem! Here are available times:</p>
                <div className="mt-2 space-y-1">
                  <div className="bg-neutral-600 rounded-lg px-3 py-1.5 text-white text-xs">Wed 10 AM</div>
                  <div className="bg-neutral-600 rounded-lg px-3 py-1.5 text-white text-xs">Thu 3 PM</div>
                  <div className="bg-neutral-600 rounded-lg px-3 py-1.5 text-white text-xs">Fri 11 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 mb-4">
              Why SMS?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              The most direct channel to <span className="text-amber-600">your customers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card padding="lg" className="text-center bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-4xl font-bold text-amber-600 mb-2">98%</div>
              <p className="text-neutral-600">Open rate</p>
            </Card>
            <Card padding="lg" className="text-center bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-4xl font-bold text-orange-600 mb-2">90s</div>
              <p className="text-neutral-600">Avg response time</p>
            </Card>
            <Card padding="lg" className="text-center bg-gradient-to-br from-red-50 to-pink-50">
              <div className="text-4xl font-bold text-red-600 mb-2">5x</div>
              <p className="text-neutral-600">More engagement than email</p>
            </Card>
            <Card padding="lg" className="text-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-4xl font-bold text-pink-600 mb-2">3min</div>
              <p className="text-neutral-600">Read within 3 minutes</p>
            </Card>
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Capabilities"
        title="More than"
        titleHighlight="just texts"
        description="Full conversational AI capabilities via SMS."
        features={features}
        layout="alternating"
        background="gray"
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Popular <span className="text-amber-600">use cases</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} hover padding="lg" className="text-center">
                <div className="w-14 h-14 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{useCase.title}</h3>
                <p className="text-sm text-neutral-600">{useCase.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to reach customers where they are?"
        description="Start your SMS AI campaign today with 500 free messages."
        primaryCta="Start Free"
        variant="dark"
      />
    </>
  )
}

export default SMSAIPage
