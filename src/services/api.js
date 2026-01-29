// ConvoHubAI - API Service
// Place this file at: src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
// API HELPERS
// ============================================

const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.detail || data.message || 'An error occurred');
    error.status = response.status;
    throw error;
  }
  return data;
};

// ============================================
// AUTH API
// ============================================

export const authApi = {
  // Register new user
  register: async (email, password, fullName) => {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    const data = await handleResponse(response);
    setTokens(data.tokens.access_token, data.tokens.refresh_token);
    setUser(data.user);
    return data;
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    setTokens(data.tokens.access_token, data.tokens.refresh_token);
    setUser(data.user);
    return data;
  },

  // Logout
  logout: async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    clearAuth();
  },

  // Get current user
  getMe: async () => {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============================================
// WORKSPACES API
// ============================================

export const workspacesApi = {
  list: async () => {
    const response = await fetch(`${API_URL}/api/v1/workspaces`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_URL}/api/v1/workspaces/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/api/v1/workspaces`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ============================================
// AGENTS API
// ============================================

export const agentsApi = {
  list: async (params = {}) => {
    const url = new URL(`${API_URL}/api/v1/agents`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url, { headers: getHeaders() });
    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/api/v1/agents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/v1/agents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export default { authApi, workspacesApi, agentsApi };