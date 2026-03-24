import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export function Input({
  className,
  label,
  error,
  hint,
  leftAddon,
  rightAddon,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-hive-text-secondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <span className="absolute left-3 text-hive-text-muted flex items-center">{leftAddon}</span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-10 rounded-xl bg-white border text-hive-text text-sm placeholder:text-hive-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-hive-accent/10 focus:border-hive-accent',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-colors duration-150',
            error ? 'border-hive-error focus:ring-hive-error/10' : 'border-slate-200',
            leftAddon ? 'pl-9' : 'pl-3',
            rightAddon ? 'pr-9' : 'pr-3',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 text-hive-text-muted flex items-center">{rightAddon}</span>
        )}
      </div>
      {error && <p className="text-xs text-hive-error">{error}</p>}
      {hint && !error && <p className="text-xs text-hive-text-muted">{hint}</p>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ className, label, error, hint, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-hive-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full min-h-[80px] rounded-xl bg-white border text-hive-text text-sm placeholder:text-hive-text-muted px-3 py-2.5',
          'focus:outline-none focus:ring-2 focus:ring-hive-accent/10 focus:border-hive-accent',
          'disabled:opacity-40 disabled:cursor-not-allowed resize-y',
          'transition-colors duration-150',
          error ? 'border-hive-error focus:ring-hive-error/10' : 'border-slate-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-hive-error">{error}</p>}
      {hint && !error && <p className="text-xs text-hive-text-muted">{hint}</p>}
    </div>
  )
}

// ── PIN Input (for restaurant manager PIN) ────────────────────

interface PinInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
  label?: string
}

export function PinInput({ value, onChange, length = 4, error, label }: PinInputProps) {
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  function handleChange(idx: number, char: string) {
    if (!/^\d?$/.test(char)) return
    const arr = Array.from({ length }, (_, i) => value[i] ?? '')
    arr[idx] = char
    onChange(arr.join(''))
    // Auto-focus next
    if (char && idx < length - 1) {
      const next = document.getElementById(`pin-${idx + 1}`)
      next?.focus()
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      const prev = document.getElementById(`pin-${idx - 1}`)
      prev?.focus()
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-hive-text-secondary">{label}</label>}
      <div className="flex gap-3">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={cn(
              'w-12 h-14 text-center text-xl font-bold rounded-xl bg-white border text-hive-text',
              'focus:outline-none focus:ring-2 focus:ring-hive-accent/10 focus:border-hive-accent',
              'transition-colors duration-150',
              error ? 'border-hive-error' : 'border-slate-200'
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-hive-error">{error}</p>}
    </div>
  )
}
