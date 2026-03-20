'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DarkHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  right?: React.ReactNode
  className?: string
}

export function DarkHeader({ title, subtitle, backHref, right, className }: DarkHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn('flex items-center gap-3 mb-6', className)}>
      {backHref && (
        <button
          onClick={() => router.push(backHref)}
          className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-white truncate">{title}</h1>
        {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}
