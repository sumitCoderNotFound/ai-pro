import { Section, Card, Container } from '@/components/ui'
import { Calendar, User, ArrowRight } from 'lucide-react'

const BlogPage = () => {
  const posts = [
    { title: 'The Future of AI in Customer Service', excerpt: 'How conversational AI is transforming customer interactions...', date: 'Jan 20, 2026', author: 'Sarah Chen', category: 'Industry', image: '🤖' },
    { title: 'Building Your First Voice Agent: A Complete Guide', excerpt: 'Step-by-step tutorial for creating voice AI agents...', date: 'Jan 15, 2026', author: 'Mike Park', category: 'Tutorial', image: '🎙️' },
    { title: 'Case Study: How State University Increased Enrollment by 40%', excerpt: 'Learn how one university transformed student recruitment...', date: 'Jan 10, 2026', author: 'Emily Zhang', category: 'Case Study', image: '🎓' },
    { title: 'Video AI Agents: The Next Frontier', excerpt: 'Introducing face-to-face AI interactions...', date: 'Jan 5, 2026', author: 'Alex Kim', category: 'Product', image: '📹' },
    { title: '5 Best Practices for Conversational AI Design', excerpt: 'Design principles for natural AI conversations...', date: 'Dec 28, 2025', author: 'Lisa Wang', category: 'Design', image: '✨' },
    { title: 'Understanding RAG: How Knowledge Bases Power AI Agents', excerpt: 'Deep dive into retrieval-augmented generation...', date: 'Dec 20, 2025', author: 'David Lee', category: 'Technical', image: '📚' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-white/80">Insights, tutorials, and updates from the ConvoAI team</p>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <Card key={idx} hover className="overflow-hidden cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-5xl">
                  {post.image}
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-neutral-900 mt-2 mb-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author}
                    </span>
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

export default BlogPage
