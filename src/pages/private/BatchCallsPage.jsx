import { useState, useEffect } from 'react'
import { monitorApi, agentsApi } from '@/services/api'
import { Dropdown, DropdownItem } from '@/components/ui'
import { 
  PhoneCall, 
  Plus, 
  Play, 
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ArrowRight,
  MoreVertical,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  Upload,
  FileText,
  Trash2,
  Eye,
  Copy,
  Edit
} from 'lucide-react'

const BatchCallsPage = () => {
  const [stats, setStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    total_calls: 0,
    success_rate: 0
  })
  const [campaigns, setCampaigns] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal states
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    agent_id: '',
    contacts_file: null,
    schedule_type: 'immediate'
  })

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsRes, campaignsRes, agentsRes] = await Promise.all([
        monitorApi.getBatchStats(),
        monitorApi.getBatchCampaigns(10),
        agentsApi.list({})
      ])
      setStats(statsRes)
      setCampaigns(campaignsRes.campaigns || [])
      setAgents(agentsRes.items || [])
    } catch (err) {
      console.error('Failed to fetch batch calls:', err)
      setError('Failed to load batch calls data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateCampaign = async (e) => {
    e.preventDefault()
    if (!newCampaign.name.trim() || !newCampaign.agent_id) return
    
    setIsCreating(true)
    try {
      // Simulate API call - replace with actual API when available
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add to campaigns list locally for demo
      const selectedAgent = agents.find(a => a.id === newCampaign.agent_id)
      setCampaigns(prev => [{
        id: Date.now().toString(),
        name: newCampaign.name,
        agent: selectedAgent?.name || 'Unknown Agent',
        status: 'scheduled',
        total_calls: 0,
        completed: 0,
        successful: 0,
        failed: 0,
        created_at: new Date().toISOString().split('T')[0],
        progress: 0
      }, ...prev])
      
      setShowNewCampaignModal(false)
      setNewCampaign({ name: '', agent_id: '', contacts_file: null, schedule_type: 'immediate' })
      
      // Refresh data
      fetchData()
    } catch (err) {
      console.error('Failed to create campaign:', err)
      alert('Failed to create campaign')
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      paused: 'bg-neutral-100 text-neutral-700',
      failed: 'bg-red-100 text-red-700'
    }
    const labels = {
      completed: 'Completed',
      in_progress: 'In Progress',
      scheduled: 'Scheduled',
      paused: 'Paused',
      failed: 'Failed'
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Batch Calls</h1>
          <p className="text-neutral-600 text-sm">Create and manage automated calling campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={() => setShowNewCampaignModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Total Campaigns</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.total_campaigns}</div>
        </div>
        
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Active Campaigns</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.active_campaigns}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Total Calls Made</span>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.total_calls.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Success Rate</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.success_rate}%</div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">Campaigns</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <PhoneCall className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No campaigns yet</h3>
            <p className="text-neutral-500 mb-6 text-sm">Create your first batch calling campaign</p>
            <button 
              onClick={() => setShowNewCampaignModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
            >
              <Plus className="w-5 h-5" />
              New Campaign
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <PhoneCall className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{campaign.name}</h3>
                      <p className="text-sm text-neutral-500">Agent: {campaign.agent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(campaign.status)}
                    <Dropdown
                      trigger={
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-neutral-400" />
                        </button>
                      }
                    >
                      {(close) => (
                        <>
                          <DropdownItem 
                            icon={Eye} 
                            onClick={() => { close(); alert(`View campaign: ${campaign.name}`); }}
                          >
                            View Details
                          </DropdownItem>
                          <DropdownItem 
                            icon={campaign.status === 'in_progress' ? Pause : Play} 
                            onClick={() => { close(); alert(`${campaign.status === 'in_progress' ? 'Pause' : 'Resume'} campaign`); }}
                          >
                            {campaign.status === 'in_progress' ? 'Pause Campaign' : 'Resume Campaign'}
                          </DropdownItem>
                          <DropdownItem 
                            icon={Copy} 
                            onClick={() => { close(); alert(`Duplicate campaign: ${campaign.name}`); }}
                          >
                            Duplicate
                          </DropdownItem>
                          <DropdownItem 
                            icon={Edit} 
                            onClick={() => { close(); alert(`Edit campaign: ${campaign.name}`); }}
                          >
                            Edit
                          </DropdownItem>
                          <div className="border-t border-neutral-100 my-1" />
                          <DropdownItem 
                            icon={Trash2} 
                            variant="danger"
                            onClick={() => { 
                              close(); 
                              if(confirm(`Delete campaign "${campaign.name}"?`)) {
                                setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                              }
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-600">Progress</span>
                    <span className="font-medium text-neutral-900">
                      {campaign.completed} / {campaign.total_calls} calls ({campaign.progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-neutral-600">{campaign.successful} successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-neutral-600">{campaign.failed} failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Created {campaign.created_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-6">
        <h3 className="font-semibold text-neutral-900 mb-2">Getting Started with Batch Calls</h3>
        <p className="text-neutral-600 text-sm mb-4">
          Upload a CSV with phone numbers, select an agent, and schedule your campaign.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">1</div>
            <span>Upload contacts (CSV)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-300 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">2</div>
            <span>Select AI agent</span>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-300 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">3</div>
            <span>Schedule & launch</span>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Create New Campaign</h2>
              <button 
                onClick={() => setShowNewCampaignModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g., Q1 Lead Follow-up"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Agent *
                </label>
                <select
                  value={newCampaign.agent_id}
                  onChange={(e) => setNewCampaign({ ...newCampaign, agent_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                >
                  <option value="">Choose an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Upload Contacts (CSV)
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setNewCampaign({ ...newCampaign, contacts_file: e.target.files[0] })}
                    className="hidden"
                    id="contacts-upload"
                  />
                  <label htmlFor="contacts-upload" className="cursor-pointer">
                    {newCampaign.contacts_file ? (
                      <div className="flex items-center justify-center gap-2 text-primary-600">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">{newCampaign.contacts_file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-neutral-400 mt-1">CSV file with phone numbers</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Schedule
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewCampaign({ ...newCampaign, schedule_type: 'immediate' })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      newCampaign.schedule_type === 'immediate'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Start Immediately
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCampaign({ ...newCampaign, schedule_type: 'scheduled' })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      newCampaign.schedule_type === 'scheduled'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Schedule Later
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newCampaign.name.trim() || !newCampaign.agent_id}
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
                      Create Campaign
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

export default BatchCallsPage