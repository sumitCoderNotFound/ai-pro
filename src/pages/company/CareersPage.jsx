import { useState } from 'react'
import { Section, Card, Container, Button } from '@/components/ui'
import { MapPin, Clock, DollarSign, ChevronRight, Heart, Zap, Globe, Users } from 'lucide-react'

const CareersPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', 'Engineering', 'Product', 'Sales', 'Marketing', 'Operations']

  const jobs = [
    { title: 'Senior Backend Engineer', category: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$150k - $200k' },
    { title: 'ML Engineer', category: 'Engineering', location: 'San Francisco', type: 'Full-time', salary: '$180k - $250k' },
    { title: 'Frontend Engineer', category: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$140k - $180k' },
    { title: 'Product Manager', category: 'Product', location: 'New York', type: 'Full-time', salary: '$150k - $190k' },
    { title: 'Product Designer', category: 'Product', location: 'Remote', type: 'Full-time', salary: '$130k - $170k' },
    { title: 'Account Executive', category: 'Sales', location: 'San Francisco', type: 'Full-time', salary: '$100k - $150k + OTE' },
    { title: 'Customer Success Manager', category: 'Sales', location: 'Remote', type: 'Full-time', salary: '$90k - $120k' },
    { title: 'Content Marketing Manager', category: 'Marketing', location: 'Remote', type: 'Full-time', salary: '$100k - $140k' },
  ]

  const filteredJobs = activeCategory === 'all' ? jobs : jobs.filter(j => j.category === activeCategory)

  const perks = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health, dental, and vision coverage' },
    { icon: DollarSign, title: 'Competitive Pay', desc: 'Top-of-market salaries plus equity' },
    { icon: Globe, title: 'Remote First', desc: 'Work from anywhere in the world' },
    { icon: Zap, title: 'Learning Budget', desc: '$2,000/year for courses and conferences' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white mb-6">
              🚀 We're Hiring!
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join us in building the future of
              <span className="text-accent-300"> AI communication</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              We're looking for passionate people who want to transform how businesses communicate.
            </p>
            <Button variant="white" size="lg">
              View Open Roles
            </Button>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why ConvoAI?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => (
              <Card key={idx} padding="lg" className="text-center">
                <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <perk.icon className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">{perk.title}</h4>
                <p className="text-sm text-neutral-600">{perk.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Open Positions</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {cat === 'all' ? 'All Departments' : cat}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredJobs.map((job, idx) => (
              <Card key={idx} hover padding="md" className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">{job.title}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default CareersPage
