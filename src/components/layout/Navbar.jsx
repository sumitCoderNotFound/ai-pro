import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { 
  ChevronDown, 
  Phone, 
  Video, 
  MessageSquare, 
  Smartphone,
  Bot,
  Workflow,
  Database,
  Zap,
  Users,
  Building2,
  GraduationCap,
  Hotel,
  FileText,
  BookOpen,
  Headphones,
  Play,
  ArrowRight,
  Globe,
  Shield,
  BarChart3,
  Code,
  Puzzle,
  Menu,
  X,
  Heart
} from 'lucide-react'

// ============================================
// MENU DATA
// ============================================
const menuData = {
  product: {
    title: 'Product',
    sections: [
      {
        title: 'CHANNELS',
        items: [
          { 
            name: 'Voice AI', 
            description: 'Natural phone conversations', 
            icon: Phone, 
            href: '/product/voice', 
            color: 'text-blue-600', 
            bg: 'bg-blue-100' 
          },
          { 
            name: 'Video AI', 
            description: 'Face-to-face AI interactions', 
            icon: Video, 
            href: '/product/video', 
            color: 'text-cyan-600', 
            bg: 'bg-cyan-100',
            badge: 'New'
          },
          { 
            name: 'Chat AI', 
            description: 'Website & app messaging', 
            icon: MessageSquare, 
            href: '/product/chat', 
            color: 'text-green-600', 
            bg: 'bg-green-100' 
          },
          { 
            name: 'SMS AI', 
            description: 'Text message automation', 
            icon: Smartphone, 
            href: '/product/sms', 
            color: 'text-amber-600', 
            bg: 'bg-amber-100' 
          },
        ]
      },
      {
        title: 'PLATFORM',
        items: [
          { 
            name: 'Agent Builder', 
            description: 'Drag-and-drop creation', 
            icon: Bot, 
            href: '/product/builder', 
            color: 'text-purple-600', 
            bg: 'bg-purple-100' 
          },
          { 
            name: 'Workflow Engine', 
            description: 'Visual conversation flows', 
            icon: Workflow, 
            href: '/product/workflow', 
            color: 'text-pink-600', 
            bg: 'bg-pink-100' 
          },
          { 
            name: 'Knowledge Base', 
            description: 'RAG-powered responses', 
            icon: Database, 
            href: '/product/knowledge', 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-100' 
          },
          { 
            name: 'Integrations', 
            description: '100+ native integrations', 
            icon: Puzzle, 
            href: '/product/integrations', 
            color: 'text-orange-600', 
            bg: 'bg-orange-100' 
          },
        ]
      },
    ],
    featured: {
      title: "What's New",
      description: 'Video AI Agents are here! Build trust with face-to-face AI interactions.',
      cta: 'Learn more',
      href: '/product/video',
      icon: '🎥',
      gradient: 'from-cyan-500 to-blue-600'
    }
  },
  solutions: {
    title: 'Solutions',
    sections: [
      {
        title: 'BY INDUSTRY',
        items: [
          { 
            name: 'Education', 
            description: 'Student recruitment & support', 
            icon: GraduationCap, 
            href: '/solutions/education', 
            color: 'text-blue-600', 
            bg: 'bg-blue-100' 
          },
          { 
            name: 'Hospitality', 
            description: 'Guest services & bookings', 
            icon: Hotel, 
            href: '/solutions/hospitality', 
            color: 'text-amber-600', 
            bg: 'bg-amber-100' 
          },
          { 
            name: 'Healthcare', 
            description: 'Patient communication', 
            icon: Heart, 
            href: '/solutions/healthcare', 
            color: 'text-red-600', 
            bg: 'bg-red-100' 
          },
          { 
            name: 'Enterprise', 
            description: 'Custom solutions at scale', 
            icon: Building2, 
            href: '/solutions/enterprise', 
            color: 'text-purple-600', 
            bg: 'bg-purple-100' 
          },
        ]
      },
      {
        title: 'BY USE CASE',
        items: [
          { 
            name: 'Lead Qualification', 
            description: 'Automate inbound leads', 
            icon: Users, 
            href: '/solutions/leads', 
            color: 'text-green-600', 
            bg: 'bg-green-100' 
          },
          { 
            name: 'Customer Support', 
            description: '24/7 AI assistance', 
            icon: Headphones, 
            href: '/solutions/support', 
            color: 'text-cyan-600', 
            bg: 'bg-cyan-100' 
          },
          { 
            name: 'Appointment Booking', 
            description: 'Smart scheduling', 
            icon: Zap, 
            href: '/solutions/booking', 
            color: 'text-yellow-600', 
            bg: 'bg-yellow-100' 
          },
          { 
            name: 'Surveys & Feedback', 
            description: 'Voice-driven insights', 
            icon: BarChart3, 
            href: '/solutions/surveys', 
            color: 'text-pink-600', 
            bg: 'bg-pink-100' 
          },
        ]
      },
    ],
    featured: {
      title: 'Customer Stories',
      description: 'See how universities increased enrollment by 40% with ConvoAI.',
      cta: 'Read case study',
      href: '/case-studies',
      icon: '📈',
      gradient: 'from-green-500 to-emerald-600'
    }
  },
  resources: {
    title: 'Resources',
    sections: [
      {
        title: 'LEARN',
        items: [
          { 
            name: 'Documentation', 
            description: 'Guides and tutorials', 
            icon: FileText, 
            href: '/docs', 
            color: 'text-blue-600', 
            bg: 'bg-blue-100' 
          },
          { 
            name: 'Blog', 
            description: 'News and insights', 
            icon: BookOpen, 
            href: '/blog', 
            color: 'text-green-600', 
            bg: 'bg-green-100' 
          },
          { 
            name: 'Webinars', 
            description: 'Live and recorded sessions', 
            icon: Play, 
            href: '/webinars', 
            color: 'text-red-600', 
            bg: 'bg-red-100' 
          },
          { 
            name: 'API Reference', 
            description: 'Developer documentation', 
            icon: Code, 
            href: '/api', 
            color: 'text-purple-600', 
            bg: 'bg-purple-100' 
          },
        ]
      },
      {
        title: 'SUPPORT',
        items: [
          { 
            name: 'Help Center', 
            description: 'FAQs and tutorials', 
            icon: Headphones, 
            href: '/help', 
            color: 'text-amber-600', 
            bg: 'bg-amber-100' 
          },
          { 
            name: 'Community', 
            description: 'Join the discussion', 
            icon: Users, 
            href: '/community', 
            color: 'text-cyan-600', 
            bg: 'bg-cyan-100' 
          },
          { 
            name: 'System Status', 
            description: '99.9% uptime', 
            icon: Globe, 
            href: '/status', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-100' 
          },
          { 
            name: 'Security', 
            description: 'Trust & compliance', 
            icon: Shield, 
            href: '/security', 
            color: 'text-slate-600', 
            bg: 'bg-slate-100' 
          },
        ]
      },
    ],
    featured: {
      title: 'Getting Started',
      description: 'Build your first AI agent in under 5 minutes with our quickstart guide.',
      cta: 'Start tutorial',
      href: '/docs/quickstart',
      icon: '🚀',
      gradient: 'from-purple-500 to-indigo-600'
    }
  },
  company: {
    title: 'Company',
    sections: [
      {
        title: 'ABOUT',
        items: [
          { 
            name: 'About Us', 
            description: 'Our mission and story', 
            icon: Building2, 
            href: '/about', 
            color: 'text-blue-600', 
            bg: 'bg-blue-100' 
          },
          { 
            name: 'Careers', 
            description: 'Join our team', 
            icon: Users, 
            href: '/careers', 
            color: 'text-green-600', 
            bg: 'bg-green-100',
            badge: 'Hiring'
          },
          { 
            name: 'Press', 
            description: 'News and media', 
            icon: FileText, 
            href: '/press', 
            color: 'text-purple-600', 
            bg: 'bg-purple-100' 
          },
          { 
            name: 'Contact', 
            description: 'Get in touch', 
            icon: MessageSquare, 
            href: '/contact', 
            color: 'text-amber-600', 
            bg: 'bg-amber-100' 
          },
        ]
      },
    ],
    featured: {
      title: "We're Hiring!",
      description: 'Join us in building the future of AI communication.',
      cta: 'View open roles',
      href: '/careers',
      icon: '💼',
      gradient: 'from-amber-500 to-orange-600'
    }
  },
}

