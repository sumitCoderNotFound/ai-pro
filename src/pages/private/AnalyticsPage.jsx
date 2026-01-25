import { useState } from 'react'
import { Card, Button } from '@/components/ui'
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
  PieChart
} from 'lucide-react'

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    { label: 'Total Calls', value: '12,847', change: '+18%', trend: 'up', icon: Phone },
    { label: 'Avg. Call Duration', value: '2m 34s', change: '-12s', trend: 'up', icon: Clock },
    { label: 'Success Rate', value: '94.2%', change: '+2.3%', trend: 'up', icon: CheckCircle },
    { label: 'Unique Callers', value: '8,234', change: '+24%', trend: 'up', icon: Users },
  ]

  const dailyData = [
    { day: 'Mon', calls: 420, success: 395 },
    { day: 'Tue', calls: 380, success: 358 },
    { day: 'Wed', calls: 450, success: 423 },
    { day: 'Thu', calls: 520, success: 492 },
    { day: 'Fri', calls: 480, success: 456 },
    { day: 'Sat', calls: 280, success: 265 },
    { day: 'Sun', calls: 220, success: 210 },
  ]

  const maxCalls = Math.max(...dailyData.map(d => d.calls))

  const outcomeData = [
    { name: 'Completed', value: 72, color: 'bg-green-500' },
    { name: 'Transferred', value: 15, color: 'bg-amber-500' },
    { name: 'No Answer', value: 8, color: 'bg-red-500' },
    { name: 'Failed', value: 5, color: 'bg-neutral-400' },
  ]

  const agentPerformance = [
    { name: 'Admission Assistant', calls: 2847, success: 96, avgDuration: '2:45' },
    { name: 'Lead Qualification', calls: 2234, success: 92, avgDuration: '3:12' },
    { name: 'Support Bot', calls: 1856, success: 89, avgDuration: '2:08' },
    { name: 'Healthcare Check-In', calls: 1423, success: 94, avgDuration: '2:34' },
    { name: 'Appointment Reminder', calls: 987, success: 98, avgDuration: '0:45' },
  ]

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
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
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
        ))}
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
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-4 h-48">
              {dailyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end gap-1 h-40">
                    <div 
                      className="flex-1 bg-primary-200 rounded-t-lg transition-all duration-300"
                      style={{ height: `${(data.calls / maxCalls) * 100}%` }}
                    />
                    <div 
                      className="flex-1 bg-green-400 rounded-t-lg transition-all duration-300"
                      style={{ height: `${(data.success / maxCalls) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500">{data.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Call Outcomes */}
        <Card padding="lg">
          <h2 className="font-semibold text-neutral-900 mb-6">Call Outcomes</h2>
          
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
                <span className="text-3xl font-bold text-neutral-900">94%</span>
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
      </Card>
    </div>
  )
}

export default AnalyticsPage
