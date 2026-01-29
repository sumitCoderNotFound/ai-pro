import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  User, 
  Building, 
  CreditCard, 
  Bell, 
  Shield, 
  Key,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    timezone: 'America/New_York',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    call_alerts: true,
    weekly_report: true,
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMessage({ type: 'success', text: 'Profile updated successfully!' })
    setIsSaving(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Timezone</label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">Notification Preferences</h3>
            
            <div className="space-y-4">
              {[
                { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates and alerts via email' },
                { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Get text messages for important events' },
                { key: 'call_alerts', label: 'Call Alerts', desc: 'Real-time notifications for new calls' },
                { key: 'weekly_report', label: 'Weekly Report', desc: 'Receive a weekly summary of your agents performance' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="font-medium text-neutral-900">{item.label}</p>
                    <p className="text-sm text-neutral-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">Billing & Subscription</h3>
            
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm opacity-80">Current Plan</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Free Trial</span>
              </div>
              <p className="text-3xl font-bold mb-1">$0/month</p>
              <p className="text-sm opacity-80 mb-4">14 days remaining in your trial</p>
              <button className="w-full py-2.5 bg-white text-primary-600 rounded-xl font-medium hover:bg-neutral-100">
                Upgrade Plan
              </button>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-3">Usage This Month</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Conversations</span>
                    <span className="text-neutral-900 font-medium">847 / 1,000</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '84.7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">AI Agents</span>
                    <span className="text-neutral-900 font-medium">1 / 1</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Password</p>
                    <p className="text-sm text-neutral-500">Last changed 30 days ago</p>
                  </div>
                  <button className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-100">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                    <p className="text-sm text-neutral-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Active Sessions</p>
                    <p className="text-sm text-neutral-500">Manage your logged in devices</p>
                  </div>
                  <button className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-100">
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">API Keys</h3>
            <p className="text-neutral-600">Manage your API keys for programmatic access.</p>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Keep your API keys secure</p>
                  <p className="text-sm text-yellow-700">Never share your API keys or commit them to version control.</p>
                </div>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
              <Key className="w-4 h-4" />
              Generate New API Key
            </button>

            <div className="text-center py-8 text-neutral-500">
              No API keys generated yet
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <p className="text-neutral-500">Select a tab to view settings</p>
          </div>
        )
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage your account and preferences</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-neutral-200 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-neutral-200 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage