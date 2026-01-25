import { Section, Card, Container } from '@/components/ui'
import { Target, Heart, Zap, Globe } from 'lucide-react'

const AboutPage = () => {
  const values = [
    { icon: Target, title: 'Customer First', desc: 'Every decision starts with how it helps our customers succeed.' },
    { icon: Heart, title: 'Human-Centered AI', desc: 'We build AI that augments humans, not replaces them.' },
    { icon: Zap, title: 'Move Fast', desc: 'We ship quickly, learn constantly, and iterate relentlessly.' },
    { icon: Globe, title: 'Global Impact', desc: 'We\'re building for businesses and users around the world.' },
  ]

  const team = [
    { name: 'Alex Chen', role: 'CEO & Co-founder', image: '👨‍💼' },
    { name: 'Sarah Kim', role: 'CTO & Co-founder', image: '👩‍💻' },
    { name: 'Michael Park', role: 'VP Engineering', image: '👨‍🔧' },
    { name: 'Emily Zhang', role: 'VP Product', image: '👩‍🎨' },
    { name: 'David Lee', role: 'VP Sales', image: '👨‍💼' },
    { name: 'Lisa Wang', role: 'VP Marketing', image: '👩‍💼' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Building the future of
              <span className="text-accent-400"> AI communication</span>
            </h1>
            <p className="text-xl text-white/80">
              We're on a mission to make AI-powered communication accessible to every business, 
              enabling meaningful conversations at scale.
            </p>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-600">
                <p>
                  ConvoAI was founded in 2022 by a team of AI researchers and enterprise software veterans 
                  who saw an opportunity to transform how businesses communicate with their customers.
                </p>
                <p>
                  We started with a simple observation: most customer interactions are repetitive, 
                  yet businesses struggle to handle them efficiently while maintaining quality.
                </p>
                <p>
                  Today, we serve over 500 businesses across education, hospitality, and healthcare, 
                  handling millions of conversations every month. And we're just getting started.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card padding="lg" className="text-center bg-primary-50">
                <div className="text-4xl font-bold text-primary-600 mb-2">2022</div>
                <p className="text-neutral-600">Founded</p>
              </Card>
              <Card padding="lg" className="text-center bg-green-50">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <p className="text-neutral-600">Customers</p>
              </Card>
              <Card padding="lg" className="text-center bg-amber-50">
                <div className="text-4xl font-bold text-amber-600 mb-2">50M+</div>
                <p className="text-neutral-600">Conversations</p>
              </Card>
              <Card padding="lg" className="text-center bg-purple-50">
                <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                <p className="text-neutral-600">Team members</p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <Card key={idx} padding="lg" className="text-center">
                <div className="w-14 h-14 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">{value.title}</h4>
                <p className="text-sm text-neutral-600">{value.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Leadership Team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <Card key={idx} hover padding="lg" className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h4 className="font-semibold text-neutral-900">{member.name}</h4>
                <p className="text-sm text-neutral-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default AboutPage
