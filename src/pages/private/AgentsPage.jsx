import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  X,
  PhoneCall,
  Settings,
  Volume2,
  Globe
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

// ===========================================
// VOICE & LANGUAGE OPTIONS
// ===========================================

const VOICE_OPTIONS = {
  deepgram: [
    // English UK
    { id: 'aura-asteria-en', name: 'Asteria', gender: 'Female', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-orion-en', name: 'Orion', gender: 'Male', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-arcas-en', name: 'Arcas', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-luna-en', name: 'Luna', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-stella-en', name: 'Stella', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-athena-en', name: 'Athena', gender: 'Female', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-hera-en', name: 'Hera', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-zeus-en', name: 'Zeus', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
  ],
  openai: [
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'echo', name: 'Echo', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'fable', name: 'Fable', gender: 'Male', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'nova', name: 'Nova', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
  ],
  elevenlabs: [
    { id: 'rachel', name: 'Rachel', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'domi', name: 'Domi', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'bella', name: 'Bella', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'antoni', name: 'Antoni', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'josh', name: 'Josh', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'arnold', name: 'Arnold', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'adam', name: 'Adam', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'sam', name: 'Sam', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
  ]
}

const LANGUAGE_OPTIONS = [
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-AU', name: 'English (Australia)', flag: '🇦🇺' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦' },
]

const TTS_PROVIDERS = [
  { id: 'deepgram', name: 'Deepgram Aura', cost: '0.15p/min', recommended: true },
  { id: 'openai', name: 'OpenAI TTS', cost: '1.2p/min', recommended: false },
  { id: 'elevenlabs', name: 'ElevenLabs', cost: '2.4p/min', recommended: false },
]

// Create/Edit Agent Modal
const AgentModal = ({ isOpen, onClose, agent, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agent_type: 'single_prompt',
    channels: ['chat'],
    llm_provider: 'groq',
    llm_model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    system_prompt: '',
    welcome_message: '',
    language: 'en-GB',
    // New voice settings
    tts_provider: 'deepgram',
    voice_id: 'aura-asteria-en',
    stt_provider: 'groq',
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
        llm_provider: agent.llm_provider || 'groq',
        llm_model: agent.llm_model || 'llama-3.3-70b-versatile',
        temperature: agent.temperature || 0.7,
        system_prompt: agent.system_prompt || '',
        welcome_message: agent.welcome_message || '',
        language: agent.language || 'en-GB',
        tts_provider: agent.tts_provider || 'deepgram',
        voice_id: agent.voice_id || 'aura-asteria-en',
        stt_provider: agent.stt_provider || 'groq',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        agent_type: 'single_prompt',
        channels: ['chat'],
        llm_provider: 'groq',
        llm_model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        system_prompt: '',
        welcome_message: '',
        language: 'en-GB',
        tts_provider: 'deepgram',
        voice_id: 'aura-asteria-en',
        stt_provider: 'groq',
      })
    }
    setError('')
  }, [agent, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-update model when provider changes
    if (name === 'llm_provider') {
      const defaultModels = {
        groq: 'llama-3.3-70b-versatile',
        openai: 'gpt-4o-mini',
        anthropic: 'claude-3-sonnet'
      }
      setFormData(prev => ({ ...prev, llm_model: defaultModels[value] || 'llama-3.3-70b-versatile' }))
    }

    // Auto-update voice when TTS provider changes
    if (name === 'tts_provider') {
      const defaultVoices = {
        deepgram: 'aura-asteria-en',
        openai: 'nova',
        elevenlabs: 'rachel'
      }
      setFormData(prev => ({ ...prev, voice_id: defaultVoices[value] || 'aura-asteria-en' }))
    }
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

  // Get available voices for selected TTS provider
  const availableVoices = VOICE_OPTIONS[formData.tts_provider] || VOICE_OPTIONS.deepgram

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

            {/* Agent Type */}
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
                    className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${formData.agent_type === type.value
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
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.channels.includes(channel.id)
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
                    <channel.icon className={`w-5 h-5 ${formData.channels.includes(channel.id) ? 'text-primary-500' : 'text-neutral-400'
                      }`} />
                    <span className={`text-sm font-medium ${formData.channels.includes(channel.id) ? 'text-primary-700' : 'text-neutral-700'
                      }`}>{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Model */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-900">AI Model (LLM)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Provider</label>
                  <select
                    name="llm_provider"
                    value={formData.llm_provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="groq">🚀 Groq (Fast & FREE)</option>
                    <option value="openai">OpenAI (Paid)</option>
                    <option value="anthropic">Anthropic (Paid)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Model</label>
                  <select
                    name="llm_model"
                    value={formData.llm_model}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {formData.llm_provider === 'groq' && (
                      <>
                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Best)</option>
                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (Fast)</option>
                        <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                      </>
                    )}
                    {formData.llm_provider === 'openai' && (
                      <>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </>
                    )}
                    {formData.llm_provider === 'anthropic' && (
                      <>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Voice Settings - Only show if voice or video channel selected */}
            {(formData.channels.includes('voice') || formData.channels.includes('video')) && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <h3 className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-500" />
                  Voice Settings
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* TTS Provider */}
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Voice Provider (TTS)</label>
                    <select
                      name="tts_provider"
                      value={formData.tts_provider}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      {TTS_PROVIDERS.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.recommended ? '⭐ ' : ''}{provider.name} ({provider.cost})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Voice Selection */}
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Voice</label>
                    <select
                      name="voice_id"
                      value={formData.voice_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      {availableVoices.map(voice => (
                        <option key={voice.id} value={voice.id}>
                          {voice.flag} {voice.name} ({voice.gender}, {voice.accent})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm text-neutral-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {LANGUAGE_OPTIONS.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Voice Preview Info */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white/50 p-2 rounded-lg">
                  <Volume2 className="w-3 h-3" />
                  <span>
                    Selected: {availableVoices.find(v => v.id === formData.voice_id)?.name || 'Asteria'} - 
                    {availableVoices.find(v => v.id === formData.voice_id)?.gender || 'Female'}, 
                    {availableVoices.find(v => v.id === formData.voice_id)?.accent || 'British'}
                  </span>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Welcome Message (First thing AI says)
              </label>
              <textarea
                name="welcome_message"
                value={formData.welcome_message}
                onChange={handleChange}
                placeholder="Hi, um, thanks for calling convohubai. How can I help you today?"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                System Prompt (Global Instructions)
              </label>
              <textarea
                name="system_prompt"
                value={formData.system_prompt}
                onChange={handleChange}
                placeholder="You are a helpful assistant..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Temperature */}
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
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>More Focused (0)</span>
                <span>More Creative (1)</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Saving...' : (agent ? 'Save Changes' : 'Create Agent')}
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Agent</h3>
          <p className="text-neutral-600 mb-6">
            Are you sure you want to delete <span className="font-medium">{agent?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Agent Card Component
const AgentCard = ({ agent, onEdit, onDelete, onToggleStatus, onDuplicate }) => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  // Get voice info
  const getVoiceInfo = () => {
    if (!agent.voice_id) return null
    const provider = agent.tts_provider || 'deepgram'
    const voices = VOICE_OPTIONS[provider] || VOICE_OPTIONS.deepgram
    return voices.find(v => v.id === agent.voice_id)
  }

  const voiceInfo = getVoiceInfo()

  // Navigate to agent detail page (with Test Audio panel)
  const handleTestAudio = (e) => {
    e.stopPropagation()
    navigate(`/dashboard/agents/${agent.id}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="p-5 border-b border-neutral-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{agent.name}</h3>
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                {agent.llm_model || 'llama-3.3-70b'}
                {voiceInfo && (
                  <span className="ml-2 text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                    {voiceInfo.flag} {voiceInfo.name}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-neutral-400" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20">
                  <button
                    onClick={() => { onEdit(agent); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => { navigate(`/dashboard/agents/${agent.id}`); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Settings className="w-4 h-4" />
                    Settings & Test
                  </button>
                  <button
                    onClick={() => { onDuplicate(agent); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  {agent.status === 'active' ? (
                    <button
                      onClick={() => { onToggleStatus(agent, 'pause'); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => { onToggleStatus(agent, 'activate'); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <Play className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                  <hr className="my-1 border-neutral-200" />
                  <button
                    onClick={() => { onDelete(agent); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
          {agent.description || 'No description'}
        </p>

        {/* Status & Channels */}
        <div className="flex items-center justify-between">
          <StatusBadge status={agent.status} />
          <div className="flex items-center gap-1">
            {(agent.channels || []).map(channel => (
              <div
                key={channel}
                className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center"
                title={channel}
              >
                <ChannelIcon channel={channel} className="w-4 h-4 text-neutral-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="p-4 bg-neutral-50">
        <div className="flex items-center gap-2">
          {/* TEST AUDIO BUTTON - NAVIGATES TO DETAIL PAGE */}
          <button
            onClick={handleTestAudio}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            Test Audio
          </button>
          
          {/* TEST CHAT BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/chat?agent_id=${agent.id}`)
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Test Chat
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2 mt-2">
          {agent.channels?.includes('video') && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/dashboard/video/${agent.id}`)
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-neutral-300 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              Video Call
            </button>
          )}
          {agent.channels?.includes('voice') && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/dashboard/call/${agent.id}`)
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-neutral-300 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Voice Call
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Agents Page
const AgentsPage = () => {
  const navigate = useNavigate()
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

  // Create agent - THEN NAVIGATE TO DETAIL PAGE
  const handleCreate = async (data) => {
    const newAgent = await agentsApi.create(data)
    // Navigate to the new agent's detail page
    navigate(`/dashboard/agents/${newAgent.id}`)
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