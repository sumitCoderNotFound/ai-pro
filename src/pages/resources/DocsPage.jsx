import { Section, Card, Container } from '@/components/ui'
import { FileText, Book, Code, Terminal, Search } from 'lucide-react'
import { useState } from 'react'

const DocsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    { icon: Book, title: 'Getting Started', desc: 'Quick start guides and tutorials', items: ['Installation', 'First Agent', 'Basic Concepts'] },
    { icon: Code, title: 'API Reference', desc: 'Complete API documentation', items: ['Authentication', 'Endpoints', 'Webhooks'] },
    { icon: Terminal, title: 'SDKs', desc: 'Client libraries and tools', items: ['JavaScript', 'Python', 'REST API'] },
    { icon: FileText, title: 'Guides', desc: 'In-depth tutorials', items: ['Voice Agents', 'Chat Integration', 'Analytics'] },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
            <p className="text-white/80 mb-8">Everything you need to build with ConvoAI</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, idx) => (
              <Card key={idx} hover padding="lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{section.title}</h3>
                    <p className="text-sm text-neutral-500 mb-3">{section.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default DocsPage
