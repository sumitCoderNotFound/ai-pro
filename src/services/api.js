// ConvoHubAI - API Service
// Handles all HTTP requests to the backend

import { API_URL, ENDPOINTS } from '../config/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'convohubai_access_token';
const REFRESH_TOKEN_KEY = 'convohubai_refresh_token';
const USER_KEY = 'convohubai_user';

// ============================================
// TOKEN MANAGEMENT
// ============================================

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ============================================
// HTTP CLIENT
// ============================================

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  // Get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 - try to refresh token
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          clearAuth();
          window.location.href = '/login';
        }
      }

      const detail = data.detail;
      let message;
      if (Array.isArray(detail)) {
        message = detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
      } else if (detail && typeof detail === 'object') {
        message = JSON.stringify(detail);
      } else {
        message = detail || data.message || 'An error occurred';
      }
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}${ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access_token, data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async post(endpoint, data = {}, includeAuth = true) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async patch(endpoint, data = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async put(endpoint, data = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

// Create singleton instance
const api = new ApiService();

// ============================================
// AUTH API
// ============================================

export const authApi = {
  register: async (email, password, fullName) => {
    const data = await api.post(ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      full_name: fullName,
    }, false);
    
    // Store tokens and user
    setTokens(data.tokens.access_token, data.tokens.refresh_token);
    setUser(data.user);
    
    return data;
  },

  login: async (email, password) => {
    const data = await api.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    }, false);
    
    // Store tokens and user
    setTokens(data.tokens.access_token, data.tokens.refresh_token);
    setUser(data.user);
    
    return data;
  },

  logout: async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  },

  getMe: async () => {
    return api.get(ENDPOINTS.AUTH.ME);
  },

  changePassword: async (currentPassword, newPassword) => {
    return api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  resetPassword: async (email) => {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { email }, false);
  },

  confirmResetPassword: async (token, newPassword) => {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM, {
      token,
      new_password: newPassword,
    }, false);
  },
};

// ============================================
// WORKSPACES API
// ============================================

export const workspacesApi = {
  list: async () => {
    return api.get(ENDPOINTS.WORKSPACES.LIST);
  },

  create: async (data) => {
    return api.post(ENDPOINTS.WORKSPACES.CREATE, data);
  },

  get: async (id) => {
    return api.get(ENDPOINTS.WORKSPACES.GET(id));
  },

  update: async (id, data) => {
    return api.patch(ENDPOINTS.WORKSPACES.UPDATE(id), data);
  },

  delete: async (id) => {
    return api.delete(ENDPOINTS.WORKSPACES.DELETE(id));
  },

  getMembers: async (id) => {
    return api.get(ENDPOINTS.WORKSPACES.MEMBERS(id));
  },

  inviteMember: async (id, email, role = 'member') => {
    return api.post(ENDPOINTS.WORKSPACES.INVITE_MEMBER(id), { email, role });
  },

  updateMember: async (workspaceId, memberId, role) => {
    return api.patch(ENDPOINTS.WORKSPACES.UPDATE_MEMBER(workspaceId, memberId), { role });
  },

  removeMember: async (workspaceId, memberId) => {
    return api.delete(ENDPOINTS.WORKSPACES.REMOVE_MEMBER(workspaceId, memberId));
  },
};

// ============================================
// AGENTS API
// ============================================

export const agentsApi = {
  list: async (params = {}) => {
    return api.get(ENDPOINTS.AGENTS.LIST, params);
  },

  create: async (data) => {
    return api.post(ENDPOINTS.AGENTS.CREATE, data);
  },

  get: async (id) => {
    return api.get(ENDPOINTS.AGENTS.GET(id));
  },

  update: async (id, data) => {
    return api.patch(ENDPOINTS.AGENTS.UPDATE(id), data);
  },

  delete: async (id) => {
    return api.delete(ENDPOINTS.AGENTS.DELETE(id));
  },

  activate: async (id) => {
    return api.post(ENDPOINTS.AGENTS.ACTIVATE(id));
  },

  pause: async (id) => {
    return api.post(ENDPOINTS.AGENTS.PAUSE(id));
  },

  duplicate: async (id, name) => {
    return api.post(ENDPOINTS.AGENTS.DUPLICATE(id), { name });
  },

  getTemplates: async (params = {}) => {
    return api.get(ENDPOINTS.AGENTS.TEMPLATES, params);
  },

  createFromTemplate: async (templateId, name, description) => {
    return api.post(ENDPOINTS.AGENTS.FROM_TEMPLATE, {
      template_id: templateId,
      name,
      description,
    });
  },
};

