import { useState, useEffect } from 'react'
import { monitorApi } from '@/services/api'
import { 
  Bell, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Slack,
  Webhook,
  Clock,
  Zap,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Loader2,
  RefreshCw
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

  const toggleAlert = (id) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const getChannelIcon = (channel) => {
    const icons = {
      email: Mail,
      slack: Slack,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900">Alerting</h1>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">New</span>
          </div>
          <p className="text-neutral-600">Get notified when important events occur</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
            <Plus className="w-5 h-5" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Active Alerts</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.active_alerts}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Triggered (24h)</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.triggered_24h}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Unresolved</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.unresolved}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Resolved (7d)</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.resolved_7d}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alert Rules */}
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
                    <button className="p-2 hover:bg-neutral-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-neutral-400" />
                    </button>
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

        {/* Recent History */}
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

      {/* Integration Info */}
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
              Configure Integrations →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertsPage
