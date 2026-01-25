import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { GraduationCap, Users, Calendar, FileText, Globe, Phone, Video, MessageSquare } from 'lucide-react'

const EducationPage = () => {
  const useCases = [
    {
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Student Recruitment',
      description: 'Answer inquiries 24/7, qualify prospects, and schedule campus visits automatically.',
      points: ['Answer admission questions', 'Qualify prospective students', 'Schedule campus tours']
    },
    {
      icon: Calendar,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Enrollment Support',
      description: 'Guide students through the application and enrollment process step by step.',
      points: ['Application status updates', 'Document submission help', 'Deadline reminders']
    },
    {
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Academic Advising',
      description: 'Provide 24/7 guidance on course selection, requirements, and academic planning.',
      points: ['Course recommendations', 'Degree requirements', 'Registration assistance']
    },
    {
      icon: Globe,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'International Students',
      description: 'Support international students with multilingual assistance and visa guidance.',
      points: ['50+ languages', 'Visa information', 'Cultural orientation']
    },
  ]

  const stats = [
    { value: '40%', label: 'Increase in enrollment inquiries handled' },
    { value: '24/7', label: 'Availability for prospective students' },
    { value: '80%', label: 'Reduction in response time' },
    { value: '3x', label: 'More campus tour bookings' },
  ]

  const channels = [
    { icon: Phone, name: 'Voice', desc: 'Phone inquiries' },
    { icon: Video, name: 'Video', desc: 'Virtual tours' },
    { icon: MessageSquare, name: 'Chat', desc: 'Website support' },
    { icon: Globe, name: 'SMS', desc: 'Text updates' },
  ]

  return (
    <>
      <PageHero
        badge="Education"
        badgeColor="primary"
        title="AI for student"
        titleHighlight="recruitment & support."
        description="Help students find their path with AI agents that answer questions, schedule tours, and guide them through every step of their education journey."
        primaryCta="See Demo"
        secondaryCta="Talk to Sales"
        gradient="from-blue-600 via-indigo-700 to-purple-800"
        features={['24/7 availability', '50+ languages', 'Seamless handoff']}
        stats={[
          { value: '500+', label: 'Institutions' },
          { value: '5M+', label: 'Students helped' },
          { value: '40%', label: 'More inquiries' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 mb-4">
              Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Results that <span className="text-blue-600">matter</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} padding="lg" className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <p className="text-neutral-600 text-sm">{stat.label}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Use Cases"
        title="Built for every"
        titleHighlight="education need"
        description="From recruitment to graduation, AI agents that understand the student journey."
        features={useCases}
        layout="grid"
        columns={2}
        background="gray"
      />

      <Section background="white" padding="large">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 mb-4">
                Omnichannel
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Meet students where <span className="text-blue-600">they are</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Deploy AI agents across every channel — phone, video, chat, and SMS. One unified experience for prospective and current students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {channels.map((channel, idx) => (
                <Card key={idx} padding="lg" className="text-center">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <channel.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-neutral-900">{channel.name}</h4>
                  <p className="text-sm text-neutral-500">{channel.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              "ConvoAI helped us increase enrollment inquiries by 40% while reducing our response time from hours to seconds."
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              <div className="text-left">
                <p className="text-white font-semibold">Dr. Sarah Johnson</p>
                <p className="text-white/60 text-sm">Director of Admissions, State University</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to transform student engagement?"
        description="Join 500+ institutions using ConvoAI for education."
        primaryCta="Request Demo"
        secondaryCta="Download Case Study"
        variant="gradient"
      />
    </>
  )
}

export default EducationPage