// ============================================
// MEGA MENU COMPONENT
// ============================================
const MegaMenu = ({ menu, isOpen, onClose }) => {
  const data = menuData[menu]
  if (!data) return null

  const isSingleColumn = data.sections.length === 1

  return (
    <div 
      className={cn(
        "absolute top-full left-0 pt-3 transition-all duration-200 ease-out",
        isOpen 
          ? "opacity-100 visible translate-y-0" 
          : "opacity-0 invisible -translate-y-2 pointer-events-none"
      )}
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-neutral-900/10 border border-neutral-100 overflow-hidden">
        <div className="flex">
          {/* Menu Sections */}
          <div className={cn(
            "p-6",
            isSingleColumn ? "min-w-[280px]" : "grid grid-cols-2 gap-x-8 min-w-[520px]"
          )}>
            {data.sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="text-[11px] font-semibold text-neutral-400 tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                        item.bg
                      )}>
                        <item.icon className={cn("w-[18px] h-[18px]", item.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-accent-500 text-white rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-neutral-500 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Section */}
          {data.featured && (
            <div className={cn(
              "w-52 p-5 flex flex-col bg-gradient-to-br",
              data.featured.gradient
            )}>
              <div className="text-3xl mb-3">{data.featured.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1.5">
                {data.featured.title}
              </h4>
              <p className="text-white/80 text-xs flex-1 leading-relaxed">
                {data.featured.description}
              </p>
              <Link
                to={data.featured.href}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white mt-3 group"
              >
                {data.featured.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// NAV ITEM COMPONENT
// ============================================
const NavItem = ({ menu, label, activeMenu, setActiveMenu, timeoutRef, isTransparent }) => {
  const isOpen = activeMenu === menu
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(menu)
  }
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 100)
  }
  
  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isOpen 
            ? "text-primary-600 bg-white shadow-sm" 
            : isTransparent
              ? "text-white/90 hover:text-white hover:bg-white/10"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
        )}
      >
        {label}
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <MegaMenu menu={menu} isOpen={isOpen} onClose={() => setActiveMenu(null)} />
    </div>
  )
}

