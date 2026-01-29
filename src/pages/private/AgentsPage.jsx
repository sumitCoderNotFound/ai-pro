import { useState, useEffect } from 'react'
import { agentsApi } from '@/services/api'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Play, 
  Pause, 
  Edit2, 
  Trash2, 
  Copy,
  Bot,
  Phone,
  MessageSquare,
  Mail,
  Video,
  AlertCircle,
  X
} from 'lucide-react'

// Agent Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    paused: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    draft: { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
    archived: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  }
  
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft'}
    </span>
  )
}

// Channel Icon Component
const ChannelIcon = ({ channel, className = "w-4 h-4" }) => {
  const icons = {
    voice: Phone,
    chat: MessageSquare,
    sms: Mail,
    video: Video,
  }
  const Icon = icons[channel] || MessageSquare
  return <Icon className={className} />
}

// Create/Edit Agent Modal
const AgentModal = ({ isOpen, onClose, agent, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agent_type: 'single_prompt',  // Fixed: correct value
    channels: ['chat'],
    llm_provider: 'openai',
    llm_model: 'gpt-4',
    temperature: 0.7,
    system_prompt: '',
    welcome_message: '',
    language: 'en',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        description: agent.description || '',
        agent_type: agent.agent_type || 'single_prompt',
        channels: agent.channels || ['chat'],
        llm_provider: agent.llm_provider || 'openai',
        llm_model: agent.llm_model || 'gpt-4',
        temperature: agent.temperature || 0.7,
        system_prompt: agent.system_prompt || '',
        welcome_message: agent.welcome_message || '',
        language: agent.language || 'en',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        agent_type: 'single_prompt',
        channels: ['chat'],
        llm_provider: 'openai',
        llm_model: 'gpt-4',
        temperature: 0.7,
        system_prompt: '',
        welcome_message: '',
        language: 'en',
      })
    }
    setError('')
  }, [agent, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name.trim()) {
      setError('Agent name is required')
      return
    }

    if (formData.channels.length === 0) {
      setError('Select at least one channel')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save agent')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {agent ? 'Edit Agent' : 'Create New Agent'}
            </h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Customer Support Bot"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What does this agent do?"
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Agent Type - Updated with correct values */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">Agent Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'single_prompt', label: 'Single Prompt', desc: 'Simple Q&A agent' },
                  { value: 'conversation_flow', label: 'Conversation Flow', desc: 'Multi-step dialogs' },
                  { value: 'multi_prompt', label: 'Multi Prompt', desc: 'Multiple prompts' },
                  { value: 'custom_llm', label: 'Custom LLM', desc: 'Custom model' },
                ].map(type => (
                  <label
                    key={type.value}
                    className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.agent_type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="agent_type"
                      value={type.value}
                      checked={formData.agent_type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-neutral-500">{type.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">Channels *</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'voice', label: 'Voice', icon: Phone },
                  { id: 'chat', label: 'Chat', icon: MessageSquare },
                  { id: 'sms', label: 'SMS', icon: Mail },
                  { id: 'video', label: 'Video', icon: Video },
                ].map(channel => (
                  <label
                    key={channel.id}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.channels.includes(channel.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(channel.id)}
                      onChange={() => handleChannelToggle(channel.id)}
                      className="sr-only"
                    />
                    <channel.icon className={`w-6 h-6 ${
                      formData.channels.includes(channel.id) ? 'text-primary-600' : 'text-neutral-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      formData.channels.includes(channel.id) ? 'text-primary-700' : 'text-neutral-600'
                    }`}>{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">AI Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    LLM Provider
                  </label>
                  <select
                    name="llm_provider"
                    value={formData.llm_provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Model
                  </label>
                  <select
                    name="llm_model"
                    value={formData.llm_model}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Temperature: {formData.temperature}
                </label>
                <input
                  type="range"
                  name="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            {/* Prompts */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">Prompts</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  System Prompt
                </label>
                <textarea
                  name="system_prompt"
                  value={formData.system_prompt}
                  onChange={handleChange}
                  placeholder="Define your agent's personality, capabilities, and behavior..."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Welcome Message
                </label>
                <textarea
                  name="welcome_message"
                  value={formData.welcome_message}
                  onChange={handleChange}
                  placeholder="Hi! How can I help you today?"
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, agent, onConfirm, isLoading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Agent</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete <strong>"{agent?.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Agent Card Component
const AgentCard = ({ agent, onEdit, onDelete, onToggleStatus, onDuplicate }) => {
  const [showMenu, setShowMenu] = useState(false)

  const agentTypeLabels = {
    single_prompt: 'Single Prompt',
    conversation_flow: 'Conversation Flow',
    multi_prompt: 'Multi Prompt',
    custom_llm: 'Custom LLM',
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{agent.name}</h3>
            <p className="text-sm text-neutral-500">{agentTypeLabels[agent.agent_type] || agent.agent_type}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <MoreVertical className="w-5 h-5 text-neutral-400" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-10">
                <button
                  onClick={() => { onEdit(agent); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { onDuplicate(agent); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                {agent.status === 'active' ? (
                  <button
                    onClick={() => { onToggleStatus(agent, 'pause'); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                  >
                    <Pause className="w-4 h-4" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={() => { onToggleStatus(agent, 'activate'); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                  >
                    <Play className="w-4 h-4" /> Activate
                  </button>
                )}
                <hr className="my-1" />
                <button
                  onClick={() => { onDelete(agent); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {agent.description && (
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{agent.description}</p>
      )}

      <div className="flex items-center gap-2 mb-4">
        {agent.channels?.map(channel => (
          <div 
            key={channel} 
            className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-lg text-xs text-neutral-600"
          >
            <ChannelIcon channel={channel} className="w-3 h-3" />
            <span className="capitalize">{channel}</span>
          </div>
        ))}
        {(!agent.channels || agent.channels.length === 0) && (
          <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-lg text-xs text-neutral-600">
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <StatusBadge status={agent.status} />
        <span className="text-xs text-neutral-500">
          {agent.llm_model || 'gpt-4'}
        </span>
      </div>
    </div>
  )
}

// Main Agents Page
const AgentsPage = () => {
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [deletingAgent, setDeletingAgent] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch agents
  const fetchAgents = async () => {
    try {
      setIsLoading(true)
      setError('')
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter) params.status = statusFilter
      
      const response = await agentsApi.list(params)
      setAgents(response.items || [])
    } catch (err) {
      console.error('Failed to fetch agents:', err)
      setError(err.message || 'Failed to fetch agents')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [searchQuery, statusFilter])

  // Create agent
  const handleCreate = async (data) => {
    await agentsApi.create(data)
    await fetchAgents()
  }

  // Update agent
  const handleUpdate = async (data) => {
    await agentsApi.update(editingAgent.id, data)
    setEditingAgent(null)
    await fetchAgents()
  }

  // Delete agent
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await agentsApi.delete(deletingAgent.id)
      setDeletingAgent(null)
      await fetchAgents()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  // Toggle agent status
  const handleToggleStatus = async (agent, action) => {
    try {
      if (action === 'activate') {
        await agentsApi.activate(agent.id)
      } else {
        await agentsApi.pause(agent.id)
      }
      await fetchAgents()
    } catch (err) {
      setError(err.message)
    }
  }

  // Duplicate agent
  const handleDuplicate = async (agent) => {
    try {
      await agentsApi.duplicate(agent.id, `${agent.name} (Copy)`)
      await fetchAgents()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Agents</h1>
          <p className="text-neutral-500">Manage your AI agents and their configurations</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Agent
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : agents.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
          <Bot className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No agents yet</h3>
          <p className="text-neutral-500 mb-6">Create your first AI agent to get started</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </button>
        </div>
      ) : (
        /* Agents Grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={setEditingAgent}
              onDelete={setDeletingAgent}
              onToggleStatus={handleToggleStatus}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        agent={null}
        onSave={handleCreate}
      />

      {/* Edit Modal */}
      <AgentModal
        isOpen={!!editingAgent}
        onClose={() => setEditingAgent(null)}
        agent={editingAgent}
        onSave={handleUpdate}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deletingAgent}
        onClose={() => setDeletingAgent(null)}
        agent={deletingAgent}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AgentsPage