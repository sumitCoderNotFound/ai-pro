import { useState } from 'react'
import { Button } from '@/components/ui'
import { 
  X, 
  MessageSquare, 
  GitBranch, 
  Layers, 
  Link2, 
  Plus,
  Phone,
  Users,
  Calendar,
  ClipboardList,
  Building,
  ShoppingCart,
  HeartPulse,
  Undo
} from 'lucide-react'
import { cn } from '@/utils/helpers'

const CreateAgentModal = ({ onClose, initialType = null }) => {
  const [selectedType, setSelectedType] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const agentTypes = [
    {
      id: 'conversation-flow',
      name: 'Conversation Flow Agent',
      description: 'For rigid, highly formatted conversations.',
      icon: GitBranch,
      recommended: true
    },
    {
      id: 'single-prompt',
      name: 'Single Prompt Agent',
      description: 'For simple, freeform conversations.',
      icon: MessageSquare,
    },
    {
      id: 'multi-prompt',
      name: 'Multi-Prompt Agent',
      description: 'For flexible conversations with structured flows.',
      icon: Layers,
    },
    {
      id: 'custom-llm',
      name: 'Custom LLM',
      description: 'Attach your custom LLM link.',
      icon: Link2,
    },
  ]

  const templates = [
    {
      id: 'blank',
      name: 'Start from blank',
      description: null,
      icon: Plus,
      flows: []
    },
    {
      id: 'patient-screening',
      name: 'Patient Screening',
      description: 'Ask questions and log them in the post-call analysis.',
      icon: HeartPulse,
      flows: ['Greetings', 'Screening']
    },
    {
      id: 'lead-qualification',
      name: 'Real Estate Lead Qualification',
      description: 'Ask questions to qualify the leads and book an appointment.',
      icon: Building,
      flows: ['Greetings', 'Schedule']
    },
    {
      id: 'appointment-booking',
      name: 'Appointment Booking',
      description: 'Schedule appointments with calendar integration.',
      icon: Calendar,
      flows: ['Greetings', 'Schedule']
    },
    {
      id: 'customer-support',
      name: 'Customer Support',
      description: 'Handle customer inquiries and route to right team.',
      icon: Users,
      flows: ['Greetings', 'Schedule']
    },
    {
      id: 'order-status',
      name: 'Order Status',
      description: 'Check order status and handle refund requests.',
      icon: ShoppingCart,
      flows: ['Greetings', 'Refund']
    },
  ]

  const handleCreate = () => {
    console.log('Creating agent:', { type: selectedType, template: selectedTemplate })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Create Agent</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Agent Type Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Agent Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {agentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    selectedType === type.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    selectedType === type.id ? "bg-primary-100" : "bg-neutral-100"
                  )}>
                    <type.icon className={cn(
                      "w-5 h-5",
                      selectedType === type.id ? "text-primary-600" : "text-neutral-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      selectedType === type.id ? "text-primary-900" : "text-neutral-900"
                    )}>
                      {type.name}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">{type.description}</p>
                  </div>
                  {/* Radio indicator */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    selectedType === type.id
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300"
                  )}>
                    {selectedType === type.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Select Template</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-xl border-2 text-center transition-all min-h-[140px]",
                    selectedTemplate === template.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  )}
                >
                  {template.id === 'blank' ? (
                    <div className="w-full h-16 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-neutral-400" />
                    </div>
                  ) : (
                    <div className="flex gap-1 mb-3">
                      {template.flows.map((flow, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-medium",
                            idx === 0 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {flow}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={cn(
                    "font-medium text-sm",
                    selectedTemplate === template.id ? "text-primary-900" : "text-neutral-900"
                  )}>
                    {template.name}
                  </p>
                  {template.description && (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            disabled={!selectedType}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateAgentModal
