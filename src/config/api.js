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
    PERCEPTION_OVERVIEW: '/analytics/perception/overview',
    PERCEPTION_LEADERBOARD: '/analytics/perception/leaderboard',
    PERCEPTION_CONVERSATION: '/analytics/perception/conversation',
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

  // Recruitment - Jobs
  JOBS: {
    LIST: '/recruitment/jobs',
    CREATE: '/recruitment/jobs',
    GET: (id) => `/recruitment/jobs/${id}`,
    UPDATE: (id) => `/recruitment/jobs/${id}`,
    DELETE: (id) => `/recruitment/jobs/${id}`,
    DUPLICATE: (id) => `/recruitment/jobs/${id}/duplicate`,
    CLOSE: (id) => `/recruitment/jobs/${id}/close`,
    PARSE: '/recruitment/jobs/parse-description',
    SHORTLIST: (id) => `/recruitment/jobs/${id}/shortlist`,
  },

  RECRUITMENT_DASHBOARD: '/recruitment/dashboard',

  ATS: {
    PROVIDERS: '/recruitment/ats/providers',
    CONNECTIONS: '/recruitment/ats/connections',
    CONNECTION: (id) => `/recruitment/ats/connections/${id}`,
    TEST: (id) => `/recruitment/ats/connections/${id}/test`,
    IMPORT_JOBS: (id) => `/recruitment/ats/connections/${id}/import-jobs`,
    IMPORT_CANDIDATES: (id) => `/recruitment/ats/connections/${id}/import-candidates`,
    PUSH: (id, appId) => `/recruitment/ats/connections/${id}/push/${appId}`,
  },

  // Recruitment - Candidates & Applications
  CANDIDATES: {
    LIST: '/recruitment/candidates',
    CREATE: '/recruitment/candidates',
    GET: (id) => `/recruitment/candidates/${id}`,
    UPDATE: (id) => `/recruitment/candidates/${id}`,
    DELETE: (id) => `/recruitment/candidates/${id}`,
    BULK_IMPORT: '/recruitment/candidates/bulk-import',
    DOCUMENTS: (id) => `/recruitment/candidates/${id}/documents`,
    DOCUMENT_DOWNLOAD: (docId) => `/recruitment/documents/${docId}/download`,
    DOCUMENT: (docId) => `/recruitment/documents/${docId}`,
  },
  APPLICATIONS: {
    LIST: '/recruitment/applications',
    CREATE: '/recruitment/applications',
    GET: (id) => `/recruitment/applications/${id}`,
    DECIDE: (id) => `/recruitment/applications/${id}/decisions`,
    NOTIFY: (id) => `/recruitment/applications/${id}/notify`,
    PRESCREEN_RESULT: (id) => `/recruitment/applications/${id}/prescreen-result`,
    PRESCREEN_OVERRIDE: (resultId) => `/recruitment/prescreen-results/${resultId}/override`,
    HISTORY: (id) => `/recruitment/applications/${id}/history`,
  },

  // Recruitment - Interviews & versions
  INTERVIEWS: {
    LIST: '/recruitment/interviews',
    CREATE: '/recruitment/interviews',
    GET: (id) => `/recruitment/interviews/${id}`,
    DELETE: (id) => `/recruitment/interviews/${id}`,
    DRAFT: (id) => `/recruitment/interviews/${id}/draft`,
    NEW_DRAFT: (id) => `/recruitment/interviews/${id}/new-draft`,
    PUBLISH: (id) => `/recruitment/interviews/${id}/publish`,
    GENERATE: (id) => `/recruitment/interviews/${id}/generate`,
  },
  VERSIONS: {
    QUESTIONS: (vid) => `/recruitment/versions/${vid}/questions`,
    QUESTION: (vid, qid) => `/recruitment/versions/${vid}/questions/${qid}`,
    REORDER: (vid) => `/recruitment/versions/${vid}/questions/reorder`,
    BRANCH: (vid, qid) => `/recruitment/versions/${vid}/questions/${qid}/branch-rules`,
    RUBRIC: (vid) => `/recruitment/versions/${vid}/rubric`,
    CRITERIA: (vid) => `/recruitment/versions/${vid}/criteria`,
    CRITERION: (vid, cid) => `/recruitment/versions/${vid}/criteria/${cid}`,
    SIMULATE: (vid) => `/recruitment/versions/${vid}/simulate`,
    PRESCREEN: (vid) => `/recruitment/interviews/versions/${vid}/prescreen`,
    PRESCREEN_QUESTION: (qid) => `/recruitment/prescreen-questions/${qid}`,
  },

  // Recruitment Phase 2 - Invites, Sessions, Settings
  INVITES: {
    CREATE: (templateId) => `/recruitment/interviews/${templateId}/invites`,
    LIST: (templateId) => `/recruitment/interviews/${templateId}/invites`,
    REVOKE: (id) => `/recruitment/invites/${id}/revoke`,
    BULK: (templateId) => `/recruitment/interviews/${templateId}/invites/bulk`,
    SEND_EMAIL: (id) => `/recruitment/invites/${id}/send-email`,
  },
  SESSIONS: {
    LIST: '/recruitment/sessions',
    GET: (id) => `/recruitment/sessions/${id}`,
    SCORE: (id) => `/recruitment/sessions/${id}/score`,
    APP_RESULT: (appId) => `/recruitment/applications/${appId}/result`,
    REVIEW: (id) => `/recruitment/sessions/${id}/review`,
    REVIEWS: (id) => `/recruitment/sessions/${id}/reviews`,
    SPEECH: (id) => `/recruitment/sessions/${id}/speech-analytics`,
  },
  RECRUITMENT_SETTINGS: '/recruitment/settings',
  EMAIL_TEMPLATES: '/recruitment/email-templates',
  EMAIL_TEMPLATE: (kind) => `/recruitment/email-templates/${kind}`,

  // Recruitment Phase 2 - Public (candidate, no auth)
  PUBLIC: {
    INVITE: (token) => `/recruitment/public/invites/${token}`,
    REGISTER: (token) => `/recruitment/public/invites/${token}/register`,
    SESSION: (st) => `/recruitment/public/sessions/${st}`,
    ANSWER: (st) => `/recruitment/public/sessions/${st}/answers`,
    COMPLETE: (st) => `/recruitment/public/sessions/${st}/complete`,
    RESULT: (st) => `/recruitment/public/sessions/${st}/result`,
    VOICE_TOKEN: (st) => `/recruitment/public/sessions/${st}/voice-token`,
    RISK_SIGNALS: (st) => `/recruitment/public/sessions/${st}/risk-signals`,
    PRESCREEN_GET: (token) => `/recruitment/public/invites/${token}/prescreen`,
    PRESCREEN_SUBMIT: (st) => `/recruitment/public/sessions/${st}/prescreen`,
    STATUS: (token) => `/recruitment/public/invites/${token}/status`,
    PORTAL: (slug) => `/recruitment/public/portal/${slug}`,
    PORTAL_APPLY: (slug, templateId) => `/recruitment/public/portal/${slug}/apply/${templateId}`,
  },
};

export default {
  API_BASE_URL,
  API_VERSION,
  API_URL,
  ENDPOINTS,
};