import { useState } from 'react'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Play
} from 'lucide-react'

const ConversationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Mock data - will be replaced with real API calls
  const conversations = [
    {
      id: '1',
      contact: '+1 (555) 123-4567',
      contactName: 'John Smith',
      channel: 'voice',
      agent: 'Admission Assistant',
      status: 'completed',
      duration: '3:24',
      messages: 12,
      sentiment: 'positive',
      startedAt: '2024-01-26T10:30:00Z',
    },
    {
      id: '2',
      contact: 'sarah@company.com',
      contactName: 'Sarah Johnson',
      channel: 'chat',
      agent: 'Support Bot',
      status: 'completed',
      duration: '5:12',
      messages: 24,
      sentiment: 'neutral',
      startedAt: '2024-01-26T09:15:00Z',
    },
    {
      id: '3',
      contact: '+1 (555) 987-6543',
      contactName: 'Mike Wilson',
      channel: 'sms',
      agent: 'Lead Qualification',
      status: 'in_progress',
      duration: '1:45',
      messages: 8,
      sentiment: 'positive',
      startedAt: '2024-01-26T11:00:00Z',
    },
    {
      id: '4',
      contact: '+1 (555) 456-7890',
      contactName: 'Emily Davis',
      channel: 'voice',
      agent: 'Booking Agent',
      status: 'failed',
      duration: '0:32',
      messages: 3,
      sentiment: 'negative',
      startedAt: '2024-01-26T08:45:00Z',
    },
  ]

  const channelIcons = {
    voice: Phone,
    chat: MessageSquare,
    sms: Mail,
  }

  const statusConfig = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  }

  const sentimentColors = {
    positive: 'bg-green-500',
    neutral: 'bg-yellow-500',
    negative: 'bg-red-500',
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const filteredConversations = conversations.filter(conv => {
    if (filterChannel && conv.channel !== filterChannel) return false
    if (filterStatus && conv.status !== filterStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        conv.contact.toLowerCase().includes(query) ||
        conv.contactName.toLowerCase().includes(query) ||
        conv.agent.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Conversations</h1>
        <p className="text-neutral-600">View and manage all conversations across channels</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Channels</option>
          <option value="voice">Voice</option>
          <option value="chat">Chat</option>
          <option value="sms">SMS</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Channel</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Agent</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Duration</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Time</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredConversations.map(conv => {
                const ChannelIcon = channelIcons[conv.channel] || MessageSquare
                const status = statusConfig[conv.status]
                const StatusIcon = status?.icon || CheckCircle

                return (
                  <tr key={conv.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${sentimentColors[conv.sentiment]}`}></div>
                        <div>
                          <p className="font-medium text-neutral-900">{conv.contactName}</p>
                          <p className="text-sm text-neutral-500">{conv.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <ChannelIcon className="w-4 h-4" />
                        <span className="capitalize">{conv.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{conv.agent}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status?.bg} ${status?.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {conv.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{conv.duration}</td>
                    <td className="px-6 py-4 text-neutral-500 text-sm">{formatTime(conv.startedAt)}</td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No conversations found</h3>
            <p className="text-neutral-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationsPage