import { useState, useEffect } from 'react'
import { agentsApi } from '@/services/api'
import {
  Phone,
  Plus,
  Search,
  Loader2,
  Trash2,
  Link2,
  CheckCircle,
  XCircle,
  Bot,
  Edit
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')

// Voice API
const voiceApi = {
  searchNumbers: async (country = 'US', areaCode = null) => {
    const params = new URLSearchParams({ country })
    if (areaCode) params.append('area_code', areaCode)
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers/available?${params}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to search numbers')
    return response.json()
  },
  addExistingNumber: async (phoneNumber, friendlyName, agentId) => {
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ phone_number: phoneNumber, friendly_name: friendlyName, agent_id: agentId })
    })
    if (!response.ok) throw new Error('Failed to add number')
    return response.json()
  },
  purchaseNumber: async (phoneNumber, friendlyName, agentId) => {
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ phone_number: phoneNumber, friendly_name: friendlyName, agent_id: agentId })
    })
    if (!response.ok) throw new Error('Failed to purchase number')
    return response.json()
  },
  listNumbers: async () => {
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to list numbers')
    return response.json()
  },
  assignNumber: async (phoneNumberId, agentId) => {
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers/${phoneNumberId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ agent_id: agentId })
    })
    if (!response.ok) throw new Error('Failed to assign number')
    return response.json()
  },
  releaseNumber: async (phoneNumberId) => {
    const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers/${phoneNumberId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to release number')
    return response.json()
  },
}

