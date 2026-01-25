import { Section, Container, Card } from '@/components/ui'
import { Code, Copy, Terminal } from 'lucide-react'

const APIPage = () => (
  <>
    <section className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 py-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
          <p className="text-white/80">Build powerful integrations with our REST API</p>
        </div>
      </Container>
    </section>
    <Section background="white" padding="large">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Card padding="lg" className="bg-neutral-900 text-white font-mono text-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-400">Example Request</span>
              <Copy className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-white" />
            </div>
            <pre className="text-green-400">{`curl -X POST https://api.convoai.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Support Agent", "type": "chat"}'`}</pre>
          </Card>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {['Agents', 'Conversations', 'Analytics'].map((item, i) => (
              <Card key={i} hover padding="md" className="cursor-pointer">
                <Terminal className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold">{item} API</h4>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  </>
)

export default APIPage
