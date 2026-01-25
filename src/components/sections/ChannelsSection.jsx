import { useRef, useState, useEffect } from 'react'
import { Section, Card } from '@/components/ui'
import { features } from '@/config/site.config'
import { Phone, Video, MessageSquare, Smartphone, ArrowRight } from 'lucide-react'

const iconMap = {
  Phone: Phone,
  Video: Video,
  MessageSquare: MessageSquare,
  Smartphone: Smartphone,
}

const colorMap = {
  primary: {
    bg: 'bg-primary-50',
    bgHover: 'group-hover:bg-primary-100',
    icon: 'text-primary-600',
    border: 'hover:border-primary-300',
    glow: 'group-hover:shadow-primary-500/20',
  },
  accent: {
    bg: 'bg-cyan-50',
    bgHover: 'group-hover:bg-cyan-100',
    icon: 'text-cyan-600',
    border: 'hover:border-cyan-300',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  success: {
    bg: 'bg-green-50',
    bgHover: 'group-hover:bg-green-100',
    icon: 'text-green-600',
    border: 'hover:border-green-300',
    glow: 'group-hover:shadow-green-500/20',
  },
  warning: {
    bg: 'bg-amber-50',
    bgHover: 'group-hover:bg-amber-100',
    icon: 'text-amber-600',
    border: 'hover:border-amber-300',
    glow: 'group-hover:shadow-amber-500/20',
  },
}

const ChannelsSection = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Section id="channels" background="white" padding="default">
      <div ref={sectionRef}>
        {/* Section Header with reveal animation */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-100 text-primary-700 mb-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Omni-Channel Communication
          </span>

          <h2
            className="text-display-md md:text-display-lg text-neutral-900 mb-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '100ms',
            }}
          >
            True omni-channel
            <br />
            <span className="gradient-text">communication.</span>
          </h2>

          <p
            className="text-lg text-neutral-600 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '200ms',
            }}
          >
            Reach your customers on their preferred channel with AI agents that seamlessly
            handle voice, video, chat, and SMS conversations.
          </p>
        </div>

        {/* Channel Cards with staggered animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.channels.map((channel, index) => {
            const Icon = iconMap[channel.icon]
            const colors = colorMap[channel.color]

            return (
              <div
                key={channel.id}
                className="transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  transitionDelay: `${300 + index * 100}ms`,
                }}
                onMouseEnter={() => setActiveCard(channel.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <Card
                  hover
                  padding="lg"
                  className={`group relative overflow-hidden h-full ${colors.border} ${colors.glow} transition-all duration-300 hover:shadow-xl`}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg}`}
                    style={{
                      background: activeCard === channel.id
                        ? `radial-gradient(circle at 30% 30%, ${colors.bg} 0%, transparent 70%)`
                        : 'none',
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon with animation */}
                    <div
                      className={`w-14 h-14 ${colors.bg} ${colors.bgHover} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className={`w-7 h-7 ${colors.icon} transition-transform duration-300 group-hover:scale-110`} />
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-800">
                      {channel.title}
                    </h3>

                    <p className="text-neutral-600 mb-4 group-hover:text-neutral-700">
                      {channel.description}
                    </p>

                    <button className="inline-flex items-center gap-2 text-primary-600 font-medium transition-all duration-300 group-hover:gap-3">
                      Learn more
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Video Highlight with slide-in animation */}
        <div
          className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
            transitionDelay: '700ms',
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }} />
          </div>

          {/* Floating orbs */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full mb-4">
                ✨ New Feature
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Video AI Agents — The Future is Face-to-Face
              </h3>
              <p className="text-white/80 mb-6">
                Build trust with face-to-face AI interactions. Perfect for virtual tours,
                counseling sessions, and high-value customer moments.
              </p>
              <ul className="space-y-3 mb-6">
                {['Virtual campus tours', 'Hotel room showcases', 'Live document review', 'Real-time translation'].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-white/90"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'all 0.5s ease-out',
                      transitionDelay: `${900 + i * 100}ms`,
                    }}
                  >
                    <div className="w-5 h-5 bg-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-colors duration-300">
                <div className="aspect-video bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer">
                  <div className="text-center transition-transform duration-300 group-hover:scale-110">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Click to preview</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-400 rounded-lg rotate-12 opacity-80" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary-400 rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default ChannelsSection