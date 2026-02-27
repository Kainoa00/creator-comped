import { cn } from '@/lib/utils'

interface CCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  /** Show the icon-only mark (CC) */
  markOnly?: boolean
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

export function CCLogo({ size = 'md', className, markOnly = false }: CCLogoProps) {
  if (markOnly) {
    return (
      <span
        className={cn(
          'font-black tracking-tight leading-none',
          sizeClasses[size],
          className
        )}
      >
        <span className="text-slate-900">C</span>
        <span className="text-cc-accent">C</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'font-black tracking-tight leading-none select-none',
        sizeClasses[size],
        className
      )}
    >
      <span className="text-slate-900">Creator</span>
      <span className="text-cc-accent">Comped</span>
    </span>
  )
}

/** Logo with the CC blue mark to the left */
export function CCLogoWithMark({ size = 'md', className }: Omit<CCLogoProps, 'markOnly'>) {
  const markSize = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-xl',
    xl: 'h-16 w-16 text-3xl',
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Blue square mark */}
      <div
        className={cn(
          'rounded-xl bg-cc-accent flex items-center justify-center font-black text-white shadow-sm',
          markSize[size]
        )}
      >
        CC
      </div>
      <CCLogo size={size} />
    </div>
  )
}
