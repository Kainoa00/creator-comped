'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  icon?: ReactNode
}

interface AnimatedTabsProps {
  tabs: Tab[]
  activeKey: string
  onTabChange: (key: string) => void
  layoutId?: string
  className?: string
}

export function AnimatedTabs({
  tabs,
  activeKey,
  onTabChange,
  layoutId = 'animated-tab-pill',
  className,
}: AnimatedTabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1 p-1 bg-white/[0.05] border border-white/[0.06] rounded-2xl',
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors',
              active ? 'text-white' : 'text-white/40 hover:text-white/60'
            )}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            {tab.icon && <span className="relative z-10 shrink-0">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
