import { Section, Container, Card } from '@/components/ui'
import { Play, Calendar, Clock } from 'lucide-react'

const WebinarsPage = () => {
  const webinars = [
    { title: 'Getting Started with ConvoAI', date: 'Jan 30, 2026', time: '2:00 PM PST', status: 'upcoming' },
    { title: 'Advanced Voice Agent Techniques', date: 'Feb 6, 2026', time: '11:00 AM PST', status: 'upcoming' },
    { title: 'Building Video AI Experiences', date: 'Jan 23, 2026', time: '2:00 PM PST', status: 'recorded' },
    { title: 'AI for Education: Best Practices', date: 'Jan 16, 2026', time: '11:00 AM PST', status: 'recorded' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-red-500 via-rose-600 to-pink-700 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Webinars</h1>
            <p className="text-white/80">Live and recorded sessions from our team</p>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {webinars.map((webinar, idx) => (
              <Card key={idx} hover padding="lg" className="cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Play className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                      webinar.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {webinar.status}
                    </span>
                    <h3 className="font-semibold text-neutral-900 mt-2">{webinar.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {webinar.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {webinar.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default WebinarsPage
