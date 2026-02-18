import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'

import {
    Save,
    Play,
    ArrowLeft,
    Trash2,
    MessageSquare,
    HelpCircle,
    GitBranch,
    Zap,
    Circle,
    StopCircle,
    Loader2,
    Check,
    X,
    Wand2,
    Sparkles,
    Lightbulb,
    AlertCircle,
    Plus,
    FileText,
    Clock,
    CheckCircle2
} from 'lucide-react'

// Custom Node Components
import StartNode from '@/components/flow/StartNode'
import MessageNode from '@/components/flow/MessageNode'
import QuestionNode from '@/components/flow/QuestionNode'
import ConditionNode from '@/components/flow/ConditionNode'
import ActionNode from '@/components/flow/ActionNode'
import EndNode from '@/components/flow/EndNode'

// Node types registration
const nodeTypes = {
    start: StartNode,
    message: MessageNode,
    question: QuestionNode,
    condition: ConditionNode,
    action: ActionNode,
    end: EndNode,
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')

// Flow API
const flowApi = {
    getFlow: async (flowId) => {
        const response = await fetch(`${API_URL}/api/v1/flows/${flowId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to get flow')
        return response.json()
    },
    listFlows: async (agentId) => {
        const url = agentId 
            ? `${API_URL}/api/v1/flows?agent_id=${agentId}`
            : `${API_URL}/api/v1/flows`
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to list flows')
        return response.json()
    },
    updateFlow: async (flowId, data) => {
        const response = await fetch(`${API_URL}/api/v1/flows/${flowId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to update flow')
        return response.json()
    },
    createFlow: async (data) => {
        const response = await fetch(`${API_URL}/api/v1/flows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create flow')
        return response.json()
    },
    deleteFlow: async (flowId) => {
        const response = await fetch(`${API_URL}/api/v1/flows/${flowId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to delete flow')
        return response.json()
    },
    activateFlow: async (flowId) => {
        const response = await fetch(`${API_URL}/api/v1/flows/${flowId}/activate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to activate flow')
        return response.json()
    },
    generateFlow: async (data) => {
        const response = await fetch(`${API_URL}/api/v1/flows/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.detail || 'Failed to generate flow')
        }
        return response.json()
    },
}

// Node palette items
const nodePalette = [
    { type: 'start', label: 'Start', icon: Circle, color: 'bg-green-500', description: 'Flow entry point' },
    { type: 'message', label: 'Message', icon: MessageSquare, color: 'bg-blue-500', description: 'Send a message' },
    { type: 'question', label: 'Question', icon: HelpCircle, color: 'bg-purple-500', description: 'Ask for input' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-amber-500', description: 'Branch logic' },
    { type: 'action', label: 'Action', icon: Zap, color: 'bg-orange-500', description: 'Trigger action' },
    { type: 'end', label: 'End', icon: StopCircle, color: 'bg-red-500', description: 'End conversation' },
]

// Example prompts for AI generator
const EXAMPLE_PROMPTS = [
    { title: "Lead Capture", prompt: "Create a lead capture flow that welcomes visitors, asks for their interest (Product Demo, Pricing, Support), collects their email and phone number, then thanks them.", icon: "🎯" },
    { title: "Study Abroad", prompt: "Create a flow for study abroad that asks which country they want to study (UK, USA, Canada, Australia), their preferred study level (Bachelors, Masters, PhD), their budget range, then collects email for recommendations.", icon: "🎓" },
    { title: "Appointment", prompt: "Create an appointment booking flow that asks what service they need, preferred date, preferred time slot (Morning, Afternoon, Evening), collects their name, email and phone, then confirms.", icon: "📅" },
    { title: "Support Ticket", prompt: "Create a support ticket flow that asks the issue category (Technical, Billing, Account), urgency level (Critical, High, Medium, Low), a description, their email, then creates a ticket.", icon: "🎫" },
    { title: "Hotel Booking", prompt: "Create a hotel booking flow that asks check-in date, check-out date, number of guests, room type (Standard, Deluxe, Suite), collects guest name and email, then confirms.", icon: "🏨" },
    { title: "Qualification", prompt: "Create a qualification flow that asks company size (1-10, 11-50, 51-200, 200+), their role, budget range, and timeline. Route enterprise leads differently.", icon: "💼" },
]

const FlowBuilderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const flowId = searchParams.get('id')
    const agentId = searchParams.get('agentId')

    const reactFlowWrapper = useRef(null)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const [currentFlowId, setCurrentFlowId] = useState(flowId)
    const [flowName, setFlowName] = useState('New Flow')
    const [flowDescription, setFlowDescription] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState('')

    const [selectedNode, setSelectedNode] = useState(null)
    const [showNodePanel, setShowNodePanel] = useState(false)
    
    // Flow Selection State
    const [showFlowSelector, setShowFlowSelector] = useState(false)
    const [existingFlows, setExistingFlows] = useState([])
    const [loadingFlows, setLoadingFlows] = useState(false)
    
    // AI Generator State
    const [showAIGenerator, setShowAIGenerator] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiFlowName, setAiFlowName] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generateError, setGenerateError] = useState('')
    const [generateSuccess, setGenerateSuccess] = useState('')

    // Check for existing flows on mount
    useEffect(() => {
        const checkExistingFlows = async () => {
            if (!agentId || flowId) {
                // If we already have a flowId, just load it
                return
            }

            try {
                setLoadingFlows(true)
                const flows = await flowApi.listFlows(agentId)
                
                if (flows && flows.length > 0) {
                    setExistingFlows(flows)
                    setShowFlowSelector(true)
                }
            } catch (err) {
                console.error('Error checking flows:', err)
            } finally {
                setLoadingFlows(false)
            }
        }

        checkExistingFlows()
    }, [agentId, flowId])

    // Load flow data
    useEffect(() => {
        const loadData = async () => {
            // Don't load if showing flow selector
            if (showFlowSelector) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const idToLoad = currentFlowId || flowId

                if (idToLoad) {
                    console.log('Loading flow:', idToLoad)
                    const flow = await flowApi.getFlow(idToLoad)
                    setFlowName(flow.name)
                    setFlowDescription(flow.description || '')
                    setNodes(flow.nodes || [])
                    setEdges(flow.edges || [])
                    console.log('Flow loaded:', flow.name, 'Nodes:', flow.nodes?.length)
                } else {
                    // New flow - set default start node
                    const defaultNodes = [
                        {
                            id: 'start-1',
                            type: 'start',
                            position: { x: 400, y: 50 },
                            data: { label: 'Start' }
                        }
                    ]
                    setNodes(defaultNodes)
                    setEdges([])
                }
            } catch (err) {
                console.error('Error loading flow:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [flowId, currentFlowId, showFlowSelector])

    // Select existing flow
    const selectFlow = (flow) => {
        setCurrentFlowId(flow.id)
        setSearchParams({ id: flow.id, agentId })
        setShowFlowSelector(false)
    }

    // Create new flow
    const createNewFlow = () => {
        setCurrentFlowId(null)
        setFlowName('New Flow')
        setFlowDescription('')
        setNodes([
            {
                id: 'start-1',
                type: 'start',
                position: { x: 400, y: 50 },
                data: { label: 'Start' }
            }
        ])
        setEdges([])
        setShowFlowSelector(false)
    }

    // Delete flow
    const deleteFlow = async (flowIdToDelete, e) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this flow?')) return

        try {
            await flowApi.deleteFlow(flowIdToDelete)
            setExistingFlows(flows => flows.filter(f => f.id !== flowIdToDelete))
        } catch (err) {
            console.error('Error deleting flow:', err)
            alert('Failed to delete flow')
        }
    }

    // Handle edge connection
    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge({
                ...params,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#6366f1', strokeWidth: 2 }
            }, eds))
        },
        [setEdges]
    )

    // Handle node click
    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node)
        setShowNodePanel(true)
    }, [])

    // Handle pane click
    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
        setShowNodePanel(false)
    }, [])

    // Delete selected node
    const deleteSelectedNode = () => {
        if (!selectedNode || selectedNode.type === 'start') return
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
        setSelectedNode(null)
        setShowNodePanel(false)
    }

    // Update node data
    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } }
                }
                return node
            })
        )
        setSelectedNode((prev) => {
            if (prev && prev.id === nodeId) {
                return { ...prev, data: { ...prev.data, ...newData } }
            }
            return prev
        })
    }

    // Save flow
    const handleSave = async () => {
        try {
            setIsSaving(true)
            setSaveStatus('saving')

            const viewport = reactFlowInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
            const idToSave = currentFlowId || flowId

            if (idToSave) {
                await flowApi.updateFlow(idToSave, {
                    name: flowName,
                    description: flowDescription,
                    nodes,
                    edges,
                    viewport
                })
            } else if (agentId) {
                const newFlow = await flowApi.createFlow({
                    name: flowName,
                    description: flowDescription,
                    agent_id: agentId,
                    nodes,
                    edges
                })
                setCurrentFlowId(newFlow.id)
                setSearchParams({ id: newFlow.id, agentId })
            }

            setSaveStatus('saved')
            setTimeout(() => setSaveStatus(''), 2000)
        } catch (err) {
            console.error('Error saving flow:', err)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }

    // Activate flow
    const handleActivate = async () => {
        const idToActivate = currentFlowId || flowId
        
        if (!idToActivate) {
            await handleSave()
            return
        }

        try {
            await flowApi.activateFlow(idToActivate)
            alert('Flow activated successfully!')
        } catch (err) {
            console.error('Error activating flow:', err)
            alert('Failed to activate flow')
        }
    }

    // AI Generate Flow
    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            setGenerateError('Please describe the flow you want to create')
            return
        }

        if (!agentId) {
            setGenerateError('Agent ID is required to generate a flow')
            return
        }

        setIsGenerating(true)
        setGenerateError('')
        setGenerateSuccess('')

        try {
            const data = await flowApi.generateFlow({
                prompt: aiPrompt,
                agent_id: agentId,
                flow_name: aiFlowName || undefined
            })

            console.log('AI Generated flow:', data)

            setNodes(data.nodes || [])
            setEdges(data.edges || [])
            setFlowName(data.name || 'AI Generated Flow')
            setFlowDescription(data.description || '')
            
            if (data.id) {
                setCurrentFlowId(data.id)
                setSearchParams({ id: data.id, agentId })
            }

            setGenerateSuccess(`✨ Generated "${data.name}" with ${data.node_count || data.nodes?.length} nodes!`)

            setTimeout(() => {
                setShowAIGenerator(false)
                setAiPrompt('')
                setAiFlowName('')
                setGenerateSuccess('')
                setGenerateError('')
            }, 1500)

        } catch (err) {
            console.error('AI Generation error:', err)
            setGenerateError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    // Use example prompt
    const useExamplePrompt = (example) => {
        setAiPrompt(example.prompt)
        setAiFlowName(example.title + ' Flow')
    }

    // Drag and drop
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            const type = event.dataTransfer.getData('application/reactflow')
            if (!type || !reactFlowInstance) return

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            })

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: type.charAt(0).toUpperCase() + type.slice(1) }
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance]
    )

    // Fit view when nodes change significantly
    useEffect(() => {
        if (reactFlowInstance && nodes.length > 1) {
            setTimeout(() => {
                reactFlowInstance.fitView({ padding: 0.2 })
            }, 100)
        }
    }, [nodes.length, reactFlowInstance])

    if (isLoading || loadingFlows) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        )
    }

    // Flow Selector Modal
    if (showFlowSelector) {
        return (
            <div className="h-screen bg-neutral-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Conversation Flows</h2>
                                <p className="text-sm text-neutral-500">Select an existing flow or create a new one</p>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-white/50 rounded-lg"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {/* Create New Flow Button */}
                        <button
                            onClick={createNewFlow}
                            className="w-full mb-4 p-4 border-2 border-dashed border-primary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center gap-3 group"
                        >
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200">
                                <Plus className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-primary-700">Create New Flow</p>
                                <p className="text-sm text-primary-500">Start from scratch</p>
                            </div>
                        </button>

                        {/* AI Generate Button */}
                        <button
                            onClick={() => {
                                setShowFlowSelector(false)
                                setShowAIGenerator(true)
                            }}
                            className="w-full mb-6 p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-3 text-white"
                        >
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Generate with AI</p>
                                <p className="text-sm text-white/80">Describe your flow in plain English</p>
                            </div>
                        </button>

                        {/* Existing Flows */}
                        {existingFlows.length > 0 && (
                            <>
                                <h3 className="text-sm font-semibold text-neutral-500 mb-3">EXISTING FLOWS</h3>
                                <div className="space-y-2">
                                    {existingFlows.map((flow) => (
                                        <div
                                            key={flow.id}
                                            onClick={() => selectFlow(flow)}
                                            className="p-4 border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100">
                                                        <FileText className="w-5 h-5 text-neutral-500 group-hover:text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-neutral-800">{flow.name}</p>
                                                            {flow.is_active && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Active
                                                                </span>
                                                            )}
                                                            {flow.is_draft && (
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                                                    Draft
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                                                            <span>{flow.nodes?.length || 0} nodes</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(flow.updated_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => deleteFlow(flow.id, e)}
                                                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-neutral-100">
            {/* Top Toolbar */}
            <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                            placeholder="Flow Name"
                        />
                        {saveStatus === 'saving' && (
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </span>
                        )}
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Saved
                            </span>
                        )}
                        <span className="text-xs text-neutral-400 ml-2">
                            {nodes.length} nodes
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Show Flows Button */}
                    <button
                        onClick={async () => {
                            const flows = await flowApi.listFlows(agentId)
                            setExistingFlows(flows || [])
                            setShowFlowSelector(true)
                        }}
                        className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Flows
                    </button>

                    {/* AI Generate Button */}
                    <button
                        onClick={() => setShowAIGenerator(true)}
                        className="px-4 py-1.5 text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 flex items-center gap-2 shadow-md shadow-purple-200"
                    >
                        <Wand2 className="w-4 h-4" />
                        AI Generate
                    </button>
                    
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                    <button
                        onClick={handleActivate}
                        className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        Activate
                    </button>
                </div>
            </div>

            <div className="flex-1 flex">
                {/* Left Sidebar - Node Palette */}
                <div className="w-64 bg-white border-r border-neutral-200 p-4 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">Nodes</h3>
                    <p className="text-xs text-neutral-500 mb-4">Drag nodes to the canvas</p>

                    <div className="space-y-2">
                        {nodePalette.map((item) => (
                            <div
                                key={item.type}
                                draggable
                                onDragStart={(e) => onDragStart(e, item.type)}
                                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors border border-neutral-200 active:cursor-grabbing"
                            >
                                <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                                    <item.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                                    <p className="text-xs text-neutral-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick AI Generate */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-800">AI Flow Generator</span>
                        </div>
                        <p className="text-xs text-purple-600 mb-3">
                            Describe your flow in plain English!
                        </p>
                        <button
                            onClick={() => setShowAIGenerator(true)}
                            className="w-full py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-violet-600 hover:to-purple-700 flex items-center justify-center gap-2"
                        >
                            <Wand2 className="w-4 h-4" />
                            Generate with AI
                        </button>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                        snapToGrid
                        snapGrid={[15, 15]}
                        defaultEdgeOptions={{
                            type: 'smoothstep',
                            animated: true,
                            style: { stroke: '#6366f1', strokeWidth: 2 }
                        }}
                    >
                        <Background variant="dots" gap={20} size={1} color="#e5e7eb" />
                        <Controls />
                        <MiniMap
                            nodeColor={(node) => {
                                switch (node.type) {
                                    case 'start': return '#22c55e'
                                    case 'message': return '#3b82f6'
                                    case 'question': return '#a855f7'
                                    case 'condition': return '#f59e0b'
                                    case 'action': return '#f97316'
                                    case 'end': return '#ef4444'
                                    default: return '#6b7280'
                                }
                            }}
                        />
                    </ReactFlow>
                </div>

                {/* Right Sidebar - Node Properties */}
                {showNodePanel && selectedNode && (
                    <div className="w-80 bg-white border-l border-neutral-200 p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-neutral-700">Node Properties</h3>
                            <button
                                onClick={() => setShowNodePanel(false)}
                                className="p-1 hover:bg-neutral-100 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    selectedNode.type === 'start' ? 'bg-green-100 text-green-700' :
                                    selectedNode.type === 'message' ? 'bg-blue-100 text-blue-700' :
                                    selectedNode.type === 'question' ? 'bg-purple-100 text-purple-700' :
                                    selectedNode.type === 'condition' ? 'bg-amber-100 text-amber-700' :
                                    selectedNode.type === 'action' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {selectedNode.type.toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={selectedNode.data.label || ''}
                                    onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {['message', 'question'].includes(selectedNode.type) && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                                        {selectedNode.type === 'message' ? 'Message' : 'Question'}
                                    </label>
                                    <textarea
                                        value={selectedNode.data.content || selectedNode.data.message || selectedNode.data.question || ''}
                                        onChange={(e) => updateNodeData(selectedNode.id, { 
                                            content: e.target.value,
                                            message: e.target.value,
                                            question: e.target.value 
                                        })}
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder={selectedNode.type === 'message' ? 'Enter message...' : 'Enter question...'}
                                    />
                                </div>
                            )}

                            {selectedNode.type === 'question' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Save Answer As</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.saveAs || selectedNode.data.variable_name || ''}
                                            onChange={(e) => updateNodeData(selectedNode.id, { saveAs: e.target.value, variable_name: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                            placeholder="e.g., user_email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Input Type</label>
                                        <select
                                            value={selectedNode.data.inputType || selectedNode.data.expected_type || 'text'}
                                            onChange={(e) => updateNodeData(selectedNode.id, { inputType: e.target.value, expected_type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="tel">Phone</option>
                                            <option value="date">Date</option>
                                            <option value="number">Number</option>
                                            <option value="choice">Multiple Choice</option>
                                        </select>
                                    </div>

                                    {(selectedNode.data.inputType === 'choice' || selectedNode.data.expected_type === 'choice' || selectedNode.data.options) && (
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">Options</label>
                                            <textarea
                                                value={(selectedNode.data.options || selectedNode.data.choices || []).join('\n')}
                                                onChange={(e) => {
                                                    const options = e.target.value.split('\n').filter(c => c.trim())
                                                    updateNodeData(selectedNode.id, { options, choices: options })
                                                }}
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                                placeholder="Option 1&#10;Option 2"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {selectedNode.type === 'condition' && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">Check Variable</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.condition || ''}
                                        onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                        placeholder="Variable name"
                                    />
                                </div>
                            )}

                            {selectedNode.type === 'action' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Action Type</label>
                                        <select
                                            value={selectedNode.data.actionType || selectedNode.data.action_type || 'save_lead'}
                                            onChange={(e) => updateNodeData(selectedNode.id, { actionType: e.target.value, action_type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                        >
                                            <option value="save_lead">Save Lead</option>
                                            <option value="send_email">Send Email</option>
                                            <option value="book_appointment">Book Appointment</option>
                                            <option value="webhook">Call Webhook</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {selectedNode.type !== 'start' && (
                                <button
                                    onClick={deleteSelectedNode}
                                    className="w-full mt-4 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Node
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Flow Generator Modal */}
            {showAIGenerator && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !isGenerating && setShowAIGenerator(false)}
                    />
                    
                    <div className="absolute inset-4 md:inset-y-10 md:inset-x-20 lg:inset-x-40 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
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
                                    onClick={() => !isGenerating && setShowAIGenerator(false)}
                                    className="p-2 hover:bg-white/50 rounded-lg"
                                    disabled={isGenerating}
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Flow Name (optional)</label>
                                    <input
                                        type="text"
                                        value={aiFlowName}
                                        onChange={(e) => setAiFlowName(e.target.value)}
                                        placeholder="e.g., Lead Capture Flow"
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={isGenerating}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Describe your conversation flow</label>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Example: Create a flow that welcomes visitors, asks what service they're interested in..."
                                        rows={8}
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                        disabled={isGenerating}
                                    />
                                </div>

                                {generateError && (
                                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-sm">{generateError}</span>
                                    </div>
                                )}

                                {generateSuccess && (
                                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600">
                                        <Check className="w-5 h-5" />
                                        <span className="text-sm">{generateSuccess}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

                            <div className="w-80 border-l border-neutral-200 bg-neutral-50 p-4 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-semibold text-neutral-700">Examples</h3>
                                </div>

                                <div className="space-y-3">
                                    {EXAMPLE_PROMPTS.map((example, index) => (
                                        <button
                                            key={index}
                                            onClick={() => useExamplePrompt(example)}
                                            className="w-full text-left p-3 bg-white border border-neutral-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                                            disabled={isGenerating}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">{example.icon}</span>
                                                <span className="font-medium text-neutral-800 group-hover:text-purple-600">{example.title}</span>
                                            </div>
                                            <p className="text-xs text-neutral-500 line-clamp-2">{example.prompt}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const FlowBuilderPageWrapper = () => (
    <ReactFlowProvider>
        <FlowBuilderPage />
    </ReactFlowProvider>
)

export default FlowBuilderPageWrapper