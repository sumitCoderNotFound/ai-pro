import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { agentsApi } from '@/services/api'
import {
  ArrowLeft, Phone, PhoneOff, Mic, MicOff, Volume2, MessageSquare, Bot,
  Loader2, Save, Code, Globe, Cpu, AlertCircle
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')

// =================== LLM PROVIDERS ===================
const LLM_PROVIDERS = [
  { id: 'groq', name: 'Groq', emoji: '🚀', cost: 'FREE', description: 'Fastest, Llama models' },
  { id: 'openai', name: 'OpenAI', emoji: '🧠', cost: 'Paid', description: 'GPT-4o, Best quality' },
  { id: 'anthropic', name: 'Anthropic', emoji: '🤖', cost: 'Paid', description: 'Claude models' },
]

const LLM_MODELS = {
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Best quality', recommended: true },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fastest' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Good balance' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable', recommended: true },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & affordable' },
  ],
  anthropic: [
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced', recommended: true },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable' },
  ],
}

// =================== TTS PROVIDERS ===================
const TTS_PROVIDERS = [
  { id: 'deepgram', name: 'Deepgram Aura', cost: '£0.0015/min', emoji: '⭐', description: 'Best value' },
  { id: 'openai', name: 'OpenAI TTS', cost: '£0.012/min', emoji: '', description: 'High quality' },
  { id: 'elevenlabs', name: 'ElevenLabs', cost: '£0.024/min', emoji: '', description: 'Most realistic' },
]

