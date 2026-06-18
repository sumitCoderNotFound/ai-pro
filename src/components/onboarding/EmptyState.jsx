/**
 * ConvoHubAI – EmptyState component
 * Drop-in replacement for every empty page/list.
 * Usage:
 *   <EmptyState
 *     icon={<Bot />}
 *     emoji="🤖"
 *     title="No agents yet"
 *     description="..."
 *     primaryAction={{ label: 'Create Agent', onClick: () => {} }}
 *     secondaryAction={{ label: 'Learn more', href: '/docs' }}
 *     tips={['Tip 1', 'Tip 2']}
 *     variant="agents" | "calls" | "chat" | "knowledge" | "default"
 *   />
 */
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'

// Gradient background patterns per variant
const VARIANT_STYLES = {
  agents: {
    gradient: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-100',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    accent: 'text-indigo-600',
    btnBg: 'bg-neutral-900 hover:bg-neutral-800',
    dots: 'bg-indigo-200',
  },
  calls: {
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    accent: 'text-emerald-600',
    btnBg: 'bg-neutral-900 hover:bg-neutral-800',
    dots: 'bg-emerald-200',
  },
  chat: {
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-100',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    accent: 'text-sky-600',
    btnBg: 'bg-neutral-900 hover:bg-neutral-800',
    dots: 'bg-sky-200',
  },
  knowledge: {
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    accent: 'text-amber-600',
    btnBg: 'bg-neutral-900 hover:bg-neutral-800',
    dots: 'bg-amber-200',
  },
  default: {
    gradient: 'from-neutral-50 to-slate-50',
    border: 'border-neutral-100',
    iconBg: 'bg-gradient-to-br from-neutral-600 to-slate-700',
    accent: 'text-neutral-600',
    btnBg: 'bg-neutral-900 hover:bg-neutral-800',
    dots: 'bg-neutral-200',
  },
}

export default function EmptyState({
  emoji,
  icon: IconComponent,
  title,
  description,
  primaryAction,
  secondaryAction,
  tips = [],
  variant = 'default',
  compact = false,
}) {
  const s = VARIANT_STYLES[variant] || VARIANT_STYLES.default

  if (compact) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 px-6 text-center rounded-2xl border bg-gradient-to-br ${s.gradient} ${s.border}`}>
        {emoji && <span className="text-4xl mb-3">{emoji}</span>}
        <h3 className="text-base font-bold text-neutral-800 mb-1">{title}</h3>
        {description && <p className="text-sm text-neutral-500 mb-4">{description}</p>}
        {primaryAction && (
          primaryAction.onClick ? (
            <button
              onClick={primaryAction.onClick}
              className={`inline-flex items-center gap-2 px-4 py-2 ${s.btnBg} text-white text-sm font-semibold rounded-xl transition-colors`}
            >
              {primaryAction.label}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={primaryAction.href}
              className={`inline-flex items-center gap-2 px-4 py-2 ${s.btnBg} text-white text-sm font-semibold rounded-xl transition-colors`}
            >
              {primaryAction.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${s.gradient} ${s.border} p-10 sm:p-14`}>

      {/* Decorative dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${s.dots} opacity-40`}
            style={{
              left: `${(i % 8) * 14 + 4}%`,
              top: `${Math.floor(i / 8) * 40 + 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center max-w-lg mx-auto">

        {/* Icon */}
        <div className={`w-20 h-20 ${s.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
          {emoji ? (
            <span className="text-4xl">{emoji}</span>
          ) : IconComponent ? (
            <IconComponent className="w-10 h-10 text-white" />
          ) : null}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-black text-neutral-900 mb-3">{title}</h2>
        {description && (
          <p className="text-neutral-500 text-base leading-relaxed mb-8">{description}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {primaryAction && (
            primaryAction.onClick ? (
              <button
                onClick={primaryAction.onClick}
                className={`inline-flex items-center gap-2 px-6 py-3.5 ${s.btnBg} text-white font-semibold rounded-2xl transition-colors shadow-md`}
              >
                {primaryAction.icon && <primaryAction.icon className="w-5 h-5" />}
                {primaryAction.label}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to={primaryAction.href}
                className={`inline-flex items-center gap-2 px-6 py-3.5 ${s.btnBg} text-white font-semibold rounded-2xl transition-colors shadow-md`}
              >
                {primaryAction.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                to={secondaryAction.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {secondaryAction.label}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="text-left space-y-2 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80">
            <p className={`text-xs font-bold uppercase tracking-widest ${s.accent} mb-3`}>Quick tips</p>
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`text-xs font-black ${s.accent} mt-0.5 flex-shrink-0`}>{i + 1}.</span>
                <p className="text-sm text-neutral-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}