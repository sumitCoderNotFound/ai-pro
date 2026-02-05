// ConvoHubAI - API Configuration

// Backend API URL - change this based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Version
export const API_VERSION = 'v1';

// Full API URL
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/password/change',
    RESET_PASSWORD: '/auth/password/reset',
    RESET_PASSWORD_CONFIRM: '/auth/password/reset/confirm',
  },
  
  // Workspaces
  WORKSPACES: {
    LIST: '/workspaces',
    CREATE: '/workspaces',
    GET: (id) => `/workspaces/${id}`,
    UPDATE: (id) => `/workspaces/${id}`,
    DELETE: (id) => `/workspaces/${id}`,
    MEMBERS: (id) => `/workspaces/${id}/members`,
    INVITE_MEMBER: (id) => `/workspaces/${id}/members`,
    UPDATE_MEMBER: (id, memberId) => `/workspaces/${id}/members/${memberId}`,
    REMOVE_MEMBER: (id, memberId) => `/workspaces/${id}/members/${memberId}`,
  },
  
  // Agents
  AGENTS: {
    LIST: '/agents',
    CREATE: '/agents',
    GET: (id) => `/agents/${id}`,
    UPDATE: (id) => `/agents/${id}`,
    DELETE: (id) => `/agents/${id}`,
    ACTIVATE: (id) => `/agents/${id}/activate`,
    PAUSE: (id) => `/agents/${id}/pause`,
    DUPLICATE: (id) => `/agents/${id}/duplicate`,
    TEMPLATES: '/agents/templates/list',
    FROM_TEMPLATE: '/agents/from-template',
  },
  
  // Knowledge Base
  KNOWLEDGE_BASE: {
    LIST: '/knowledge-bases',
    CREATE: '/knowledge-bases',
    GET: (id) => `/knowledge-bases/${id}`,
    DELETE: (id) => `/knowledge-bases/${id}`,
    DOCUMENTS: (id) => `/knowledge-bases/${id}/documents`,
    UPLOAD: (id) => `/knowledge-bases/${id}/documents/upload`,
  },
  
  // Conversations
  CONVERSATIONS: {
    LIST: '/conversations',
    GET: (id) => `/conversations/${id}`,
    MESSAGES: (id) => `/conversations/${id}/messages`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_CALLS: '/dashboard/recent-calls',
    TOP_AGENTS: '/dashboard/top-agents',
    ACTIVITY_CHART: '/dashboard/activity-chart',
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    DAILY_CALLS: '/analytics/daily-calls',
    CALL_OUTCOMES: '/analytics/call-outcomes',
    AGENT_PERFORMANCE: '/analytics/agent-performance',
    CHAT_HISTORY: '/analytics/chat-history',
  },
  
  // Settings
  SETTINGS: {
    PROFILE: '/settings/profile',
    WORKSPACE: '/settings/workspace',
    BILLING: '/settings/billing',
    INVOICES: '/settings/billing/invoices',
    NOTIFICATIONS: '/settings/notifications',
    API_KEYS: '/settings/api-keys',
    PASSWORD: '/settings/password',
  },
  
  // Monitor (Batch Calls, QA, Alerts)
  MONITOR: {
    BATCH_STATS: '/monitor/batch-calls/stats',
    BATCH_CAMPAIGNS: '/monitor/batch-calls/campaigns',
    QA_STATS: '/monitor/qa/stats',
    QA_REVIEWS: '/monitor/qa/reviews',
    QA_RULES: '/monitor/qa/rules',
    ALERTS_STATS: '/monitor/alerts/stats',
    ALERTS_RULES: '/monitor/alerts/rules',
    ALERTS_HISTORY: '/monitor/alerts/history',
  },
};

export default {
  API_BASE_URL,
  API_VERSION,
  API_URL,
  ENDPOINTS,
};