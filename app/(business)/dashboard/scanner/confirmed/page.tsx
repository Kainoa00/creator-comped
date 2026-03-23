'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function CompConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Comp Confirmed!</h1>
      <p className="text-white/50 text-sm mb-8">The comp has been successfully verified.</p>

      <Link
        href="/dashboard/scanner"
        className="w-full max-w-xs py-4 rounded-[18px] text-white font-semibold text-base text-center transition-opacity hover:opacity-90 block"
        style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        Back to Scanner
      </Link>
    </div>
  )
}