// ============================================
// KNOWLEDGE BASE API (future)
// ============================================

export const knowledgeBaseApi = {
  list: async () => {
    return api.get(ENDPOINTS.KNOWLEDGE_BASE.LIST);
  },

  create: async (data) => {
    return api.post(ENDPOINTS.KNOWLEDGE_BASE.CREATE, data);
  },

  get: async (id) => {
    return api.get(ENDPOINTS.KNOWLEDGE_BASE.GET(id));
  },

  delete: async (id) => {
    return api.delete(ENDPOINTS.KNOWLEDGE_BASE.DELETE(id));
  },
};

// ============================================
// CONVERSATIONS API (future)
// ============================================

export const conversationsApi = {
  list: async (params = {}) => {
    return api.get(ENDPOINTS.CONVERSATIONS.LIST, params);
  },

  get: async (id) => {
    return api.get(ENDPOINTS.CONVERSATIONS.GET(id));
  },

  getMessages: async (id) => {
    return api.get(ENDPOINTS.CONVERSATIONS.MESSAGES(id));
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  getStats: async () => {
    return api.get(ENDPOINTS.DASHBOARD.STATS);
  },

  getRecentCalls: async (limit = 10) => {
    return api.get(ENDPOINTS.DASHBOARD.RECENT_CALLS, { limit });
  },

  getTopAgents: async (limit = 5) => {
    return api.get(ENDPOINTS.DASHBOARD.TOP_AGENTS, { limit });
  },

  getActivityChart: async (days = 7) => {
    return api.get(ENDPOINTS.DASHBOARD.ACTIVITY_CHART, { days });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  getOverview: async (timeRange = '7d') => {
    return api.get(ENDPOINTS.ANALYTICS.OVERVIEW, { time_range: timeRange });
  },

  getDailyCalls: async (timeRange = '7d') => {
    return api.get(ENDPOINTS.ANALYTICS.DAILY_CALLS, { time_range: timeRange });
  },

  getCallOutcomes: async (timeRange = '7d') => {
    return api.get(ENDPOINTS.ANALYTICS.CALL_OUTCOMES, { time_range: timeRange });
  },

  getAgentPerformance: async (timeRange = '7d', limit = 10) => {
    return api.get(ENDPOINTS.ANALYTICS.AGENT_PERFORMANCE, { time_range: timeRange, limit });
  },

  getChatHistory: async (params = {}) => {
    return api.get(ENDPOINTS.ANALYTICS.CHAT_HISTORY, params);
  },

  getPerceptionOverview: async (timeRange = '7d', agentId = null) => {
    const params = { time_range: timeRange };
    if (agentId) params.agent_id = agentId;
    return api.get(ENDPOINTS.ANALYTICS.PERCEPTION_OVERVIEW, params);
  },

  getPerceptionLeaderboard: async (timeRange = '7d') => {
    return api.get(ENDPOINTS.ANALYTICS.PERCEPTION_LEADERBOARD, { time_range: timeRange });
  },

  getConversationPerception: async (conversationId) => {
    return api.get(`${ENDPOINTS.ANALYTICS.PERCEPTION_CONVERSATION}/${conversationId}`);
  },
};

// ============================================
// SETTINGS API
// ============================================

export const settingsApi = {
  getProfile: async () => {
    return api.get(ENDPOINTS.SETTINGS.PROFILE);
  },

  updateProfile: async (data) => {
    return api.patch(ENDPOINTS.SETTINGS.PROFILE, data);
  },

  changePassword: async (currentPassword, newPassword) => {
    return api.post(ENDPOINTS.SETTINGS.PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  getWorkspace: async () => {
    return api.get(ENDPOINTS.SETTINGS.WORKSPACE);
  },

  getBilling: async () => {
    return api.get(ENDPOINTS.SETTINGS.BILLING);
  },

  getInvoices: async () => {
    return api.get(ENDPOINTS.SETTINGS.INVOICES);
  },

  getNotifications: async () => {
    return api.get(ENDPOINTS.SETTINGS.NOTIFICATIONS);
  },

  updateNotifications: async (data) => {
    return api.patch(ENDPOINTS.SETTINGS.NOTIFICATIONS, data);
  },

  getApiKeys: async () => {
    return api.get(ENDPOINTS.SETTINGS.API_KEYS);
  },

  createApiKey: async () => {
    return api.post(ENDPOINTS.SETTINGS.API_KEYS);
  },
};

// ============================================
// MONITOR API (Batch Calls, QA, Alerts)
// ============================================

export const monitorApi = {
  // Batch Calls
  getBatchStats: async () => {
    return api.get(ENDPOINTS.MONITOR.BATCH_STATS);
  },

  getBatchCampaigns: async (limit = 10) => {
    return api.get(ENDPOINTS.MONITOR.BATCH_CAMPAIGNS, { limit });
  },

  // Quality Assurance
  getQAStats: async (timeRange = '7d') => {
    return api.get(ENDPOINTS.MONITOR.QA_STATS, { time_range: timeRange });
  },

  getQAReviews: async (limit = 10) => {
    return api.get(ENDPOINTS.MONITOR.QA_REVIEWS, { limit });
  },

  getQARules: async () => {
    return api.get(ENDPOINTS.MONITOR.QA_RULES);
  },

  // Alerts
  getAlertsStats: async () => {
    return api.get(ENDPOINTS.MONITOR.ALERTS_STATS);
  },

  getAlertRules: async () => {
    return api.get(ENDPOINTS.MONITOR.ALERTS_RULES);
  },

  getAlertHistory: async (limit = 10) => {
    return api.get(ENDPOINTS.MONITOR.ALERTS_HISTORY, { limit });
  },
};

// ============================================
// RECRUITMENT API (Jobs, Candidates, Interviews)
// ============================================

export const recruitmentApi = {
  jobs: {
    list: (params = {}) => api.get(ENDPOINTS.JOBS.LIST, params),
    create: (data) => api.post(ENDPOINTS.JOBS.CREATE, data),
    get: (id) => api.get(ENDPOINTS.JOBS.GET(id)),
    update: (id, data) => api.patch(ENDPOINTS.JOBS.UPDATE(id), data),
    remove: (id) => api.delete(ENDPOINTS.JOBS.DELETE(id)),
    duplicate: (id) => api.post(ENDPOINTS.JOBS.DUPLICATE(id)),
    close: (id) => api.post(ENDPOINTS.JOBS.CLOSE(id)),
    parseDescription: (description) => api.post(ENDPOINTS.JOBS.PARSE, { description }),
    shortlist: (id) => api.get(ENDPOINTS.JOBS.SHORTLIST(id)),
  },
  dashboard: {
    get: () => api.get(ENDPOINTS.RECRUITMENT_DASHBOARD),
  },
  candidates: {
    list: (params = {}) => api.get(ENDPOINTS.CANDIDATES.LIST, params),
    create: (data) => api.post(ENDPOINTS.CANDIDATES.CREATE, data),
    get: (id) => api.get(ENDPOINTS.CANDIDATES.GET(id)),
    update: (id, data) => api.patch(ENDPOINTS.CANDIDATES.UPDATE(id), data),
    remove: (id) => api.delete(ENDPOINTS.CANDIDATES.DELETE(id)),
    bulkImport: (data) => api.post(ENDPOINTS.CANDIDATES.BULK_IMPORT, data),
    documents: (id) => api.get(ENDPOINTS.CANDIDATES.DOCUMENTS(id)),
    uploadDocument: async (id, file, kind = 'resume') => {
      const token = localStorage.getItem('convohubai_access_token')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('kind', kind)
      const res = await fetch(`${API_URL}${ENDPOINTS.CANDIDATES.DOCUMENTS(id)}`, {
        method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd,
      })
      if (!res.ok) { let m = 'Upload failed'; try { m = (await res.json()).detail || m } catch { /* ignore */ } throw new Error(m) }
      return res.json()
    },
    downloadDocument: async (docId) => {
      const token = localStorage.getItem('convohubai_access_token')
      const res = await fetch(`${API_URL}${ENDPOINTS.CANDIDATES.DOCUMENT_DOWNLOAD(docId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Could not download the file')
      return res.blob()
    },
    deleteDocument: (docId) => api.delete(ENDPOINTS.CANDIDATES.DOCUMENT(docId)),
  },
  applications: {
    list: (params = {}) => api.get(ENDPOINTS.APPLICATIONS.LIST, params),
    create: (data) => api.post(ENDPOINTS.APPLICATIONS.CREATE, data),
    get: (id) => api.get(ENDPOINTS.APPLICATIONS.GET(id)),
    decide: (id, toStage, reason) =>
      api.post(ENDPOINTS.APPLICATIONS.DECIDE(id), { to_stage: toStage, reason }),
    notify: (id, kind) => api.post(ENDPOINTS.APPLICATIONS.NOTIFY(id), { kind }),
    prescreenResult: (id) => api.get(ENDPOINTS.APPLICATIONS.PRESCREEN_RESULT(id)),
    prescreenOverride: (resultId, data) => api.post(ENDPOINTS.APPLICATIONS.PRESCREEN_OVERRIDE(resultId), data),
    history: (id) => api.get(ENDPOINTS.APPLICATIONS.HISTORY(id)),
  },
  interviews: {
    list: (params = {}) => api.get(ENDPOINTS.INTERVIEWS.LIST, params),
    create: (data) => api.post(ENDPOINTS.INTERVIEWS.CREATE, data),
    get: (id) => api.get(ENDPOINTS.INTERVIEWS.GET(id)),
    remove: (id) => api.delete(ENDPOINTS.INTERVIEWS.DELETE(id)),
    getDraft: (id) => api.get(ENDPOINTS.INTERVIEWS.DRAFT(id)),
    updateDraft: (id, data) => api.patch(ENDPOINTS.INTERVIEWS.DRAFT(id), data),
    newDraft: (id) => api.post(ENDPOINTS.INTERVIEWS.NEW_DRAFT(id)),
    publish: (id) => api.post(ENDPOINTS.INTERVIEWS.PUBLISH(id)),
    generate: (id, data) => api.post(ENDPOINTS.INTERVIEWS.GENERATE(id), data),
  },
  versions: {
    listQuestions: (vid) => api.get(ENDPOINTS.VERSIONS.QUESTIONS(vid)),
    addQuestion: (vid, data) => api.post(ENDPOINTS.VERSIONS.QUESTIONS(vid), data),
    updateQuestion: (vid, qid, data) => api.patch(ENDPOINTS.VERSIONS.QUESTION(vid, qid), data),
    deleteQuestion: (vid, qid) => api.delete(ENDPOINTS.VERSIONS.QUESTION(vid, qid)),
    reorderQuestions: (vid, orderedIds) =>
      api.post(ENDPOINTS.VERSIONS.REORDER(vid), { ordered_ids: orderedIds }),
    addBranchRule: (vid, qid, data) => api.post(ENDPOINTS.VERSIONS.BRANCH(vid, qid), data),
    getRubric: (vid) => api.get(ENDPOINTS.VERSIONS.RUBRIC(vid)),
    addCriterion: (vid, data) => api.post(ENDPOINTS.VERSIONS.CRITERIA(vid), data),
    updateCriterion: (vid, cid, data) => api.patch(ENDPOINTS.VERSIONS.CRITERION(vid, cid), data),
    deleteCriterion: (vid, cid) => api.delete(ENDPOINTS.VERSIONS.CRITERION(vid, cid)),
    simulate: (vid, persona) => api.post(ENDPOINTS.VERSIONS.SIMULATE(vid), { persona }),
    listPrescreen: (vid) => api.get(ENDPOINTS.VERSIONS.PRESCREEN(vid)),
    addPrescreen: (vid, data) => api.post(ENDPOINTS.VERSIONS.PRESCREEN(vid), data),
    updatePrescreen: (qid, data) => api.patch(ENDPOINTS.VERSIONS.PRESCREEN_QUESTION(qid), data),
    deletePrescreen: (qid) => api.delete(ENDPOINTS.VERSIONS.PRESCREEN_QUESTION(qid)),
  },
  invites: {
    create: (templateId, data) => api.post(ENDPOINTS.INVITES.CREATE(templateId), data),
    list: (templateId) => api.get(ENDPOINTS.INVITES.LIST(templateId)),
    revoke: (id) => api.post(ENDPOINTS.INVITES.REVOKE(id)),
    bulk: (templateId, data) => api.post(ENDPOINTS.INVITES.BULK(templateId), data),
    sendEmail: (id, data = {}) => api.post(ENDPOINTS.INVITES.SEND_EMAIL(id), data),
  },
  sessions: {
    list: (params = {}) => api.get(ENDPOINTS.SESSIONS.LIST, params),
    get: (id) => api.get(ENDPOINTS.SESSIONS.GET(id)),
    getScore: (id) => api.get(`${ENDPOINTS.SESSIONS.GET(id)}/score`),
    rescore: (id) => api.post(ENDPOINTS.SESSIONS.SCORE(id)),
    applicationResult: (appId) => api.get(ENDPOINTS.SESSIONS.APP_RESULT(appId)),
    addReview: (id, data) => api.post(ENDPOINTS.SESSIONS.REVIEW(id), data),
    reviews: (id) => api.get(ENDPOINTS.SESSIONS.REVIEWS(id)),
    speechAnalytics: (id) => api.get(ENDPOINTS.SESSIONS.SPEECH(id)),
    downloadReport: async (id) => {
      const token = localStorage.getItem('convohubai_access_token')
      const res = await fetch(`${API_URL}${ENDPOINTS.SESSIONS.GET(id)}/report`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Could not generate the report')
      return res.blob()
    },
  },
  ats: {
    providers: () => api.get(ENDPOINTS.ATS.PROVIDERS),
    list: () => api.get(ENDPOINTS.ATS.CONNECTIONS),
    create: (data) => api.post(ENDPOINTS.ATS.CONNECTIONS, data),
    update: (id, data) => api.patch(ENDPOINTS.ATS.CONNECTION(id), data),
    remove: (id) => api.delete(ENDPOINTS.ATS.CONNECTION(id)),
    test: (id) => api.post(ENDPOINTS.ATS.TEST(id)),
    importJobs: (id, data = { limit: 100 }) => api.post(ENDPOINTS.ATS.IMPORT_JOBS(id), data),
    importCandidates: (id, data = { limit: 100 }) => api.post(ENDPOINTS.ATS.IMPORT_CANDIDATES(id), data),
    push: (id, appId) => api.post(ENDPOINTS.ATS.PUSH(id, appId)),
  },
  settings: {
    get: () => api.get(ENDPOINTS.RECRUITMENT_SETTINGS),
    update: (data) => api.patch(ENDPOINTS.RECRUITMENT_SETTINGS, data),
  },
  emailTemplates: {
    list: () => api.get(ENDPOINTS.EMAIL_TEMPLATES),
    upsert: (kind, data) => api.put(ENDPOINTS.EMAIL_TEMPLATE(kind), data),
    reset: (kind) => api.delete(ENDPOINTS.EMAIL_TEMPLATE(kind)),
  },
};

// ============================================
// PUBLIC CANDIDATE API (no auth, token-based)
// ============================================

const publicRequest = async (endpoint, method = 'GET', body = null) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${endpoint}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    let message;
    if (Array.isArray(detail)) message = detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
    else if (detail && typeof detail === 'object') message = JSON.stringify(detail);
    else message = detail || data.message || 'Something went wrong';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
};

export const publicInterviewApi = {
  getInvite: (token) => publicRequest(ENDPOINTS.PUBLIC.INVITE(token)),
  register: (token, data) => publicRequest(ENDPOINTS.PUBLIC.REGISTER(token), 'POST', data),
  getSession: (st) => publicRequest(ENDPOINTS.PUBLIC.SESSION(st)),
  submitAnswer: (st, data) => publicRequest(ENDPOINTS.PUBLIC.ANSWER(st), 'POST', data),
  complete: (st) => publicRequest(ENDPOINTS.PUBLIC.COMPLETE(st), 'POST'),
  getResult: (st) => publicRequest(ENDPOINTS.PUBLIC.RESULT(st)),
  voiceToken: (st) => publicRequest(ENDPOINTS.PUBLIC.VOICE_TOKEN(st), 'POST'),
  riskSignals: (st, signals) => publicRequest(ENDPOINTS.PUBLIC.RISK_SIGNALS(st), 'POST', { signals }),
  getPrescreen: (token) => publicRequest(ENDPOINTS.PUBLIC.PRESCREEN_GET(token)),
  submitPrescreen: (st, answers) => publicRequest(ENDPOINTS.PUBLIC.PRESCREEN_SUBMIT(st), 'POST', { answers }),
  status: (token) => publicRequest(ENDPOINTS.PUBLIC.STATUS(token)),
  portal: (slug) => publicRequest(ENDPOINTS.PUBLIC.PORTAL(slug)),
  portalApply: (slug, templateId, data) => publicRequest(ENDPOINTS.PUBLIC.PORTAL_APPLY(slug, templateId), 'POST', data),
  uploadDocument: async (st, file, kind = 'resume') => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    const res = await fetch(`${API_URL}/recruitment/public/sessions/${st}/documents`, { method: 'POST', body: fd })
    if (!res.ok) { let m = 'Upload failed'; try { m = (await res.json()).detail || m } catch { /* ignore */ } throw new Error(m) }
    return res.json()
  },
};

export default api;