const PhoneNumbersPage = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Add number modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [addMode, setAddMode] = useState('existing') // 'existing' or 'search'
  const [phoneInput, setPhoneInput] = useState('')
  const [friendlyName, setFriendlyName] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  // Search mode state
  const [searchCountry, setSearchCountry] = useState('US')
  const [searchAreaCode, setSearchAreaCode] = useState('')
  const [availableNumbers, setAvailableNumbers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(null)
  
  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assigningNumber, setAssigningNumber] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [numbersRes, agentsRes] = await Promise.all([
        voiceApi.listNumbers(),
        agentsApi.list({})
      ])
      setPhoneNumbers(numbersRes.phone_numbers || [])
      setAgents(agentsRes.items || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExistingNumber = async () => {
    if (!phoneInput.trim()) {
      setError('Please enter a phone number')
      return
    }
    
    // Format phone number
    let formattedNumber = phoneInput.trim()
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+1' + formattedNumber.replace(/\D/g, '')
    }
    
    setIsAdding(true)
    setError('')
    try {
      await voiceApi.addExistingNumber(
        formattedNumber,
        friendlyName || 'Voice Line',
        selectedAgent || null
      )
      setShowAddModal(false)
      setPhoneInput('')
      setFriendlyName('')
      setSelectedAgent('')
      setSuccessMessage('Phone number added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await fetchData()
    } catch (err) {
      setError('Failed to add number: ' + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleSearchNumbers = async () => {
    setIsSearching(true)
    setError('')
    try {
      const result = await voiceApi.searchNumbers(searchCountry, searchAreaCode || null)
      setAvailableNumbers(result.numbers || [])
      if (result.numbers?.length === 0) {
        setError('No numbers found. Try a different area code.')
      }
    } catch (err) {
      setError('Failed to search numbers. Check your Twilio credentials.')
    } finally {
      setIsSearching(false)
    }
  }

  const handlePurchaseNumber = async () => {
    if (!selectedNumber) return
    setIsAdding(true)
    try {
      await voiceApi.purchaseNumber(
        selectedNumber.phone_number,
        friendlyName || selectedNumber.friendly_name,
        selectedAgent || null
      )
      setShowAddModal(false)
      setSelectedNumber(null)
      setFriendlyName('')
      setSelectedAgent('')
      setAvailableNumbers([])
      setSuccessMessage('Phone number purchased successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await fetchData()
    } catch (err) {
      setError('Failed to purchase number')
    } finally {
      setIsAdding(false)
    }
  }

  const handleAssignNumber = async () => {
    if (!assigningNumber || !selectedAgent) return
    try {
      await voiceApi.assignNumber(assigningNumber.id, selectedAgent)
      setShowAssignModal(false)
      setAssigningNumber(null)
      setSelectedAgent('')
      setSuccessMessage('Number assigned to agent!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await fetchData()
    } catch (err) {
      setError('Failed to assign number')
    }
  }

  const handleReleaseNumber = async (phoneNumber) => {
    if (!confirm(`Are you sure you want to remove ${phoneNumber.phone_number}?`)) return
    try {
      await voiceApi.releaseNumber(phoneNumber.id)
      setSuccessMessage('Phone number removed!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await fetchData()
    } catch (err) {
      setError('Failed to remove number')
    }
  }

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unassigned'
  }

  const resetModal = () => {
    setShowAddModal(false)
    setAddMode('existing')
    setPhoneInput('')
    setFriendlyName('')
    setSelectedAgent('')
    setAvailableNumbers([])
    setSelectedNumber(null)
    setSearchAreaCode('')
    setError('')
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
          <h1 className="text-2xl font-bold text-neutral-900">Phone Numbers</h1>
          <p className="text-neutral-500 mt-1">Manage your voice-enabled phone numbers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Add Number
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">&times;</button>
        </div>
      )}

      {/* Phone Numbers List */}
      {phoneNumbers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900">No phone numbers yet</h3>
          <p className="text-neutral-500 mt-1 mb-4">Add a phone number to enable voice calls</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Add Your First Number
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {phoneNumbers.map(pn => (
            <div key={pn.id} className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{pn.phone_number}</h3>
                    <p className="text-sm text-neutral-500">{pn.friendly_name || 'No name'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {pn.status === 'active' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${pn.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {pn.status}
                    </span>
                  </div>
                  
                  {/* Assigned Agent */}
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <Bot className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      {pn.agent_id ? getAgentName(pn.agent_id) : 'Unassigned'}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setAssigningNumber(pn); setSelectedAgent(pn.agent_id || ''); setShowAssignModal(true) }}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="Assign to agent"
                    >
                      <Link2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReleaseNumber(pn)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove number"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Capabilities */}
              <div className="flex gap-3 mt-4">
                {(pn.capabilities?.voice || pn.voice_enabled) && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Voice</span>
                )}
                {(pn.capabilities?.sms || pn.sms_enabled) && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">SMS</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Number Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add Phone Number</h2>
            
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAddMode('existing')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  addMode === 'existing' 
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500' 
                    : 'bg-neutral-100 text-neutral-600 border-2 border-transparent hover:bg-neutral-200'
                }`}
              >
                Add Existing Number
              </button>
              <button
                onClick={() => setAddMode('search')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  addMode === 'search' 
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500' 
                    : 'bg-neutral-100 text-neutral-600 border-2 border-transparent hover:bg-neutral-200'
                }`}
              >
                Buy New Number
              </button>
            </div>
            
            {/* Add Existing Number Form */}
            {addMode === 'existing' && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-500 mb-4">
                  Add a phone number you already own in Twilio
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+14847298802"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-neutral-400 mt-1">Include country code (e.g., +1 for US)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Friendly Name</label>
                  <input
                    type="text"
                    value={friendlyName}
                    onChange={(e) => setFriendlyName(e.target.value)}
                    placeholder="e.g., Sales Line, Support"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Assign to Agent (optional)</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select an agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetModal}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExistingNumber}
                    disabled={isAdding || !phoneInput.trim()}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Number
                  </button>
                </div>
              </div>
            )}
            
            {/* Buy New Number Form */}
            {addMode === 'search' && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-500 mb-4">
                  Search and buy a new phone number from Twilio
                </p>
                
                {/* Search */}
                <div className="flex gap-3">
                  <select
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    className="px-3 py-2 border border-neutral-300 rounded-lg"
                  >
                    <option value="US">US (+1)</option>
                    <option value="GB">UK (+44)</option>
                    <option value="CA">Canada (+1)</option>
                    <option value="AU">Australia (+61)</option>
                  </select>
                  <input
                    type="text"
                    value={searchAreaCode}
                    onChange={(e) => setSearchAreaCode(e.target.value)}
                    placeholder="Area code (optional)"
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                  <button
                    onClick={handleSearchNumbers}
                    disabled={isSearching}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Search
                  </button>
                </div>
                
                {/* Available Numbers */}
                {availableNumbers.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg p-2">
                    {availableNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedNumber(num)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedNumber?.phone_number === num.phone_number
                            ? 'bg-primary-50 border-2 border-primary-500'
                            : 'bg-neutral-50 border-2 border-transparent hover:bg-neutral-100'
                        }`}
                      >
                        <p className="font-medium">{num.phone_number}</p>
                        <p className="text-sm text-neutral-500">{num.locality}, {num.region}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Purchase Form */}
                {selectedNumber && (
                  <div className="border-t border-neutral-200 pt-4 space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-700">Selected: {selectedNumber.phone_number}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Friendly Name</label>
                      <input
                        type="text"
                        value={friendlyName}
                        onChange={(e) => setFriendlyName(e.target.value)}
                        placeholder="e.g., Sales Line"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Assign to Agent</label>
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      >
                        <option value="">Select an agent...</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetModal}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchaseNumber}
                    disabled={isAdding || !selectedNumber}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                    Purchase Number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && assigningNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Assign Phone Number</h2>
            <p className="text-neutral-600 mb-4">
              Assign <strong>{assigningNumber.phone_number}</strong> to an agent
            </p>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg mb-4"
            >
              <option value="">Select an agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowAssignModal(false); setAssigningNumber(null); setSelectedAgent('') }}
                className="px-4 py-2 border border-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignNumber}
                disabled={!selectedAgent}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneNumbersPage