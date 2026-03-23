'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof typeof formData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const err = await signUp(formData.email, formData.password, formData.fullName)
    if (err) {
      setError(err)
      setLoading(false)
      return
    }
    router.push('/discover')
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-14 pb-6">
          <Link
            href="/login"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors -ml-2"
            aria-label="Back to login"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-white text-2xl font-bold">Create Account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4 pb-8">
          {error && (
            <div className="px-4 py-3 rounded-[14px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={update('fullName')}
            required
            className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={update('email')}
            required
            className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={update('password')}
              required
              className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={update('confirmPassword')}
              required
              className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed px-1">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[18px] text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Apple */}
          <button
            type="button"
            className="w-full py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white font-semibold text-base transition-colors hover:bg-[#252525] flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-full py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white font-semibold text-base transition-colors hover:bg-[#252525] flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-semibold hover:opacity-70 transition-opacity">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
