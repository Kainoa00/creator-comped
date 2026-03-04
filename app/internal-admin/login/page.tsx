'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function InternalAdminLoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === '53171') {
      router.push('/internal-admin')
    } else {
      setError('Invalid access code')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Internal Admin Login</h1>
          </div>
          <p className="text-white/70">Liaison Technologies staff only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Access Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition text-center text-2xl tracking-widest font-mono"
                placeholder="• • • • •"
                required
                maxLength={5}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
            >
              Log In
            </button>
          </form>
        </div>

        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/20 mt-6 flex gap-3">
          <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/90">
            <strong>Restricted Access:</strong> This portal is for Liaison Technologies staff only.
            Unauthorized access is prohibited.
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
