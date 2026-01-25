import { Section, Container, Card } from '@/components/ui'
import { CheckCircle, AlertCircle } from 'lucide-react'

const StatusPage = () => {
  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Voice Services', status: 'operational' },
    { name: 'Chat Services', status: 'operational' },
    { name: 'Dashboard', status: 'operational' },
    { name: 'Webhooks', status: 'operational' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-white mb-4">
              <CheckCircle className="w-8 h-8" />
              <span className="text-2xl font-bold">All Systems Operational</span>
            </div>
            <p className="text-white/80">Current status of ConvoAI services</p>
          </div>
        </Container>
      </section>
      <Section background="white" padding="large">
        <Container>
          <div className="max-w-2xl mx-auto space-y-4">
            {services.map((service, i) => (
              <Card key={i} padding="md">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">{service.name}</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Operational
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 text-neutral-500">
            <p>99.99% uptime over the last 90 days</p>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default StatusPage
