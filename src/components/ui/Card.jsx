import { cn } from '@/utils/helpers'

const Card = ({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-neutral-200 shadow-soft',
        hover && 'transition-all duration-300 hover:shadow-soft-lg hover:border-neutral-300 hover:-translate-y-1',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className, as: Component = 'h3', ...props }) => (
  <Component
    className={cn('text-xl font-semibold text-neutral-900', className)}
    {...props}
  >
    {children}
  </Component>
)

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-neutral-600 mt-1', className)} {...props}>
    {children}
  </p>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('mt-6 pt-6 border-t border-neutral-200', className)} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
