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

          {/* OAuth buttons hidden — Apple/Google sign-in not yet wired up
          <div className="flex items-center gap-4 py-2">...</div>
          <button type="button" ...>Continue with Apple</button>
          <button type="button" ...>Continue with Google</button>
          */}

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
