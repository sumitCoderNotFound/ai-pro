import { useState } from 'react'
import { Section } from '@/components/ui'
import { faqs } from '@/config/site.config'
import { cn } from '@/utils/helpers'
import { ChevronDown } from 'lucide-react'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq" background="gray" padding="default">
      <Section.Header>
        <Section.Badge>FAQ</Section.Badge>
        <Section.Title>
          Common
          <br />
          <span className="gradient-text">Questions</span>
        </Section.Title>
      </Section.Header>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-neutral-200 last:border-0"
          >
            <button
              className="w-full py-6 flex items-center justify-between text-left"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span className="text-lg font-semibold text-neutral-900 pr-8">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-neutral-400 transition-transform flex-shrink-0',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
              )}
            >
              <p className="text-neutral-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="text-center mt-12">
        <p className="text-neutral-600 mb-4">
          Still have questions?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
        >
          Contact our support team
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </Section>
  )
}

export default FAQSection
