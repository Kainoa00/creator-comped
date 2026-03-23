'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimeRange } from '@/lib/types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getLast12Months(): { label: string; month: number; year: number }[] {
  const now = new Date()
  const results = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    results.push({ label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, month: d.getMonth(), year: d.getFullYear() })
  }
  return results
}

function getYears(): number[] {
  const y = new Date().getFullYear()
  return [y, y - 1, y - 2]
}

interface TimeRangeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (range: TimeRange) => void
  initialRange?: TimeRange
}

export function TimeRangeModal({ isOpen, onClose, onApply, initialRange }: TimeRangeModalProps) {
  const now = new Date()
  const [mode, setMode] = useState<TimeRange['mode']>(initialRange?.mode ?? 'month')
  const [selectedMonth, setSelectedMonth] = useState(initialRange?.month ?? now.getMonth())
  const [selectedYear, setSelectedYear] = useState(initialRange?.year ?? now.getFullYear())
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Sync from initialRange when modal opens
  useEffect(() => {
    if (isOpen && initialRange) {
      setMode(initialRange.mode)
      if (initialRange.month != null) setSelectedMonth(initialRange.month)
      if (initialRange.year != null) setSelectedYear(initialRange.year)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const months = getLast12Months()
  const years = getYears()

  function handleApply() {
    const range: TimeRange = { mode }
    if (mode === 'month') { range.month = selectedMonth; range.year = selectedYear }
    if (mode === 'year') { range.year = selectedYear }
    onApply(range)
    onClose()
  }

  const segmentBg = 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-bold text-white">Time Range</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>

        {/* Segmented Control */}
        <div className="flex bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 mb-5">
          {(['month', 'year', 'all'] as const).map((m) => {
            const labels = { month: 'Month', year: 'Year', all: 'All Time' }
            const active = mode === m
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-semibold transition-all',
                  active ? 'text-white' : 'text-white/50 hover:text-white/70'
                )}
                style={active ? { background: segmentBg } : {}}
              >
                {labels[m]}
              </button>
            )
          })}
        </div>

        {/* Conditional Dropdown */}
        {mode === 'month' && (
          <div className="mb-5">
            <p className="text-xs text-white/40 mb-2">Select Month</p>
            <div className="relative">
              <select
                value={`${selectedMonth}-${selectedYear}`}
                onChange={(e) => {
                  const [m, y] = e.target.value.split('-').map(Number)
                  setSelectedMonth(m)
                  setSelectedYear(y)
                }}
                className="w-full appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
              >
                {months.map((mo) => (
                  <option key={`${mo.month}-${mo.year}`} value={`${mo.month}-${mo.year}`} className="bg-[#1a1a1a]">
                    {mo.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">▾</div>
            </div>
          </div>
        )}

        {mode === 'year' && (
          <div className="mb-5">
            <p className="text-xs text-white/40 mb-2">Select Year</p>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-[#1a1a1a]">{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">▾</div>
            </div>
          </div>
        )}

        {mode === 'all' && <div className="mb-5" />}

        {/* Footer */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: segmentBg }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
