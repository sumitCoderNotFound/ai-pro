import { useState, useEffect, useCallback, useRef } from 'react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useParticipants,
  VideoTrack,
  useTracks
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Maximize2,
  Minimize2,
  Users,
  Settings,
  Bot,
  Volume2
} from 'lucide-react'

// AI Avatar Component
const AIAvatar = ({ isSpeaking, name }) => {
  const [audioLevels, setAudioLevels] = useState([0.3, 0.5, 0.7, 0.5, 0.3])

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setAudioLevels(prev => prev.map(() => 0.2 + Math.random() * 0.8))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioLevels([0.3, 0.5, 0.7, 0.5, 0.3])
    }
  }, [isSpeaking])

  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden rounded-2xl">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl ${isSpeaking ? 'animate-pulse' : ''}`} />
      <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl ${isSpeaking ? 'animate-pulse' : ''}`} />

      {/* Avatar */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Outer glow */}
        {isSpeaking && (
          <div 
            className="absolute rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-60 blur-xl"
            style={{ 
              width: '300px', 
              height: '300px', 
              top: '-18px', 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
          />
        )}

        {/* Speaking rings */}
        {isSpeaking && (
          <div 
            className="absolute rounded-full border-4 border-purple-400/30 animate-ping"
            style={{ 
              width: '280px', 
              height: '280px', 
              top: '-8px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              animationDuration: '1.5s' 
            }}
          />
        )}

        {/* Main circle */}
        <div 
          className={`
            relative w-64 h-64 rounded-full 
            bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
            flex items-center justify-center
            shadow-2xl
            transition-all duration-300
            ${isSpeaking ? 'scale-105 shadow-purple-500/50' : 'scale-100'}
          `}
        >
          {/* Inner dark circle */}
          <div className="absolute inset-3 rounded-full bg-neutral-900/90 backdrop-blur-sm" />
          
          {/* Bot icon */}
          <div className="relative z-10">
            <Bot className="w-24 h-24 text-white" />
          </div>

          {/* Audio visualization */}
          {isSpeaking && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-10">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className="w-2 bg-white rounded-full transition-all duration-75"
                  style={{ 
                    height: `${level * 100}%`,
                    opacity: 0.6 + level * 0.4
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className={`
          px-4 py-2 rounded-full
          ${isSpeaking ? 'bg-green-500' : 'bg-gray-600'}
          text-white text-sm font-medium
          flex items-center gap-2
          shadow-lg
          transition-colors duration-300
        `}>
          {isSpeaking ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              Speaking...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Listening...
            </>
          )}
        </div>

        {/* Name */}
        <div className="text-center mt-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/60">AI Assistant</p>
        </div>
      </div>
    </div>
  )
}

// Local Video Component
const LocalVideo = ({ participant }) => {
  const videoRef = useRef(null)
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }])
  
  const videoTrack = tracks.find(
    t => t.participant.identity === participant?.identity && t.source === Track.Source.Camera
  )

  return (
    <div className="w-full h-full bg-neutral-800 rounded-2xl overflow-hidden relative">
      {videoTrack?.publication?.track ? (
        <VideoTrack trackRef={videoTrack} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 bg-neutral-700 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {participant?.identity?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      )}
      
      {/* User name overlay */}
      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-sm">
        {participant?.identity || 'You'}
      </div>
    </div>
  )
}

// Custom Video Conference UI with AI Avatar
const VideoConferenceUI = ({ onLeave, agentName }) => {
  const room = useRoomContext()
  const participants = useParticipants()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false)

  // Find AI participant and check if speaking
  useEffect(() => {
    const checkAiSpeaking = () => {
      const aiParticipant = participants.find(p => 
        p.identity.startsWith('agent-') || p.identity.includes('agent')
      )
      if (aiParticipant) {
        setAiIsSpeaking(aiParticipant.isSpeaking)
      }
    }
    
    const interval = setInterval(checkAiSpeaking, 100)
    return () => clearInterval(interval)
  }, [participants])

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMute = useCallback(async () => {
    try {
      await room.localParticipant.setMicrophoneEnabled(isMuted)
      setIsMuted(!isMuted)
    } catch (e) {
      console.error('Error toggling mute:', e)
    }
  }, [room, isMuted])

  const toggleVideo = useCallback(async () => {
    try {
      await room.localParticipant.setCameraEnabled(isVideoOff)
      setIsVideoOff(!isVideoOff)
    } catch (e) {
      console.error('Error toggling video:', e)
    }
  }, [room, isVideoOff])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleLeave = useCallback(async () => {
    try {
      await room.disconnect()
    } catch (e) {
      console.error('Error disconnecting:', e)
    }
    onLeave?.()
  }, [room, onLeave])

  const localParticipant = room.localParticipant

  return (
    <div className="relative h-full bg-neutral-900 rounded-2xl overflow-hidden">
      {/* Call Info Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{formatDuration(callDuration)}</span>
          </div>
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white text-sm">{participants.length}</span>
          </div>
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm">Speaking with {agentName}</span>
          </div>
        </div>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Video Grid */}
      <div className="h-full pt-16 pb-24 flex gap-4 p-4">
        {/* AI Avatar - Left/Main */}
        <div className="flex-1">
          <AIAvatar isSpeaking={aiIsSpeaking} name={agentName} />
        </div>

        {/* User Video - Right/Small */}
        <div className="w-80">
          <LocalVideo participant={localParticipant} />
        </div>
      </div>

      {/* Audio Renderer */}
      <RoomAudioRenderer />

      {/* Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/70 backdrop-blur-sm rounded-2xl z-20">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-xl transition-all ${
            isMuted ? 'bg-red-500 text-white' : 'bg-neutral-700 text-white hover:bg-neutral-600'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-xl transition-all ${
            isVideoOff ? 'bg-red-500 text-white' : 'bg-neutral-700 text-white hover:bg-neutral-600'
          }`}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button
          className="p-4 bg-neutral-700 text-white rounded-xl hover:bg-neutral-600 transition-all"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        <button
          onClick={handleLeave}
          className="p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
          title="End call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

// Main VideoRoom Component
const VideoRoom = ({ 
  serverUrl,
  token, 
  roomName,
  userName = 'Guest',
  agentName = 'AI Assistant',
  onConnected,
  onDisconnected,
  onError
}) => {
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState(null)

  const handleConnected = useCallback(() => {
    setIsConnecting(false)
    onConnected?.()
  }, [onConnected])

  const handleDisconnected = useCallback(() => {
    onDisconnected?.()
  }, [onDisconnected])

  const handleError = useCallback((err) => {
    setError(err.message)
    setIsConnecting(false)
    onError?.(err)
  }, [onError])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-neutral-900 rounded-2xl p-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <VideoOff className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">Connection Error</h3>
        <p className="text-neutral-400 text-center mb-4">{error}</p>
        <button
          onClick={onDisconnected}
          className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      video={true}
      audio={true}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      onError={handleError}
      data-lk-theme="default"
      style={{ height: '100%' }}
    >
      {isConnecting ? (
        <div className="flex flex-col items-center justify-center h-full bg-neutral-900 rounded-2xl">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white text-lg">Connecting to {agentName}...</p>
          <p className="text-neutral-400 text-sm mt-2">Please allow camera and microphone access</p>
        </div>
      ) : (
        <VideoConferenceUI onLeave={onDisconnected} agentName={agentName} />
      )}
    </LiveKitRoom>
  )
}

export default VideoRoom