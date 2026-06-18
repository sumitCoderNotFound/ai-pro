import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { dashboardApi, agentsApi, analyticsApi } from '@/services/api'
import { 
  Phone, 
  CheckCircle, 
  Clock, 
  Bot, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ArrowRight,
  MessageSquare,
  Users,
  RefreshCw,
  AlertCircle,
  Zap,
  Activity,
  BarChart3,
} from 'lucide-react'

const StatCard = ({ title, value, change, changeType, icon: Icon, iconBg, isLoading }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-neutral-600">{title}</span>
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    {isLoading ? (
      <div className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-neutral-100 rounded w-20"></div>
      </div>
    ) : (
      <>
        <div className="text-3xl font-bold text-neutral-900 mb-1">{value}</div>
        {change !== null && change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {changeType === 'up' ? '+' : '-'}{Math.abs(change)}% vs last week
          </div>
        )}
      </>
    )}
  </div>
)

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentCalls, setRecentCalls] = useState([])
  const [topAgents, setTopAgents] = useState([])
  const [usageMetrics, setUsageMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    setError(null)
    
    try {
      const [statsRes, callsRes, agentsRes, overviewRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentCalls(5),
        dashboardApi.getTopAgents(5),
        analyticsApi.getOverview('30d').catch(() => null),
      ])
      
      setStats(statsRes)
      setRecentCalls(callsRes.calls || [])
      setTopAgents(agentsRes.agents || [])

      // Build usage metrics from stats + overview
      if (statsRes || overviewRes) {
        const totalCalls = overviewRes?.stats?.[0]?.value?.replace(',', '') || statsRes?.total_calls?.value || '0'
        const totalCallsNum = parseInt(String(totalCalls).replace(/[^0-9]/g, '')) || 0

        // Estimate voice hours from avg duration × total calls
        const avgDurSecs = statsRes?.avg_duration_seconds || 0
        const voiceMinutes = Math.round((totalCallsNum * avgDurSecs) / 60)
        const voiceHours = voiceMinutes >= 60 ? `${(voiceMinutes / 60).toFixed(1)}h` : `${voiceMinutes}m`

        setUsageMetrics({
          messages: totalCallsNum.toLocaleString(),
          voice: voiceHours,
          agents: statsRes?.active_agents?.value || '0',
          successRate: statsRes?.success_rate?.value || '0',
        })
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Refresh every 30 seconds
    const interval = setInterval(() => fetchDashboardData(), 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  // Build stats cards from API data
  const statsCards = [
    { 
      title: 'Total Calls', 
      value: stats?.total_calls?.value?.toLocaleString() || '0', 
      change: stats?.total_calls?.change || null, 
      changeType: stats?.total_calls?.change_type || null,
      icon: Phone,
      iconBg: 'bg-blue-500'
    },
    { 
      title: 'Success Rate', 
      value: stats ? `${stats.success_rate?.value || 0}%` : '0%', 
      change: stats?.success_rate?.change || null, 
      changeType: stats?.success_rate?.change_type || null,
      icon: CheckCircle,
      iconBg: 'bg-green-500'
    },
    { 
      title: 'Avg. Duration', 
      value: stats?.avg_duration?.value || '0s', 
      change: null, 
      changeType: null,
      icon: Clock,
      iconBg: 'bg-yellow-500'
    },
    { 
      title: 'Active Agents', 
      value: stats?.active_agents?.value?.toString() || '0', 
      change: null, 
      changeType: null,
      icon: Bot,
      iconBg: 'bg-purple-500'
    },
  ]

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'text-green-600 bg-green-100',
      'active': 'text-blue-600 bg-blue-100',
      'transferred': 'text-yellow-600 bg-yellow-100',
      'failed': 'text-red-600 bg-red-100',
      'abandoned': 'text-neutral-600 bg-neutral-100'
    }
    return colors[status] || colors['active']
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back! 👋
          </h1>
          <p className="text-neutral-600">Here's what's happening with your AI agents today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700"
          >
            <Bot className="w-5 h-5" />
            View Agents
          </Link>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </Link>
        </div>
      </div>

      {/* ── Usage Metrics Strip ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-neutral-200 rounded-2xl">
        {/* Period label */}
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pr-2 border-r border-neutral-200 mr-1">
          This month
        </span>

        {isLoading || !usageMetrics ? (
          /* skeleton */
          <>
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 animate-pulse">
                <div className="w-3 h-3 bg-neutral-200 rounded" />
                <div className="w-20 h-3 bg-neutral-200 rounded" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tabular-nums">{usageMetrics.messages}</span>
              <span className="text-xs text-blue-500">conversations</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tabular-nums">{usageMetrics.voice}</span>
              <span className="text-xs text-violet-500">voice time</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Bot className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tabular-nums">{usageMetrics.agents}</span>
              <span className="text-xs text-emerald-500">active agents</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tabular-nums">{usageMetrics.successRate}%</span>
              <span className="text-xs text-amber-500">success rate</span>
            </div>
          </>
        )}

        {/* Right side — status + links */}
        <div className="ml-auto flex items-center gap-3">
          <Link to="/status" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            All systems operational
          </Link>
          <Link to="/dashboard/analytics" className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
            Full analytics
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={handleRefresh}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, i) => (
          <StatCard key={i} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Calls</h2>
            <Link to="/dashboard/calls" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-neutral-100 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-neutral-200 rounded w-12 mb-2"></div>
                    <div className="h-3 bg-neutral-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentCalls.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500">No calls yet</p>
              <p className="text-sm text-neutral-400 mt-1">
                Conversations will appear here once they start
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      call.type === 'chat' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {call.type === 'chat' ? (
                        <MessageSquare className={`w-5 h-5 ${call.type === 'chat' ? 'text-blue-600' : 'text-green-600'}`} />
                      ) : (
                        <Phone className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{call.phone}</p>
                      <p className="text-sm text-neutral-500">{call.agent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">{call.duration}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                      <span className="text-sm text-neutral-500">{call.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Agents */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Top Performing Agents</h2>
            <Link to="/dashboard/agents" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-xl"></div>
                    <div>
                      <div className="h-4 bg-neutral-200 rounded w-28 mb-2"></div>
                      <div className="h-3 bg-neutral-100 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full"></div>
                    <div className="h-3 bg-neutral-100 rounded w-10 mt-2 ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topAgents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500">No agents yet</p>
              <Link to="/dashboard/agents" className="text-primary-600 hover:underline text-sm">
                Create your first agent
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {topAgents.map((agent, i) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{agent.name}</p>
                      <p className="text-sm text-neutral-500">
                        {agent.total_conversations} conversations
                        {agent.status === 'active' && (
                          <span className="ml-2 text-green-600">• Active</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                        style={{ width: `${agent.success_rate}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{agent.success_rate}% success</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      {!isLoading && stats && (
        <div className="mt-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900">Quick Summary</h3>
              <p className="text-neutral-600 text-sm mt-1">
                You have {stats.active_agents?.value || 0} active agent{stats.active_agents?.value !== 1 ? 's' : ''} handling {stats.total_calls?.value || 0} conversation{stats.total_calls?.value !== 1 ? 's' : ''} with a {stats.success_rate?.value || 0}% success rate.
              </p>
            </div>
            <Link
              to="/dashboard/analytics"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary-200 rounded-xl text-primary-700 hover:bg-primary-50 font-medium"
            >
              View Analytics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage