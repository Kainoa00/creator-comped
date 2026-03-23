'use client'

import { useRouter } from 'next/navigation'

export default function VerifyOrderPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col px-6 pt-14">
      <h1 className="text-xl font-bold mb-6">Verify Order</h1>

      {/* Creator card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-6 border border-white/[0.06]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            J
          </div>
          <div>
            <p className="font-semibold text-white">Jane Creator</p>
            <p className="text-white/50 text-sm">@janecreates</p>
          </div>
        </div>

        {/* Order items */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Pepperoni Pizza</span>
            <span className="text-white/50">x1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Garlic Bread</span>
            <span className="text-white/50">x1</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/dashboard/scanner/confirmed')}
          className="w-full py-4 rounded-[18px] text-white font-semibold text-base transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          Comped ✓
        </button>
        <button
          onClick={() => router.push('/dashboard/scanner')}
          className="w-full py-4 rounded-[18px] text-white font-semibold text-base border border-white/20 hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
