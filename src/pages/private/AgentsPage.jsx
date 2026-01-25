import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import CreateAgentModal from '@/components/modals/CreateAgentModal'
import { 
  Bot, 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  MessageSquare,
  Import,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  FileText,
  Users,
  Settings,
  Copy,
  Trash2,
  Edit,
  Filter
} from 'lucide-react'

const AgentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createAgentType, setCreateAgentType] = useState(null) // 'voice' or 'chat'
  const [expandedFolders, setExpandedFolders] = useState(['all'])
  const [activeMenu, setActiveMenu] = useState(null)

  const folders = [
    { id: 'all', name: 'All Agents', count: 8 },
    { id: 'templates', name: 'Template Agents', count: 3, icon: FileText },
  ]

  const transferAgents = [
    { id: 'screening', name: 'Transfer Screening Agents', count: 2 },
  ]

  const agents = [
    {
      id: 1,
      name: 'Admission Assistant',
      type: 'Single Prompt',
      category: 'voice',
      phone: '+1 (555) 123-4567',
      creator: { name: 'John', avatar: 'J' },
      updatedAt: '01/25/2026, 14:30',
    },
    {
      id: 2,
      name: 'Support Chat Agent',
      type: 'Conversation Flow',
      category: 'chat',
      phone: '-',
      creator: { name: 'Sarah', avatar: 'S' },
      updatedAt: '01/25/2026, 12:15',
    },
    {
      id: 3,
      name: 'Healthcare Check-In',
      type: 'Single Prompt',
      category: 'voice',
      phone: '-',
      creator: { name: 'Kate', avatar: 'K' },
      updatedAt: '01/24/2026, 12:09',
    },
    {
      id: 4,
      name: 'Lead Qualification Bot',
      type: 'Multi-Prompt',
      category: 'voice',
      phone: '+1 (555) 987-6543',
      creator: { name: 'Mike', avatar: 'M' },
      updatedAt: '01/24/2026, 10:45',
    },
    {
      id: 5,
      name: 'Patient Screening',
      type: 'Conversation Flow',
      category: 'voice',
      phone: '-',
      creator: { name: 'John', avatar: 'J' },
      updatedAt: '01/24/2026, 09:30',
    },
  ]

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateAgent = (type) => {
    setCreateAgentType(type)
    setShowCreateModal(true)
  }

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Sidebar - Folders */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-neutral-200 h-full flex flex-col">
          {/* All Agents */}
          <div className="p-2">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary-50 text-primary-700 rounded-xl"
            >
              <Bot className="w-5 h-5" />
              <span className="font-medium">All Agents</span>
            </button>
          </div>

          {/* Folders Section */}
          <div className="px-4 py-3 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Folders</span>
              <button className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="text-sm">Template Agents</span>
              </button>
            </div>
          </div>

          {/* Transfer Agents Section */}
          <div className="px-4 py-3 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Transfer Agents</span>
            <div className="mt-2 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">
                <Users className="w-4 h-4 text-neutral-400" />
                <span className="text-sm">Transfer Screening Agents</span>
              </button>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Actions */}
          <div className="p-4 border-t border-neutral-100">
            <div className="text-xs text-neutral-400 text-center">
              {agents.length} agents total
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">All Agents</h1>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Import */}
            <Button variant="outline" leftIcon={<Import className="w-4 h-4" />}>
              Import
            </Button>

            {/* Create Agent Dropdown */}
            <div className="relative group">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Create an Agent
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button 
                  onClick={() => handleCreateAgent('voice')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  Voice Agent
                </button>
                <button 
                  onClick={() => handleCreateAgent('chat')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  Chat Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 flex-1 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Agent Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Agent Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Voice
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Edited by
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAgents.map((agent) => (
                <tr 
                  key={agent.id} 
                  className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        agent.category === 'voice' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {agent.category === 'voice' ? (
                          <Phone className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <span className="font-medium text-neutral-900">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-lg">
                      {agent.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs font-medium text-orange-600">
                        {agent.creator.avatar}
                      </div>
                      <span className="text-neutral-600">{agent.creator.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {agent.phone}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-sm">
                    {agent.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenu(activeMenu === agent.id ? null : agent.id)
                        }}
                        className="p-2 hover:bg-neutral-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                      
                      {activeMenu === agent.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenu(null)} 
                          />
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                              <Copy className="w-4 h-4" /> Duplicate
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                              <Settings className="w-4 h-4" /> Settings
                            </button>
                            <hr className="my-2 border-neutral-100" />
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAgents.length === 0 && (
            <div className="text-center py-16">
              <Bot className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">No agents found</h3>
              <p className="text-neutral-500 mb-4">Create your first agent to get started</p>
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
                Create Agent
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 gap-2">
          <button className="p-2 hover:bg-neutral-100 rounded-lg disabled:opacity-50" disabled>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm">1</span>
          <button className="p-2 hover:bg-neutral-100 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <CreateAgentModal 
          onClose={() => {
            setShowCreateModal(false)
            setCreateAgentType(null)
          }}
          initialType={createAgentType}
        />
      )}
    </div>
  )
}

export default AgentsPage
