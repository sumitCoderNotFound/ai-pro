import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Video, Eye, Sparkles, Monitor, Users, GraduationCap, Hotel, Building2 } from 'lucide-react'

const VideoAIPage = () => {
  const features = [
    {
      icon: Eye,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      title: 'Realistic AI Avatars',
      description: 'Lifelike digital humans that build trust through face-to-face interaction.',
      points: ['Customizable appearance', 'Natural expressions', 'Lip-sync accuracy'],
      emoji: '👤'
    },
    {
      icon: Monitor,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Screen Sharing',
      description: 'AI agents can share screens to walk through documents, applications, or presentations.',
      points: ['Document review', 'Form assistance', 'Visual demonstrations'],
      emoji: '🖥️'
    },
    {
      icon: Sparkles,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Real-Time Translation',
      description: 'Break language barriers with instant translation while maintaining natural conversation flow.',
      points: ['30+ languages', 'Subtitle overlay', 'Cultural adaptation'],
      emoji: '🌍'
    },
    {
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Human Handoff',
      description: 'Seamlessly transfer to a human agent with full context when needed.',
      points: ['Context preservation', 'Warm transfer', 'Recording & transcripts'],
      emoji: '🤝'
    },
  ]

  const useCases = [
    {
      icon: GraduationCap,
      title: 'Virtual Campus Tours',
      description: 'Give prospective students a personal tour experience with an AI guide who can answer any question.',
      color: 'bg-blue-500'
    },
    {
      icon: Hotel,
      title: 'Hotel Room Showcases',
      description: 'Let guests preview rooms and amenities with a virtual concierge who handles bookings.',
      color: 'bg-amber-500'
    },
    {
      icon: Building2,
      title: 'Remote Consultations',
      description: 'Provide face-to-face advisory services at scale without scheduling constraints.',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Customer Onboarding',
      description: 'Walk new customers through setup with a friendly AI guide who can demonstrate features.',
      color: 'bg-green-500'
    },
  ]

  return (
    <>
      <PageHero
        badge="✨ New Feature"
        badgeColor="accent"
        title="Face-to-face AI"
        titleHighlight="that builds trust."
        description="The future of customer interaction is here. Deploy realistic AI avatars for video conversations that feel personal and build genuine connections."
        primaryCta="Join Waitlist"
        secondaryCta="See Demo"
        gradient="from-cyan-600 via-blue-700 to-indigo-900"
        features={['Realistic avatars', 'Screen sharing', 'Real-time translation']}
        stats={[
          { value: '3x', label: 'Higher engagement' },
          { value: '89%', label: 'Satisfaction rate' },
          { value: '24/7', label: 'Availability' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-100 text-cyan-700 mb-4">
              Why Video AI?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Build trust through <span className="text-cyan-600">human connection</span>
            </h2>
            <p className="text-lg text-neutral-600">
              Video creates 3x more engagement than voice alone. Our AI avatars combine the scalability of automation with the trust of face-to-face interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl">
              <div className="text-5xl font-bold text-cyan-600 mb-2">73%</div>
              <p className="text-neutral-600">of customers prefer video for complex queries</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="text-5xl font-bold text-blue-600 mb-2">2.5x</div>
              <p className="text-neutral-600">higher conversion rate than chat alone</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <div className="text-5xl font-bold text-indigo-600 mb-2">40%</div>
              <p className="text-neutral-600">reduction in support escalations</p>
            </div>
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Capabilities"
        title="Next-generation"
        titleHighlight="video interactions"
        description="Everything you need to deploy AI-powered video agents at scale."
        features={features}
        layout="alternating"
        background="gray"
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-100 text-cyan-700 mb-4">
              Use Cases
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Perfect for high-touch <span className="text-cyan-600">interactions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} hover padding="lg" className="flex gap-6">
                <div className={`w-14 h-14 ${useCase.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{useCase.title}</h3>
                  <p className="text-neutral-600">{useCase.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-500/20 text-cyan-300 mb-6">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be first in line for Video AI
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              We're rolling out Video AI to select customers. Join the waitlist to get early access and shape the future of video automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[300px]"
              />
              <button className="px-8 py-4 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-400 transition-colors">
                Join Waitlist
              </button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default VideoAIPage
