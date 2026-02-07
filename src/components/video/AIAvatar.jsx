import { useState, useEffect, useRef } from 'react'
import { Bot, Volume2, VolumeX } from 'lucide-react'

/**
 * Animated AI Avatar Component
 * Shows a professional AI avatar with:
 * - Pulsing animation when speaking
 * - Audio waveform visualization
 * - Status indicators
 * - Beautiful gradient effects
 */

const AIAvatar = ({ 
  isSpeaking = false, 
  isListening = false,
  isThinking = false,
  name = "AI Assistant",
  avatarUrl = null,  // Optional custom avatar image
  size = "large",    // "small" | "medium" | "large"
  theme = "blue"     // "blue" | "purple" | "green" | "gradient"
}) => {
  const [audioLevels, setAudioLevels] = useState([0.3, 0.5, 0.7, 0.5, 0.3])
  const animationRef = useRef(null)

  // Animate audio levels when speaking
  useEffect(() => {
    if (isSpeaking) {
      const animate = () => {
        setAudioLevels(prev => 
          prev.map(() => 0.2 + Math.random() * 0.8)
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      
      const intervalId = setInterval(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 100)
      
      return () => {
        clearInterval(intervalId)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      setAudioLevels([0.3, 0.5, 0.7, 0.5, 0.3])
    }
  }, [isSpeaking])

  // Size configurations
  const sizeConfig = {
    small: { container: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-xs' },
    medium: { container: 'w-40 h-40', icon: 'w-16 h-16', text: 'text-sm' },
    large: { container: 'w-64 h-64', icon: 'w-24 h-24', text: 'text-base' }
  }

  // Theme configurations
  const themeConfig = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      ring: 'ring-blue-400',
      bg: 'bg-blue-500/20'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      ring: 'ring-purple-400',
      bg: 'bg-purple-500/20'
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50',
      ring: 'ring-green-400',
      bg: 'bg-green-500/20'
    },
    gradient: {
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      ring: 'ring-purple-400',
      bg: 'bg-purple-500/20'
    }
  }

  const currentSize = sizeConfig[size]
  const currentTheme = themeConfig[theme]

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Container */}
      <div className="relative">
        {/* Outer glow ring - pulses when speaking */}
        <div 
          className={`
            absolute inset-0 rounded-full bg-gradient-to-r ${currentTheme.gradient}
            ${isSpeaking ? 'animate-pulse opacity-60' : 'opacity-30'}
            blur-xl transition-opacity duration-300
          `}
          style={{ transform: 'scale(1.2)' }}
        />
        
        {/* Speaking ring animation */}
        {isSpeaking && (
          <>
            <div 
              className={`absolute inset-0 rounded-full border-4 border-white/30 animate-ping`}
              style={{ animationDuration: '1.5s' }}
            />
            <div 
              className={`absolute inset-0 rounded-full border-2 border-white/20 animate-ping`}
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
          </>
        )}

        {/* Main avatar circle */}
        <div 
          className={`
            relative ${currentSize.container} rounded-full 
            bg-gradient-to-br ${currentTheme.gradient}
            flex items-center justify-center
            shadow-2xl ${isSpeaking ? currentTheme.glow : ''}
            transition-all duration-300
            ${isSpeaking ? 'scale-105' : 'scale-100'}
          `}
        >
          {/* Inner dark circle */}
          <div className="absolute inset-2 rounded-full bg-neutral-900/80 backdrop-blur-sm" />
          
          {/* Avatar content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name}
                className={`${currentSize.icon} rounded-full object-cover`}
              />
            ) : (
              <Bot className={`${currentSize.icon} text-white`} />
            )}
          </div>

          {/* Audio visualization bars */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className={`w-1.5 bg-white rounded-full transition-all duration-75`}
                  style={{ 
                    height: `${level * 100}%`,
                    opacity: 0.6 + level * 0.4
                  }}
                />
              ))}
            </div>
          )}

          {/* Listening indicator */}
          {isListening && !isSpeaking && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/80">Listening...</span>
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className={`
          absolute -bottom-1 left-1/2 -translate-x-1/2
          px-3 py-1 rounded-full
          ${isSpeaking ? 'bg-green-500' : isListening ? 'bg-red-500' : isThinking ? 'bg-yellow-500' : 'bg-gray-500'}
          text-white text-xs font-medium
          flex items-center gap-1
          shadow-lg
        `}>
          {isSpeaking ? (
            <>
              <Volume2 className="w-3 h-3" />
              Speaking
            </>
          ) : isListening ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Listening
            </>
          ) : isThinking ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-spin" />
              Thinking
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-white rounded-full" />
              Ready
            </>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="text-center">
        <h3 className={`font-semibold text-white ${currentSize.text}`}>{name}</h3>
        <p className="text-xs text-white/60">AI Assistant</p>
      </div>
    </div>
  )
}

/**
 * Full-screen AI Avatar Display for Video Calls
 * Use this as a replacement for the video feed when showing AI
 */
export const AIAvatarDisplay = ({
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  name = "Hotel Assistant",
  theme = "gradient"
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Gradient orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main avatar */}
      <AIAvatar 
        isSpeaking={isSpeaking}
        isListening={isListening}
        isThinking={isThinking}
        name={name}
        size="large"
        theme={theme}
      />

      {/* Add custom CSS for float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default AIAvatar