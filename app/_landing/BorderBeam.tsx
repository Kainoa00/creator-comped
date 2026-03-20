'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
  className?: string
}

/**
 * BorderBeam — an animated beam of light that travels around a container's border.
 * Place it as a direct child of a `relative` parent with `overflow-hidden rounded-*`.
 *
 * Pattern from 21st.dev / Aceternity UI.
 */
export default function BorderBeam({
  size = 160,
  duration = 10,
  delay = 0,
  colorFrom = '#f97316',
  colorTo = '#3b82f6',
  borderWidth = 1.5,
  className = '',
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': `${duration}s`,
          '--delay': `-${delay}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--border-width': `${borderWidth}px`,
        } as CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        '[border:var(--border-width)_solid_transparent]',
        '![mask-clip:padding-box,border-box]',
        '![mask-composite:intersect]',
        '[mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square',
        'after:w-[calc(var(--size)*1px)]',
        'after:animate-border-beam',
        'after:[animation-delay:var(--delay)]',
        'after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)]',
        'after:[offset-anchor:calc(var(--size)*0.5px)_50%]',
        'after:[offset-path:rect(0_auto_auto_0_round_calc(var(--border-width)))]',
        className,
      )}
    />
  )
}
