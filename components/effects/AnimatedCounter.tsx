'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useInView, animate, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      if (ref.current) {
        ref.current.textContent = `${prefix}${value.toLocaleString()}${suffix}`
      }
      return
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`
        }
      },
    })
    return controls.stop
  }, [isInView, value, duration, motionValue, prefix, suffix, shouldReduceMotion])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}0{suffix}
    </span>
  )
}
