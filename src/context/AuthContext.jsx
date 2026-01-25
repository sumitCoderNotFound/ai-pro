import { createContext, useContext, useState, useEffect } from 'react'

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
    const savedUser = localStorage.getItem('convoai_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('convoai_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Sign up function
  const signup = (userData) => {
    const { name, email, company, password } = userData
    
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('convoai_users') || '[]')
    
    // Check if email already exists
    if (existingUsers.find(u => u.email === email)) {
      throw new Error('Email already registered')
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      company,
      password, // In real app, this would be hashed
      createdAt: new Date().toISOString()
    }
    
    // Save to users list
    existingUsers.push(newUser)
    localStorage.setItem('convoai_users', JSON.stringify(existingUsers))
    
    // Create session (without password)
    const sessionUser = { ...newUser }
    delete sessionUser.password
    
    localStorage.setItem('convoai_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    
    return sessionUser
  }

  // Login function
  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('convoai_users') || '[]')
    
    const user = existingUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Create session (without password)
    const sessionUser = { ...user }
    delete sessionUser.password
    
    localStorage.setItem('convoai_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    
    return sessionUser
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('convoai_user')
    setUser(null)
  }

  // Update profile function
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    
    // Update session
    localStorage.setItem('convoai_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    
    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem('convoai_users') || '[]')
    const userIndex = existingUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates }
      localStorage.setItem('convoai_users', JSON.stringify(existingUsers))
    }
    
    return updatedUser
  }

  const value = {
    user,
    isAuthenticated: !!user,
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