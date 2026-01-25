import { Section, Card } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { Check } from 'lucide-react'

const FeatureSection = ({
  badge,
  title,
  titleHighlight,
  description,
  features,
  layout = 'grid', // 'grid' | 'list' | 'alternating'
  columns = 3,
  background = 'white'
}) => {
  return (
    <Section background={background} padding="large">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        {badge && (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-100 text-primary-700 mb-4">
            {badge}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          {title}
          {titleHighlight && (
            <span className="text-primary-600"> {titleHighlight}</span>
          )}
        </h2>
        {description && (
          <p className="text-lg text-neutral-600">{description}</p>
        )}
      </div>

      {/* Features Grid */}
      {layout === 'grid' && (
        <div className={cn(
          "grid gap-8",
          columns === 2 && "md:grid-cols-2",
          columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "md:grid-cols-2 lg:grid-cols-4"
        )}>
          {features.map((feature, idx) => (
            <Card key={idx} hover padding="lg" className="h-full">
              {feature.icon && (
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  feature.iconBg || "bg-primary-100"
                )}>
                  <feature.icon className={cn("w-6 h-6", feature.iconColor || "text-primary-600")} />
                </div>
              )}
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 mb-4">
                {feature.description}
              </p>
              {feature.points && (
                <ul className="space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Alternating Layout */}
      {layout === 'alternating' && (
        <div className="space-y-24">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={cn(
                "grid lg:grid-cols-2 gap-12 items-center",
                idx % 2 === 1 && "lg:flex-row-reverse"
              )}
            >
              <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                {feature.icon && (
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                    feature.iconBg || "bg-primary-100"
                  )}>
                    <feature.icon className={cn("w-7 h-7", feature.iconColor || "text-primary-600")} />
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-neutral-600 mb-6">
                  {feature.description}
                </p>
                {feature.points && (
                  <ul className="space-y-3">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-neutral-700">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={cn(
                "bg-neutral-100 rounded-2xl aspect-video flex items-center justify-center",
                idx % 2 === 1 ? "lg:order-1" : ""
              )}>
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} className="rounded-2xl" />
                ) : (
                  <div className="text-6xl">{feature.emoji || '🎯'}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

export default FeatureSection
