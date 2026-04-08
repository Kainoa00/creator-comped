'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, QrCode } from 'lucide-react'
import { hapticSuccess } from '@/lib/haptics'

export default function CompConfirmedPage() {
  useEffect(() => {
    hapticSuccess()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </div>

      <h1 className="text-3xl font-bold mb-2">Comp Confirmed!</h1>
      <p className="text-white/50 text-sm mb-2">The creator has been notified.</p>
      <p className="text-white/30 text-xs mb-10">They have 48 hours to post their content.</p>

      <div className="w-full max-w-xs space-y-3">
        <Link
          href="/dashboard/scanner"
          className="w-full py-4 rounded-2xl text-white font-semibold text-base text-center transition-opacity hover:opacity-90 active:opacity-80 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          <QrCode className="h-4 w-4" />
          Scan Next Code
        </Link>

        <Link
          href="/dashboard"
          className="w-full py-4 rounded-2xl border border-white/10 text-white/60 font-semibold text-sm text-center block hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
