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
    Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import {
    Save,
    Play,
    Undo,
    Redo,
    ZoomIn,
    ZoomOut,
    Maximize2,
    ArrowLeft,
    Plus,
    Trash2,
    Copy,
    Settings,
    MessageSquare,
    HelpCircle,
    GitBranch,
    Zap,
    Circle,
    StopCircle,
    Loader2,
    Check,
    ChevronRight,
    X
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
    activateFlow: async (flowId) => {
        const response = await fetch(`${API_URL}/api/v1/flows/${flowId}/activate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to activate flow')
        return response.json()
    },
    getTemplates: async () => {
        const response = await fetch(`${API_URL}/api/v1/flows/templates/list`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (!response.ok) throw new Error('Failed to get templates')
        return response.json()
    },
}

// Node palette items
const nodeTypes_palette = [
    { type: 'start', label: 'Start', icon: Circle, color: 'bg-green-500', description: 'Flow entry point' },
    { type: 'message', label: 'Message', icon: MessageSquare, color: 'bg-blue-500', description: 'Send a message' },
    { type: 'question', label: 'Question', icon: HelpCircle, color: 'bg-purple-500', description: 'Ask for input' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-amber-500', description: 'Branch logic' },
    { type: 'action', label: 'Action', icon: Zap, color: 'bg-orange-500', description: 'Trigger action' },
    { type: 'end', label: 'End', icon: StopCircle, color: 'bg-red-500', description: 'End conversation' },
]

const FlowBuilderPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const flowId = searchParams.get('id')
    const agentId = searchParams.get('agentId')

    const reactFlowWrapper = useRef(null)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const [flowName, setFlowName] = useState('New Flow')
    const [flowDescription, setFlowDescription] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState('') // 'saving', 'saved', 'error'

    const [selectedNode, setSelectedNode] = useState(null)
    const [showNodePanel, setShowNodePanel] = useState(false)
    const [showTemplates, setShowTemplates] = useState(false)
    const [templates, setTemplates] = useState([])

    // History for undo/redo
    const [history, setHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // Load flow data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)

                if (flowId) {
                    // Load existing flow
                    const flow = await flowApi.getFlow(flowId)
                    setFlowName(flow.name)
                    setFlowDescription(flow.description || '')
                    setNodes(flow.nodes || [])
                    setEdges(flow.edges || [])
                } else {
                    // New flow - set default start node
                    const defaultNodes = [
                        {
                            id: 'start-1',
                            type: 'start',
                            position: { x: 250, y: 50 },
                            data: { label: 'Start' }
                        }
                    ]
                    setNodes(defaultNodes)
                    setEdges([])
                }

                // Load templates
                const templatesRes = await flowApi.getTemplates()
                setTemplates(templatesRes.templates || [])

            } catch (err) {
                console.error('Error loading flow:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [flowId])

    // Auto-save
    useEffect(() => {
        if (!flowId || isLoading) return

        const autoSave = setTimeout(async () => {
            await handleSave()
        }, 2000)

        return () => clearTimeout(autoSave)
    }, [nodes, edges])

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

    // Handle pane click (deselect)
    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
        setShowNodePanel(false)
    }, [])

    // Add new node
    const addNode = (type) => {
        const newNode = {
            id: `${type}-${Date.now()}`,
            type,
            position: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 300 + 100,
            },
            data: {
                label: type.charAt(0).toUpperCase() + type.slice(1),
                content: '',
            }
        }
        setNodes((nds) => [...nds, newNode])
    }

    // Delete selected node
    const deleteSelectedNode = () => {
        if (!selectedNode) return
        if (selectedNode.type === 'start') {
            alert('Cannot delete the start node')
            return
        }
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
        setSelectedNode(null)
        setShowNodePanel(false)
    }

    // Update node data
    // Update node data
    const updateNodeData = (nodeId, newData) => {
        // First update the nodes array
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } }
                }
                return node
            })
        )

        // Also update selectedNode so the panel shows updated values
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

            if (flowId) {
                await flowApi.updateFlow(flowId, {
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
                // Navigate to the new flow
                navigate(`/dashboard/flow-builder?id=${newFlow.id}`, { replace: true })
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
        if (!flowId) {
            await handleSave()
            return
        }

        try {
            await flowApi.activateFlow(flowId)
            alert('Flow activated successfully!')
        } catch (err) {
            console.error('Error activating flow:', err)
            alert('Failed to activate flow')
        }
    }

    // Load template
    const loadTemplate = (template) => {
        setNodes(template.nodes)
        setEdges(template.edges)
        setFlowName(template.name)
        setFlowDescription(template.description)
        setShowTemplates(false)
    }

    // Drag and drop from palette
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
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
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                        Templates
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
                <div className="w-64 bg-white border-r border-neutral-200 p-4">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">Nodes</h3>
                    <p className="text-xs text-neutral-500 mb-4">Drag nodes to the canvas</p>

                    <div className="space-y-2">
                        {nodeTypes_palette.map((item) => (
                            <div
                                key={item.type}
                                draggable
                                onDragStart={(e) => onDragStart(e, item.type)}
                                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors border border-neutral-200"
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
                            {/* Node Type Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedNode.type === 'start' ? 'bg-green-100 text-green-700' :
                                    selectedNode.type === 'message' ? 'bg-blue-100 text-blue-700' :
                                        selectedNode.type === 'question' ? 'bg-purple-100 text-purple-700' :
                                            selectedNode.type === 'condition' ? 'bg-amber-100 text-amber-700' :
                                                selectedNode.type === 'action' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedNode.type.toUpperCase()}
                                </span>
                            </div>

                            {/* Label */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={selectedNode.data.label || ''}
                                    onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Content (for message/question nodes) */}
                            {['message', 'question'].includes(selectedNode.type) && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                                        {selectedNode.type === 'message' ? 'Message Content' : 'Question Text'}
                                    </label>
                                    <textarea
                                        value={selectedNode.data.content || ''}
                                        onChange={(e) => updateNodeData(selectedNode.id, { content: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder={selectedNode.type === 'message' ? 'Enter the message to send...' : 'Enter your question...'}
                                    />
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Use {'{{variable_name}}'} to insert variables
                                    </p>
                                </div>
                            )}

                            {/* Variable name (for question nodes) */}
                            {selectedNode.type === 'question' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Save Answer To Variable</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.variable_name || ''}
                                            onChange={(e) => updateNodeData(selectedNode.id, { variable_name: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., user_name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Expected Answer Type</label>
                                        <select
                                            value={selectedNode.data.expected_type || 'text'}
                                            onChange={(e) => updateNodeData(selectedNode.id, { expected_type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="text">Free Text</option>
                                            <option value="number">Number</option>
                                            <option value="yes_no">Yes/No</option>
                                            <option value="email">Email</option>
                                            <option value="phone">Phone</option>
                                            <option value="choice">Multiple Choice</option>
                                        </select>
                                    </div>

                                    {selectedNode.data.expected_type === 'choice' && (
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">Choices (one per line)</label>
                                            <textarea
                                                value={(selectedNode.data.choices || []).join('\n')}
                                                onChange={(e) => updateNodeData(selectedNode.id, { choices: e.target.value.split('\n').filter(c => c.trim()) })}
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Conditions (for condition nodes) */}
                            {selectedNode.type === 'condition' && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">Condition</label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={selectedNode.data.conditions?.[0]?.variable || ''}
                                            onChange={(e) => updateNodeData(selectedNode.id, {
                                                conditions: [{ ...selectedNode.data.conditions?.[0], variable: e.target.value }]
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                            placeholder="Variable name"
                                        />
                                        <select
                                            value={selectedNode.data.conditions?.[0]?.operator || 'equals'}
                                            onChange={(e) => updateNodeData(selectedNode.id, {
                                                conditions: [{ ...selectedNode.data.conditions?.[0], operator: e.target.value }]
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                        >
                                            <option value="equals">Equals</option>
                                            <option value="not_equals">Not Equals</option>
                                            <option value="contains">Contains</option>
                                            <option value="greater_than">Greater Than</option>
                                            <option value="less_than">Less Than</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={selectedNode.data.conditions?.[0]?.value || ''}
                                            onChange={(e) => updateNodeData(selectedNode.id, {
                                                conditions: [{ ...selectedNode.data.conditions?.[0], value: e.target.value }]
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                            placeholder="Value to compare"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action config (for action nodes) */}
                            {selectedNode.type === 'action' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Action Type</label>
                                        <select
                                            value={selectedNode.data.action_type || 'webhook'}
                                            onChange={(e) => updateNodeData(selectedNode.id, { action_type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="webhook">Call Webhook</option>
                                            <option value="set_variable">Set Variable</option>
                                            <option value="transfer">Transfer Call</option>
                                            <option value="send_email">Send Email</option>
                                            <option value="send_sms">Send SMS</option>
                                        </select>
                                    </div>

                                    {selectedNode.data.action_type === 'webhook' && (
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">Webhook URL</label>
                                            <input
                                                type="text"
                                                value={selectedNode.data.action_config?.url || ''}
                                                onChange={(e) => updateNodeData(selectedNode.id, {
                                                    action_config: { ...selectedNode.data.action_config, url: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    )}

                                    {selectedNode.data.action_type === 'set_variable' && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-600 mb-1">Variable Name</label>
                                                <input
                                                    type="text"
                                                    value={selectedNode.data.action_config?.variable || ''}
                                                    onChange={(e) => updateNodeData(selectedNode.id, {
                                                        action_config: { ...selectedNode.data.action_config, variable: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                                    placeholder="variable_name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-600 mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={selectedNode.data.action_config?.value || ''}
                                                    onChange={(e) => updateNodeData(selectedNode.id, {
                                                        action_config: { ...selectedNode.data.action_config, value: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                                                    placeholder="value"
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Delete button */}
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

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Flow Templates</h2>
                            <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-4 border border-neutral-200 rounded-xl hover:border-primary-500 cursor-pointer transition-colors"
                                    onClick={() => loadTemplate(template)}
                                >
                                    <h3 className="font-medium text-neutral-900">{template.name}</h3>
                                    <p className="text-sm text-neutral-500 mt-1">{template.description}</p>
                                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
                                        {template.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Wrap with ReactFlowProvider
const FlowBuilderPageWrapper = () => (
    <ReactFlowProvider>
        <FlowBuilderPage />
    </ReactFlowProvider>
)

export default FlowBuilderPageWrapper