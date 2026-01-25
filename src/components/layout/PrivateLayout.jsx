import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/ui'
import { cn } from '@/utils/helpers'
import {
  Bot,
  Database,
  Phone,
  MessageSquare,
  BarChart3,
  Shield,
  Bell,
  CreditCard,
  Settings,
  Search,
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Menu,
  HelpCircle,
  History,
  PhoneCall,
  MessagesSquare,
  Plus,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react'

const PrivateLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [freeTrialExpanded, setFreeTrialExpanded] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Mock data for free trial - replace with real data
  const trialData = {
    remaining: 9.88,
    concurrencyUsed: 0,
    concurrencyLimit: 20
  }

  const navigation = {
    build: {
      label: 'BUILD',
      items: [
        { name: 'Agents', href: '/dashboard/agents', icon: Bot },
        { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: Database },
      ]
    },
    deploy: {
      label: 'DEPLOY',
      items: [
        { name: 'Phone Numbers', href: '/dashboard/phone-numbers', icon: Phone },
        { name: 'Batch Call', href: '/dashboard/batch-calls', icon: PhoneCall },
      ]
    },
    monitor: {
      label: 'MONITOR',
      items: [
        { name: 'Call History', href: '/dashboard/calls', icon: History },
        { name: 'Chat History', href: '/dashboard/chats', icon: MessagesSquare },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'AI Quality Assurance', href: '/dashboard/quality', icon: Shield },
        { name: 'Alerting', href: '/dashboard/alerts', icon: Bell, badge: 'New' },
      ]
    },
    system: {
      label: 'SYSTEM',
      items: [
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActiveRoute = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    
    // Find matching nav item
    for (const section of Object.values(navigation)) {
      for (const item of section.items) {
        if (isActiveRoute(item.href)) {
          return item.name
        }
      }
    }
    return 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white border-r border-neutral-200 flex flex-col transition-all duration-300",
        sidebarCollapsed ? "w-[70px]" : "w-[260px]"
      )}>
        {/* Logo - Clickable to Dashboard */}
        <Link 
          to="/dashboard" 
          className="h-16 px-4 flex items-center gap-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
        >
          {!sidebarCollapsed ? (
            <Logo />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          )}
        </Link>

        {/* Workspace Selector */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 border-b border-neutral-100">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.company || user?.name || 'My Workspace'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {Object.entries(navigation).map(([key, section]) => (
            <div key={key} className="mb-6">
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isActiveRoute(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                        sidebarCollapsed && "justify-center px-0"
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-primary-600" : "text-neutral-400"
                      )} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Free Trial Section */}
        <div className="border-t border-neutral-100">
          {!sidebarCollapsed ? (
            <div className="p-3">
              {/* Collapsible Header */}
              <button 
                onClick={() => setFreeTrialExpanded(!freeTrialExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">Free Trial</span>
                </div>
                {freeTrialExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              {/* Expanded Content */}
              {freeTrialExpanded && (
                <div className="mt-2 px-3 space-y-3">
                  {/* Remaining Balance */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Remaining:</span>
                    <span className="text-sm font-semibold text-primary-600">${trialData.remaining.toFixed(2)}</span>
                  </div>

                  {/* Concurrency Used */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-neutral-500">Concurrency Used:</span>
                      <button className="text-neutral-400 hover:text-neutral-600">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {trialData.concurrencyUsed}/{trialData.concurrencyLimit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-300"
                      style={{ width: `${(trialData.concurrencyUsed / trialData.concurrencyLimit) * 100}%` }}
                    />
                  </div>

                  {/* Add Payment Button */}
                  <Link
                    to="/dashboard/billing"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Add Payment
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <button 
                className="w-full flex items-center justify-center p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Free Trial"
              >
                <Sparkles className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="border-t border-neutral-100 p-3">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl transition-colors",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user?.email || user?.name || 'User'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </>
              )}
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className={cn(
                  "absolute bottom-full mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50",
                  sidebarCollapsed ? "left-full ml-2 w-48" : "left-0 right-0"
                )}>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </Link>
                  <hr className="my-2 border-neutral-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Help & Updates Row */}
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between mt-2 px-3">
              <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
              <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
                <Settings className="w-4 h-4" />
                Updates
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-[70px]" : "ml-[260px]"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              {/* Menu Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <Link 
                  to="/dashboard" 
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  Dashboard
                </Link>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
                <span className="text-neutral-700 font-medium">
                  {getCurrentPageName()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl w-64">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-neutral-400"
                />
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded text-[10px] font-medium text-neutral-400 border border-neutral-200">
                  ⌘K
                </kbd>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Help */}
              <button className="p-2.5 text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default PrivateLayout