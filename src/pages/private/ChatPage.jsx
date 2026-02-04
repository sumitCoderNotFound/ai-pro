import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom'

import { agentsApi } from '@/services/api'
import {
  Send, Bot, User, Loader2, MessageSquare, Plus, Trash2, Settings, Sparkles,
  ChevronDown, Globe, Cpu, MessageCircle, Shield, Webhook, Database, Play,
  RotateCcw, Check, X, Upload, FileText, Unlink, TestTube, Zap,
  GitBranch
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('convohubai_access_token')


// API Functions
const chatApi = {
  sendMessage: async (agentId, message, conversationId = null) => {
    const response = await fetch(`${API_URL}/api/v1/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ agent_id: agentId, message, conversation_id: conversationId })
    })
    if (!response.ok) { const error = await response.json(); throw new Error(error.detail || 'Failed to send message') }
    return response.json()
  },
}

const knowledgeBaseApi = {
  list: async () => {
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases`, { headers: { 'Authorization': `Bearer ${getToken()}` } })
    if (!response.ok) throw new Error('Failed to fetch knowledge bases')
    return response.json()
  },
  create: async (data) => {
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create knowledge base')
    return response.json()
  },
  connectToAgent: async (agentId, knowledgeBaseId) => {
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases/connect-to-agent/${agentId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ knowledge_base_id: knowledgeBaseId })
    })
    if (!response.ok) throw new Error('Failed to connect knowledge base')
    return response.json()
  },
  disconnectFromAgent: async (agentId) => {
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases/disconnect-from-agent/${agentId}`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to disconnect')
    return response.json()
  },
  getDocuments: async (kbId) => {
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases/${kbId}/documents`, { headers: { 'Authorization': `Bearer ${getToken()}` } })
    if (!response.ok) throw new Error('Failed to fetch documents')
    return response.json()
  },
  uploadDocument: async (kbId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_URL}/api/v1/knowledge-bases/${kbId}/documents`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData
    })
    if (!response.ok) throw new Error('Failed to upload document')
    return response.json()
  },
}

const webhooksApi = {
  list: async (agentId) => {
    const url = agentId ? `${API_URL}/api/v1/webhooks?agent_id=${agentId}` : `${API_URL}/api/v1/webhooks`
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${getToken()}` } })
    if (!response.ok) throw new Error('Failed to fetch webhooks')
    return response.json()
  },
  create: async (data) => {
    const response = await fetch(`${API_URL}/api/v1/webhooks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create webhook')
    return response.json()
  },
  delete: async (webhookId) => {
    const response = await fetch(`${API_URL}/api/v1/webhooks/${webhookId}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to delete webhook')
    return response.json()
  },
  test: async (webhookId) => {
    const response = await fetch(`${API_URL}/api/v1/webhooks/${webhookId}/test`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ event_type: 'test' })
    })
    if (!response.ok) throw new Error('Failed to test webhook')
    return response.json()
  },
}

