// ConvoHubAI - Auth Context with Backend Integration
// Replace your existing src/context/AuthContext.jsx with this file

import { createContext, useContext, useState, useEffect } from 'react'
import { 
  authApi, 
  getAccessToken, 
  getStoredUser, 
  clearAuth,
  setUser as setStoredUser 
} from '@/services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()
      const storedUser = getStoredUser()

      if (token && storedUser) {
        try {
          // Verify token is still valid by calling /auth/me
          const userData = await authApi.getMe()
          setUser(userData)
        } catch (err) {
          console.error('Auth init error:', err)
          clearAuth()
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Sign up function - connects to real backend
  const signup = async (userData) => {
    const { name, email, password } = userData

    try {
      const data = await authApi.register(email, password, name)
      setUser(data.user)
      return data.user
    } catch (err) {
      throw new Error(err.message || 'Registration failed')
    }
  }

  // Login function - connects to real backend
  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password)
      setUser(data.user)
      return data.user
    } catch (err) {
      throw new Error(err.message || 'Invalid email or password')
    }
  }

  // Logout function - connects to real backend
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
  }

  // Update profile function
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setStoredUser(updatedUser)
    setUser(updatedUser)
    return updatedUser
  }

  const value = {
    user,
    isAuthenticated: !!user && !!getAccessToken(),
    isLoading,
    signup,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext