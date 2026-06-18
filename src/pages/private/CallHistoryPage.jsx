import { useState, useEffect } from 'react'
import { agentsApi } from '@/services/api'
import EmptyState from '@/components/onboarding/EmptyState'
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Play,
  Pause,
  Loader2,
  Filter,
  FileText,
  Bot,
  User
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')

const voiceApi = {
  listCalls: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.agent_id) queryParams.append('agent_id', params.agent_id)
    if (params.direction) queryParams.append('direction', params.direction)
    if (params.status) queryParams.append('status', params.status)
    if (params.limit) queryParams.append('limit', params.limit)
    const response = await fetch(`${API_URL}/api/v1/voice/calls?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to list calls')
    return response.json()
  },
  getCall: async (callId) => {
    const response = await fetch(`${API_URL}/api/v1/voice/calls/${callId}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to get call')
    return response.json()
  },
}

const CallHistoryPage = () => {
  const [calls, setCalls] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filterDirection, setFilterDirection] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAgent, setFilterAgent] = useState('')
  const [playingAudio, setPlayingAudio] = useState(null)
  const [audioElement, setAudioElement] = useState(null)

  useEffect(() => {
    fetchData()
  }, [filterDirection, filterStatus, filterAgent])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [callsRes, agentsRes] = await Promise.all([
        voiceApi.listCalls({
          direction: filterDirection || undefined,
          status: filterStatus || undefined,
          agent_id: filterAgent || undefined,
          limit: 50
        }),
        agentsApi.list({})
      ])
      setCalls(callsRes || [])
      setAgents(agentsRes.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (call) => {
    try {
      const details = await voiceApi.getCall(call.id)
      setSelectedCall(details)
      setShowDetails(true)
    } catch (err) {
      console.error(err)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString()
  }

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'ringing': 'bg-yellow-100 text-yellow-700',
      'failed': 'bg-red-100 text-red-700',
      'no-answer': 'bg-orange-100 text-orange-700',
      'busy': 'bg-purple-100 text-purple-700',
    }
    return colors[status] || 'bg-neutral-100 text-neutral-700'
  }

  const getDirectionIcon = (direction) => {
    if (direction === 'inbound') return <PhoneIncoming className="w-4 h-4 text-green-600" />
    if (direction === 'outbound') return <PhoneOutgoing className="w-4 h-4 text-blue-600" />
    return <Phone className="w-4 h-4 text-neutral-600" />
  }

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown'
  }

  const playRecording = (url) => {
    if (playingAudio === url) {
      audioElement?.pause()
      setPlayingAudio(null)
    } else {
      if (audioElement) audioElement.pause()
      const audio = new Audio(url)
      audio.play()
      audio.onended = () => setPlayingAudio(null)
      setAudioElement(audio)
      setPlayingAudio(url)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Call History</h1>
          <p className="text-neutral-500 mt-1">View and analyze your voice call recordings</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
        >
          <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700">Filters:</span>
          </div>
          <select value={filterDirection} onChange={(e) => setFilterDirection(e.target.value)} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg">
            <option value="">All Directions</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="failed">Failed</option>
            <option value="no-answer">No Answer</option>
          </select>
          <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg">
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Total Calls</p>
          <p className="text-2xl font-bold text-neutral-900">{calls.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Inbound</p>
          <p className="text-2xl font-bold text-green-600">{calls.filter(c => c.direction === 'inbound').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Outbound</p>
          <p className="text-2xl font-bold text-blue-600">{calls.filter(c => c.direction === 'outbound').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Avg Duration</p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatDuration(Math.round(calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / (calls.length || 1)))}
          </p>
        </div>
      </div>

      {/* Call List */}
      {calls.length === 0 ? (
        <EmptyState
          emoji="📞"
          title="No calls yet"
          description="Your voice call history will appear here. Connect a phone number to your agent and start taking inbound calls or launch an outbound campaign."
          variant="calls"
          primaryAction={{ label: 'Connect a Phone Number', href: '/dashboard/phone-numbers' }}
          secondaryAction={{ label: 'Start a Batch Campaign', href: '/dashboard/batch-calls' }}
          tips={[
            'Make sure your agent is set to "Active" before it can receive calls.',
            'Use Batch Calls to proactively reach hundreds of contacts at once.',
            'Call recordings and transcripts are saved automatically for every conversation.',
          ]}
        />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Direction</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">From / To</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Agent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Duration</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(call => (
                <tr key={call.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getDirectionIcon(call.direction)}
                      <span className="text-sm capitalize">{call.direction}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="font-medium">{call.direction === 'inbound' ? call.from_number : call.to_number}</p>
                      <p className="text-neutral-500 text-xs">
                        {call.direction === 'inbound' ? `To: ${call.to_number}` : `From: ${call.from_number}`}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm">{call.agent_id ? getAgentName(call.agent_id) : '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      {formatDuration(call.duration_seconds)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {formatDate(call.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {call.recording_url && (
                        <button
                          onClick={() => playRecording(call.recording_url)}
                          className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                          title="Play recording"
                        >
                          {playingAudio === call.recording_url ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(call)}
                        className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="View details"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Call Details Modal */}
      {showDetails && selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Call Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-neutral-500 hover:text-neutral-700 text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">Direction</p>
                <div className="flex items-center gap-2 mt-1">
                  {getDirectionIcon(selectedCall.direction)}
                  <span className="font-medium capitalize">{selectedCall.direction}</span>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">Status</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCall.status)}`}>
                  {selectedCall.status}
                </span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">From</p>
                <p className="font-medium mt-1">{selectedCall.from_number}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">To</p>
                <p className="font-medium mt-1">{selectedCall.to_number}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">Duration</p>
                <p className="font-medium mt-1">{formatDuration(selectedCall.duration_seconds)}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">Agent</p>
                <p className="font-medium mt-1">{selectedCall.agent_id ? getAgentName(selectedCall.agent_id) : '-'}</p>
              </div>
            </div>
            
            {selectedCall.recording_url && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Recording</h3>
                <audio controls className="w-full" src={selectedCall.recording_url} />
              </div>
            )}
            
            {selectedCall.transcript && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Transcript</h3>
                <div className="p-4 bg-neutral-50 rounded-lg max-h-60 overflow-y-auto">
                  {selectedCall.transcript_segments ? (
                    <div className="space-y-3">
                      {selectedCall.transcript_segments.map((seg, idx) => (
                        <div key={idx} className={`flex gap-3 ${seg.role === 'user' ? '' : 'flex-row-reverse'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${seg.role === 'user' ? 'bg-blue-100' : 'bg-neutral-800'}`}>
                            {seg.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`max-w-[80%] rounded-xl px-4 py-2 ${seg.role === 'user' ? 'bg-blue-100' : 'bg-neutral-200'}`}>
                            <p className="text-sm">{seg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{selectedCall.transcript}</p>
                  )}
                </div>
              </div>
            )}
            
            {selectedCall.summary && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">AI Summary</h3>
                <p className="text-sm text-neutral-600 p-4 bg-neutral-50 rounded-lg">{selectedCall.summary}</p>
              </div>
            )}
            
            <div className="text-xs text-neutral-500 space-y-1">
              <p>Started: {formatDate(selectedCall.started_at)}</p>
              {selectedCall.answered_at && <p>Answered: {formatDate(selectedCall.answered_at)}</p>}
              {selectedCall.ended_at && <p>Ended: {formatDate(selectedCall.ended_at)}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CallHistoryPage