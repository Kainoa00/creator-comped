'use client'

import { ChevronDown } from 'lucide-react'
import type { TimeRange } from '@/lib/types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function timeRangeLabel(range: TimeRange): string {
  if (range.mode === 'all') return 'All Time'
  if (range.mode === 'year') return `${range.year ?? new Date().getFullYear()}`
  const month = range.month ?? new Date().getMonth()
  const year = range.year ?? new Date().getFullYear()
  return `${MONTH_NAMES[month]} ${year}`
}

interface TimeRangeTriggerProps {
  range: TimeRange
  onClick: () => void
  className?: string
}

export function TimeRangeTrigger({ range, onClick, className }: TimeRangeTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80 ${className ?? ''}`}
      style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
    >
      {timeRangeLabel(range)}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  )
}
