import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Puzzle, Search } from 'lucide-react'
import { useState } from 'react'

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'crm', name: 'CRM' },
    { id: 'communication', name: 'Communication' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'payment', name: 'Payment' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'ai', name: 'AI/LLM' },
  ]

  const integrations = [
    { name: 'Salesforce', category: 'crm', icon: '☁️', desc: 'Sync contacts and deals' },
    { name: 'HubSpot', category: 'crm', icon: '🧡', desc: 'Marketing automation' },
    { name: 'Pipedrive', category: 'crm', icon: '🎯', desc: 'Sales pipeline' },
    { name: 'Zoho CRM', category: 'crm', icon: '📊', desc: 'Customer management' },
    { name: 'Slack', category: 'communication', icon: '💬', desc: 'Team notifications' },
    { name: 'Microsoft Teams', category: 'communication', icon: '👥', desc: 'Enterprise chat' },
    { name: 'Twilio', category: 'communication', icon: '📱', desc: 'Voice & SMS' },
    { name: 'SendGrid', category: 'communication', icon: '📧', desc: 'Email delivery' },
    { name: 'Google Calendar', category: 'calendar', icon: '📅', desc: 'Schedule sync' },
    { name: 'Calendly', category: 'calendar', icon: '🗓️', desc: 'Booking links' },
    { name: 'Microsoft Outlook', category: 'calendar', icon: '📨', desc: 'Email & calendar' },
    { name: 'Cal.com', category: 'calendar', icon: '⏰', desc: 'Open scheduling' },
    { name: 'Stripe', category: 'payment', icon: '💳', desc: 'Payment processing' },
    { name: 'PayPal', category: 'payment', icon: '🅿️', desc: 'Online payments' },
    { name: 'Square', category: 'payment', icon: '⬜', desc: 'POS integration' },
    { name: 'Shopify', category: 'payment', icon: '🛒', desc: 'E-commerce' },
    { name: 'Google Analytics', category: 'analytics', icon: '📈', desc: 'Website analytics' },
    { name: 'Mixpanel', category: 'analytics', icon: '🔬', desc: 'Product analytics' },
    { name: 'Segment', category: 'analytics', icon: '🔗', desc: 'Data routing' },
    { name: 'Amplitude', category: 'analytics', icon: '📉', desc: 'User analytics' },
    { name: 'OpenAI', category: 'ai', icon: '🤖', desc: 'GPT models' },
    { name: 'Anthropic', category: 'ai', icon: '🧠', desc: 'Claude models' },
    { name: 'Cohere', category: 'ai', icon: '💡', desc: 'Enterprise AI' },
    { name: 'Custom LLM', category: 'ai', icon: '⚙️', desc: 'Self-hosted models' },
  ]

  const filteredIntegrations = integrations.filter(i => {
    const matchesCategory = activeCategory === 'all' || i.category === activeCategory
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <PageHero
        badge="Integrations"
        badgeColor="primary"
        title="Connect to"
        titleHighlight="100+ tools."
        description="ConvoAI integrates with your existing tech stack. Connect CRMs, calendars, payment systems, and more with just a few clicks."
        primaryCta="Browse Integrations"
        secondaryCta="Request Integration"
        gradient="from-orange-500 via-red-600 to-pink-700"
        features={['One-click setup', 'Real-time sync', 'Custom webhooks']}
        stats={[
          { value: '100+', label: 'Integrations' },
          { value: '2-way', label: 'Data sync' },
          { value: '99.9%', label: 'Uptime' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Integration Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredIntegrations.map((integration, idx) => (
              <Card key={idx} hover padding="md" className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{integration.name}</h4>
                    <p className="text-sm text-neutral-500">{integration.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Puzzle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No integrations found. Try a different search.</p>
            </div>
          )}
        </Container>
      </Section>

      <Section background="gray" padding="large">
        <Container>
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Don't see what you need?
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              We're constantly adding new integrations. Request one and we'll prioritize it based on demand. Or use our API to build your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Request Integration
              </button>
              <button className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors">
                View API Docs
              </button>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to connect your tools?"
        description="Start integrating in minutes with our one-click setup."
        primaryCta="Get Started"
        variant="dark"
      />
    </>
  )
}

export default IntegrationsPage
