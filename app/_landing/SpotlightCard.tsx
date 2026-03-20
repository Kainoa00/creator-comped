'use client'

import { useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

export default function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
        className,
      )}
    >
      {/* Spotlight radial gradient following cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(249,115,22,0.12), transparent 50%)',
        }}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
