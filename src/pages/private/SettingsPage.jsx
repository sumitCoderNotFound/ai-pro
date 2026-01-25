import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, Button, Input } from '@/components/ui'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Palette,
  Key,
  Save,
  Check,
  Building,
  Mail,
  Webhook
} from 'lucide-react'

const SettingsPage = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  ]

  const handleSave = () => {
    updateProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500">Manage your account and workspace settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-600' : 'text-neutral-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Profile Settings</h2>
                  <p className="text-sm text-neutral-500">Update your personal information</p>
                </div>
                <Button 
                  variant="primary" 
                  leftIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-neutral-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <Input
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card padding="lg">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">API Keys</h2>
                <p className="text-sm text-neutral-500">Manage your API keys for integrations</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">Production Key</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-neutral-900 text-green-400 rounded-lg text-sm font-mono">
                      sk_live_••••••••••••••••••••••••
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">Test Key</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Test Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-neutral-900 text-green-400 rounded-lg text-sm font-mono">
                      sk_test_••••••••••••••••••••••••
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card padding="lg">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">Billing & Subscription</h2>
                <p className="text-sm text-neutral-500">Manage your plan and payment methods</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Current Plan</p>
                    <p className="text-2xl font-bold">Professional</p>
                    <p className="text-white/80 text-sm mt-1">$149/month • Renews Feb 25, 2026</p>
                  </div>
                  <Button variant="white">Upgrade</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-neutral-900">Payment Method</h3>
                <div className="p-4 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center text-sm font-bold text-neutral-600">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-neutral-500">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </Card>
          )}

          {(activeTab !== 'profile' && activeTab !== 'api' && activeTab !== 'billing') && (
            <Card padding="lg" className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  <span className="text-neutral-400">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)?.icon
                      return Icon ? <Icon className="w-8 h-8" /> : null
                    })()}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Coming Soon</h3>
              <p className="text-neutral-500">This settings section is under development</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
