import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Headphones, Clock, BarChart3, Users } from 'lucide-react'

const SupportPage = () => (
  <>
    <PageHero
      badge="Customer Support"
      title="24/7 AI support"
      titleHighlight="that delights customers."
      description="Resolve support tickets instantly with AI agents that understand context and escalate when needed."
      primaryCta="Start Free"
      gradient="from-cyan-600 via-blue-600 to-indigo-700"
      features={['Instant resolution', 'Smart escalation', 'Multi-channel']}
      stats={[
        { value: '80%', label: 'Auto-resolved' },
        { value: '< 3s', label: 'Response time' },
        { value: '95%', label: 'Satisfaction' },
      ]}
    />
    <Section background="white" padding="large">
      <Container>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Headphones, title: 'Always On', desc: '24/7/365 support coverage' },
            { icon: Clock, title: 'Instant Response', desc: 'No more waiting in queues' },
            { icon: BarChart3, title: 'Smart Insights', desc: 'Learn from every conversation' },
            { icon: Users, title: 'Human Backup', desc: 'Seamless escalation when needed' },
          ].map((f, i) => (
            <Card key={i} hover padding="lg" className="text-center">
              <div className="w-12 h-12 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">{f.title}</h4>
              <p className="text-sm text-neutral-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
    <CTASection title="Ready to transform customer support?" primaryCta="Start Free Trial" variant="dark" />
  </>
)

export default SupportPage
