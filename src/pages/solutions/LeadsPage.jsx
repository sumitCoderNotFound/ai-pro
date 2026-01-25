import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Users, Filter, Calendar, BarChart3, Zap } from 'lucide-react'

const LeadsPage = () => (
  <>
    <PageHero
      badge="Lead Qualification"
      title="Qualify leads"
      titleHighlight="while you sleep."
      description="AI agents that engage, qualify, and route leads 24/7. Never miss a hot prospect again."
      primaryCta="Start Free"
      gradient="from-green-600 via-emerald-600 to-teal-700"
      features={['24/7 qualification', 'CRM integration', 'Smart routing']}
      stats={[
        { value: '3x', label: 'More qualified leads' },
        { value: '80%', label: 'Faster response' },
        { value: '50%', label: 'Cost reduction' },
      ]}
    />
    <Section background="white" padding="large">
      <Container>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: 'Engage Instantly', desc: 'Respond to leads in seconds, not hours' },
            { icon: Filter, title: 'Smart Qualification', desc: 'Ask the right questions to qualify leads' },
            { icon: Zap, title: 'Route Automatically', desc: 'Send hot leads to your sales team instantly' },
          ].map((f, i) => (
            <Card key={i} hover padding="lg" className="text-center">
              <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <f.icon className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">{f.title}</h4>
              <p className="text-sm text-neutral-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
    <CTASection title="Ready to capture more leads?" primaryCta="Start Free Trial" variant="gradient" />
  </>
)

export default LeadsPage
