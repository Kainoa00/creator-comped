import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-6 w-6 border-[2px]',
  lg: 'h-10 w-10 border-[3px]',
  xl: 'h-16 w-16 border-[4px]',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-slate-200 border-t-hive-accent',
        sizeClasses[size],
        className
      )}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 bg-[#0B0B0D] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-hive-text-secondary text-sm">Loading...</p>
      </div>
    </div>
  )
}
