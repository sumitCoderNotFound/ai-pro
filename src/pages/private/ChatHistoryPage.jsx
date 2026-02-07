import { useState, useEffect } from 'react'
import { Card, Button, Dropdown, DropdownItem } from '@/components/ui'
import { analyticsApi, agentsApi } from '@/services/api'
import { 
  Search, 
  Filter, 
  Download,
  MessageSquare,
  Clock,
  Calendar,
  MoreVertical,
  Bot,
  Loader2,
  RefreshCw,
  AlertCircle,
  Eye,
  Trash2,
  FileText,
  ExternalLink
} from 'lucide-react'

const ChatHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAgent, setFilterAgent] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Build params object, only include non-empty values
      const chatParams = { limit: 50 }
      if (filterStatus) chatParams.status = filterStatus
      if (filterAgent) chatParams.agent_id = filterAgent
      
      const [chatsRes, agentsRes] = await Promise.all([
        analyticsApi.getChatHistory(chatParams),
        agentsApi.list({})
      ])
      setChats(chatsRes.chats || [])
      setAgents(agentsRes.items || [])
    } catch (err) {
      console.error('Failed to fetch chat history:', err)
      setError('Failed to load chat history')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterStatus, filterAgent])

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      transferred: 'bg-amber-100 text-amber-700',
      active: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      abandoned: 'bg-neutral-100 text-neutral-700'
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status}
      </span>
    )
  }

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      chat.visitor?.toLowerCase().includes(query) ||
      chat.agent?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Chat History</h1>
          <p className="text-neutral-500">View and analyze all chat conversations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="transferred">Transferred</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="">All Agents</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
      </div>

      {/* Chats Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No chat history</h3>
            <p className="text-neutral-500">Chat conversations will appear here once they start</p>
          </div>
        ) : (
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
              {filteredChats.map((chat) => (
                <tr key={chat.id} className="hover:bg-neutral-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-neutral-900">{chat.visitor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-700">{chat.agent}</span>
                    </div>
                  </td>
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
                    <Dropdown
                      trigger={
                        <button className="p-2 hover:bg-neutral-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-4 h-4 text-neutral-400" />
                        </button>
                      }
                    >
                      {(close) => (
                        <>
                          <DropdownItem 
                            icon={Eye} 
                            onClick={() => { close(); alert(`View chat: ${chat.id}`); }}
                          >
                            View Transcript
                          </DropdownItem>
                          <DropdownItem 
                            icon={FileText} 
                            onClick={() => { close(); alert(`Export chat: ${chat.id}`); }}
                          >
                            Export
                          </DropdownItem>
                          <DropdownItem 
                            icon={ExternalLink} 
                            onClick={() => { close(); alert(`Open in new tab: ${chat.id}`); }}
                          >
                            Open in New Tab
                          </DropdownItem>
                          <div className="border-t border-neutral-100 my-1" />
                          <DropdownItem 
                            icon={Trash2} 
                            variant="danger"
                            onClick={() => { 
                              close(); 
                              if(confirm('Delete this chat?')) {
                                setChats(prev => prev.filter(c => c.id !== chat.id));
                              }
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Stats Summary */}
      {!isLoading && filteredChats.length > 0 && (
        <div className="text-sm text-neutral-500 text-center">
          Showing {filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default ChatHistoryPage