import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { 
  Search, 
  Filter, 
  Download,
  MessageSquare,
  Clock,
  Calendar,
  MoreVertical,
  Bot
} from 'lucide-react'

const ChatHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const chats = [
    {
      id: 1,
      visitor: 'visitor_abc123',
      agent: 'Support Chat Bot',
      messages: 12,
      duration: '5:24',
      status: 'completed',
      date: '2026-01-25',
      time: '14:32',
    },
    {
      id: 2,
      visitor: 'visitor_def456',
      agent: 'Sales Assistant',
      messages: 8,
      duration: '3:12',
      status: 'completed',
      date: '2026-01-25',
      time: '14:15',
    },
    {
      id: 3,
      visitor: 'visitor_ghi789',
      agent: 'Support Chat Bot',
      messages: 15,
      duration: '8:45',
      status: 'transferred',
      date: '2026-01-25',
      time: '13:58',
    },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      transferred: 'bg-amber-100 text-amber-700',
      active: 'bg-blue-100 text-blue-700'
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Chat History</h1>
          <p className="text-neutral-500">View and analyze all chat conversations</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
          Date Range
        </Button>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>
      </div>

      {/* Chats Table */}
      <Card padding="none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Visitor</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Agent</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Messages</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date & Time</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {chats.map((chat) => (
              <tr key={chat.id} className="hover:bg-neutral-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-neutral-900">{chat.visitor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-700">{chat.agent}</td>
                <td className="px-6 py-4 text-neutral-700">{chat.messages}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">{chat.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(chat.status)}</td>
                <td className="px-6 py-4 text-neutral-500 text-sm">
                  {chat.date} at {chat.time}
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default ChatHistoryPage
