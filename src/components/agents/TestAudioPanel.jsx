import { useState, useEffect, useRef, useCallback } from 'react'
import { 
    Phone, 
    PhoneOff, 
    Mic, 
    MicOff, 
    Volume2, 
    VolumeX,
    Loader2,
    MessageSquare,
    X,
    Sparkles,
    Bot
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')

/**
 * TestAudioPanel - Real-time voice testing for AI agents
 * 
 * Usage:
 * import TestAudioPanel from '@/components/agents/TestAudioPanel'
 * 
 * <TestAudioPanel
 *   agent={selectedAgent}  // Agent object with id, name, system_prompt, welcome_message
 *   isOpen={showTestAudio}
 *   onClose={() => setShowTestAudio(false)}
 * />
 */

const TestAudioPanel = ({ agent, isOpen, onClose }) => {
    // Call State
    const [isCallActive, setIsCallActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isAiSpeaking, setIsAiSpeaking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    
    // Conversation
    const [messages, setMessages] = useState([])
    const [currentTranscript, setCurrentTranscript] = useState('')
    
    // Audio refs
    const mediaRecorderRef = useRef(null)
    const audioContextRef = useRef(null)
    const audioChunksRef = useRef([])
    const silenceTimeoutRef = useRef(null)
    const speechSynthRef = useRef(null)
    const recognitionRef = useRef(null)
    
    // Initialize speech synthesis
    useEffect(() => {
        speechSynthRef.current = window.speechSynthesis
        return () => {
            if (speechSynthRef.current) {
                speechSynthRef.current.cancel()
            }
        }
    }, [])

    // Speak text using Web Speech API (TTS)
    const speakText = useCallback((text) => {
        return new Promise((resolve) => {
            if (!speechSynthRef.current) {
                resolve()
                return
            }
            
            // Cancel any ongoing speech
            speechSynthRef.current.cancel()
            
            const utterance = new SpeechSynthesisUtterance(text)
            
            // Get available voices and select a good one
            const voices = speechSynthRef.current.getVoices()
            const preferredVoice = voices.find(v => 
                v.name.includes('Samantha') || 
                v.name.includes('Google') ||
                v.name.includes('Microsoft') ||
                v.lang.startsWith('en')
            ) || voices[0]
            
            if (preferredVoice) {
                utterance.voice = preferredVoice
            }
            
            utterance.rate = 1.0
            utterance.pitch = 1.0
            utterance.volume = 1.0
            
            utterance.onstart = () => setIsAiSpeaking(true)
            utterance.onend = () => {
                setIsAiSpeaking(false)
                resolve()
            }
            utterance.onerror = () => {
                setIsAiSpeaking(false)
                resolve()
            }
            
            speechSynthRef.current.speak(utterance)
        })
    }, [])

    // Get AI response from backend
    const getAIResponse = useCallback(async (userMessage) => {
        try {
            // Build conversation history
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }))
            conversationHistory.push({ role: 'user', content: userMessage })
            
            const response = await fetch(`${API_URL}/api/v1/agents/${agent.id}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversation_history: conversationHistory
                })
            })
            
            if (!response.ok) throw new Error('Failed to get response')
            
            const data = await response.json()
            return data.response || data.message || "I'm sorry, I couldn't process that."
            
        } catch (error) {
            console.error('AI Response error:', error)
            return "I'm having trouble connecting right now. Please try again."
        }
    }, [agent?.id, messages])

    // Process user speech
    const processUserSpeech = useCallback(async (transcript) => {
        if (!transcript.trim()) return
        
        // Add user message
        const userMessage = { role: 'user', content: transcript }
        setMessages(prev => [...prev, userMessage])
        setCurrentTranscript('')
        
        // Get AI response
        const aiResponse = await getAIResponse(transcript)
        
        // Add AI message
        const aiMessage = { role: 'assistant', content: aiResponse }
        setMessages(prev => [...prev, aiMessage])
        
        // Speak the response
        await speakText(aiResponse)
        
        // Resume listening after speaking
        if (isCallActive && !isMuted) {
            startListening()
        }
    }, [getAIResponse, speakText, isCallActive, isMuted])

    // Start speech recognition
    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported')
            return
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onstart = () => {
            setIsListening(true)
        }
        
        recognitionRef.current.onresult = (event) => {
            let interimTranscript = ''
            let finalTranscript = ''
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript
                } else {
                    interimTranscript += transcript
                }
            }
            
            if (finalTranscript) {
                // Stop listening while processing
                recognitionRef.current?.stop()
                setIsListening(false)
                processUserSpeech(finalTranscript)
            } else {
                setCurrentTranscript(interimTranscript)
            }
        }
        
        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            if (event.error !== 'no-speech') {
                setIsListening(false)
            }
        }
        
        recognitionRef.current.onend = () => {
            // Restart if call is still active
            if (isCallActive && !isMuted && !isAiSpeaking) {
                recognitionRef.current?.start()
            }
        }
        
        recognitionRef.current.start()
    }, [isCallActive, isMuted, isAiSpeaking, processUserSpeech])

    // Stop speech recognition
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current = null
        }
        setIsListening(false)
    }, [])

    // Start call
    const startCall = async () => {
        setIsConnecting(true)
        setMessages([])
        
        try {
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setIsCallActive(true)
            setIsConnecting(false)
            
            // Speak first message
            const firstMessage = agent?.welcome_message || agent?.first_message || 
                "Hello! Thank you for calling. How can I assist you today?"
            
            const aiMessage = { role: 'assistant', content: firstMessage }
            setMessages([aiMessage])
            
            await speakText(firstMessage)
            
            // Start listening after greeting
            startListening()
            
        } catch (error) {
            console.error('Failed to start call:', error)
            setIsConnecting(false)
        }
    }

    // End call
    const endCall = () => {
        setIsCallActive(false)
        stopListening()
        
        if (speechSynthRef.current) {
            speechSynthRef.current.cancel()
        }
        
        setIsAiSpeaking(false)
        setCurrentTranscript('')
    }

    // Toggle mute
    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false)
            if (isCallActive && !isAiSpeaking) {
                startListening()
            }
        } else {
            setIsMuted(true)
            stopListening()
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening()
            if (speechSynthRef.current) {
                speechSynthRef.current.cancel()
            }
        }
    }, [stopListening])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCallActive 
                                ? 'bg-green-500 animate-pulse' 
                                : 'bg-primary-500'
                        }`}>
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-800">Test Audio</h3>
                            <p className="text-sm text-neutral-500">
                                {isCallActive ? 'Call in progress...' : 'Test your agent'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-lg"
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                {/* Agent Info */}
                <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-neutral-800">{agent?.name}</p>
                            <p className="text-sm text-neutral-500">{agent?.description || 'AI Assistant'}</p>
                        </div>
                    </div>
                </div>

                {/* Conversation Area */}
                <div className="h-64 overflow-y-auto p-4 space-y-3 bg-white">
                    {messages.length === 0 && !isCallActive && (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                            <MessageSquare className="w-12 h-12 mb-3" />
                            <p>Click "Start Call" to test your agent</p>
                        </div>
                    )}
                    
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                message.role === 'user'
                                    ? 'bg-primary-500 text-white rounded-br-md'
                                    : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                            }`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Current transcript (interim) */}
                    {currentTranscript && (
                        <div className="flex justify-end">
                            <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-primary-200 text-primary-800 rounded-br-md">
                                <p className="text-sm italic">{currentTranscript}...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* AI Speaking Indicator */}
                    {isAiSpeaking && (
                        <div className="flex justify-start">
                            <div className="px-4 py-2 rounded-2xl bg-neutral-100 rounded-bl-md">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-sm text-neutral-500">Speaking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        {isListening && (
                            <div className="flex items-center gap-2 text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Listening...</span>
                            </div>
                        )}
                        {isAiSpeaking && (
                            <div className="flex items-center gap-2 text-primary-600">
                                <Volume2 className="w-4 h-4 animate-pulse" />
                                <span>AI Speaking...</span>
                            </div>
                        )}
                        {isCallActive && !isListening && !isAiSpeaking && (
                            <div className="flex items-center gap-2 text-neutral-500">
                                <span>Processing...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="px-6 py-4 bg-white border-t border-neutral-200">
                    <div className="flex items-center justify-center gap-4">
                        {!isCallActive ? (
                            /* Start Call Button */
                            <button
                                onClick={startCall}
                                disabled={isConnecting}
                                className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-5 h-5" />
                                        Start Call
                                    </>
                                )}
                            </button>
                        ) : (
                            /* Call Controls */
                            <>
                                <button
                                    onClick={toggleMute}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                        isMuted 
                                            ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                
                                <button
                                    onClick={endCall}
                                    className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <PhoneOff className="w-6 h-6" />
                                </button>
                                
                                <button
                                    className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                                >
                                    <Volume2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestAudioPanel