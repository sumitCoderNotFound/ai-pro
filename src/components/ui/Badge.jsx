import { cn } from '@/utils/helpers'

const variants = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-neutral-100 text-neutral-700',
  accent: 'bg-accent-100 text-accent-700',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  outline: 'bg-transparent border border-neutral-300 text-neutral-600',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  dot,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-success-500',
          variant === 'warning' && 'bg-warning-500',
          variant === 'error' && 'bg-error-500',
          variant === 'primary' && 'bg-primary-500',
          variant === 'accent' && 'bg-accent-500',
          variant === 'secondary' && 'bg-neutral-500',
        )} />
      )}
      {children}
    </span>
  )
}

export default Badge
