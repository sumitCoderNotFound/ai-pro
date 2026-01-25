import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site.config'
import { Button, Logo, Container, Input } from '@/components/ui'
import { Linkedin, Twitter, Youtube, Send } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-white">
      {/* CTA Section */}
      <div className="border-b border-neutral-800">
        <Container className="py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-display-md md:text-display-lg text-white mb-4">
              Revolutionize your communication with AI
            </h2>
            <p className="text-neutral-400 text-lg mb-8">
              Start building smarter conversations today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Try For Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-neutral-600 text-white hover:bg-neutral-800">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Logo dark size="lg" />
            <p className="mt-4 text-neutral-400 max-w-xs">
              AI-powered communication platform for Education & Hospitality.
            </p>
            
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-primary-500"
                />
                <Button variant="primary" size="md" className="flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Solutions</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <p className="text-neutral-400 text-sm">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {siteConfig.navigation.footer.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-neutral-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
