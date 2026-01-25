import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Hotel, Calendar, MessageSquare, Star, Globe } from 'lucide-react'

const HospitalityPage = () => {
  const useCases = [
    {
      icon: Calendar,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Reservations & Bookings',
      description: 'Handle room bookings, restaurant reservations, and spa appointments 24/7.',
      points: ['Real-time availability', 'Multi-property support', 'Instant confirmations']
    },
    {
      icon: MessageSquare,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Guest Services',
      description: 'Answer questions about amenities, local attractions, and hotel policies instantly.',
      points: ['Room service orders', 'Amenity information', 'Local recommendations']
    },
    {
      icon: Globe,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Multilingual Support',
      description: 'Serve international guests in their native language with real-time translation.',
      points: ['50+ languages', 'Cultural sensitivity', 'Accent adaptation']
    },
    {
      icon: Star,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'VIP Concierge',
      description: 'Provide personalized recommendations and special arrangements for guests.',
      points: ['Dining reservations', 'Event tickets', 'Transportation']
    },
  ]

  const services = [
    { icon: '🛏️', name: 'Room Bookings', desc: '24/7 reservations' },
    { icon: '🍽️', name: 'Restaurant', desc: 'Table reservations' },
    { icon: '💆', name: 'Spa & Wellness', desc: 'Appointments' },
    { icon: '🚗', name: 'Transport', desc: 'Airport transfers' },
    { icon: '🎫', name: 'Concierge', desc: 'Event tickets' },
    { icon: '🏊', name: 'Amenities', desc: 'Pool, gym info' },
  ]

  return (
    <>
      <PageHero
        badge="Hospitality"
        badgeColor="amber"
        title="AI concierge for"
        titleHighlight="exceptional guest experiences."
        description="Delight guests with AI-powered concierge services that handle bookings, answer questions, and provide personalized recommendations around the clock."
        primaryCta="See Demo"
        secondaryCta="Talk to Sales"
        gradient="from-amber-500 via-orange-600 to-red-700"
        features={['24/7 concierge', '50+ languages', 'Instant bookings']}
        stats={[
          { value: '200+', label: 'Hotels' },
          { value: '35%', label: 'More bookings' },
          { value: '4.8★', label: 'Guest rating' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Every service, <span className="text-amber-600">automated</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, idx) => (
              <Card key={idx} hover padding="md" className="text-center">
                <div className="text-3xl mb-2">{service.icon}</div>
                <h4 className="font-semibold text-neutral-900 text-sm">{service.name}</h4>
                <p className="text-xs text-neutral-500">{service.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Use Cases"
        title="Elevate every"
        titleHighlight="guest touchpoint"
        description="From booking to checkout, AI agents that deliver 5-star service."
        features={useCases}
        layout="grid"
        columns={2}
        background="gray"
      />

      <CTASection
        title="Ready to delight your guests?"
        description="Join 200+ hotels using ConvoAI for hospitality."
        primaryCta="Request Demo"
        variant="dark"
      />
    </>
  )
}

export default HospitalityPage
