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

      const error = new Error(data.detail || data.message || 'An error occurred');
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

export default api;