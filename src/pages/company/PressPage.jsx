import { Section, Card, Container } from '@/components/ui'
import { Download, ExternalLink, Calendar } from 'lucide-react'

const PressPage = () => {
  const pressReleases = [
    { date: 'Jan 15, 2026', title: 'ConvoAI Raises $50M Series B to Expand AI Communication Platform', source: 'TechCrunch' },
    { date: 'Dec 10, 2025', title: 'ConvoAI Launches Video AI Agents for Face-to-Face Customer Interactions', source: 'VentureBeat' },
    { date: 'Nov 5, 2025', title: 'ConvoAI Partners with Major University System for Student Recruitment', source: 'EdTech Magazine' },
    { date: 'Sep 20, 2025', title: 'ConvoAI Named to Forbes AI 50 List', source: 'Forbes' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Press & Media</h1>
            <p className="text-xl text-white/80">
              Get the latest news and updates about ConvoAI.
            </p>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Press Releases</h2>
              <div className="space-y-4">
                {pressReleases.map((item, idx) => (
                  <Card key={idx} hover padding="md" className="cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="text-sm text-neutral-500 min-w-[100px]">{item.date}</div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-primary-600">{item.source}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 ml-auto flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Media Kit</h2>
              <Card padding="lg" className="bg-neutral-50">
                <p className="text-neutral-600 mb-4">
                  Download our brand assets, logos, and company information.
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Media Kit
                </button>
              </Card>
              <div className="mt-6">
                <h3 className="font-semibold text-neutral-900 mb-3">Media Contact</h3>
                <p className="text-neutral-600">
                  press@convoai.com
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default PressPage
