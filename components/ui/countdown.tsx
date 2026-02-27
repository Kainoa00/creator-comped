'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { secondsRemaining, formatCountdown, format48hCountdown } from '@/lib/utils'

interface CountdownProps {
  /** ISO timestamp of when the countdown expires */
  deadline: string
  onExpired?: () => void
  /** Show hours too (for 48h proof deadline) */
  showHours?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Countdown({
  deadline,
  onExpired,
  showHours = false,
  className,
  size = 'md',
}: CountdownProps) {
  const [seconds, setSeconds] = useState(() => secondsRemaining(deadline))
  const [expired, setExpired] = useState(seconds === 0)

  const tick = useCallback(() => {
    const remaining = secondsRemaining(deadline)
    setSeconds(remaining)
    if (remaining === 0) {
      setExpired(true)
      onExpired?.()
    }
  }, [deadline, onExpired])

  useEffect(() => {
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick])

  const isWarning = seconds <= 3600 && seconds > 1800  // 1h to 30min
  const isCritical = seconds <= 1800 && seconds > 0    // <30min
  const display = showHours ? format48hCountdown(deadline) : formatCountdown(seconds)

  const sizeClasses = {
    sm: 'text-lg font-bold tracking-wider',
    md: 'text-3xl font-bold tracking-widest',
    lg: 'text-5xl font-black tracking-widest',
  }

  if (expired) {
    return (
      <span className={cn('text-cc-error font-bold', sizeClasses[size], className)}>
        EXPIRED
      </span>
    )
  }

  return (
    <span
      className={cn(
        sizeClasses[size],
        isCritical ? 'text-cc-error animate-pulse' : isWarning ? 'text-amber-600' : 'text-cc-text',
        className
      )}
    >
      {display}
    </span>
  )
}

/** Full countdown card for use in Creator proof flow */
export function CountdownCard({
  deadline,
  onExpired,
  label = 'Time remaining to submit proof',
}: {
  deadline: string
  onExpired?: () => void
  label?: string
}) {
  const [seconds, setSeconds] = useState(() => secondsRemaining(deadline))
  const isUrgent = seconds <= 3600 // 1 hour

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = secondsRemaining(deadline)
      setSeconds(remaining)
      if (remaining === 0) onExpired?.()
    }, 1000)
    return () => clearInterval(interval)
  }, [deadline, onExpired])

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 flex flex-col items-center gap-1',
        isUrgent
          ? 'bg-red-50 border-red-200'
          : 'bg-slate-50 border-slate-200'
      )}
    >
      <p className="text-xs text-cc-text-muted uppercase tracking-wider">{label}</p>
      <Countdown deadline={deadline} onExpired={onExpired} showHours size="lg" />
      {isUrgent && (
        <p className="text-xs text-cc-error font-medium">Post immediately to avoid a strike!</p>
      )}
    </div>
  )
}