const simulationApi = {
  run: async (data) => {
    const response = await fetch(`${API_URL}/api/v1/simulation/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to run simulation')
    return response.json()
  },
  getPersonas: async () => {
    const response = await fetch(`${API_URL}/api/v1/simulation/personas`, { headers: { 'Authorization': `Bearer ${getToken()}` } })
    if (!response.ok) throw new Error('Failed to fetch personas')
    return response.json()
  },
}

const agentSettingsApi = {
  updateSettings: async (agentId, settings) => {
    const params = new URLSearchParams()
    if (settings.response_style) params.append('response_style', settings.response_style)
    if (settings.max_tokens) params.append('max_tokens', settings.max_tokens)
    if (settings.content_filter_enabled !== undefined) params.append('content_filter_enabled', settings.content_filter_enabled)
    if (settings.fallback_message) params.append('fallback_message', settings.fallback_message)
    const response = await fetch(`${API_URL}/api/v1/agents/${agentId}/settings?${params.toString()}`, {
      method: 'PATCH', headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to update settings')
    return response.json()
  },
  publish: async (agentId) => {
    const response = await fetch(`${API_URL}/api/v1/agents/${agentId}/publish`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) { const error = await response.json(); throw new Error(error.detail || 'Failed to publish') }
    return response.json()
  },
  unpublish: async (agentId) => {
    const response = await fetch(`${API_URL}/api/v1/agents/${agentId}/unpublish`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Failed to unpublish')
    return response.json()
  },
}

// Components
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-neutral-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

const MessageBubble = ({ message, isUser }) => (
  <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-100' : 'bg-neutral-800'}`}>
      {isUser ? <User className="w-4 h-4 text-primary-600" /> : <Bot className="w-4 h-4 text-white" />}
    </div>
    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      <p className={`text-xs mt-1.5 ${isUser ? 'text-primary-200' : 'text-neutral-400'}`}>
        {new Date(message.timestamp || message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
)

const KnowledgeBaseSection = ({ agent, onUpdate }) => {
  const [knowledgeBases, setKnowledgeBases] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKbName, setNewKbName] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => { knowledgeBaseApi.list().then(setKnowledgeBases).catch(console.error) }, [])
  useEffect(() => { if (agent?.knowledge_base_id) knowledgeBaseApi.getDocuments(agent.knowledge_base_id).then(setDocuments).catch(console.error) }, [agent?.knowledge_base_id])

  const handleCreateKb = async () => {
    if (!newKbName.trim()) return
    setIsLoading(true)
    try { await knowledgeBaseApi.create({ name: newKbName }); setNewKbName(''); setShowCreateModal(false); const data = await knowledgeBaseApi.list(); setKnowledgeBases(data) }
    catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleConnect = async (kbId) => {
    setIsLoading(true)
    try { await knowledgeBaseApi.connectToAgent(agent.id, kbId); onUpdate?.() }
    catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try { await knowledgeBaseApi.disconnectFromAgent(agent.id); setDocuments([]); onUpdate?.() }
    catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !agent?.knowledge_base_id) return
    setIsLoading(true)
    try { await knowledgeBaseApi.uploadDocument(agent.knowledge_base_id, file); const docs = await knowledgeBaseApi.getDocuments(agent.knowledge_base_id); setDocuments(docs) }
    catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const connectedKb = knowledgeBases.find(kb => kb.id === agent?.knowledge_base_id)

  return (
    <div className="space-y-3">
      {connectedKb ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Database className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-green-700">{connectedKb.name}</span></div>
            <button onClick={handleDisconnect} disabled={isLoading} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"><Unlink className="w-3 h-3" />Disconnect</button>
          </div>
          <p className="text-xs text-green-600 mt-1">{connectedKb.document_count} documents</p>
          {documents.length > 0 && <div className="mt-3 space-y-2">{documents.map(doc => <div key={doc.id} className="flex items-center gap-2 text-xs text-neutral-600"><FileText className="w-3 h-3" /><span>{doc.name}</span></div>)}</div>}
          <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt,.md,.csv,.json" />
          <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 disabled:opacity-50"><Upload className="w-3 h-3" />Upload Document</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500">No knowledge base connected.</p>
          {knowledgeBases.length > 0 && <select onChange={(e) => e.target.value && handleConnect(e.target.value)} className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2" disabled={isLoading}><option value="">Select a knowledge base...</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.name}</option>)}</select>}
          <button onClick={() => setShowCreateModal(true)} className="text-primary-600 hover:underline text-sm flex items-center gap-1"><Plus className="w-3 h-3" />Create New Knowledge Base</button>
        </>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Knowledge Base</h3>
            <input type="text" value={newKbName} onChange={(e) => setNewKbName(e.target.value)} placeholder="Knowledge base name" className="w-full px-3 py-2 border border-neutral-300 rounded-lg mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg">Cancel</button>
              <button onClick={handleCreateKb} disabled={isLoading || !newKbName.trim()} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const WebhookSection = ({ agent }) => {
  const [webhooks, setWebhooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '' })
  const [testResult, setTestResult] = useState(null)

  useEffect(() => { if (agent?.id) webhooksApi.list(agent.id).then(setWebhooks).catch(console.error) }, [agent?.id])

  const handleCreate = async () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) return
    setIsLoading(true)
    try { await webhooksApi.create({ name: newWebhook.name, url: newWebhook.url, agent_id: agent.id, events: ['conversation_started', 'message_received', 'conversation_ended'] }); setNewWebhook({ name: '', url: '' }); setShowCreateModal(false); const data = await webhooksApi.list(agent.id); setWebhooks(data) }
    catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleDelete = async (webhookId) => {
    if (!confirm('Delete this webhook?')) return
    try { await webhooksApi.delete(webhookId); const data = await webhooksApi.list(agent.id); setWebhooks(data) }
    catch (err) { console.error(err) }
  }

  const handleTest = async (webhookId) => {
    setTestResult(null)
    try { const result = await webhooksApi.test(webhookId); setTestResult({ id: webhookId, ...result }) }
    catch (err) { setTestResult({ id: webhookId, success: false, error: err.message }) }
  }

  return (
    <div className="space-y-3">
      {webhooks.length > 0 ? (
        <div className="space-y-2">
          {webhooks.map(wh => (
            <div key={wh.id} className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{wh.name}</p><p className="text-xs text-neutral-500 truncate max-w-[200px]">{wh.url}</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleTest(wh.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Test"><TestTube className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(wh.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {testResult?.id === wh.id && <div className={`mt-2 text-xs p-2 rounded ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{testResult.success ? '✓ Test successful' : `✗ ${testResult.error || testResult.message}`}</div>}
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-neutral-500">No webhooks configured.</p>}
      <button onClick={() => setShowCreateModal(true)} className="text-primary-600 hover:underline text-sm flex items-center gap-1"><Plus className="w-3 h-3" />Add Webhook</button>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Webhook</h3>
            <input type="text" value={newWebhook.name} onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))} placeholder="Webhook name" className="w-full px-3 py-2 border border-neutral-300 rounded-lg mb-3" />
            <input type="url" value={newWebhook.url} onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))} placeholder="https://your-webhook-url.com/endpoint" className="w-full px-3 py-2 border border-neutral-300 rounded-lg mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg">Cancel</button>
              <button onClick={handleCreate} disabled={isLoading || !newWebhook.name.trim() || !newWebhook.url.trim()} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Adding...' : 'Add Webhook'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ChatSettingsSection = ({ agent, onUpdate }) => {
  const [responseStyle, setResponseStyle] = useState(agent?.response_style || 'conversational')
  const [maxTokens, setMaxTokens] = useState(agent?.max_tokens || '500')
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => { setResponseStyle(agent?.response_style || 'conversational'); setMaxTokens(agent?.max_tokens || '500') }, [agent])
  const handleSave = async () => { setIsSaving(true); try { await agentSettingsApi.updateSettings(agent.id, { response_style: responseStyle, max_tokens: maxTokens }); onUpdate?.() } catch (err) { console.error(err) } finally { setIsSaving(false) } }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><span className="text-sm text-neutral-600">Response Style</span><select value={responseStyle} onChange={(e) => setResponseStyle(e.target.value)} className="text-sm border border-neutral-300 rounded-lg px-2 py-1"><option value="conversational">Conversational</option><option value="formal">Formal</option><option value="concise">Concise</option></select></div>
      <div className="flex items-center justify-between"><span className="text-sm text-neutral-600">Max Response Length</span><input type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} className="w-20 text-sm border border-neutral-300 rounded-lg px-2 py-1 text-right" /></div>
      <button onClick={handleSave} disabled={isSaving} className="w-full mt-2 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm hover:bg-neutral-200 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Settings'}</button>
    </div>
  )
}

const SecuritySettingsSection = ({ agent, onUpdate }) => {
  const [contentFilterEnabled, setContentFilterEnabled] = useState(agent?.content_filter_enabled ?? true)
  const [fallbackMessage, setFallbackMessage] = useState(agent?.fallback_message || "I'm sorry, I didn't understand that.")
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => { setContentFilterEnabled(agent?.content_filter_enabled ?? true); setFallbackMessage(agent?.fallback_message || "I'm sorry, I didn't understand that.") }, [agent])
  const handleSave = async () => { setIsSaving(true); try { await agentSettingsApi.updateSettings(agent.id, { content_filter_enabled: contentFilterEnabled, fallback_message: fallbackMessage }); onUpdate?.() } catch (err) { console.error(err) } finally { setIsSaving(false) } }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><span className="text-sm text-neutral-600">Content Filter</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={contentFilterEnabled} onChange={(e) => setContentFilterEnabled(e.target.checked)} className="sr-only peer" /><div className="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div></label></div>
      <div><span className="text-sm text-neutral-600">Fallback Message</span><input type="text" value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} className="w-full mt-1 text-sm border border-neutral-300 rounded-lg px-3 py-2" /></div>
      <button onClick={handleSave} disabled={isSaving} className="w-full mt-2 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm hover:bg-neutral-200 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Settings'}</button>
    </div>
  )
}

