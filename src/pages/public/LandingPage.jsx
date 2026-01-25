import { 
  HeroSection, 
  ChannelsSection, 
  FeaturesSection, 
  IndustriesSection, 
  TestimonialsSection, 
  IntegrationsSection, 
  FAQSection,
  CTASection 
} from '@/components/sections'

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <ChannelsSection />
      <FeaturesSection />
      <IndustriesSection />
      <TestimonialsSection />
      <IntegrationsSection />
      <FAQSection />
      <CTASection 
        title="Ready to transform your communication?"
        description="Start your free trial today. No credit card required."
        primaryCta="Start Free Trial"
        secondaryCta="Contact Sales"
      />
    </>
  )
}

export default LandingPage
