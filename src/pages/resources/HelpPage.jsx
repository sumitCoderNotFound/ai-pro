import { Section, Container, Card } from '@/components/ui'
import { HelpCircle, Search, MessageSquare, BookOpen } from 'lucide-react'
import { useState } from 'react'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const categories = [
    { icon: '🚀', title: 'Getting Started', count: 12 },
    { icon: '🤖', title: 'Agent Setup', count: 24 },
    { icon: '📞', title: 'Voice & Phone', count: 18 },
    { icon: '💬', title: 'Chat & Messaging', count: 15 },
    { icon: '🔗', title: 'Integrations', count: 30 },
    { icon: '💰', title: 'Billing & Plans', count: 10 },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-white/80 mb-8">Find answers to your questions</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Container>
      </section>
      <Section background="white" padding="large">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Card key={i} hover padding="lg" className="cursor-pointer">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-neutral-900">{cat.title}</h3>
                <p className="text-sm text-neutral-500">{cat.count} articles</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default HelpPage