const AgentSettingsPanel = ({ agent, onUpdate }) => {
  const [systemPrompt, setSystemPrompt] = useState(agent?.system_prompt || '')
  const [welcomeMessage, setWelcomeMessage] = useState(agent?.welcome_message || '')
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => { setSystemPrompt(agent?.system_prompt || ''); setWelcomeMessage(agent?.welcome_message || '') }, [agent])
  const handleSave = async () => { if (!agent) return; setIsSaving(true); try { await agentsApi.update(agent.id, { system_prompt: systemPrompt, welcome_message: welcomeMessage }); onUpdate?.() } catch (err) { console.error(err) } finally { setIsSaving(false) } }
  if (!agent) return null
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
          <div className="flex-1 min-w-0"><h2 className="font-semibold text-neutral-900 truncate">{agent.name}</h2><p className="text-xs text-neutral-500">Agent ID: {agent.id?.slice(0, 8)}...</p></div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{agent.is_published ? 'Published' : 'Draft'}</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /><span>{agent.llm_model || 'gpt-4o-mini'}</span></div>
          <div className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /><span>{agent.language || 'English'}</span></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-neutral-200">
          <label className="block text-sm font-medium text-neutral-700 mb-2">System Prompt</label>
          <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Define your agent's personality..." rows={6} className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono" />
        </div>
        <div className="p-4 border-b border-neutral-200">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Welcome Message</label>
          <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="Hi! How can I help?" rows={2} className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>
        <CollapsibleSection title="Chat Settings" icon={MessageCircle}><ChatSettingsSection agent={agent} onUpdate={onUpdate} /></CollapsibleSection>
        <CollapsibleSection title="Knowledge Base" icon={Database}><KnowledgeBaseSection agent={agent} onUpdate={onUpdate} /></CollapsibleSection>
        <CollapsibleSection title="Security & Fallback" icon={Shield}><SecuritySettingsSection agent={agent} onUpdate={onUpdate} /></CollapsibleSection>
        <CollapsibleSection title="Webhook Settings" icon={Webhook}><WebhookSection agent={agent} /></CollapsibleSection>
      </div>
      <div className="p-4 border-t border-neutral-200">
        <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 font-medium disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const TestChatPanel = ({ agent, messages, onSendMessage, isSending, onClear, chatMode, setChatMode, onRunSimulation, isSimulating }) => {
  const [inputMessage, setInputMessage] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [personas, setPersonas] = useState([])
  const [numTurns, setNumTurns] = useState(5)
  const messagesEndRef = useRef(null)
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { simulationApi.getPersonas().then(data => { setPersonas(data.personas || []); if (data.personas?.length > 0) setSelectedPersona(data.personas[0].prompt) }).catch(console.error) }, [])
  const handleSubmit = (e) => { e.preventDefault(); if (!inputMessage.trim() || isSending) return; onSendMessage(inputMessage.trim()); setInputMessage('') }
  const handleSimulation = () => { onRunSimulation(selectedPersona, numTurns) }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-4 py-3"><div className="flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4 text-neutral-500" /><span className="font-medium text-neutral-700">Test Chat</span></div></div>
      <div className="bg-white border-b border-neutral-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setChatMode('manual')} className={`border rounded-xl p-4 ${chatMode === 'manual' ? 'border-primary-200 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${chatMode === 'manual' ? 'bg-primary-100' : 'bg-neutral-100'}`}><MessageSquare className={`w-5 h-5 ${chatMode === 'manual' ? 'text-primary-600' : 'text-neutral-600'}`} /></div>
              <h4 className="font-medium text-neutral-900 text-sm">Manual Chat</h4><p className="text-xs text-neutral-500 mt-1">Chat with the agent</p>
            </div>
          </button>
          <button onClick={() => setChatMode('simulation')} className={`border rounded-xl p-4 ${chatMode === 'simulation' ? 'border-primary-200 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${chatMode === 'simulation' ? 'bg-primary-100' : 'bg-neutral-100'}`}><Sparkles className={`w-5 h-5 ${chatMode === 'simulation' ? 'text-primary-600' : 'text-neutral-600'}`} /></div>
              <h4 className="font-medium text-neutral-900 text-sm">AI Simulated</h4><p className="text-xs text-neutral-500 mt-1">Auto-simulate conversations</p>
            </div>
          </button>
        </div>
      </div>
      {chatMode === 'simulation' && (
        <div className="bg-white border-b border-neutral-200 p-4 space-y-3">
          <div><label className="block text-xs font-medium text-neutral-600 mb-1">User Persona</label><select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)} className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2">{personas.map(p => <option key={p.id} value={p.prompt}>{p.name}</option>)}</select></div>
          <div className="flex items-center gap-3">
            <div className="flex-1"><label className="block text-xs font-medium text-neutral-600 mb-1">Turns</label><input type="number" value={numTurns} onChange={(e) => setNumTurns(parseInt(e.target.value) || 5)} min={1} max={20} className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2" /></div>
            <button onClick={handleSimulation} disabled={isSimulating || !agent} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mt-5">{isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}{isSimulating ? 'Running...' : 'Run Simulation'}</button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500">
            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8 text-neutral-400" /></div>
            <p className="text-sm font-medium text-neutral-700">No messages yet</p>
            <p className="text-xs text-neutral-500 mt-1">{chatMode === 'manual' ? 'Start a conversation below' : 'Run a simulation to test your agent'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => <MessageBubble key={msg.id || idx} message={msg} isUser={msg.role === 'user'} />)}
            {isSending && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div><div className="bg-neutral-100 rounded-2xl px-4 py-3"><div className="flex items-center gap-1"><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div></div></div>}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {messages.length > 0 && <div className="px-4 pb-2"><div className="flex items-center justify-center gap-2"><button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg"><RotateCcw className="w-3.5 h-3.5" />Clear Chat</button></div></div>}
      {chatMode === 'manual' && (
        <div className="p-4 bg-white border-t border-neutral-200">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={agent ? `Message ${agent.name}...` : 'Select an agent first'} disabled={!agent || isSending} className="flex-1 px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed" />
              <button type="submit" disabled={!agent || !inputMessage.trim() || isSending} className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button>
            </div>
          </form>
          <p className="text-xs text-neutral-400 mt-2 text-center">Responses powered by {agent?.llm_provider || 'AI'}</p>
        </div>
      )}
    </div>
  )
}

