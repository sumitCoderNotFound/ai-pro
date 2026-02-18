import { useState } from 'react'
import { 
  X, 
  Sparkles, 
  Wand2, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Example prompts for inspiration
const EXAMPLE_PROMPTS = [
  {
    title: "Lead Capture",
    prompt: "Create a lead capture flow that welcomes visitors, asks for their interest (Product Demo, Pricing, Support), collects their email and phone number, then thanks them.",
    icon: "🎯"
  },
  {
    title: "Study Abroad Advisor",
    prompt: "Create a flow for Crizac Study Abroad that asks which country they want to study (UK, USA, Canada, Australia), their preferred study level (Bachelors, Masters, PhD), their budget range, then collects email for university recommendations.",
    icon: "🎓"
  },
  {
    title: "Appointment Booking",
    prompt: "Create an appointment booking flow that asks what service they need (Consultation, Demo, Support), preferred date, preferred time slot (Morning, Afternoon, Evening), collects their name, email and phone, then confirms the booking.",
    icon: "📅"
  },
  {
    title: "Customer Support",
    prompt: "Create a support ticket flow that asks the issue category (Technical, Billing, Account, Other), urgency level (Critical, High, Medium, Low), a description of the issue, their email, then creates a support ticket.",
    icon: "🎫"
  },
  {
    title: "Hotel Booking",
    prompt: "Create a hotel booking flow that asks check-in date, check-out date, number of guests, room type (Standard, Deluxe, Suite), collects guest name and email, then confirms the reservation.",
    icon: "🏨"
  },
  {
    title: "Product Qualification",
    prompt: "Create a qualification flow that asks company size (1-10, 11-50, 51-200, 200+), their role, budget range, and timeline. If enterprise (200+), route to enterprise message, otherwise show standard options.",
    icon: "💼"
  }
]

const AIFlowGeneratorModal = ({ isOpen, onClose, agentId, onFlowGenerated }) => {
  const [prompt, setPrompt] = useState('')
  const [flowName, setFlowName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedFlow, setGeneratedFlow] = useState(null)

  if (!isOpen) return null

  const getToken = () => localStorage.getItem('convohubai_access_token')

  const handleGenerate = async (saveToDb = true) => {
    if (!prompt.trim()) {
      setError('Please describe the flow you want to create')
      return
    }

    setIsGenerating(true)
    setError('')
    setSuccess('')
    setGeneratedFlow(null)

    try {
      const endpoint = saveToDb ? '/api/v1/flows/generate' : '/api/v1/flows/generate/preview'
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          prompt: prompt,
          agent_id: agentId,
          flow_name: flowName || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate flow')
      }

      const data = await response.json()
      setGeneratedFlow(data)
      
      if (saveToDb) {
        setSuccess(`✨ Flow "${data.name}" created with ${data.node_count} nodes!`)
        if (onFlowGenerated) {
          onFlowGenerated(data)
        }
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseExample = (example) => {
    setPrompt(example.prompt)
    setFlowName(example.title + ' Flow')
  }

  const handleClose = () => {
    setPrompt('')
    setFlowName('')
    setError('')
    setSuccess('')
    setGeneratedFlow(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-y-10 md:inset-x-20 lg:inset-x-40 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">AI Flow Generator</h2>
                <p className="text-sm text-neutral-500">Describe your flow in plain English</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Input */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Flow Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Flow Name (optional)
              </label>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="e.g., Lead Capture Flow"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Prompt Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Describe your conversation flow
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a flow that welcomes visitors, asks what service they're interested in (Sales, Support, Partnerships), collects their email and phone number, then thanks them and says someone will contact them soon."
                rows={6}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="mt-2 text-xs text-neutral-400">
                💡 Tip: Be specific about questions, options, conditions, and actions
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Generate Button */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleGenerate(true)}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Flow
                  </>
                )}
              </button>
            </div>

            {/* Generated Flow Preview */}
            {generatedFlow && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Generated: {generatedFlow.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{generatedFlow.node_count || generatedFlow.nodes?.length}</div>
                    <div className="text-xs text-neutral-500">Nodes</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{generatedFlow.edge_count || generatedFlow.edges?.length}</div>
                    <div className="text-xs text-neutral-500">Connections</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-xs text-neutral-500">Ready</div>
                  </div>
                </div>
                
                {/* Node list */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {generatedFlow.nodes?.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-2 text-sm">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${
                        node.type === 'start' ? 'bg-green-500' :
                        node.type === 'end' ? 'bg-red-500' :
                        node.type === 'message' ? 'bg-blue-500' :
                        node.type === 'question' ? 'bg-amber-500' :
                        node.type === 'condition' ? 'bg-pink-500' :
                        'bg-purple-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-neutral-600">{node.data?.label || node.type}</span>
                      <span className="text-neutral-400 text-xs">({node.type})</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleClose}
                  className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Open in Flow Builder →
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Examples */}
          <div className="w-80 border-l border-neutral-200 bg-neutral-50 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-neutral-700">Example Prompts</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Click any example to use it
            </p>

            <div className="space-y-3">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleUseExample(example)}
                  className="w-full text-left p-3 bg-white border border-neutral-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{example.icon}</span>
                    <span className="font-medium text-neutral-800 group-hover:text-purple-600">
                      {example.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {example.prompt}
                  </p>
                </button>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <h4 className="font-medium text-purple-800 mb-2">💡 Writing Tips</h4>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Specify questions with options</li>
                <li>• Mention conditions for branching</li>
                <li>• Include what data to collect</li>
                <li>• Describe actions (save, email)</li>
                <li>• Add welcome/thank you messages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIFlowGeneratorModal