import { useState, useEffect } from 'react'
import { monitorApi } from '@/services/api'
import { Dropdown, DropdownItem } from '@/components/ui'
import { 
  Bell, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  Webhook,
  Clock,
  Zap,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Loader2,
  RefreshCw,
  X,
  Edit,
  Trash2,
  Copy,
  Eye
} from 'lucide-react'

const AlertsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [stats, setStats] = useState({
    active_alerts: 0,
    triggered_24h: 0,
    unresolved: 0,
    resolved_7d: 0
  })
  const [rules, setRules] = useState([])
  const [history, setHistory] = useState([])
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    type: 'threshold',
    metric: 'failure_rate',
    threshold: 10,
    channels: ['email']
  })

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsRes, rulesRes, historyRes] = await Promise.all([
        monitorApi.getAlertsStats(),
        monitorApi.getAlertRules(),
        monitorApi.getAlertHistory(10)
      ])
      setStats(statsRes)
      setRules(rulesRes.rules || [])
      setHistory(historyRes.history || [])
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
      setError('Failed to load alerts data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    if (!newAlert.name.trim()) return
    
    setIsCreating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRules(prev => [{
        id: Date.now().toString(),
        name: newAlert.name,
        description: newAlert.description,
        type: newAlert.type,
        metric: newAlert.metric,
        threshold: newAlert.threshold,
        enabled: true,
        channels: newAlert.channels,
        last_triggered: 'Never',
        trigger_count: 0
      }, ...prev])
      
      setStats(prev => ({
        ...prev,
        active_alerts: prev.active_alerts + 1
      }))
      
      setShowCreateModal(false)
      setNewAlert({
        name: '',
        description: '',
        type: 'threshold',
        metric: 'failure_rate',
        threshold: 10,
        channels: ['email']
      })
    } catch (err) {
      console.error('Failed to create alert:', err)
      alert('Failed to create alert')
    } finally {
      setIsCreating(false)
    }
  }

  const toggleAlert = (id) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const toggleChannel = (channel) => {
    setNewAlert(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const getChannelIcon = (channel) => {
    const icons = {
      email: Mail,
      slack: MessageSquare,
      webhook: Webhook
    }
    const Icon = icons[channel] || Bell
    return <Icon className="w-4 h-4" />
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
      info: 'bg-blue-100 text-blue-700'
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[severity] || 'bg-neutral-100 text-neutral-700'}`}>
        {severity}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900">Alerting</h1>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">New</span>
          </div>
          <p className="text-neutral-600 text-sm">Get notified when important events occur</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            Create Alert
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">
            Try Again
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Active Alerts</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.active_alerts}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Triggered (24h)</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.triggered_24h}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Unresolved</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Resolved (7d)</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.resolved_7d}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900">Alert Rules</h2>
          </div>
          
          {rules.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              No alert rules configured
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {rules.map((rule) => (
                <div key={rule.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleAlert(rule.id)}
                        className={`mt-1 ${rule.enabled ? 'text-primary-600' : 'text-neutral-300'}`}
                      >
                        {rule.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                      <div>
                        <h3 className={`font-medium ${rule.enabled ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {rule.name}
                        </h3>
                        <p className={`text-sm ${rule.enabled ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    <Dropdown
                      trigger={
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-neutral-400" />
                        </button>
                      }
                    >
                      {(close) => (
                        <>
                          <DropdownItem 
                            icon={Eye} 
                            onClick={() => { close(); alert(`View alert: ${rule.name}`); }}
                          >
                            View Details
                          </DropdownItem>
                          <DropdownItem 
                            icon={Edit} 
                            onClick={() => { close(); alert(`Edit alert: ${rule.name}`); }}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem 
                            icon={Copy} 
                            onClick={() => { close(); alert(`Duplicate alert: ${rule.name}`); }}
                          >
                            Duplicate
                          </DropdownItem>
                          <div className="border-t border-neutral-100 my-1" />
                          <DropdownItem 
                            icon={Trash2} 
                            variant="danger"
                            onClick={() => { 
                              close(); 
                              if(confirm(`Delete alert "${rule.name}"?`)) {
                                setRules(prev => prev.filter(r => r.id !== rule.id));
                              }
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </div>

                  <div className="ml-9 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Channels:</span>
                      <div className="flex items-center gap-1">
                        {rule.channels && rule.channels.map((channel, idx) => (
                          <div key={idx} className="w-6 h-6 bg-neutral-100 rounded flex items-center justify-center text-neutral-600">
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Clock className="w-4 h-4" />
                      Last: {rule.last_triggered}
                    </div>
                    <div className="text-neutral-500">
                      Triggered {rule.trigger_count}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
          </div>
          
          {history.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              No recent activity
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {history.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900 text-sm">{item.alert_name}</span>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">{item.message}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{item.timestamp}</span>
                    {item.resolved ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Resolved
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-neutral-100">
            <button className="w-full text-sm text-primary-600 hover:underline">
              View Full History
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Connect Your Tools</h3>
            <p className="text-neutral-600 text-sm mb-3">
              Integrate with Slack, PagerDuty, or custom webhooks to receive alerts where your team works.
            </p>
            <button className="text-sm text-primary-600 hover:underline font-medium">
              Configure Integrations
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Create Alert</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAlert} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Alert Name *
                </label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="e.g., High Failure Rate Alert"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  placeholder="Describe when this alert should trigger..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Metric
                </label>
                <select
                  value={newAlert.metric}
                  onChange={(e) => setNewAlert({ ...newAlert, metric: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="failure_rate">Call Failure Rate</option>
                  <option value="qa_score">QA Score</option>
                  <option value="response_time">Response Time</option>
                  <option value="agent_status">Agent Status</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Threshold (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notification Channels
                </label>
                <div className="flex gap-3">
                  {[
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'slack', label: 'Slack', icon: MessageSquare },
                    { id: 'webhook', label: 'Webhook', icon: Webhook }
                  ].map((channel) => (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => toggleChannel(channel.id)}
                      className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        newAlert.channels.includes(channel.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <channel.icon className={`w-5 h-5 ${newAlert.channels.includes(channel.id) ? 'text-primary-600' : 'text-neutral-400'}`} />
                      <span className={`text-xs font-medium ${newAlert.channels.includes(channel.id) ? 'text-primary-700' : 'text-neutral-600'}`}>
                        {channel.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newAlert.name.trim()}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Alert
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertsPage