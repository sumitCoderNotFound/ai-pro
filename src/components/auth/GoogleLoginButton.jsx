// Google OAuth Login Button Component
// Place this file at: src/components/auth/GoogleLoginButton.jsx

import { useEffect, useCallback } from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const GoogleLoginButton = ({ onSuccess, onError, disabled }) => {
  
  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Send the Google token to your backend
      const res = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Google login failed')
      }

      // Store tokens
      localStorage.setItem('convohubai_access_token', data.tokens.access_token)
      localStorage.setItem('convohubai_refresh_token', data.tokens.refresh_token)
      localStorage.setItem('convohubai_user', JSON.stringify(data.user))

      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      console.error('Google login error:', error)
      if (onError) {
        onError(error.message || 'Google login failed')
      }
    }
  }, [onSuccess, onError])

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'continue_with',
          }
        )
      }
    }

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [handleCredentialResponse])

  if (!GOOGLE_CLIENT_ID) {
    return null // Don't render if no client ID
  }

  return (
    <div 
      id="google-signin-button" 
      className={`w-full flex justify-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    />
  )
}

export default GoogleLoginButton