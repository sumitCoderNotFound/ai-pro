import { Section, Card } from '@/components/ui'
import { testimonials } from '@/config/site.config'
import { Quote, Play } from 'lucide-react'

const TestimonialsSection = () => {
  return (
    <Section id="testimonials" background="gray" padding="default">
      <Section.Header>
        <Section.Badge>Customer Stories</Section.Badge>
        <Section.Title>
          Proven Impact,
          <br />
          <span className="gradient-text">Real Conversations</span>
        </Section.Title>
        <Section.Description>
          Discover how businesses use ConvoAI to streamline operations, 
          enhance customer service, and scale effortlessly.
        </Section.Description>
      </Section.Header>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} hover padding="lg" className="relative">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6">
              <Quote className="w-8 h-8 text-primary-100" />
            </div>

            {/* Video Play Button */}
            <button className="w-full aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl mb-6 flex items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary-600 fill-primary-600 ml-1" />
              </div>
            </button>

            {/* Quote */}
            <p className="text-neutral-700 mb-6 leading-relaxed">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                <p className="text-sm text-neutral-500">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* See All Link */}
      <div className="text-center mt-12">
        <a
          href="#cases"
          className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
        >
          See All Case Studies
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </Section>
  )
}

export default TestimonialsSection