const VOICE_OPTIONS = {
  deepgram: [
    { id: 'aura-asteria-en', name: 'Asteria', gender: 'Female', accent: 'British', flag: '🇬🇧' },
    { id: 'aura-athena-en', name: 'Athena', gender: 'Female', accent: 'British', flag: '🇬🇧' },
    { id: 'aura-orion-en', name: 'Orion', gender: 'Male', accent: 'British', flag: '🇬🇧' },
    { id: 'aura-luna-en', name: 'Luna', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'aura-stella-en', name: 'Stella', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'aura-arcas-en', name: 'Arcas', gender: 'Male', accent: 'American', flag: '🇺🇸' },
    { id: 'aura-zeus-en', name: 'Zeus', gender: 'Male', accent: 'American', flag: '🇺🇸' },
  ],
  openai: [
    { id: 'nova', name: 'Nova', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', accent: 'American', flag: '🇺🇸' },
    { id: 'echo', name: 'Echo', gender: 'Male', accent: 'American', flag: '🇺🇸' },
    { id: 'fable', name: 'Fable', gender: 'Male', accent: 'British', flag: '🇬🇧' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', accent: 'American', flag: '🇺🇸' },
  ],
  elevenlabs: [
    { id: 'rachel', name: 'Rachel', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'bella', name: 'Bella', gender: 'Female', accent: 'American', flag: '🇺🇸' },
    { id: 'josh', name: 'Josh', gender: 'Male', accent: 'American', flag: '🇺🇸' },
    { id: 'arnold', name: 'Arnold', gender: 'Male', accent: 'American', flag: '🇺🇸' },
  ],
}

// =================== STT PROVIDERS ===================
const STT_PROVIDERS = [
  { id: 'groq', name: 'Groq Whisper', cost: 'FREE', emoji: '⭐', description: 'Free, fast' },
  { id: 'openai', name: 'OpenAI Whisper', cost: '£0.006/min', emoji: '', description: 'Most accurate' },
  { id: 'deepgram', name: 'Deepgram Nova-2', cost: '£0.008/min', emoji: '', description: 'Real-time' },
]

// =================== LANGUAGES ===================
const LANGUAGE_OPTIONS = [
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', region: 'English' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', region: 'English' },
  { code: 'en-AU', name: 'English (Australia)', flag: '🇦🇺', region: 'English' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳', region: 'English' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', region: 'Asian' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸', region: 'European' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', region: 'European' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', region: 'European' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹', region: 'European' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷', region: 'European' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', region: 'Asian' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', region: 'Asian' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳', region: 'Asian' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', region: 'Middle Eastern' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱', region: 'European' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺', region: 'European' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷', region: 'Middle Eastern' },
]

// Helpers
const getModelsForProvider = (p) => LLM_MODELS[p] || LLM_MODELS.groq
const getVoicesForProvider = (p) => VOICE_OPTIONS[p] || VOICE_OPTIONS.deepgram
const getDefaultModel = (p) => (getModelsForProvider(p).find(m => m.recommended) || getModelsForProvider(p)[0])?.id
const getDefaultVoice = (p) => getVoicesForProvider(p)[0]?.id

// =================== TEST AUDIO PANEL ===================
const TestAudioPanel = ({ agent }) => {
  const [activeTab, setActiveTab] = useState('audio')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [isSendingChat, setIsSendingChat] = useState(false)
  
  const speechSynthRef = useRef(null)
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis
    return () => { if (speechSynthRef.current) speechSynthRef.current.cancel() }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakText = useCallback((text) => {
    return new Promise((resolve) => {
      if (!speechSynthRef.current) { resolve(); return }
      speechSynthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const langCode = agent?.language || 'en-GB'
      utterance.lang = langCode
      
      const voices = speechSynthRef.current.getVoices()
      const voiceInfo = (VOICE_OPTIONS[agent?.tts_provider] || VOICE_OPTIONS.deepgram).find(v => v.id === agent?.voice_id)
      const isFemale = voiceInfo?.gender === 'Female'
      
      let preferredVoice = voices.find(v => {
        const matchesLang = v.lang.startsWith(langCode.split('-')[0])
        const matchesGender = isFemale ? 
          (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.toLowerCase().includes('female')) :
          (v.name.includes('Daniel') || v.name.includes('Alex') || v.name.toLowerCase().includes('male'))
        return matchesLang && matchesGender
      }) || voices.find(v => v.lang.startsWith(langCode.split('-')[0])) || voices.find(v => v.lang.startsWith('en'))
      
      if (preferredVoice) utterance.voice = preferredVoice
      utterance.rate = 1.0
      utterance.pitch = isFemale ? 1.1 : 0.9
      
      utterance.onstart = () => setIsAiSpeaking(true)
      utterance.onend = () => { setIsAiSpeaking(false); resolve() }
      utterance.onerror = () => { setIsAiSpeaking(false); resolve() }
      speechSynthRef.current.speak(utterance)
    })
  }, [agent?.language, agent?.tts_provider, agent?.voice_id])

  const getAIResponse = useCallback(async (userMessage) => {
    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await fetch(`${API_URL}/api/v1/agents/${agent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ message: userMessage, conversation_history: conversationHistory })
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      return data.response || "I'm sorry, I couldn't process that."
    } catch (error) {
      return "I'm having trouble connecting. Please try again."
    }
  }, [agent?.id, messages])

  const processUserSpeech = useCallback(async (transcript) => {
    if (!transcript.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: transcript }])
    setCurrentTranscript('')
    const aiResponse = await getAIResponse(transcript)
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    await speakText(aiResponse)
    if (isCallActive && !isMuted) startListening()
  }, [getAIResponse, speakText, isCallActive, isMuted])

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = agent?.language || 'en-GB'
    recognitionRef.current.onstart = () => setIsListening(true)
    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '', interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += transcript
        else interimTranscript += transcript
      }
      if (finalTranscript) {
        recognitionRef.current?.stop()
        setIsListening(false)
        processUserSpeech(finalTranscript)
      } else setCurrentTranscript(interimTranscript)
    }
    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.onend = () => { if (isCallActive && !isMuted && !isAiSpeaking) recognitionRef.current?.start() }
    recognitionRef.current.start()
  }, [isCallActive, isMuted, isAiSpeaking, processUserSpeech, agent?.language])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null }
    setIsListening(false)
  }, [])

  const startCall = async () => {
    setIsConnecting(true)
    setMessages([])
    await new Promise(r => setTimeout(r, 500))
    setIsCallActive(true)
    setIsConnecting(false)
    const firstMessage = agent?.welcome_message || `Hello! I'm ${agent?.name}. How can I help?`
    setMessages([{ role: 'assistant', content: firstMessage }])
    await speakText(firstMessage)
    startListening()
  }

  const endCall = () => {
    setIsCallActive(false)
    stopListening()
    if (speechSynthRef.current) speechSynthRef.current.cancel()
    setIsAiSpeaking(false)
    setCurrentTranscript('')
  }

  const toggleMute = () => {
    if (isMuted) { setIsMuted(false); if (isCallActive && !isAiSpeaking) startListening() }
    else { setIsMuted(true); stopListening() }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim() || isSendingChat) return
    const userMessage = chatInput.trim()
    setChatInput('')
    setIsSendingChat(true)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    const aiResponse = await getAIResponse(userMessage)
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    setIsSendingChat(false)
  }

  const voiceInfo = (VOICE_OPTIONS[agent?.tts_provider] || VOICE_OPTIONS.deepgram).find(v => v.id === agent?.voice_id)
  const langInfo = LANGUAGE_OPTIONS.find(l => l.code === agent?.language) || LANGUAGE_OPTIONS[0]
  const ttsProvider = TTS_PROVIDERS.find(p => p.id === agent?.tts_provider)

  return (
    <div className="w-[400px] border-l border-neutral-200 bg-white flex flex-col h-full">
      <div className="border-b border-neutral-200 p-4">
        <h3 className="font-bold text-neutral-900 mb-3">Test Agent</h3>
        <div className="space-y-2 text-xs">
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">🧠 {agent?.llm_model}</span>
            {voiceInfo && <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium">🎤 {voiceInfo.flag} {voiceInfo.name} ({voiceInfo.gender})</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">🌍 {langInfo.flag} {langInfo.name}</span>
            {ttsProvider && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium">🔊 {ttsProvider.name}</span>}
          </div>
        </div>
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700"><strong>Browser Test:</strong> Uses browser speech. Production uses your configured voice.</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setActiveTab('audio')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'audio' ? 'bg-green-100 text-green-700' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            <Phone className="w-4 h-4" /> Voice
          </button>
          <button onClick={() => setActiveTab('chat')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button onClick={() => setActiveTab('json')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'json' ? 'bg-neutral-200' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'audio' && (
          <>
            {!isCallActive ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Test Voice Call</h4>
                <p className="text-sm text-neutral-500 text-center mb-2">Uses <strong>Welcome Message</strong> & <strong>System Prompt</strong></p>
                <p className="text-xs text-neutral-400 mb-6">{langInfo.flag} {langInfo.name}</p>
                <button onClick={startCall} disabled={isConnecting} className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 shadow-md">
                  {isConnecting ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Connecting...</span> : <span className="flex items-center gap-2"><Phone className="w-5 h-5" />Start Call</span>}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${m.role === 'user' ? 'bg-green-500 text-white' : 'bg-white border border-neutral-200 shadow-sm'}`}>
                        <p className="text-sm">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {currentTranscript && <div className="flex justify-end"><div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-green-100 text-green-700"><p className="text-sm italic">{currentTranscript}...</p></div></div>}
                  <div ref={messagesEndRef} />
                </div>
                <div className="px-4 py-3 bg-white border-t text-center">
                  {isListening && <span className="text-green-600 flex items-center justify-center gap-2 text-sm font-medium"><span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />Listening ({langInfo.flag})...</span>}
                  {isAiSpeaking && <span className="text-blue-600 flex items-center justify-center gap-2 text-sm font-medium"><Volume2 className="w-4 h-4 animate-pulse" />Speaking ({voiceInfo?.name})...</span>}
                  {!isListening && !isAiSpeaking && <span className="text-neutral-400 text-sm">Ready</span>}
                </div>
                <div className="p-4 border-t bg-white flex justify-center gap-4">
                  <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-100 text-red-500' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg">
                    <PhoneOff className="w-7 h-7" />
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                  <MessageSquare className="w-12 h-12 mb-3" />
                  <p className="text-sm">Start chatting to test</p>
                </div>
              ) : messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-neutral-200 shadow-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isSendingChat && <div className="flex justify-start"><div className="px-4 py-2.5 rounded-2xl bg-white border"><Loader2 className="w-4 h-4 animate-spin text-neutral-400" /></div></div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleSendChat} disabled={!chatInput.trim() || isSendingChat} className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50">
                  {isSendingChat ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                </button>
              </div>
              <button onClick={() => setMessages([])} className="mt-2 text-xs text-neutral-500 hover:text-neutral-700">Clear</button>
            </div>
          </>
        )}

        {activeTab === 'json' && (
          <div className="flex-1 p-4 overflow-auto bg-neutral-900">
            <pre className="text-xs text-green-400 font-mono">{JSON.stringify(agent, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

// =================== SETTINGS PANEL ===================
const AgentSettingsPanel = ({ agent, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', system_prompt: '', welcome_message: '',
    llm_provider: 'groq', llm_model: 'llama-3.3-70b-versatile',
    tts_provider: 'deepgram', stt_provider: 'groq', voice_id: 'aura-asteria-en',
    language: 'en-GB', temperature: 0.7,
  })

  useEffect(() => {
    if (agent) setFormData({
      name: agent.name || '', description: agent.description || '',
      system_prompt: agent.system_prompt || '', welcome_message: agent.welcome_message || '',
      llm_provider: agent.llm_provider || 'groq', llm_model: agent.llm_model || 'llama-3.3-70b-versatile',
      tts_provider: agent.tts_provider || 'deepgram', stt_provider: agent.stt_provider || 'groq',
      voice_id: agent.voice_id || 'aura-asteria-en', language: agent.language || 'en-GB',
      temperature: agent.temperature || 0.7,
    })
  }, [agent])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'llm_provider') updated.llm_model = getDefaultModel(value)
      if (name === 'tts_provider') updated.voice_id = getDefaultVoice(value)
      return updated
    })
  }

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData) }
  const availableModels = getModelsForProvider(formData.llm_provider)
  const availableVoices = getVoicesForProvider(formData.tts_provider)
  const selectedVoice = availableVoices.find(v => v.id === formData.voice_id)

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-2">Agent Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-2">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-3 border border-neutral-300 rounded-xl resize-none" />
      </div>

      {/* LLM */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-4"><Cpu className="w-4 h-4 text-blue-600" />AI Model (LLM)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Provider</label>
            <select name="llm_provider" value={formData.llm_provider} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
              {LLM_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} ({p.cost})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Model</label>
            <select name="llm_model" value={formData.llm_model} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
              {availableModels.map(m => <option key={m.id} value={m.id}>{m.recommended ? '⭐ ' : ''}{m.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TTS Voice */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-4"><Volume2 className="w-4 h-4 text-purple-600" />Voice (TTS)</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Provider</label>
            <select name="tts_provider" value={formData.tts_provider} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
              {TTS_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} ({p.cost})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Voice</label>
            <select name="voice_id" value={formData.voice_id} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
              {availableVoices.map(v => <option key={v.id} value={v.id}>{v.flag} {v.name} ({v.gender})</option>)}
            </select>
          </div>
        </div>
        {selectedVoice && (
          <div className="p-3 bg-white rounded-lg border border-purple-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">{selectedVoice.flag}</div>
            <div className="flex-1">
              <p className="font-medium text-neutral-800">{selectedVoice.name}</p>
              <p className="text-xs text-neutral-500">{selectedVoice.gender} • {selectedVoice.accent}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${selectedVoice.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>{selectedVoice.gender}</span>
          </div>
        )}
      </div>

      {/* Language */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-green-600" />Language</h3>
        <select name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
          <optgroup label="🇬🇧 English">{LANGUAGE_OPTIONS.filter(l => l.region === 'English').map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</optgroup>
          <optgroup label="🌏 Asian">{LANGUAGE_OPTIONS.filter(l => l.region === 'Asian').map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</optgroup>
          <optgroup label="🇪🇺 European">{LANGUAGE_OPTIONS.filter(l => l.region === 'European').map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</optgroup>
          <optgroup label="🌍 Middle Eastern">{LANGUAGE_OPTIONS.filter(l => l.region === 'Middle Eastern').map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</optgroup>
        </select>
      </div>

      {/* STT */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-4"><Mic className="w-4 h-4 text-amber-600" />Speech Recognition (STT)</h3>
        <select name="stt_provider" value={formData.stt_provider} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white">
          {STT_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} ({p.cost})</option>)}
        </select>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-teal-600" />Welcome Message</h3>
        <p className="text-xs text-neutral-500 mb-3"><strong>First thing</strong> your agent says</p>
        <textarea name="welcome_message" value={formData.welcome_message} onChange={handleChange} rows={3} placeholder="Hello! Thank you for calling..." className="w-full px-4 py-3 border rounded-xl resize-none" />
      </div>

      {/* System Prompt */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-2"><Code className="w-4 h-4 text-slate-600" />System Prompt</h3>
        <p className="text-xs text-neutral-500 mb-3"><strong>Personality & rules</strong> your agent follows</p>
        <textarea name="system_prompt" value={formData.system_prompt} onChange={handleChange} rows={10} placeholder="You are a helpful assistant..." className="w-full px-4 py-3 border rounded-xl resize-none font-mono text-sm" />
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-2">Creativity: {formData.temperature}</label>
        <input type="range" name="temperature" value={formData.temperature} onChange={handleChange} min="0" max="1" step="0.1" className="w-full" />
        <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>🎯 Focused (0)</span><span>🎨 Creative (1)</span></div>
      </div>

      <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-lg shadow-md">
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
      </button>
    </form>
  )
}

// =================== MAIN PAGE ===================
const AgentDetailPage = () => {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setIsLoading(true)
        const data = await agentsApi.get(agentId)
        setAgent(data)
      } catch (err) { setError('Failed to load agent') }
      finally { setIsLoading(false) }
    }
    fetchAgent()
  }, [agentId])

  const handleSave = async (data) => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const updated = await agentsApi.update(agentId, data)
      setAgent(updated)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) { setError('Failed to save') }
    finally { setIsSaving(false) }
  }

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-neutral-50"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>
  if (error || !agent) return <div className="flex items-center justify-center h-screen bg-neutral-50"><AlertCircle className="w-10 h-10 text-red-500" /><p className="text-red-500 ml-2">{error || 'Not found'}</p></div>

  const voiceInfo = (VOICE_OPTIONS[agent.tts_provider] || VOICE_OPTIONS.deepgram).find(v => v.id === agent.voice_id)
  const langInfo = LANGUAGE_OPTIONS.find(l => l.code === agent.language) || LANGUAGE_OPTIONS[0]

  return (
    <div className="flex h-screen bg-neutral-100">
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard/agents')} className="p-2 hover:bg-neutral-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md"><Bot className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="font-bold text-lg text-neutral-900">{agent.name}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">{agent.llm_model}</span>
                  {voiceInfo && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{voiceInfo.flag} {voiceInfo.name}</span>}
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{langInfo.flag} {langInfo.code}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && <span className="text-green-600 text-sm font-medium">✓ Saved!</span>}
            <span className="text-sm text-neutral-400">ID: {agent.id?.substring(0, 8)}...</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto"><AgentSettingsPanel agent={agent} onSave={handleSave} isSaving={isSaving} /></div>
      </div>
      <TestAudioPanel agent={agent} />
    </div>
  )
}

export default AgentDetailPage