import { cn } from '@/utils/helpers'
import Container from './Container'

const Section = ({
  children,
  className,
  containerClassName,
  containerSize,
  background = 'white',
  padding = 'default',
  id,
  ...props
}) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-neutral-50',
    dark: 'bg-neutral-900 text-white',
    gradient: 'bg-hero',
    mesh: 'bg-white bg-mesh',
  }

  const paddings = {
    none: '',
    sm: 'py-12 md:py-16',
    default: 'py-16 md:py-24 lg:py-32',
    lg: 'py-24 md:py-32 lg:py-40',
  }

  return (
    <section
      id={id}
      className={cn(backgrounds[background], paddings[padding], className)}
      {...props}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </section>
  )
}

const SectionHeader = ({
  children,
  className,
  centered = true,
  ...props
}) => (
  <div
    className={cn(
      'mb-12 md:mb-16',
      centered && 'text-center max-w-3xl mx-auto',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const SectionBadge = ({ children, className, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold',
      'bg-primary-100 text-primary-700 mb-4',
      className
    )}
    {...props}
  >
    {children}
  </span>
)

const SectionTitle = ({
  children,
  className,
  as: Component = 'h2',
  ...props
}) => (
  <Component
    className={cn('text-display-md md:text-display-lg text-neutral-900', className)}
    {...props}
  >
    {children}
  </Component>
)

const SectionDescription = ({ children, className, ...props }) => (
  <p
    className={cn('mt-4 text-body-lg text-neutral-600 max-w-2xl mx-auto', className)}
    {...props}
  >
    {children}
  </p>
)

Section.Header = SectionHeader
Section.Badge = SectionBadge
Section.Title = SectionTitle
Section.Description = SectionDescription

export default Section
