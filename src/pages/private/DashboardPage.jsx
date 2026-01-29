import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { agentsApi } from '@/services/api'
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
  Users
} from 'lucide-react'

const StatCard = ({ title, value, change, changeType, icon: Icon, iconBg }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-neutral-600">{title}</span>
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold text-neutral-900 mb-1">{value}</div>
    {change && (
      <div className={`flex items-center gap-1 text-sm ${
        changeType === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {changeType === 'up' ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        {change} vs last week
      </div>
    )}
  </div>
)

const DashboardPage = () => {
  const { user } = useAuth()
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await agentsApi.list({ page_size: 5 })
        setAgents(response.items || [])
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { 
      title: 'Total Calls', 
      value: '2,847', 
      change: '+12.5%', 
      changeType: 'up',
      icon: Phone,
      iconBg: 'bg-blue-500'
    },
    { 
      title: 'Success Rate', 
      value: '94.2%', 
      change: '+3.1%', 
      changeType: 'up',
      icon: CheckCircle,
      iconBg: 'bg-green-500'
    },
    { 
      title: 'Avg. Duration', 
      value: '2m 34s', 
      change: '-0.3s', 
      changeType: 'up',
      icon: Clock,
      iconBg: 'bg-yellow-500'
    },
    { 
      title: 'Active Agents', 
      value: agents.filter(a => a.status === 'active').length.toString(), 
      change: null, 
      changeType: null,
      icon: Bot,
      iconBg: 'bg-purple-500'
    },
  ]

  const recentCalls = [
    { phone: '+1 (555) 123-4567', agent: 'Admission Assistant', duration: '3:24', status: 'Completed', time: '2 min ago' },
    { phone: '+1 (555) 987-6543', agent: 'Lead Qualification', duration: '5:12', status: 'Completed', time: '8 min ago' },
    { phone: '+1 (555) 456-7890', agent: 'Support Bot', duration: '1:45', status: 'Transferred', time: '15 min ago' },
  ]

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

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
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
          
          <div className="space-y-4">
            {recentCalls.map((call, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{call.phone}</p>
                    <p className="text-sm text-neutral-500">{call.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">{call.duration}</p>
                  <p className="text-sm text-neutral-500">{call.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Top Performing Agents</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500">No agents yet</p>
              <Link to="/dashboard/agents" className="text-primary-600 hover:underline text-sm">
                Create your first agent
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.slice(0, 3).map((agent, i) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{agent.name}</p>
                      <p className="text-sm text-neutral-500 capitalize">{agent.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${90 - i * 5}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{90 - i * 5}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage