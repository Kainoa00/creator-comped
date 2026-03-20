import { cn } from '@/lib/utils'

interface DarkCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  noPad?: boolean
}

export function DarkCard({ children, className, onClick, noPad }: DarkCardProps) {
  const base =
    'bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-2xl'
  const pad = noPad ? '' : 'p-5'

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(base, pad, 'w-full text-left transition-colors hover:bg-white/[0.08] active:bg-white/[0.1] cursor-pointer', className)}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={cn(base, pad, className)}>
      {children}
    </div>
  )
}
