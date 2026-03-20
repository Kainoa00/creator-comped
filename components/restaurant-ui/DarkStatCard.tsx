import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface DarkStatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  className?: string
}

export function DarkStatCard({ icon: Icon, label, value, sub, accent, className }: DarkStatCardProps) {
  return (
    <div className={cn(
      'bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3',
      className
    )}>
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        accent
          ? 'bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600'
          : 'bg-white/[0.08]'
      )}>
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-xs text-white/50 mt-0.5 font-medium">{label}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
