import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Section, Container, Card, Button } from '@/components/ui'
import { Check, X, HelpCircle } from 'lucide-react'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with AI',
      price: { monthly: 49, annual: 39 },
      features: [
        { name: '1 AI Agent', included: true },
        { name: '1,000 conversations/mo', included: true },
        { name: 'Chat channel', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Voice channel', included: false },
        { name: 'Custom integrations', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For growing teams that need more power',
      price: { monthly: 149, annual: 119 },
      features: [
        { name: '5 AI Agents', included: true },
        { name: '10,000 conversations/mo', included: true },
        { name: 'Chat + Voice channels', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'CRM integrations', included: true },
        { name: 'API access', included: true },
        { name: 'Custom branding', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: { monthly: null, annual: null },
      features: [
        { name: 'Unlimited AI Agents', included: true },
        { name: 'Unlimited conversations', included: true },
        { name: 'All channels', included: true },
        { name: 'Custom analytics', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Full API access', included: true },
        { name: 'SLA guarantee', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'What counts as a conversation?',
      answer: 'A conversation is a single interaction session between a user and your AI agent, regardless of the number of messages exchanged.',
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Choose the perfect plan for your business. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual ? 'bg-white text-primary-700' : 'text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isAnnual ? 'bg-white text-primary-700' : 'text-white'
                }`}
              >
                Annual <span className="text-green-600 ml-1">Save 20%</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <Section background="gray" padding="large">
        <Container>
          <div className="grid md:grid-cols-3 gap-8 -mt-32">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                padding="none"
                className={`relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                  <p className="text-neutral-600 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {plan.price.monthly ? (
                      <>
                        <span className="text-4xl font-bold text-neutral-900">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-neutral-500">/month</span>
                        {isAnnual && (
                          <p className="text-sm text-green-600 mt-1">
                            Billed annually (${plan.price.annual * 12}/year)
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-neutral-900">Custom</span>
                    )}
                  </div>

                  <Link to={plan.price.monthly ? '/signup' : '/contact'}>
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      fullWidth
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-neutral-200 p-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-neutral-700' : 'text-neutral-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <Card key={idx} padding="lg">
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-500" />
                  {faq.question}
                </h4>
                <p className="text-neutral-600 ml-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-white/80 mb-8">
              Our team is here to help you find the perfect plan.
            </p>
            <Link to="/contact">
              <Button variant="white" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

export default PricingPage
