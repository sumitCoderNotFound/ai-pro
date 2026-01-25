import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * Hook to detect if element is in viewport with customizable threshold
 */
export const useInView = (threshold = 0.1) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setHasAnimated(true)
        } else {
          setIsInView(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView, hasAnimated }
}

/**
 * Hook to get scroll progress within a section (0 to 1)
 */
export const useScrollProgress = () => {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const newProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ))

      setProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { ref, progress }
}

/**
 * Hook for staggered children animations
 */
export const useStaggerAnimation = (itemCount, baseDelay = 100) => {
  const { ref, isInView, hasAnimated } = useInView(0.2)

  const getDelay = useCallback((index) => {
    return index * baseDelay
  }, [baseDelay])

  return { ref, isInView, hasAnimated, getDelay }
}

/**
 * Hook for parallax effect
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      const distance = elementCenter - viewportCenter

      setOffset(distance * speed * -1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

/**
 * Hook for mouse position tracking (for hover effects)
 */
export const useMousePosition = () => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return { ref, position }
}