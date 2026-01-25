import { useEffect, useRef } from 'react'
import { Section, Card } from '@/components/ui'
import { integrations } from '@/config/site.config'

const IntegrationsSection = () => {
  const scrollRef = useRef(null)

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId
    let scrollPosition = 0
    const speed = 0.5 // pixels per frame

    const scroll = () => {
      scrollPosition += speed
      
      // Reset to beginning when halfway (seamless loop)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Double the integrations for seamless loop
  const doubledIntegrations = [...integrations, ...integrations]

  return (
    <Section id="integrations" background="white" padding="default">
      <Section.Header>
        <Section.Badge>Integrations</Section.Badge>
        <Section.Title>
          Seamless integrations
          <br />
          <span className="gradient-text">with your tech stack</span>
        </Section.Title>
        <Section.Description>
          Connect ConvoAI with your existing tools and workflows. 
          From CRMs to LLMs, we integrate with what you already use.
        </Section.Description>
      </Section.Header>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling Cards */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden py-4"
        >
          {doubledIntegrations.map((integration, index) => (
            <Card
              key={index}
              hover
              padding="md"
              className="flex-shrink-0 w-40 h-28 flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <span className="text-neutral-500 text-sm font-bold">
                    {integration.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 font-medium">
                  {integration.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Categories */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <Card padding="lg" className="text-center">
          <div className="w-14 h-14 mx-auto bg-primary-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">CRM & Sales</h3>
          <p className="text-neutral-600 text-sm mb-4">
            Salesforce, HubSpot, Pipedrive, and more
          </p>
          <a href="#" className="text-primary-600 font-medium text-sm">
            View all CRM integrations →
          </a>
        </Card>

        <Card padding="lg" className="text-center">
          <div className="w-14 h-14 mx-auto bg-accent-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">LLM & AI</h3>
          <p className="text-neutral-600 text-sm mb-4">
            OpenAI, Anthropic, Custom LLMs
          </p>
          <a href="#" className="text-primary-600 font-medium text-sm">
            View all AI integrations →
          </a>
        </Card>

        <Card padding="lg" className="text-center">
          <div className="w-14 h-14 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Telephony</h3>
          <p className="text-neutral-600 text-sm mb-4">
            Twilio, Vonage, SIP Trunking
          </p>
          <a href="#" className="text-primary-600 font-medium text-sm">
            View all telephony integrations →
          </a>
        </Card>
      </div>

      {/* API Callout */}
      <div className="mt-12 bg-neutral-900 rounded-2xl p-8 md:p-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          Need a custom integration?
        </h3>
        <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
          Use our powerful API to build custom integrations with any system. 
          Full documentation and SDKs available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            View API Docs
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </Section>
  )
}

export default IntegrationsSection