// Main Chat Page
const ChatPage = () => {
  const [searchParams] = useSearchParams()
  const initialAgentId = searchParams.get('agent_id')
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('create')
  const [chatMode, setChatMode] = useState('manual')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        const response = await agentsApi.list({})
        const agentsList = response.items || []
        setAgents(agentsList)
        if (initialAgentId) { const agent = agentsList.find(a => a.id === initialAgentId); if (agent) setSelectedAgent(agent) }
        else if (agentsList.length > 0) { setSelectedAgent(agentsList[0]) }
      } catch (err) { console.error(err); setError('Failed to load agents') }
      finally { setIsLoading(false) }
    }
    fetchAgents()
  }, [initialAgentId])

  const handleSendMessage = async (userMessage) => {
    if (!selectedAgent || isSending) return
    setIsSending(true); setError('')
    const tempUserMsg = { id: `temp-${Date.now()}`, role: 'user', content: userMessage, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, tempUserMsg])
    try {
      const response = await chatApi.sendMessage(selectedAgent.id, userMessage, selectedConversation?.id)
      if (!selectedConversation) { setSelectedConversation({ id: response.conversation_id }) }
      const aiMessage = { id: response.message_id, role: 'assistant', content: response.response, created_at: response.created_at }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) { console.error(err); setError(err.message || 'Failed to send message'); setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id)) }
    finally { setIsSending(false) }
  }

  const handleRunSimulation = async (persona, numTurns) => {
    if (!selectedAgent || isSimulating) return
    setIsSimulating(true); setError(''); setMessages([])
    try {
      const result = await simulationApi.run({ agent_id: selectedAgent.id, user_persona: persona, num_turns: numTurns })
      const simMessages = result.messages.map((msg, idx) => ({ id: `sim-${idx}`, role: msg.role, content: msg.content, created_at: msg.timestamp }))
      setMessages(simMessages)
    } catch (err) { console.error(err); setError(err.message || 'Failed to run simulation') }
    finally { setIsSimulating(false) }
  }

  const handleClearChat = () => { setMessages([]); setSelectedConversation(null) }

  const handleAgentUpdate = async () => {
    try {
      const response = await agentsApi.list({})
      const agentsList = response.items || []
      setAgents(agentsList)
      if (selectedAgent) { const updated = agentsList.find(a => a.id === selectedAgent.id); if (updated) setSelectedAgent(updated) }
    } catch (err) { console.error(err) }
  }

  const handlePublish = async () => {
    if (!selectedAgent) return
    setIsPublishing(true)
    try {
      if (selectedAgent.is_published) { await agentSettingsApi.unpublish(selectedAgent.id) }
      else { await agentSettingsApi.publish(selectedAgent.id) }
      await handleAgentUpdate()
    } catch (err) { console.error(err); setError(err.message || 'Failed to publish agent') }
    finally { setIsPublishing(false) }
  }

  if (isLoading) {
    return <div className="h-[calc(100vh-64px)] flex items-center justify-center"><div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /><p className="text-neutral-500">Loading agents...</p></div></div>
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
            <div>
              <select value={selectedAgent?.id || ''} onChange={(e) => { const agent = agents.find(a => a.id === e.target.value); setSelectedAgent(agent); setMessages([]); setSelectedConversation(null) }} className="font-semibold text-neutral-900 bg-transparent border-none focus:outline-none cursor-pointer pr-6 appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', backgroundSize: '16px' }}>
                {agents.length === 0 ? <option value="">No agents available</option> : agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
              </select>
              {selectedAgent && <p className="text-xs text-neutral-500">{selectedAgent.llm_model || 'gpt-4o-mini'}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button onClick={() => setActiveTab('create')} className={`px-4 py-1.5 text-sm font-medium rounded-md ${activeTab === 'create' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}>Create</button>
            <button
              onClick={() => selectedAgent && navigate(`/dashboard/flow-builder?agentId=${selectedAgent.id}`)}
              disabled={!selectedAgent}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4" />
              Flow Builder
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"><Settings className="w-5 h-5" /></button>
            <button onClick={handlePublish} disabled={isPublishing || !selectedAgent} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 ${selectedAgent?.is_published ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}{selectedAgent?.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
      {error && <div className="px-4 py-2 bg-red-50 border-b border-red-200"><div className="flex items-center justify-between text-red-700 text-sm"><span>{error}</span><button onClick={() => setError('')}><X className="w-4 h-4" /></button></div></div>}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-neutral-200 overflow-hidden"><AgentSettingsPanel agent={selectedAgent} onUpdate={handleAgentUpdate} /></div>
        <div className="w-1/2 overflow-hidden"><TestChatPanel agent={selectedAgent} messages={messages} onSendMessage={handleSendMessage} isSending={isSending} onClear={handleClearChat} chatMode={chatMode} setChatMode={setChatMode} onRunSimulation={handleRunSimulation} isSimulating={isSimulating} /></div>
      </div>
    </div>
  )
}

export default ChatPage
