import { useEffect, useRef, useState } from 'react'

const companyLogos = [
  { name: 'Lenovo', short: 'LENOVO' },
  { name: 'Microsoft', short: 'MICROSOFT' },
  { name: 'DoorDash', short: 'DOORDASH' },
  { name: 'Caribou', short: 'CARIBOU' },
  { name: 'Capsule', short: 'CAPSULE' },
  { name: 'Stripe', short: 'STRIPE' },
  { name: 'Asbury', short: 'ASBURY' },
  { name: 'Slack', short: 'SLACK' },
]

const LogoMarqueeSection = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const doubledLogos = [...companyLogos, ...companyLogos]

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      {/* Logo Marquee - Top Row (moves right on scroll) */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          className="flex gap-12 items-center whitespace-nowrap"
          style={{
            transform: `translateX(${-scrollProgress * 300}px)`,
          }}
        >
          {doubledLogos.map((logo, index) => (
            <span
              key={index}
              className="text-xl font-bold text-neutral-200 hover:text-neutral-800 transition-colors duration-300 cursor-pointer tracking-wider"
            >
              {logo.short}
            </span>
          ))}
        </div>
      </div>

      {/* Built to Scale - Animated Center */}
      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="flex items-center justify-center gap-6 md:gap-12 lg:gap-20">
          {/* Left Text */}
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-neutral-900"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : -60}px)`,
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Built
          </h2>

          {/* Animated Dots Circle */}
          <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44">
            {[...Array(8)].map((_, index) => {
              const baseAngle = index * 45 * (Math.PI / 180)
              const rotationOffset = scrollProgress * Math.PI * 2
              const angle = baseAngle + rotationOffset
              const radius = 35 + Math.sin(scrollProgress * Math.PI * 2 + index) * 8

              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={index}
                  className="absolute w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-neutral-900 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${0.8 + scrollProgress * 0.4})`,
                    opacity: 0.7 + index * 0.04,
                  }}
                />
              )
            })}
          </div>

          {/* Right Text */}
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-neutral-900"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : 60}px)`,
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
          >
            to Scale.
          </h2>
        </div>
      </div>

      {/* Logo Marquee - Bottom Row (moves left on scroll) */}
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          className="flex gap-12 items-center whitespace-nowrap justify-end"
          style={{
            transform: `translateX(${scrollProgress * 300}px)`,
          }}
        >
          {doubledLogos.map((logo, index) => (
            <span
              key={index}
              className="text-xl font-bold text-neutral-200 hover:text-neutral-800 transition-colors duration-300 cursor-pointer tracking-wider"
            >
              {logo.short}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoMarqueeSection