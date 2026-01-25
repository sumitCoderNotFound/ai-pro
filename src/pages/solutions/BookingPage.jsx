import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Calendar, Clock, Bell, Zap } from 'lucide-react'

const BookingPage = () => (
  <>
    <PageHero
      badge="Appointment Booking"
      title="Smart scheduling"
      titleHighlight="that works 24/7."
      description="Let customers book, reschedule, and get reminders through natural conversation."
      primaryCta="Start Free"
      gradient="from-yellow-500 via-amber-600 to-orange-600"
      features={['Calendar sync', 'Auto reminders', 'Rescheduling']}
      stats={[
        { value: '80%', label: 'Fewer no-shows' },
        { value: '24/7', label: 'Booking available' },
        { value: '3x', label: 'More appointments' },
      ]}
    />
    <Section background="white" padding="large">
      <Container>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: 'Easy Booking', desc: 'Natural conversation booking' },
            { icon: Clock, title: 'Rescheduling', desc: 'Change appointments via text' },
            { icon: Bell, title: 'Reminders', desc: 'Reduce no-shows by 80%' },
            { icon: Zap, title: 'Instant Confirm', desc: 'Real-time calendar sync' },
          ].map((f, i) => (
            <Card key={i} hover padding="lg" className="text-center">
              <div className="w-12 h-12 mx-auto bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">{f.title}</h4>
              <p className="text-sm text-neutral-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
    <CTASection title="Ready to fill your calendar?" primaryCta="Start Free Trial" variant="gradient" />
  </>
)

export default BookingPage
