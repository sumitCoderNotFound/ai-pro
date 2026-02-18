import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  ArrowLeft,
  User,
  Bot,
  Loader2,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Sparkles,
  Zap,
  Globe,
  Shield
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const VoiceCallPage = () => {
  const { agentId } = useParams()
  const navigate = useNavigate()
  
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Phone numbers
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState('')
  
  // Call state
  const [callStatus, setCallStatus] = useState('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [callId, setCallId] = useState(null)
  const [callSid, setCallSid] = useState(null)
  
  // Phone number input
  const [toPhoneNumber, setToPhoneNumber] = useState('')
  
  const getToken = () => localStorage.getItem('convohubai_access_token')
  
  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/agents/${agentId}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        
        if (!response.ok) throw new Error('Failed to fetch agent')
        
        const data = await response.json()
        setAgent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAgent()
  }, [agentId])
  
  // Fetch phone numbers
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/voice/phone-numbers`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setPhoneNumbers(data.phone_numbers || [])
          
          const agentNumber = data.phone_numbers?.find(pn => pn.agent_id === agentId)
          if (agentNumber) {
            setSelectedPhoneNumberId(agentNumber.id)
          } else if (data.phone_numbers?.length > 0) {
            setSelectedPhoneNumberId(data.phone_numbers[0].id)
          }
        }
      } catch (err) {
        console.error('Error fetching phone numbers:', err)
      }
    }
    
    fetchPhoneNumbers()
  }, [agentId])
  
  // Call duration timer
  useEffect(() => {
    let interval
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatPhoneNumber = (number) => {
    if (!number) return ''
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return number
  }
  
  // Start outbound call
  const handleStartCall = async () => {
    if (!toPhoneNumber.trim()) {
      setError('Please enter a phone number to call')
      return
    }
    
    if (!selectedPhoneNumberId) {
      setError('Please select a phone number to call from')
      return
    }
    
    setError('')
    setSuccess('')
    setCallStatus('dialing')
    
    try {
      const response = await fetch(`${API_URL}/api/v1/voice/calls/outbound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          agent_id: agentId,
          to_number: toPhoneNumber,
          phone_number_id: selectedPhoneNumberId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to start call')
      }
      
      const data = await response.json()
      setCallId(data.call_id)
      setCallSid(data.call_sid)
      setCallStatus('ringing')
      setSuccess('Call initiated! Ringing...')
      
      pollCallStatus(data.call_id)
      
    } catch (err) {
      setError(err.message)
      setCallStatus('idle')
    }
  }
  
  // Poll call status
  const pollCallStatus = async (id) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/voice/calls/${id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'in-progress') {
            setCallStatus('connected')
            setSuccess('')
          } else if (['completed', 'busy', 'no-answer', 'failed', 'canceled'].includes(data.status)) {
            setCallStatus('ended')
            setCallDuration(data.duration_seconds || 0)
            setTimeout(() => {
              setCallStatus('idle')
              setCallDuration(0)
              setCallId(null)
              setCallSid(null)
            }, 3000)
            return
          }
        }
      } catch (err) {
        console.error('Error polling call status:', err)
      }
      
      if (callStatus !== 'idle' && callStatus !== 'ended') {
        setTimeout(checkStatus, 2000)
      }
    }
    
    checkStatus()
  }
  
  // End call
  const handleEndCall = async () => {
    if (!callId) return
    
    try {
      await fetch(`${API_URL}/api/v1/voice/calls/${callId}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      
      setCallStatus('ended')
      setSuccess('Call ended')
      
      setTimeout(() => {
        setCallStatus('idle')
        setCallDuration(0)
        setCallId(null)
        setCallSid(null)
        setSuccess('')
      }, 2000)
      
    } catch (err) {
      setError('Error ending call: ' + err.message)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
            <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-purple-300">Loading agent...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/agents')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Agents</span>
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Voice Call</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8">
        
        {/* Agent Card */}
        <div className="w-full max-w-md">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Animated Ring */}
            <div className="relative">
              {/* Outer rings */}
              {callStatus === 'connected' && (
                <>
                  <div className="absolute inset-0 w-40 h-40 -m-4 border-2 border-green-400/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-48 h-48 -m-8 border border-green-400/20 rounded-full animate-ping delay-300"></div>
                </>
              )}
              {(callStatus === 'dialing' || callStatus === 'ringing') && (
                <>
                  <div className="absolute inset-0 w-40 h-40 -m-4 border-2 border-yellow-400/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-48 h-48 -m-8 border border-yellow-400/20 rounded-full animate-ping delay-500"></div>
                </>
              )}
              
              {/* Main Avatar */}
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${
                callStatus === 'connected' ? 'from-green-400 via-emerald-500 to-teal-600' :
                callStatus === 'ringing' || callStatus === 'dialing' ? 'from-yellow-400 via-orange-500 to-red-500' :
                callStatus === 'ended' ? 'from-red-400 via-rose-500 to-pink-600' :
                'from-violet-400 via-purple-500 to-indigo-600'
              } p-1 shadow-2xl ${callStatus === 'connected' ? 'shadow-green-500/30' : 'shadow-purple-500/30'}`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {callStatus === 'connected' ? (
                    <PhoneCall className="w-12 h-12 text-green-400 animate-pulse" />
                  ) : callStatus === 'ringing' || callStatus === 'dialing' ? (
                    <PhoneOutgoing className="w-12 h-12 text-yellow-400 animate-bounce" />
                  ) : callStatus === 'ended' ? (
                    <PhoneOff className="w-12 h-12 text-red-400" />
                  ) : (
                    <Bot className="w-12 h-12 text-purple-400" />
                  )}
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                callStatus === 'connected' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                callStatus === 'ringing' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse' :
                callStatus === 'dialing' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                callStatus === 'ended' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' :
                'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200'
              }`}>
                {callStatus === 'connected' ? '🟢 Connected' :
                 callStatus === 'ringing' ? '📞 Ringing...' :
                 callStatus === 'dialing' ? '📱 Dialing...' :
                 callStatus === 'ended' ? '🔴 Ended' :
                 '⚪ Ready'}
              </div>
            </div>
            
            {/* Agent Info */}
            <h1 className="mt-8 text-2xl font-bold text-white text-center">
              {agent?.name || 'AI Agent'}
            </h1>
            <p className="mt-2 text-white/60 text-center max-w-xs">
              {agent?.description || 'Voice AI Assistant'}
            </p>
            
            {/* Tech Stack Badge */}
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-white/70">
                {agent?.llm_provider || 'groq'} / {agent?.llm_model || 'llama-3.3-70b'}
              </span>
            </div>
          </div>
          
          {/* Call Duration */}
          {(callStatus === 'connected' || callStatus === 'ended') && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className={`w-3 h-3 rounded-full ${callStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-4xl font-mono font-bold text-white tabular-nums">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
          )}
          
          {/* Messages */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}
          
          {/* Call Setup Form */}
          {callStatus === 'idle' && (
            <div className="space-y-5 mb-8">
              {/* From Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <Phone className="w-4 h-4" />
                  Call from (Your Twilio Number)
                </label>
                {phoneNumbers.length > 0 ? (
                  <div className="relative">
                    <select
                      value={selectedPhoneNumberId}
                      onChange={(e) => setSelectedPhoneNumberId(e.target.value)}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer hover:bg-white/10"
                    >
                      {phoneNumbers.map(pn => (
                        <option key={pn.id} value={pn.id} className="bg-slate-800">
                          {formatPhoneNumber(pn.phone_number)} {pn.friendly_name ? `(${pn.friendly_name})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                    <p className="text-yellow-300 text-sm mb-2">No phone numbers configured</p>
                    <button 
                      onClick={() => navigate('/dashboard/phone-numbers')}
                      className="text-yellow-400 text-sm font-medium hover:underline"
                    >
                      Add Phone Number →
                    </button>
                  </div>
                )}
              </div>
              
              {/* To Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <Globe className="w-4 h-4" />
                  Call to (Customer's Number)
                </label>
                <input
                  type="tel"
                  value={toPhoneNumber}
                  onChange={(e) => setToPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567 or +44 7123 456789"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/10"
                />
                <p className="text-white/40 text-xs px-1">
                  Include country code (e.g., +1 for US, +44 for UK)
                </p>
              </div>
            </div>
          )}
          
          {/* Call Button */}
          <div className="flex justify-center">
            {callStatus === 'idle' ? (
              <button
                onClick={handleStartCall}
                disabled={!selectedPhoneNumberId || !toPhoneNumber.trim()}
                className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 disabled:from-slate-600 disabled:via-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-green-500/40 disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
              >
                <Phone className="w-6 h-6 group-hover:animate-bounce" />
                Start Call
                <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : callStatus === 'dialing' || callStatus === 'ringing' || callStatus === 'connected' ? (
              <button
                onClick={handleEndCall}
                className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-400 hover:via-rose-400 hover:to-pink-400 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105"
              >
                <PhoneOff className="w-6 h-6" />
                End Call
              </button>
            ) : null}
          </div>
        </div>
        
        {/* Info Cards */}
        {callStatus === 'idle' && (
          <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">AI Powered</h3>
              <p className="text-white/50 text-sm">Natural conversations using advanced LLM</p>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Real-time</h3>
              <p className="text-white/50 text-sm">Instant speech recognition & response</p>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Recorded</h3>
              <p className="text-white/50 text-sm">Full transcript saved automatically</p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs">
            Powered by Twilio • {agent?.llm_provider === 'groq' ? 'Groq (FREE)' : agent?.llm_provider || 'Groq'} AI • Secure & Encrypted
          </p>
        </div>
      </div>
      
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default VoiceCallPage