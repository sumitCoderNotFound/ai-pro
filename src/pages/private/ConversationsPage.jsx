import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { 
  Search, 
  Filter, 
  Phone, 
  Video, 
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  MoreHorizontal,
  Download
} from 'lucide-react'

const ConversationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)

  const conversations = [
    {
      id: 1,
      user: { name: 'Sarah Mitchell', email: 'sarah.m@email.com' },
      topic: 'MBA Program Inquiry',
      channel: 'phone',
      status: 'completed',
      duration: '3m 24s',
      timestamp: '2024-01-24T10:30:00',
      agent: 'Admission Assistant',
      messages: [
        { role: 'user', content: 'Hi, I\'d like to know more about your MBA program.' },
        { role: 'agent', content: 'Hello! I\'d be happy to help you learn about our MBA program. Are you interested in full-time or part-time options?' },
        { role: 'user', content: 'I\'m working full-time, so part-time would be better.' },
        { role: 'agent', content: 'Great! Our part-time MBA program is designed for working professionals. Classes are held in the evenings and weekends. Would you like me to schedule a call with an admissions counselor?' },
      ]
    },
    {
      id: 2,
      user: { name: 'John Davis', email: 'john.d@email.com' },
      topic: 'Virtual Campus Tour',
      channel: 'video',
      status: 'completed',
      duration: '8m 12s',
      timestamp: '2024-01-24T09:45:00',
      agent: 'Campus Tour Guide',
      messages: []
    },
    {
      id: 3,
      user: { name: 'Emily Rodriguez', email: 'emily.r@email.com' },
      topic: 'Scholarship Information',
      channel: 'chat',
      status: 'transferred',
      duration: '2m 45s',
      timestamp: '2024-01-24T09:15:00',
      agent: 'Support Bot',
      messages: []
    },
    {
      id: 4,
      user: { name: 'Michael Thompson', email: 'michael.t@email.com' },
      topic: 'Application Status',
      channel: 'chat',
      status: 'completed',
      duration: '1m 08s',
      timestamp: '2024-01-24T08:50:00',
      agent: 'Support Bot',
      messages: []
    },
    {
      id: 5,
      user: { name: 'Lisa Kim', email: 'lisa.k@email.com' },
      topic: 'Housing Options',
      channel: 'phone',
      status: 'completed',
      duration: '4m 33s',
      timestamp: '2024-01-24T08:30:00',
      agent: 'Support Bot',
      messages: []
    },
  ]

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'phone': return Phone
      case 'video': return Video
      case 'chat': return MessageSquare
      default: return MessageSquare
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'transferred': return 'bg-amber-100 text-amber-700'
      case 'active': return 'bg-blue-100 text-blue-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Conversations</h1>
          <p className="text-neutral-500">View and manage all AI conversations</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-5 h-5" />}>
          Export
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-5 h-5" />}>
          Filters
        </Button>
      </div>

      {/* Conversations List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="divide-y divide-neutral-100">
              {conversations.map((convo) => {
                const ChannelIcon = getChannelIcon(convo.channel)
                return (
                  <div 
                    key={convo.id} 
                    className={`p-4 hover:bg-neutral-50 cursor-pointer transition-colors ${
                      selectedConversation?.id === convo.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                        <ChannelIcon className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-neutral-900">{convo.user.name}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(convo.status)}`}>
                            {convo.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 truncate">{convo.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-900">{formatTime(convo.timestamp)}</p>
                        <p className="text-xs text-neutral-400">{convo.duration}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-300" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedConversation ? (
            <Card padding="none" className="sticky top-8">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">Conversation Details</h3>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">User</span>
                    <span className="text-sm font-medium text-neutral-900">{selectedConversation.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Email</span>
                    <span className="text-sm text-neutral-900">{selectedConversation.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Agent</span>
                    <span className="text-sm text-neutral-900">{selectedConversation.agent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Duration</span>
                    <span className="text-sm text-neutral-900">{selectedConversation.duration}</span>
                  </div>
                </div>
              </div>

              {selectedConversation.messages.length > 0 && (
                <div className="p-6">
                  <h4 className="font-medium text-neutral-900 mb-4">Transcript</h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {selectedConversation.messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.role === 'user' 
                            ? 'bg-primary-600 text-white rounded-tr-none' 
                            : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card padding="lg" className="text-center">
              <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Select a conversation to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationsPage
