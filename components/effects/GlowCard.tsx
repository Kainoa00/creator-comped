'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  href?: string
}

/**
 * Wraps a card with an orange glow box-shadow on hover.
 * The card itself controls its own padding/background — GlowCard just adds the glow.
 */
export function GlowCard({ children, className, href }: GlowCardProps) {
  const classes = cn(
    'group block rounded-2xl transition-all duration-300',
    'hover:[box-shadow:0_0_0_1px_rgba(255,107,53,0.4),0_8px_32px_rgba(255,107,53,0.12)]',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
