import PageHero from '@/components/sections/PageHero'
import FeatureSection from '@/components/sections/FeatureSection'
import CTASection from '@/components/sections/CTASection'
import { Section, Card, Container } from '@/components/ui'
import { Database, Upload, RefreshCw, Search, FileText, Globe, Lock, Zap } from 'lucide-react'

const KnowledgeBasePage = () => {
  const features = [
    {
      icon: Upload,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      title: 'Easy Import',
      description: 'Upload documents, connect websites, or sync from your existing knowledge base.',
      points: ['PDF, Word, HTML support', 'Website crawling', 'API sync']
    },
    {
      icon: RefreshCw,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Auto-Sync',
      description: 'Keep knowledge up-to-date automatically as your content changes.',
      points: ['Scheduled updates', 'Change detection', 'Version history']
    },
    {
      icon: Search,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Semantic Search',
      description: 'Find relevant information even when questions are phrased differently.',
      points: ['Intent matching', 'Fuzzy search', 'Context awareness']
    },
    {
      icon: Lock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Access Control',
      description: 'Control which agents can access which knowledge sources.',
      points: ['Role-based access', 'Content filtering', 'Audit logs']
    },
  ]

  const sources = [
    { name: 'Documents', icon: FileText, types: 'PDF, Word, Text' },
    { name: 'Websites', icon: Globe, types: 'Crawl & sync' },
    { name: 'APIs', icon: Zap, types: 'REST, GraphQL' },
    { name: 'Databases', icon: Database, types: 'SQL, NoSQL' },
  ]

  return (
    <>
      <PageHero
        badge="Knowledge Base"
        badgeColor="primary"
        title="RAG-powered"
        titleHighlight="responses."
        description="Give your AI agents access to your company knowledge. Our RAG technology ensures accurate, up-to-date answers grounded in your data."
        primaryCta="Connect Your Data"
        secondaryCta="Learn More"
        gradient="from-indigo-600 via-purple-600 to-violet-700"
        features={['Automatic sync', 'Semantic search', 'Source citations']}
        stats={[
          { value: '99%', label: 'Accuracy rate' },
          { value: '50ms', label: 'Query time' },
          { value: '∞', label: 'Document limit' },
        ]}
      />

      <Section background="white" padding="large">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Connect <span className="text-indigo-600">any source</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {sources.map((source, idx) => (
              <Card key={idx} hover padding="lg" className="text-center">
                <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <source.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">{source.name}</h4>
                <p className="text-sm text-neutral-500">{source.types}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <FeatureSection
        badge="Features"
        title="Knowledge that"
        titleHighlight="stays current"
        description="Automatic syncing ensures your AI always has the latest information."
        features={features}
        layout="grid"
        columns={2}
        background="gray"
      />

      <CTASection
        title="Ready to empower your AI with knowledge?"
        description="Connect your first data source in minutes."
        primaryCta="Get Started"
        variant="gradient"
      />
    </>
  )
}

export default KnowledgeBasePage
