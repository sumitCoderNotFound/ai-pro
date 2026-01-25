import { useRef, useState, useEffect } from 'react'
import { Section, Card } from '@/components/ui'
import { features } from '@/config/site.config'
import { Users, Zap, Globe, Shield, Check, Sparkles } from 'lucide-react'

const iconMap = {
  Users: Users,
  Zap: Zap,
  Globe: Globe,
  Shield: Shield,
}

const FeaturesSection = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Section id="features" background="gray" padding="default">
      <div ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-100 text-primary-700 mb-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Why ConvoAI
          </span>

          <h2
            className="text-display-md md:text-display-lg text-neutral-900 mb-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '100ms',
            }}
          >
            Built to scale,
            <br />
            <span className="gradient-text">human by design.</span>
          </h2>

          <p
            className="text-lg text-neutral-600 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '200ms',
            }}
          >
            Everything you need to deploy AI agents that sound human, execute tasks,
            and scale effortlessly.
          </p>
        </div>

        {/* Feature Highlights Grid - 3D tilt effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.highlights.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            const isHovered = hoveredFeature === index

            return (
              <div
                key={index}
                className="transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0) rotateX(0)'
                    : 'translateY(40px) rotateX(10deg)',
                  transitionDelay: `${300 + index * 100}ms`,
                  perspective: '1000px',
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card
                  hover
                  padding="lg"
                  className="text-center h-full relative overflow-hidden group"
                  style={{
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {/* Animated background gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                    }}
                  />

                  <div className="relative z-10">
                    <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Card>
              </div>
            )
          })}
        </div>

        {/* Detailed Features - Bento grid style */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feature 1 - Large */}
          <div
            className="lg:col-span-2 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-60px)',
              transitionDelay: '700ms',
            }}
          >
            <Card padding="lg" className="h-full group hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <span className="text-primary-600 font-semibold text-sm mb-2 block">
                    🎨 Drag & Drop Builder
                  </span>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Highly Configurable Agentic Framework
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Design reliable conversational call flows with a drag-and-drop framework,
                    built-in guardrails, and full control over agent behavior.
                  </p>
                  <ul className="space-y-2">
                    {['Visual flow builder', 'Custom triggers & conditions', 'Built-in guardrails', 'No coding required'].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-neutral-700"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                          transition: 'all 0.4s ease-out',
                          transitionDelay: `${800 + i * 80}ms`,
                        }}
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-xl p-4 min-h-[200px] flex items-center justify-center relative overflow-hidden group-hover:from-primary-50 group-hover:to-accent-50 transition-colors duration-500">
                  {/* Animated placeholder */}
                  <div className="space-y-3 w-full max-w-[200px]">
                    <div className="h-8 bg-white/80 rounded-lg shadow-sm animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-20 flex-1 bg-white/60 rounded-lg shadow-sm animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="h-20 flex-1 bg-white/60 rounded-lg shadow-sm animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <div className="h-8 bg-white/80 rounded-lg shadow-sm animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Feature 2 - Small */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(60px)',
              transitionDelay: '800ms',
            }}
          >
            <Card padding="lg" className="h-full group hover:shadow-xl transition-shadow duration-300">
              <span className="text-cyan-600 font-semibold text-sm mb-2 block">
                ⚡ Real-Time Actions
              </span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Function Calling
              </h3>
              <p className="text-neutral-600 mb-4">
                Add built-in or custom functions directly into call flows.
              </p>
              <ul className="space-y-2">
                {['Book appointments', 'Process payments', 'Update CRM records', 'Transfer calls', 'Send confirmations'].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-neutral-700 text-sm"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(10px)',
                      transition: 'all 0.4s ease-out',
                      transitionDelay: `${900 + i * 60}ms`,
                    }}
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Feature 3 - Small */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
              transitionDelay: '900ms',
            }}
          >
            <Card padding="lg" className="h-full group hover:shadow-xl transition-shadow duration-300">
              <span className="text-amber-600 font-semibold text-sm mb-2 block">
                📚 Knowledge Base
              </span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Streaming RAG
              </h3>
              <p className="text-neutral-600 mb-4">
                Ensure accurate, real-time answers backed by your knowledge base with auto-sync.
              </p>
              <div className="bg-neutral-100 rounded-xl p-4 mt-4 group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-orange-50 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Globe className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="text-sm text-neutral-600">Auto-syncs with your website</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000"
                    style={{
                      width: isVisible ? '75%' : '0%',
                      transitionDelay: '1200ms',
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Feature 4 - Large */}
          <div
            className="lg:col-span-2 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
              transitionDelay: '1000ms',
            }}
          >
            <Card padding="lg" className="h-full group hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
              {/* Animated background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100 to-cyan-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2" />

              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-1">
                  <span className="text-green-600 font-semibold text-sm mb-2 block">
                    🤝 Hybrid Handoff
                  </span>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Seamless AI to Human Transfer
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    When AI reaches its limits, seamlessly transfer to human agents with full
                    conversation context preserved.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-sm text-neutral-600">
                      AI handles <span className="font-semibold text-neutral-900">80%</span> → Humans handle the rest
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-neutral-100 rounded-xl p-4 min-h-[160px] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-cyan-50 transition-colors duration-500">
                  {/* Flow diagram placeholder */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-0.5 bg-neutral-300" />
                      <span className="text-xs text-neutral-500 my-1">handoff</span>
                      <div className="w-8 h-0.5 bg-neutral-300" />
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default FeaturesSection
