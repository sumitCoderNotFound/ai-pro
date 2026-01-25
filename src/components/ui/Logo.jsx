import { Link } from 'react-router-dom'
import { cn } from '@/utils/helpers'

const Logo = ({ variant = 'default', size = 'md', className }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const isWhite = variant === 'white'

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center",
        isWhite 
          ? "bg-white/20 backdrop-blur-sm" 
          : "bg-gradient-to-br from-primary-500 to-accent-500"
      )}>
        <svg
          viewBox="0 0 24 24"
          className={cn("w-5 h-5", isWhite ? "text-white" : "text-white")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      </div>
      
      {/* Logo Text */}
      <span className={cn(
        "font-bold tracking-tight",
        sizes[size],
        isWhite ? "text-white" : "text-neutral-900"
      )}>
        Convo<span className={isWhite ? "text-accent-300" : "text-primary-600"}>AI</span>
      </span>
    </div>
  )
}

export default Logo
