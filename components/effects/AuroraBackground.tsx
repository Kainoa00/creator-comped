'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
}

/**
 * Decorative aurora blobs — use inside a `relative overflow-hidden` container.
 * Automatically pauses when `prefers-reduced-motion: reduce` is set (via CSS media query in globals.css).
 */
const BLOB_1_STYLE: React.CSSProperties = {
  width: 500, height: 500,
  background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
  top: '-20%', left: '-10%',
  animation: 'aurora-shift-1 10s ease-in-out infinite',
}
const BLOB_2_STYLE: React.CSSProperties = {
  width: 400, height: 400,
  background: 'radial-gradient(circle, #4A90E2 0%, transparent 70%)',
  top: '10%', right: '-10%',
  animation: 'aurora-shift-2 12s ease-in-out infinite',
}
const BLOB_3_STYLE: React.CSSProperties = {
  width: 300, height: 300,
  background: 'radial-gradient(circle, #e05a5a 0%, transparent 70%)',
  bottom: '-10%', left: '30%',
  animation: 'aurora-shift-1 8s ease-in-out infinite reverse',
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="aurora-blob absolute rounded-full blur-[100px] opacity-[0.07]" style={BLOB_1_STYLE} />
      <div className="aurora-blob absolute rounded-full blur-[100px] opacity-[0.05]" style={BLOB_2_STYLE} />
      <div className="aurora-blob absolute rounded-full blur-[80px] opacity-[0.04]"  style={BLOB_3_STYLE} />
    </div>
  )
}
