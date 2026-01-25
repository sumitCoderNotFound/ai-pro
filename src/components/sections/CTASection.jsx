import { Link } from 'react-router-dom'
import { Button, Container } from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/helpers'

const CTASection = ({
  title = "Ready to get started?",
  description = "Start your free trial today. No credit card required.",
  primaryCta = "Start Free Trial",
  primaryCtaLink = "/signup",
  secondaryCta = "Contact Sales",
  secondaryCtaLink = "/contact",
  variant = 'gradient' // 'gradient' | 'dark' | 'light'
}) => {
  const variants = {
    gradient: "bg-gradient-to-r from-primary-600 to-accent-600",
    dark: "bg-neutral-900",
    light: "bg-neutral-100"
  }

  const isLight = variant === 'light'

  return (
    <section className={cn("py-20", variants[variant])}>
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isLight ? "text-neutral-900" : "text-white"
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-lg mb-8",
            isLight ? "text-neutral-600" : "text-white/80"
          )}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={primaryCtaLink}>
              <Button 
                variant={isLight ? "primary" : "white"} 
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {primaryCta}
              </Button>
            </Link>
            {secondaryCta && (
              <Link to={secondaryCtaLink}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className={isLight ? "" : "border-white/30 text-white hover:bg-white/10"}
                >
                  {secondaryCta}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CTASection
