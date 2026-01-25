import { Link } from 'react-router-dom'
import { Button, Container } from '@/components/ui'
import { ArrowRight, Play } from 'lucide-react'
import { cn } from '@/utils/helpers'

const PageHero = ({
  badge,
  badgeColor = 'primary',
  title,
  titleHighlight,
  description,
  primaryCta,
  primaryCtaLink = '/signup',
  secondaryCta,
  secondaryCtaLink,
  image,
  stats,
  features,
  gradient = 'from-primary-600 via-primary-700 to-primary-900',
  children
}) => {
  const badgeColors = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    cyan: 'bg-cyan-100 text-cyan-700',
  }

  return (
    <section className={cn("relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br", gradient)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {badge && (
              <span className={cn(
                "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-6",
                badgeColors[badgeColor]
              )}>
                {badge}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="text-accent-400">{titleHighlight}</span>
                </>
              )}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {primaryCta && (
                <Link to={primaryCtaLink}>
                  <Button variant="white" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    {primaryCta}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCtaLink || '#demo'}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    leftIcon={<Play className="w-5 h-5" />}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {secondaryCta}
                  </Button>
                </Link>
              )}
            </div>

            {/* Features List */}
            {features && (
              <div className="flex flex-wrap gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80">
                    <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/20">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image/Visual */}
          <div className="relative">
            {image ? (
              <img src={image} alt="" className="rounded-2xl shadow-2xl" />
            ) : children ? (
              children
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white/60">Interactive Demo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default PageHero
