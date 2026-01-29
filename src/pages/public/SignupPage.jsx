import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button, Input, Logo } from '@/components/ui'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  // Handle Google OAuth response
  const handleGoogleResponse = useCallback(async (response) => {
    setIsLoading(true)
    setError('')
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      const res = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Google signup failed')
      }

      // Store tokens
      localStorage.setItem('convohubai_access_token', data.tokens.access_token)
      localStorage.setItem('convohubai_refresh_token', data.tokens.refresh_token)
      localStorage.setItem('convohubai_user', JSON.stringify(data.user))

      // Navigate to dashboard
      navigate('/dashboard')
      window.location.reload() // Refresh to update auth state
    } catch (err) {
      console.error('Google signup error:', err)
      setError(err.message || 'Google signup failed')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  // Initialize Google Sign-In
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
          }
        )
      }
    }

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [handleGoogleResponse])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      await signup(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-800 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Start your AI journey today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join 500+ businesses already using ConvoAI to transform their customer communication.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Sarah Johnson</p>
                <p className="text-white/60 text-sm">Director of Admissions</p>
              </div>
            </div>
            <p className="text-white/90 italic">
              "ConvoAI helped us increase enrollment inquiries by 40% while reducing our response time from hours to seconds."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo className="mb-8" />
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create your account</h1>
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Work Email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Company (Optional)"
              name="company"
              placeholder="Your company name"
              value={formData.company}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Password strength: {strengthLabels[passwordStrength - 1] || 'Too weak'}
                  </p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Google Sign-Up Button */}
              {GOOGLE_CLIENT_ID ? (
                <div 
                  id="google-signup-button" 
                  className="w-full flex justify-center"
                />
              ) : (
                <button 
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-300 rounded-xl text-neutral-400 cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google (Not configured)
                </button>
              )}

              {/* GitHub Button (placeholder) */}
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage