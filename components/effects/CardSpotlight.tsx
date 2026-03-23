'use client'

import { useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardSpotlightProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function CardSpotlight({
  children,
  className,
  spotlightColor = 'rgba(255,107,53,0.08)',
}: CardSpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = divRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const spotlight = el.querySelector<HTMLDivElement>('[data-spotlight]')
    if (spotlight) {
      spotlight.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`
      spotlight.style.opacity = '1'
    }
  }

  function handleMouseLeave() {
    const spotlight = divRef.current?.querySelector<HTMLDivElement>('[data-spotlight]')
    if (spotlight) spotlight.style.opacity = '0'
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative', className)}
    >
      {/* Spotlight overlay — pointer-events-none so it never blocks clicks */}
      <div
        data-spotlight=""
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  )
}
