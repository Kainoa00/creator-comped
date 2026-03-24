import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  accent: 'bg-hive-accent-subtle text-hive-accent border border-blue-200',
}

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
  accent: 'bg-hive-accent',
}

export function Badge({
  className,
  variant = 'neutral',
  dot = false,
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('shrink-0 rounded-full', dotColors[variant], size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')}
        />
      )}
      {children}
    </span>
  )
}

// ── Convenience exports for common status mappings ────────────

import type { OrderStatus, ProofReviewStatus } from '@/lib/types'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    created: { label: 'Created', variant: 'neutral' },
    scanned: { label: 'Scanned', variant: 'info' },
    confirmed: { label: 'Confirmed', variant: 'accent' },
    proof_submitted: { label: 'Proof Submitted', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'error' },
    expired: { label: 'Expired', variant: 'neutral' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function ProofStatusBadge({ status }: { status: ProofReviewStatus }) {
  const map: Record<ProofReviewStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Under Review', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    needs_fix: { label: 'Needs Fix', variant: 'warning' },
    rejected: { label: 'Rejected', variant: 'error' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}
