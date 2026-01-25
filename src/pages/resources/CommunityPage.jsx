import { Section, Container, Card, Button } from '@/components/ui'
import { Users, MessageSquare, Github, Twitter } from 'lucide-react'

const CommunityPage = () => (
  <>
    <section className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 py-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Community</h1>
          <p className="text-white/80">Connect with other ConvoAI users and developers</p>
        </div>
      </Container>
    </section>
    <Section background="white" padding="large">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, title: 'Discord', desc: 'Join our Discord server', color: 'bg-indigo-100 text-indigo-600' },
            { icon: Github, title: 'GitHub', desc: 'Contribute to open source', color: 'bg-neutral-100 text-neutral-900' },
            { icon: Twitter, title: 'Twitter', desc: 'Follow for updates', color: 'bg-blue-100 text-blue-600' },
            { icon: Users, title: 'Forum', desc: 'Ask questions', color: 'bg-green-100 text-green-600' },
          ].map((item, i) => (
            <Card key={i} hover padding="lg" className="text-center cursor-pointer">
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
              <p className="text-sm text-neutral-500">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  </>
)

export default CommunityPage
