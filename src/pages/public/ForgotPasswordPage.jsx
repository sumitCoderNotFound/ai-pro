import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Logo } from '@/components/ui'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/v1/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong')
      }

      setSuccess(true)
    } catch (err) {
      // Always show success to prevent email enumeration
      setSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo className="mb-8" />
            
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Forgot password?</h1>
            <p className="text-neutral-600">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Check your email</h2>
              <p className="text-neutral-600 mb-6">
                We've sent a password reset link to<br />
                <span className="font-medium text-neutral-900">{email}</span>
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => setSuccess(false)} 
                  className="text-primary-600 hover:underline"
                >
                  try another email address
                </button>
              </p>
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Back to login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Reset password'}
                </Button>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-neutral-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-800 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure password reset
          </h2>
          <p className="text-white/80 text-lg">
            We take security seriously. You'll receive an email with a secure link to reset your password.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage