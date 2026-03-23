'use client'

import { CSSProperties } from 'react'

interface GradientSliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function GradientSlider({ min, max, step = 1, value, onChange, className }: GradientSliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  const style: CSSProperties = {
    background: `linear-gradient(to right, #FF6B35 0%, #4A90E2 ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`gradient-slider w-full ${className ?? ''}`}
      style={style}
    />
  )
}
