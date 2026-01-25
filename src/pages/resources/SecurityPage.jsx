import { Section, Container, Card } from '@/components/ui'
import { Shield, Lock, CheckCircle, FileText } from 'lucide-react'

const SecurityPage = () => {
  const certifications = [
    { name: 'SOC 2 Type II', desc: 'Annual security audit' },
    { name: 'GDPR', desc: 'EU data protection' },
    { name: 'HIPAA', desc: 'Healthcare compliance' },
    { name: 'ISO 27001', desc: 'Information security' },
  ]

  const features = [
    { icon: Lock, title: 'Encryption', desc: 'AES-256 encryption at rest and in transit' },
    { icon: Shield, title: 'Access Control', desc: 'Role-based access with SSO support' },
    { icon: FileText, title: 'Audit Logs', desc: 'Complete activity logging' },
    { icon: CheckCircle, title: 'Pen Testing', desc: 'Regular third-party security testing' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-neutral-900 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Security & Compliance</h1>
            <p className="text-white/80">Enterprise-grade security you can trust</p>
          </div>
        </Container>
      </section>
      <Section background="white" padding="large">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Certifications</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {certifications.map((cert, i) => (
              <Card key={i} padding="lg" className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-neutral-900">{cert.name}</h4>
                <p className="text-sm text-neutral-500">{cert.desc}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Security Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} padding="lg">
                <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h4 className="font-semibold text-neutral-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-neutral-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default SecurityPage