// ============================================
// MOBILE MENU ITEM
// ============================================
const MobileMenuItem = ({ data, onClose }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-neutral-900 font-medium"
      >
        {data.title}
        <ChevronDown className={cn(
          "w-5 h-5 text-neutral-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"
      )}>
        <div className="space-y-1">
          {data.sections.flatMap(section => section.items).map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", item.bg)}>
                <item.icon className={cn("w-4 h-4", item.color)} />
              </div>
              <div>
                <span className="text-neutral-700 font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-accent-500 text-white rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN NAVBAR COMPONENT
// ============================================
const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [location])

  const isHomePage = location.pathname === '/'
  const isTransparent = !scrolled && isHomePage

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-neutral-900/5 border-b border-neutral-200/50" 
            : isHomePage 
              ? "bg-transparent" 
              : "bg-white border-b border-neutral-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 relative z-10">
              <Logo variant={isTransparent ? 'white' : 'default'} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem 
                menu="product" 
                label="Product" 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
                timeoutRef={timeoutRef} 
                isTransparent={isTransparent} 
              />
              <NavItem 
                menu="solutions" 
                label="Solutions" 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
                timeoutRef={timeoutRef} 
                isTransparent={isTransparent} 
              />
              <Link
                to="/pricing"
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                Pricing
              </Link>
              <NavItem 
                menu="resources" 
                label="Resources" 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
                timeoutRef={timeoutRef} 
                isTransparent={isTransparent} 
              />
              <NavItem 
                menu="company" 
                label="Company" 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
                timeoutRef={timeoutRef} 
                isTransparent={isTransparent} 
              />
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                Login
              </Link>
              <Link
                to="/contact"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200",
                  isTransparent
                    ? "text-white border-white/30 hover:bg-white/10"
                    : "text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                )}
              >
                Contact Sales
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Try For Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-0">
              {Object.entries(menuData).map(([key, data]) => (
                <MobileMenuItem key={key} data={data} onClose={() => setMobileOpen(false)} />
              ))}
              
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block py-4 text-neutral-900 font-medium border-b border-neutral-100"
              >
                Pricing
              </Link>
            </div>

            <div className="mt-8 space-y-3">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" fullWidth>Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" fullWidth>
                  Try For Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar