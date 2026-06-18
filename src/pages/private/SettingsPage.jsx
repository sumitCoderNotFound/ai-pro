import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { settingsApi } from '@/services/api'
import { 
  User, 
  Building, 
  CreditCard, 
  Bell, 
  Shield, 
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    timezone: 'America/New_York',
  })

  const [billingData, setBillingData] = useState({
    plan: { name: 'Free', price: 0 },
    trial: { is_trial: true, days_remaining: 14 },
    usage: {
      conversations: { used: 0, limit: 500 },
      agents: { used: 0, limit: 1 }
    }
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
    { id: 'security', label: 'Security & Trust', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfile()
    } else if (activeTab === 'billing') {
      fetchBilling()
    } else if (activeTab === 'notifications') {
      fetchNotifications()
    }
  }, [activeTab])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const data = await settingsApi.getProfile()
      setProfileData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        timezone: data.timezone || 'America/New_York',
      })
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBilling = async () => {
    setIsLoading(true)
    try {
      const data = await settingsApi.getBilling()
      setBillingData(data)
    } catch (err) {
      console.error('Failed to fetch billing:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await settingsApi.getNotifications()
      setNotificationSettings(data)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await settingsApi.updateProfile({
        full_name: profileData.full_name,
        phone: profileData.phone,
        timezone: profileData.timezone,
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await settingsApi.updateNotifications(notificationSettings)
      setMessage({ type: 'success', text: 'Notification settings updated!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )
    }

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

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
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
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {billingData.trial?.is_trial ? 'Free Trial' : billingData.plan?.name}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">${billingData.plan?.price || 0}/month</p>
              {billingData.trial?.is_trial && (
                <p className="text-sm opacity-80 mb-4">{billingData.trial.days_remaining} days remaining in your trial</p>
              )}
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
                    <span className="text-neutral-900 font-medium">
                      {billingData.usage?.conversations?.used?.toLocaleString() || 0} / {billingData.usage?.conversations?.limit?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${Math.min((billingData.usage?.conversations?.used || 0) / (billingData.usage?.conversations?.limit || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">AI Agents</span>
                    <span className="text-neutral-900 font-medium">
                      {billingData.usage?.agents?.used || 0} / {billingData.usage?.agents?.limit || 0}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${Math.min((billingData.usage?.agents?.used || 0) / (billingData.usage?.agents?.limit || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Security & Trust</h3>
              <p className="text-sm text-neutral-500 mt-1">Your data is protected by enterprise-grade security infrastructure.</p>
            </div>

            {/* Trust Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg">Enterprise-Grade Security</span>
                </div>
                <p className="text-emerald-100 text-sm leading-relaxed max-w-lg">
                  ConvoHubAI is built on security-first infrastructure. All your conversation data, agent configurations, and customer information are protected end-to-end.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['AES-256 Encryption', 'TLS 1.3 in Transit', 'SOC 2 Compliant', 'GDPR Ready'].map(b => (
                    <span key={b} className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                      <CheckCircle className="w-3 h-3" />{b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Badges */}
            <div>
              <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-widest mb-3">Compliance & Certifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { badge: 'GDPR', desc: 'EU Data Protection', color: 'blue', icon: '🇪🇺' },
                  { badge: 'SOC 2', desc: 'Type II Audit Ready', color: 'indigo', icon: '🏛️' },
                  { badge: 'HIPAA', desc: 'Healthcare Ready', color: 'emerald', icon: '🏥' },
                  { badge: 'ISO 27001', desc: 'Info Security Mgmt', color: 'violet', icon: '🔐' },
                ].map(({ badge, desc, color, icon }) => (
                  <div key={badge} className={`p-4 rounded-2xl border-2 text-center bg-${color}-50 border-${color}-100`}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className={`text-sm font-black text-${color}-700`}>{badge}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encryption Details */}
            <div>
              <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-widest mb-3">Data Protection</h4>
              <div className="space-y-2">
                {[
                  { title: 'Data at Rest', desc: 'All stored data encrypted with AES-256-GCM', icon: '🔒', status: 'Active' },
                  { title: 'Data in Transit', desc: 'TLS 1.3 enforced on all API connections', icon: '🔗', status: 'Active' },
                  { title: 'Database Encryption', desc: 'PostgreSQL tablespace and column-level encryption', icon: '🗄️', status: 'Active' },
                  { title: 'Backups', desc: 'Encrypted daily backups retained for 30 days', icon: '💾', status: 'Active' },
                  { title: 'Data Residency', desc: 'Data stored in your chosen region only', icon: '🌍', status: 'Active' },
                ].map(({ title, desc, icon, status }) => (
                  <div key={title} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">{title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-widest mb-3">Account Security</h4>
              <div className="space-y-3">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Password</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Use a strong, unique password for your account</p>
                    </div>
                    <button className="px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold hover:bg-white transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Two-Factor Authentication</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Adds a second verification step on login</p>
                    </div>
                    <button className="px-3 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Active Sessions</p>
                      <p className="text-xs text-neutral-500 mt-0.5">View and revoke logged-in devices</p>
                    </div>
                    <button className="px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold hover:bg-white transition-colors">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Controls */}
            <div>
              <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-widest mb-3">Privacy Controls</h4>
              <div className="space-y-2">
                {[
                  { title: 'Call Recording', desc: 'Control whether voice calls are recorded and stored', toggle: true, on: true },
                  { title: 'Transcript Storage', desc: 'Save conversation transcripts for analytics and review', toggle: true, on: true },
                  { title: 'Analytics Data Sharing', desc: 'Anonymous usage data to improve the platform', toggle: true, on: false },
                ].map(({ title, desc, on }) => (
                  <div key={title} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">{title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                    </div>
                    <div className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${on ? 'bg-emerald-500' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Deletion */}
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-rose-800">Data Deletion</p>
                  <p className="text-xs text-rose-600 mt-0.5">Request permanent deletion of all your workspace data. This action cannot be undone.</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-300 rounded-lg hover:bg-rose-100 transition-colors flex-shrink-0">
                  Request Deletion
                </button>
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