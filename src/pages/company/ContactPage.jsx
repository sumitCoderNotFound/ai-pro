import { useState } from 'react'
import { Section, Card, Container, Button, Input } from '@/components/ui'
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', message: '', type: 'sales'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you! We\'ll be in touch soon.')
  }

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'hello@convoai.com', link: 'mailto:hello@convoai.com' },
    { icon: Phone, title: 'Phone', value: '+1 (888) 123-4567', link: 'tel:+18881234567' },
    { icon: MapPin, title: 'Office', value: '123 AI Street, San Francisco, CA 94105', link: '#' },
    { icon: Clock, title: 'Hours', value: 'Mon-Fri, 9AM-6PM PST', link: '#' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-white/80">
              Have a question or want to learn more? We'd love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      <Section background="white" padding="large">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <Input
                    label="Company"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      I'm interested in
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Sales inquiry', 'Product demo', 'Support', 'Partnership', 'Other'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.type === type
                              ? 'bg-primary-600 text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" rightIcon={<Send className="w-5 h-5" />}>
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Contact Information</h2>
              {contactInfo.map((item, idx) => (
                <a key={idx} href={item.link} className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{item.title}</h4>
                    <p className="text-neutral-600">{item.value}</p>
                  </div>
                </a>
              ))}

              <Card padding="lg" className="bg-primary-50 border-primary-100">
                <MessageSquare className="w-8 h-8 text-primary-600 mb-3" />
                <h4 className="font-semibold text-neutral-900 mb-2">Live Chat</h4>
                <p className="text-sm text-neutral-600 mb-4">
                  Chat with our AI assistant or a human team member right now.
                </p>
                <Button variant="primary" size="sm">
                  Start Chat
                </Button>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ContactPage
