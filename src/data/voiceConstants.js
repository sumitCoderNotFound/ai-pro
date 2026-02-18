/**
 * ConvoHubAI - Shared Constants for Voice, Language, and LLM Settings
 * Use these across all pages for consistent options
 */

// ===========================================
// LLM PROVIDERS & MODELS
// ===========================================

export const LLM_PROVIDERS = [
  { id: 'groq', name: 'Groq', emoji: '🚀', description: 'Fast & FREE', cost: 'FREE' },
  { id: 'openai', name: 'OpenAI', emoji: '🧠', description: 'GPT Models', cost: 'Paid' },
  { id: 'anthropic', name: 'Anthropic', emoji: '🤖', description: 'Claude Models', cost: 'Paid' },
]

export const LLM_MODELS = {
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Best quality', recommended: true },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fastest' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Good balance' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & cheap', recommended: true },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Cheapest' },
  ],
  anthropic: [
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced', recommended: true },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fastest' },
  ],
}

// ===========================================
// TTS (Text-to-Speech) PROVIDERS & VOICES
// ===========================================

export const TTS_PROVIDERS = [
  { id: 'deepgram', name: 'Deepgram Aura', cost: '0.15p/min', recommended: true, emoji: '⭐' },
  { id: 'openai', name: 'OpenAI TTS', cost: '1.2p/min', recommended: false, emoji: '' },
  { id: 'elevenlabs', name: 'ElevenLabs', cost: '2.4p/min', recommended: false, emoji: '' },
]

export const VOICE_OPTIONS = {
  deepgram: [
    { id: 'aura-asteria-en', name: 'Asteria', gender: 'Female', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-orion-en', name: 'Orion', gender: 'Male', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-athena-en', name: 'Athena', gender: 'Female', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'aura-luna-en', name: 'Luna', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-stella-en', name: 'Stella', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-hera-en', name: 'Hera', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-arcas-en', name: 'Arcas', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'aura-zeus-en', name: 'Zeus', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
  ],
  openai: [
    { id: 'nova', name: 'Nova', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'echo', name: 'Echo', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
    { id: 'fable', name: 'Fable', gender: 'Male', accent: 'British', flag: '🇬🇧', language: 'en-GB' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', accent: 'American', flag: '🇺🇸', language: 'en-US' },
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
  ],
}

// ===========================================
// STT (Speech-to-Text) PROVIDERS
// ===========================================

export const STT_PROVIDERS = [
  { id: 'groq', name: 'Groq Whisper', cost: 'FREE', recommended: true, emoji: '⭐' },
  { id: 'deepgram', name: 'Deepgram Nova', cost: '0.8p/min', recommended: false, emoji: '' },
]

// ===========================================
// LANGUAGE OPTIONS
// ===========================================

export const LANGUAGE_OPTIONS = [
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
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
]

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get models for a specific LLM provider
 */
export const getModelsForProvider = (provider) => {
  return LLM_MODELS[provider] || LLM_MODELS.groq
}

/**
 * Get voices for a specific TTS provider
 */
export const getVoicesForProvider = (provider) => {
  return VOICE_OPTIONS[provider] || VOICE_OPTIONS.deepgram
}

/**
 * Get default model for a provider
 */
export const getDefaultModel = (provider) => {
  const models = getModelsForProvider(provider)
  const recommended = models.find(m => m.recommended)
  return recommended?.id || models[0]?.id
}

/**
 * Get default voice for a provider
 */
export const getDefaultVoice = (provider) => {
  const voices = getVoicesForProvider(provider)
  return voices[0]?.id || 'aura-asteria-en'
}

/**
 * Get voice info by ID
 */
export const getVoiceInfo = (provider, voiceId) => {
  const voices = getVoicesForProvider(provider)
  return voices.find(v => v.id === voiceId)
}

/**
 * Get language info by code
 */
export const getLanguageInfo = (code) => {
  return LANGUAGE_OPTIONS.find(l => l.code === code) || LANGUAGE_OPTIONS[0]
}

/**
 * Default agent settings (cost-optimized)
 */
export const DEFAULT_AGENT_SETTINGS = {
  llm_provider: 'groq',
  llm_model: 'llama-3.3-70b-versatile',
  tts_provider: 'deepgram',
  stt_provider: 'groq',
  voice_id: 'aura-asteria-en',
  language: 'en-GB',
  temperature: 0.7,
}