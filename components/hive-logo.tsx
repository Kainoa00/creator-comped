import { cn } from '@/lib/utils'

interface HiveLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  /** Show the icon-only mark */
  markOnly?: boolean
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

export function HiveLogo({ size = 'md', className, markOnly = false }: HiveLogoProps) {
  if (markOnly) {
    return (
      <span
        className={cn(
          'font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent',
          sizeClasses[size],
          className
        )}
      >
        H
      </span>
    )
  }

  return (
    <span
      className={cn(
        'font-black tracking-tight leading-none select-none bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent',
        sizeClasses[size],
        className
      )}
    >
      HIVE
    </span>
  )
}

/** Logo with the hexagon mark to the left */
export function HiveLogoWithMark({ size = 'md', className }: Omit<HiveLogoProps, 'markOnly'>) {
  const markSize = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-xl',
    xl: 'h-16 w-16 text-3xl',
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Gradient hexagon mark */}
      <div
        className={cn(
          'rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center font-black text-white shadow-sm',
          markSize[size]
        )}
      >
        H
      </div>
      <HiveLogo size={size} />
    </div>
  )
}
