import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { MessageSquare, Bot, Zap, Globe, Palette, Code, BarChart3, Shield } from 'lucide-react'

const ChatAIPage = () => {
  const features = [
    {
      icon: Bot,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Smart Conversations',
      description: 'Context-aware AI that remembers conversation history and user preferences.',
      points: ['Long-term memory', 'Context switching', 'Personalized responses']
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Instant Actions',
      description: 'Trigger workflows, book appointments, and process transactions in chat.',
      points: ['Native integrations', 'Custom webhooks', 'Real-time updates']
    },
    {
      icon: Palette,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Fully Customizable',
      description: 'Match your brand with custom colors, fonts, and conversation styles.',
      points: ['Brand theming', 'Custom avatars', 'Tone customization']
    },
    {
      icon: Globe,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Omnichannel',
      description: 'Deploy on web, mobile apps, WhatsApp, Facebook Messenger, and more.',
      points: ['Website widget', 'Mobile SDK', 'Social platforms']
    },
  ]

  const integrations = [
    { name: 'WhatsApp', icon: '💬' },
    { name: 'Messenger', icon: '📱' },
    { name: 'Slack', icon: '🔔' },
    { name: 'Teams', icon: '👥' },
    { name: 'Discord', icon: '🎮' },
    { name: 'Telegram', icon: '✈️' },
  ]

  return (
    <>
      <PageHero
        badge="Chat AI"
        badgeColor="green"
        title="Website chat"
        titleHighlight="that converts."
        description="Engage visitors with AI-powered chat that understands intent, answers questions, and guides users to conversion — 24/7."
        primaryCta="Add to Your Site"
        secondaryCta="See Demo"
        gradient="from-green-600 via-emerald-700 to-teal-900"
        features={['5-minute setup', 'No code required', 'Free tier available']}
        stats={[
          { value: '50M+', label: 'Chats handled' },
          { value: '40%', label: 'More conversions' },
          { value: '3s', label: 'Avg response' },
        ]}
      >
        {/* Chat Widget Preview */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm mx-auto">
          <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">ConvoAI Assistant</p>
              <p className="text-white/70 text-xs">● Online</p>
            </div>
          </div>
          <div className="p-4 space-y-3 bg-neutral-50 min-h-[250px]">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[80%]">
              <p className="text-neutral-700 text-sm">Hi! 👋 How can I help you today?</p>
            </div>
            <div className="bg-green-600 rounded-2xl rounded-tr-none p-3 max-w-[80%] ml-auto">
              <p className="text-white text-sm">I want to learn about pricing</p>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[80%]">
              <p className="text-neutral-700 text-sm">Great question! We have 3 plans starting at $49/mo. Would you like me to explain each one?</p>
            </div>
          </div>
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 px-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none"
              />
              <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </PageHero>

      <FeatureSection
        badge="Features"
        title="Chat that actually"
        titleHighlight="understands"
        description="Not just another chatbot. ConvoAI Chat uses advanced AI to have real conversations."
        features={features}
        layout="grid"
        columns={2}
      />

      <Section background="gray" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Deploy <span className="text-green-600">everywhere</span>
            </h2>
            <p className="text-lg text-neutral-600">
              One AI, every platform. Reach customers wherever they are.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, idx) => (
              <Card key={idx} hover padding="md" className="text-center">
                <div className="text-4xl mb-2">{integration.icon}</div>
                <p className="font-medium text-neutral-700">{integration.name}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700 mb-4">
                Easy Integration
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Add to your site in <span className="text-green-600">2 minutes</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Just copy and paste one line of code. No developers needed.
              </p>
              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <code>{`<script src="https://cdn.convoai.com/widget.js" data-id="YOUR_ID"></script>`}</code>
              </div>
              <div className="flex gap-4 mt-6">
                <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                  Get Your Code
                </button>
                <button className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors">
                  View Docs
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card padding="lg" className="bg-green-50">
                <Code className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="font-semibold text-neutral-900 mb-1">No Code</h4>
                <p className="text-sm text-neutral-600">Copy-paste installation</p>
              </Card>
              <Card padding="lg" className="bg-blue-50">
                <Zap className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-semibold text-neutral-900 mb-1">Instant</h4>
                <p className="text-sm text-neutral-600">Live in seconds</p>
              </Card>
              <Card padding="lg" className="bg-purple-50">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-semibold text-neutral-900 mb-1">Analytics</h4>
                <p className="text-sm text-neutral-600">Built-in insights</p>
              </Card>
              <Card padding="lg" className="bg-amber-50">
                <Shield className="w-8 h-8 text-amber-600 mb-3" />
                <h4 className="font-semibold text-neutral-900 mb-1">Secure</h4>
                <p className="text-sm text-neutral-600">GDPR compliant</p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to transform your website?"
        description="Add intelligent chat to your site today. Free plan available."
        primaryCta="Start Free"
        variant="gradient"
      />
    </>
  )
}

export default ChatAIPage
