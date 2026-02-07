import { useState, useEffect } from 'react'
import { Card, Button, Dropdown, DropdownItem } from '@/components/ui'
import { knowledgeBaseApi, agentsApi } from '@/services/api'
import { 
  Database,
  Plus,
  Search,
  Upload,
  FileText,
  Globe,
  Link2,
  MoreVertical,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  File,
  Settings
} from 'lucide-react'

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [knowledgeBases, setKnowledgeBases] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newKB, setNewKB] = useState({
    name: '',
    description: '',
    kb_type: 'documents'
  })

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [kbRes, agentsRes] = await Promise.all([
        knowledgeBaseApi.list(),
        agentsApi.list({})
      ])
      
      const kbData = (kbRes || []).map(kb => {
        const connectedAgents = (agentsRes.items || [])
          .filter(agent => agent.knowledge_base_id === kb.id)
          .map(agent => agent.name)
        
        const lastUpdate = kb.updated_at ? getTimeAgo(kb.updated_at) : 'Never'
        
        return {
          id: kb.id,
          name: kb.name,
          type: kb.kb_type || 'documents',
          sources: parseInt(kb.document_count || '0'),
          lastSync: lastUpdate,
          status: kb.status === 'ready' || kb.status === 'synced' ? 'synced' : 
                  kb.status === 'processing' ? 'syncing' : 'needs-update',
          agents: connectedAgents.length > 0 ? connectedAgents : ['Not connected']
        }
      })
      
      setKnowledgeBases(kbData)
      setAgents(agentsRes.items || [])
    } catch (err) {
      console.error('Failed to fetch knowledge bases:', err)
      setError('Failed to load knowledge bases')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateKB = async (e) => {
    e.preventDefault()
    if (!newKB.name.trim()) return
    
    setIsCreating(true)
    try {
      await knowledgeBaseApi.create(newKB)
      setShowAddModal(false)
      setNewKB({ name: '', description: '', kb_type: 'documents' })
      fetchData()
    } catch (err) {
      console.error('Failed to create knowledge base:', err)
      alert('Failed to create knowledge base')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKB = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return
    
    try {
      await knowledgeBaseApi.delete(id)
      fetchData()
    } catch (err) {
      console.error('Failed to delete knowledge base:', err)
      alert('Failed to delete knowledge base')
    }
  }

  const handleSyncKB = async (id) => {
    // Update status locally to show syncing
    setKnowledgeBases(prev => prev.map(kb => 
      kb.id === id ? { ...kb, status: 'syncing' } : kb
    ))
    
    // Simulate sync - replace with actual API call
    setTimeout(() => {
      setKnowledgeBases(prev => prev.map(kb => 
        kb.id === id ? { ...kb, status: 'synced', lastSync: 'Just now' } : kb
      ))
    }, 2000)
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'documents': return FileText
      case 'website': return Globe
      case 'api': return Link2
      default: return Database
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'synced':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Synced
          </span>
        )
      case 'syncing':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Syncing
          </span>
        )
      case 'needs-update':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Needs Update
          </span>
        )
      default:
        return null
    }
  }

  const filteredKnowledgeBases = knowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Knowledge Base</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage data sources for your AI agents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge Base
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search knowledge bases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredKnowledgeBases.map((kb) => {
            const TypeIcon = getTypeIcon(kb.type)
            return (
              <Card key={kb.id} padding="lg" hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-base">{kb.name}</h3>
                      <p className="text-sm text-neutral-500 capitalize">{kb.type}</p>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <Dropdown
                    trigger={
                      <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                    }
                  >
                    {(close) => (
                      <>
                        <DropdownItem 
                          icon={Eye} 
                          onClick={() => { close(); alert(`View ${kb.name}`); }}
                        >
                          View Details
                        </DropdownItem>
                        <DropdownItem 
                          icon={Edit} 
                          onClick={() => { close(); alert(`Edit ${kb.name}`); }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem 
                          icon={RefreshCw} 
                          onClick={() => { close(); handleSyncKB(kb.id); }}
                        >
                          Sync Now
                        </DropdownItem>
                        <DropdownItem 
                          icon={Settings} 
                          onClick={() => { close(); alert(`Settings for ${kb.name}`); }}
                        >
                          Settings
                        </DropdownItem>
                        <div className="border-t border-neutral-100 my-1" />
                        <DropdownItem 
                          icon={Trash2} 
                          variant="danger"
                          onClick={() => { close(); handleDeleteKB(kb.id, kb.name); }}
                        >
                          Delete
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-neutral-50 rounded-xl px-4 py-3">
                    <p className="text-xl font-bold text-neutral-900">{kb.sources}</p>
                    <p className="text-xs text-neutral-500">Sources</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{kb.lastSync}</span>
                    </div>
                    <p className="text-xs text-neutral-500">Last Sync</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(kb.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Used by:</span>
                    <div className="flex -space-x-2">
                      {kb.agents.slice(0, 2).map((agent, idx) => (
                        <div 
                          key={idx}
                          className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-[10px] font-medium text-primary-700 border-2 border-white"
                          title={agent}
                        >
                          {agent.charAt(0)}
                        </div>
                      ))}
                      {kb.agents.length > 2 && (
                        <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-[10px] font-medium text-neutral-600 border-2 border-white">
                          +{kb.agents.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}

          {/* Add New Card */}
          <Card 
            padding="lg" 
            className="border-2 border-dashed border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer transition-all flex items-center justify-center min-h-[200px]"
            onClick={() => setShowAddModal(true)}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-7 h-7 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1 text-base">Add Knowledge Base</h3>
              <p className="text-sm text-neutral-500">Upload documents or connect a website</p>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredKnowledgeBases.length === 0 && !error && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No knowledge bases yet</h3>
          <p className="text-neutral-500 mb-6 text-sm">Create your first knowledge base to enhance your AI agents</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge Base
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <Card padding="lg" className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Database className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1 text-base">Pro Tip</h3>
            <p className="text-sm text-neutral-600">
              Keep your knowledge bases up-to-date for better AI responses. Enable auto-sync to automatically 
              refresh content from connected websites and documents.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Knowledge Base Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Add Knowledge Base</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateKB} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newKB.name}
                  onChange={(e) => setNewKB({ ...newKB, name: e.target.value })}
                  placeholder="e.g., Product Documentation"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newKB.description}
                  onChange={(e) => setNewKB({ ...newKB, description: e.target.value })}
                  placeholder="Brief description of this knowledge base..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'documents', label: 'Documents', icon: FileText },
                    { value: 'website', label: 'Website', icon: Globe },
                    { value: 'api', label: 'API', icon: Link2 }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewKB({ ...newKB, kb_type: type.value })}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        newKB.kb_type === type.value 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 ${newKB.kb_type === type.value ? 'text-primary-600' : 'text-neutral-400'}`} />
                      <span className={`text-sm font-medium ${newKB.kb_type === type.value ? 'text-primary-700' : 'text-neutral-600'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newKB.name.trim()}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Knowledge Base
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default KnowledgeBasePage