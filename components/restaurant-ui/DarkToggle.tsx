import { cn } from '@/lib/utils'

interface DarkToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  'aria-label'?: string
}

export function DarkToggle({ checked, onChange, 'aria-label': ariaLabel }: DarkToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors shrink-0',
        checked ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600' : 'bg-white/[0.1]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
