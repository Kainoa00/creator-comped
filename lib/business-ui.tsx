/** Shared UI constants and components for business dashboard pages. */

import { isDemoMode } from '@/lib/supabase'

export const fieldClass =
  'w-full bg-white/[0.06] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/15'

export const gradientLabel: React.CSSProperties = {
  background: 'linear-gradient(90deg, #8B5CF6 0%, #4A90E2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

/** Shows a "Sample Data" badge only when the app is in demo mode. */
export function DemoBadge({ children }: { children?: React.ReactNode }) {
  if (!isDemoMode) return null
  return (
    <span className="inline-flex items-center mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
      {children ?? 'Sample Data'}
    </span>
  )
}
