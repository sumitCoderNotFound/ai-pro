import { Link } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { 
  Bot,
  Phone,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Plus,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  BarChart3,
  Users,
  Zap
} from 'lucide-react'

const DashboardPage = () => {
  const stats = [
    { 
      label: 'Total Calls', 
      value: '2,847', 
      change: '+12.5%', 
      trend: 'up',
      icon: Phone,
      color: 'blue'
    },
    { 
      label: 'Success Rate', 
      value: '94.2%', 
      change: '+3.1%', 
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    { 
      label: 'Avg. Duration', 
      value: '2m 34s', 
      change: '-0.3s', 
      trend: 'up',
      icon: Clock,
      color: 'purple'
    },
    { 
      label: 'Active Agents', 
      value: '8', 
      change: '+2', 
      trend: 'up',
      icon: Bot,
      color: 'amber'
    },
  ]

  const recentCalls = [
    { 
      id: 1,
      type: 'inbound',
      caller: '+1 (555) 123-4567',
      agent: 'Admission Assistant',
      duration: '3:24',
      status: 'completed',
      time: '2 min ago'
    },
    { 
      id: 2,
      type: 'outbound',
      caller: '+1 (555) 987-6543',
      agent: 'Lead Qualification',
      duration: '5:12',
      status: 'completed',
      time: '8 min ago'
    },
    { 
      id: 3,
      type: 'inbound',
      caller: '+1 (555) 456-7890',
      agent: 'Support Bot',
      duration: '1:45',
      status: 'transferred',
      time: '15 min ago'
    },
    { 
      id: 4,
      type: 'inbound',
      caller: '+1 (555) 321-0987',
      agent: 'Healthcare Check-In',
      duration: '2:08',
      status: 'completed',
      time: '22 min ago'
    },
    { 
      id: 5,
      type: 'outbound',
      caller: '+1 (555) 654-3210',
      agent: 'Appointment Reminder',
      duration: '0:45',
      status: 'failed',
      time: '30 min ago'
    },
  ]

  const topAgents = [
    { name: 'Admission Assistant', calls: 847, success: 96, color: 'blue' },
    { name: 'Lead Qualification', calls: 623, success: 92, color: 'green' },
    { name: 'Support Bot', calls: 512, success: 89, color: 'purple' },
    { name: 'Healthcare Check-In', calls: 398, success: 94, color: 'amber' },
  ]

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
      case 'transferred':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Transferred</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Failed</span>
      default:
        return <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">{status}</span>
    }
  }

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-500' },
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back! 👋</h1>
          <p className="text-neutral-500">Here's what's happening with your AI agents today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/agents">
            <Button variant="outline" leftIcon={<Bot className="w-4 h-4" />}>
              View Agents
            </Button>
          </Link>
          <Link to="/dashboard/agents">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Agent
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} padding="lg" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[stat.color].bg}`}>
                <stat.icon className={`w-6 h-6 ${colorClasses[stat.color].text}`} />
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
              <span className="text-sm text-neutral-400 ml-1">vs last week</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Calls */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Recent Calls</h2>
              <Link to="/dashboard/calls" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {recentCalls.map((call) => (
                <div key={call.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      call.type === 'inbound' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {call.type === 'inbound' ? (
                        <PhoneIncoming className={`w-5 h-5 text-blue-600`} />
                      ) : (
                        <PhoneOutgoing className={`w-5 h-5 text-green-600`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900">{call.caller}</p>
                      <p className="text-sm text-neutral-500">{call.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-900">{call.duration}</p>
                      <p className="text-xs text-neutral-400">{call.time}</p>
                    </div>
                    <div>
                      {getStatusBadge(call.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performing Agents */}
        <div>
          <Card padding="none">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">Top Performing Agents</h2>
            </div>
            <div className="p-6 space-y-5">
              {topAgents.map((agent, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[agent.color].bg}`}>
                        <Bot className={`w-4 h-4 ${colorClasses[agent.color].text}`} />
                      </div>
                      <span className="font-medium text-neutral-900 text-sm">{agent.name}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{agent.calls} calls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorClasses[agent.color].bar} rounded-full transition-all duration-500`}
                        style={{ width: `${agent.success}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-12 text-right">{agent.success}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-neutral-100">
              <Link to="/dashboard/analytics" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1">
                View Analytics <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card hover padding="lg" className="cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Add Phone Number</h3>
              <p className="text-sm text-neutral-500">Connect a new phone number</p>
            </div>
          </div>
        </Card>
        <Card hover padding="lg" className="cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Start Batch Call</h3>
              <p className="text-sm text-neutral-500">Run outbound campaign</p>
            </div>
          </div>
        </Card>
        <Card hover padding="lg" className="cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">View Reports</h3>
              <p className="text-sm text-neutral-500">Download analytics reports</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
