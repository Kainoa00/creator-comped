'use client'

import { useState } from 'react'
import { ChevronDown, Calendar } from 'lucide-react'

type FilterType = 'Month' | 'Year' | 'All time'

interface FilterSelectorProps {
  value: FilterType
  onChange: (value: FilterType) => void
}

export function FilterSelector({ value, onChange }: FilterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('March 2026')
  const [selectedYear, setSelectedYear] = useState('2026')

  const months = [
    'March 2026', 'February 2026', 'January 2026',
    'December 2025', 'November 2025', 'October 2025',
    'September 2025', 'August 2025', 'July 2025',
    'June 2025', 'May 2025', 'April 2025',
  ]

  const years = ['2026', '2025', '2024', '2023']

  const getDisplayValue = () => {
    if (value === 'Month') return selectedMonth
    if (value === 'Year') return selectedYear
    return 'All time'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
      >
        <Calendar className="w-4 h-4" />
        <span>{getDisplayValue()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="flex border-b border-white/10">
              <button
                onClick={() => onChange('Month')}
                className={`flex-1 px-4 py-2 text-sm transition ${
                  value === 'Month'
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600'
                    : 'hover:bg-white/5'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => onChange('Year')}
                className={`flex-1 px-4 py-2 text-sm transition ${
                  value === 'Year'
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600'
                    : 'hover:bg-white/5'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => {
                  onChange('All time')
                  setIsOpen(false)
                }}
                className={`flex-1 px-4 py-2 text-sm transition ${
                  value === 'All time'
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600'
                    : 'hover:bg-white/5'
                }`}
              >
                All time
              </button>
            </div>

            {value === 'Month' && (
              <div className="max-h-64 overflow-y-auto p-2">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedMonth === month ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {value === 'Year' && (
              <div className="p-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedYear === year ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
