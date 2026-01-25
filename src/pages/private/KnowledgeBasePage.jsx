import { useState } from 'react'
import { Card, Button } from '@/components/ui'
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
  AlertCircle
} from 'lucide-react'

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const knowledgeBases = [
    {
      id: 1,
      name: 'Product Documentation',
      type: 'documents',
      sources: 24,
      lastSync: '2 hours ago',
      status: 'synced',
      agents: ['Support Bot', 'Sales Assistant']
    },
    {
      id: 2,
      name: 'FAQ Database',
      type: 'website',
      sources: 156,
      lastSync: '30 min ago',
      status: 'synced',
      agents: ['Support Bot']
    },
    {
      id: 3,
      name: 'Pricing Information',
      type: 'documents',
      sources: 8,
      lastSync: '1 day ago',
      status: 'needs-update',
      agents: ['Sales Assistant', 'Lead Qualification']
    },
    {
      id: 4,
      name: 'Company Policies',
      type: 'documents',
      sources: 12,
      lastSync: '3 hours ago',
      status: 'synced',
      agents: ['HR Bot', 'Support Bot']
    },
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Knowledge Base</h1>
          <p className="text-neutral-500">Manage data sources for your AI agents</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Knowledge Base
        </Button>
      </div>

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

      {/* Knowledge Base Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {knowledgeBases.map((kb) => {
          const TypeIcon = getTypeIcon(kb.type)
          return (
            <Card key={kb.id} padding="lg" hover className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{kb.name}</h3>
                    <p className="text-sm text-neutral-500 capitalize">{kb.type}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-neutral-50 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-neutral-900">{kb.sources}</p>
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
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-7 h-7 text-neutral-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-1">Add Knowledge Base</h3>
            <p className="text-sm text-neutral-500">Upload documents or connect a website</p>
          </div>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card padding="lg" className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Database className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">💡 Pro Tip</h3>
            <p className="text-sm text-neutral-600">
              Keep your knowledge bases up-to-date for better AI responses. Enable auto-sync to automatically 
              refresh content from connected websites and documents.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default KnowledgeBasePage
