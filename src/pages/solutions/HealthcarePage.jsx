import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Heart, Calendar, FileText, Phone, Shield, Clock } from 'lucide-react'

const HealthcarePage = () => {
  const features = [
    { icon: Calendar, title: 'Appointment Scheduling', desc: 'Book, reschedule, and send reminders automatically' },
    { icon: FileText, title: 'Pre-Visit Intake', desc: 'Collect patient information before appointments' },
    { icon: Phone, title: 'Follow-Up Calls', desc: 'Check on patients after procedures' },
    { icon: Shield, title: 'HIPAA Compliant', desc: 'Enterprise-grade security and compliance' },
  ]

  return (
    <>
      <PageHero
        badge="Healthcare"
        badgeColor="primary"
        title="AI for patient"
        titleHighlight="communication."
        description="Improve patient outcomes with AI agents that handle scheduling, reminders, and follow-ups while maintaining HIPAA compliance."
        primaryCta="Request Demo"
        gradient="from-red-500 via-rose-600 to-pink-700"
        features={['HIPAA compliant', '24/7 availability', 'EHR integration']}
        stats={[
          { value: '60%', label: 'Fewer no-shows' },
          { value: '100%', label: 'HIPAA compliant' },
          { value: '24/7', label: 'Patient support' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} hover padding="lg" className="text-center">
                <div className="w-14 h-14 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-red-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-neutral-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to improve patient communication?"
        description="HIPAA-compliant AI for healthcare providers."
        primaryCta="Request Demo"
        variant="gradient"
      />
    </>
  )
}

export default HealthcarePage
