import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VideoRoom from '@/components/video/VideoRoom'
import livekitService from '@/services/livekit'
import { agentsApi } from '@/services/api'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Settings,
  CheckCircle
} from 'lucide-react'

const VideoCallPage = () => {
  const { agentId } = useParams()
  const navigate = useNavigate()
  
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Pre-call state
  const [isInCall, setIsInCall] = useState(false)
  const [roomData, setRoomData] = useState(null)
  const [token, setToken] = useState(null)
  
  // Device permissions
  const [hasVideoPermission, setHasVideoPermission] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true)
  
  // Preview state
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [previewStream, setPreviewStream] = useState(null)

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await agentsApi.get(agentId)
        setAgent(response)
      } catch (err) {
        setError('Agent not found')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (agentId) {
      fetchAgent()
    }
  }, [agentId])

  // Check and request permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        
        setHasVideoPermission(true)
        setHasAudioPermission(true)
        setPreviewStream(stream)
      } catch (err) {
        console.error('Permission error:', err)
        // Try audio only
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          setHasAudioPermission(true)
          audioStream.getTracks().forEach(track => track.stop())
        } catch (audioErr) {
          console.error('Audio permission denied')
        }
      } finally {
        setIsCheckingPermissions(false)
      }
    }

    checkPermissions()

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Start the video call
  const startCall = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Create room - backend returns token in response
      const room = await livekitService.createRoom(agentId)
      setRoomData(room)
      
      // Token is now included in room response
      setToken(room.token)
      
      // Stop preview stream
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop())
        setPreviewStream(null)
      }
      
      setIsInCall(true)
    } catch (err) {
      setError('Failed to start video call: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // End the call
  const endCall = () => {
    setIsInCall(false)
    setRoomData(null)
    setToken(null)
    navigate('/dashboard/agents')
  }

  // Toggle preview video
  const togglePreviewVideo = () => {
    if (previewStream) {
      previewStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  // Toggle preview audio
  const togglePreviewAudio = () => {
    if (previewStream) {
      previewStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  if (isLoading && !agent) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (error && !agent) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-white text-xl font-semibold mb-2">Error</h2>
        <p className="text-neutral-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/dashboard/agents')}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
        >
          Back to Agents
        </button>
      </div>
    )
  }

  // In-call view
  if (isInCall && token && roomData) {
    return (
      <div className="min-h-screen bg-neutral-900 p-4">
        <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)]">
          <VideoRoom
            serverUrl={roomData.livekit_url || livekitService.getLiveKitUrl()}
            token={token}
            roomName={roomData.name}
            agentName={agent?.name || 'AI Assistant'}
            onDisconnected={endCall}
            onError={(err) => setError(err.message || err)}
          />
        </div>
      </div>
    )
  }

  // Pre-call lobby
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/agents')}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Video Call</h1>
            <p className="text-neutral-400">Connect with {agent?.name || 'AI Agent'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div className="space-y-4">
            <div className="aspect-video bg-neutral-800 rounded-2xl overflow-hidden relative">
              {isCheckingPermissions ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                  <p className="text-neutral-400">Checking camera & microphone...</p>
                </div>
              ) : hasVideoPermission && previewStream && videoEnabled ? (
                <video
                  autoPlay
                  muted
                  playsInline
                  ref={(video) => {
                    if (video && previewStream) {
                      video.srcObject = previewStream
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <VideoOff className="w-16 h-16 text-neutral-600 mb-4" />
                  <p className="text-neutral-400">
                    {hasVideoPermission ? 'Camera is off' : 'Camera access denied'}
                  </p>
                </div>
              )}

              {/* Preview Controls */}
              {!isCheckingPermissions && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <button
                    onClick={togglePreviewAudio}
                    disabled={!hasAudioPermission}
                    className={`p-3 rounded-xl transition-all ${
                      !audioEnabled || !hasAudioPermission
                        ? 'bg-red-500 text-white'
                        : 'bg-neutral-700 text-white hover:bg-neutral-600'
                    }`}
                  >
                    {audioEnabled && hasAudioPermission ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={togglePreviewVideo}
                    disabled={!hasVideoPermission}
                    className={`p-3 rounded-xl transition-all ${
                      !videoEnabled || !hasVideoPermission
                        ? 'bg-red-500 text-white'
                        : 'bg-neutral-700 text-white hover:bg-neutral-600'
                    }`}
                  >
                    {videoEnabled && hasVideoPermission ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <VideoOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Permission Status */}
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-2 ${hasVideoPermission ? 'text-green-500' : 'text-red-500'}`}>
                {hasVideoPermission ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Camera {hasVideoPermission ? 'ready' : 'blocked'}
              </div>
              <div className={`flex items-center gap-2 ${hasAudioPermission ? 'text-green-500' : 'text-red-500'}`}>
                {hasAudioPermission ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Microphone {hasAudioPermission ? 'ready' : 'blocked'}
              </div>
            </div>
          </div>

          {/* Call Info */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{agent?.name || 'AI Assistant'}</h2>
                  <p className="text-neutral-400">{agent?.type || 'Video Agent'}</p>
                </div>
              </div>
              
              {agent?.description && (
                <p className="text-neutral-300 text-sm mb-4">{agent.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Agent is online and ready
              </div>
            </div>

            {/* Call Settings */}
            <div className="bg-neutral-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Call Settings
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-neutral-300">Start with video on</span>
                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      videoEnabled ? 'bg-primary-500' : 'bg-neutral-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      videoEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-neutral-300">Start with audio on</span>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      audioEnabled ? 'bg-primary-500' : 'bg-neutral-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            {/* Start Call Button */}
            <button
              onClick={startCall}
              disabled={isLoading || (!hasVideoPermission && !hasAudioPermission)}
              className="w-full py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6" />
                  Start Video Call
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCallPage