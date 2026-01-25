import { useState } from 'react'
import { Section, Card, Button } from '@/components/ui'
import { industries } from '@/config/site.config'
import { cn } from '@/utils/helpers'
import { GraduationCap, Building2, Check, ArrowRight } from 'lucide-react'

const iconMap = {
  education: GraduationCap,
  hospitality: Building2,
}

const IndustriesSection = () => {
  const [activeIndustry, setActiveIndustry] = useState(industries[0].id)
  const currentIndustry = industries.find(i => i.id === activeIndustry)

  return (
    <Section id="industries" background="white" padding="default">
      <Section.Header>
        <Section.Badge>Industry Solutions</Section.Badge>
        <Section.Title>
          Built for
          <br />
          <span className="gradient-text">your industry.</span>
        </Section.Title>
        <Section.Description>
          Purpose-built AI solutions for Education and Hospitality with 
          industry-specific features and compliance.
        </Section.Description>
      </Section.Header>

      {/* Industry Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        {industries.map((industry) => {
          const Icon = iconMap[industry.id]
          return (
            <button
              key={industry.id}
              onClick={() => setActiveIndustry(industry.id)}
              className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all',
                activeIndustry === industry.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              <Icon className="w-5 h-5" />
              {industry.name}
            </button>
          )
        })}
      </div>

      {/* Industry Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Info */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            {currentIndustry.title}
          </h3>
          <p className="text-lg text-neutral-600 mb-8">
            {currentIndustry.description}
          </p>

          <h4 className="font-semibold text-neutral-900 mb-4">Use Cases</h4>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {currentIndustry.useCases.map((useCase, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-neutral-50 rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-neutral-700">{useCase}</span>
              </div>
            ))}
          </div>

          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Explore {currentIndustry.name} Solutions
          </Button>
        </div>

        {/* Right: Visual */}
        <div className="relative">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8">
            {/* Mock UI */}
            <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    {activeIndustry === 'education' ? (
                      <GraduationCap className="w-5 h-5 text-white" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {activeIndustry === 'education' ? 'Student Assistant' : 'Concierge AI'}
                    </p>
                    <p className="text-sm text-success-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-success-500 rounded-full" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg" />
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg" />
                </div>
              </div>

              {/* Chat Preview */}
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary-600">AI</span>
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                    <p className="text-neutral-700 text-sm">
                      {activeIndustry === 'education'
                        ? "Hello! I'm here to help with your admission inquiry. What program are you interested in?"
                        : "Welcome! I'm your virtual concierge. How can I make your stay more comfortable?"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-primary-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-xs">
                    <p className="text-white text-sm">
                      {activeIndustry === 'education'
                        ? "I'd like to know about the MBA program requirements"
                        : "Can I book a spa appointment for tomorrow?"
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0" />
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary-600">AI</span>
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                    <p className="text-neutral-700 text-sm">
                      {activeIndustry === 'education'
                        ? "Great choice! Would you prefer a quick overview or should I schedule a video call with our admissions counselor?"
                        : "Of course! I see we have openings at 10am and 2pm. Which time works better? I can also show you our spa facilities via video tour."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-neutral-100">
                <div className="bg-neutral-100 rounded-xl px-4 py-3 text-neutral-400 text-sm">
                  Type your message...
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-200 rounded-full opacity-60 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-60 blur-xl" />
        </div>
      </div>
    </Section>
  )
}

export default IndustriesSection
