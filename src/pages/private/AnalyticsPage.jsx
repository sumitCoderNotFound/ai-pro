import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { analyticsApi } from '@/services/api'
import { 
  TrendingUp, 
  TrendingDown,
  Phone,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [stats, setStats] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [outcomeData, setOutcomeData] = useState([])
  const [agentPerformance, setAgentPerformance] = useState([])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [overviewRes, dailyRes, outcomesRes, performanceRes] = await Promise.all([
        analyticsApi.getOverview(timeRange),
        analyticsApi.getDailyCalls(timeRange),
        analyticsApi.getCallOutcomes(timeRange),
        analyticsApi.getAgentPerformance(timeRange, 10)
      ])
      
      setStats(overviewRes.stats || [])
      setDailyData(dailyRes.data || [])
      setOutcomeData(outcomesRes.outcomes || [])
      setAgentPerformance(performanceRes.agents || [])
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const iconMap = {
    'Total Calls': Phone,
    'Avg. Call Duration': Clock,
    'Success Rate': CheckCircle,
    'Unique Callers': Users
  }

  const maxCalls = Math.max(...dailyData.map(d => d.calls), 1)
  
  // Calculate total success rate from outcomes
  const completedOutcome = outcomeData.find(o => o.name === 'Completed')
  const successRate = completedOutcome?.value || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-500">Track performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 rounded-xl p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-800 font-medium">
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = iconMap[stat.label] || Phone
          return (
            <Card key={idx} padding="lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-neutral-400 ml-1">vs last period</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Calls Chart */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-neutral-900">Daily Call Volume</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full" />
                  <span className="text-neutral-600">Total Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-neutral-600">Successful</span>
                </div>
              </div>
            </div>
            
            {dailyData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-neutral-500">
                No data available for this period
              </div>
            ) : (
              <div className="flex items-end justify-between gap-4 h-48">
                {dailyData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-1 h-40">
                      <div 
                        className="flex-1 bg-primary-200 rounded-t-lg transition-all duration-300"
                        style={{ height: `${(data.calls / maxCalls) * 100}%` }}
                        title={`Total: ${data.calls}`}
                      />
                      <div 
                        className="flex-1 bg-green-400 rounded-t-lg transition-all duration-300"
                        style={{ height: `${(data.success / maxCalls) * 100}%` }}
                        title={`Success: ${data.success}`}
                      />
                    </div>
                    <span className="text-xs text-neutral-500">{data.day}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Call Outcomes */}
        <Card padding="lg">
          <h2 className="font-semibold text-neutral-900 mb-6">Call Outcomes</h2>
          
          {outcomeData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-neutral-500">
              No data available
            </div>
          ) : (
            <>
              {/* Simple Donut representation */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    {outcomeData.reduce((acc, item, idx) => {
                      const offset = acc.offset
                      const circumference = 2 * Math.PI * 60
                      const strokeDasharray = (item.value / 100) * circumference
                      
                      acc.elements.push(
                        <circle
                          key={idx}
                          cx="80"
                          cy="80"
                          r="60"
                          fill="none"
                          stroke={item.color.replace('bg-', '')}
                          strokeWidth="20"
                          strokeDasharray={`${strokeDasharray} ${circumference}`}
                          strokeDashoffset={-offset}
                          className={item.color.replace('bg-', 'stroke-')}
                        />
                      )
                      
                      acc.offset += strokeDasharray
                      return acc
                    }, { elements: [], offset: 0 }).elements}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-neutral-900">{successRate}%</span>
                    <span className="text-xs text-neutral-500">Success</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {outcomeData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-neutral-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Agent Performance</h2>
          <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        {agentPerformance.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            No agent performance data available
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Agent</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Calls</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Success Rate</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Avg. Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {agentPerformance.map((agent, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{agent.name}</td>
                  <td className="px-6 py-4 text-neutral-600">{agent.calls.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${agent.success}%` }}
                        />
                      </div>
                      <span className="text-neutral-900 font-medium">{agent.success}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{agent.avgDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

export default AnalyticsPage
