import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { BarChart3, MessageSquare, TrendingUp, Users } from 'lucide-react'

const SurveysPage = () => (
  <>
    <PageHero
      badge="Surveys & Feedback"
      title="Voice-driven"
      titleHighlight="customer insights."
      description="Collect richer feedback through conversational surveys that adapt to responses."
      primaryCta="Start Free"
      gradient="from-pink-500 via-rose-600 to-red-600"
      features={['Conversational', 'Higher completion', 'Real-time analysis']}
      stats={[
        { value: '3x', label: 'Response rate' },
        { value: '10x', label: 'Richer insights' },
        { value: '85%', label: 'Completion rate' },
      ]}
    />
    <Section background="white" padding="large">
      <Container>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, title: 'Conversational', desc: 'Natural dialogue, not forms' },
            { icon: TrendingUp, title: 'Adaptive', desc: 'Questions adapt to responses' },
            { icon: BarChart3, title: 'Analytics', desc: 'Real-time sentiment analysis' },
            { icon: Users, title: 'Scale', desc: 'Survey thousands simultaneously' },
          ].map((f, i) => (
            <Card key={i} hover padding="lg" className="text-center">
              <div className="w-12 h-12 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">{f.title}</h4>
              <p className="text-sm text-neutral-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
    <CTASection title="Ready to get better feedback?" primaryCta="Start Free Trial" variant="dark" />
  </>
)

export default SurveysPage
