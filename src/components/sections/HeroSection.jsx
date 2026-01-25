import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Badge } from '@/components/ui'
import { siteConfig, stats } from '@/config/site.config'
import { Play, ArrowRight, Star, Sparkles } from 'lucide-react'

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center bg-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-500/30 rounded-full blur-[100px]"
          style={{
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-[120px]"
          style={{
            transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - Slide down */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            <Badge className="bg-white/10 text-white border border-white/20 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              #1 AI Communication Platform for Education & Hospitality
            </Badge>
          </div>

          {/* Main Headline - Staggered reveal */}
          <h1 className="text-display-xl md:text-display-2xl text-white mb-6 leading-tight overflow-hidden">
            <span
              className="block transition-all duration-700 ease-out"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
                transitionDelay: '100ms',
              }}
            >
              Meet your AI
            </span>
            <span
              className="block bg-gradient-to-r from-accent-400 via-cyan-300 to-primary-300 bg-clip-text text-transparent transition-all duration-700 ease-out"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
                transitionDelay: '200ms',
              }}
            >
              communication center
            </span>
            <span
              className="block transition-all duration-700 ease-out"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
                transitionDelay: '300ms',
              }}
            >
              from the future.
            </span>
          </h1>

          {/* Subheadline - Fade up */}
          <p
            className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '400ms',
            }}
          >
            {siteConfig.description}
          </p>

          {/* CTA Buttons - Scale in */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
              transitionDelay: '500ms',
            }}
          >
            <Link to="/signup">
              <Button 
                variant="white" 
                size="lg" 
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="group"
              >
                <span className="group-hover:translate-x-[-4px] transition-transform">
                  Try For Free
                </span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats - Staggered fade in */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transition-all duration-700 ease-out"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${600 + index * 100}ms`,
                }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual - Slide up with parallax */}
        <div
          className="mt-16 md:mt-24 relative transition-all duration-1000 ease-out"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded 
              ? `translateY(0) perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)` 
              : 'translateY(60px)',
            transitionDelay: '700ms',
          }}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl scale-110" />
            
            {/* Main Dashboard Preview */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-2xl">
              <div className="bg-neutral-900 rounded-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800 border-b border-neutral-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-neutral-700 rounded-lg px-4 py-1 text-neutral-400 text-sm">
                      app.convoai.com
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="aspect-[16/9] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Grid */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px',
                    }} />
                  </div>
                  
                  <div className="text-center z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <p className="text-white/60">Click to watch interactive demo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div
              className="absolute -left-4 md:-left-16 top-1/4 bg-white rounded-xl shadow-2xl p-4 hidden lg:block"
              style={{
                transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Call Completed</p>
                  <p className="text-sm text-neutral-500">2m 34s • Student Inquiry</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 md:-right-16 top-1/3 bg-white rounded-xl shadow-2xl p-4 hidden lg:block"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Video Session</p>
                  <p className="text-sm text-neutral-500">Live • Virtual Tour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

export default HeroSection
