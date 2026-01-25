import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Building2, Shield, Users, Zap, Globe, Lock, BarChart3, Headphones } from 'lucide-react'

const EnterprisePage = () => {
  const features = [
    { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 Type II, GDPR, HIPAA compliance' },
    { icon: Users, title: 'Dedicated Support', desc: '24/7 priority support with dedicated CSM' },
    { icon: Zap, title: 'Custom Integrations', desc: 'Connect to any system with custom APIs' },
    { icon: Globe, title: 'Global Deployment', desc: 'Multi-region deployment with 99.99% SLA' },
    { icon: Lock, title: 'SSO & SCIM', desc: 'Enterprise identity management' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Custom dashboards and reporting' },
  ]

  return (
    <>
      <PageHero
        badge="Enterprise"
        badgeColor="primary"
        title="AI at scale for"
        titleHighlight="large organizations."
        description="Custom solutions built for enterprise requirements. Dedicated support, advanced security, and unlimited scalability."
        primaryCta="Contact Sales"
        secondaryCta="See Case Studies"
        gradient="from-purple-600 via-violet-700 to-indigo-800"
        features={['99.99% SLA', 'Dedicated support', 'Custom integrations']}
        stats={[
          { value: '50+', label: 'Enterprise clients' },
          { value: '99.99%', label: 'Uptime SLA' },
          { value: '24/7', label: 'Priority support' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Built for <span className="text-purple-600">enterprise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} hover padding="lg">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">{feature.title}</h4>
                <p className="text-neutral-600 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Let's build something great together"
        description="Talk to our enterprise team about your requirements."
        primaryCta="Contact Sales"
        variant="dark"
      />
    </>
  )
}

export default EnterprisePage
