'use client'

import { useState } from 'react'
import { Delete, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const shakeStyle = `
@keyframes pinShake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.pin-shake { animation: pinShake 0.4s ease-in-out; }
@keyframes pinPop {
  0% { transform: scale(1); }
  40% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
.pin-pop { animation: pinPop 0.15s ease-out; }
`

interface PINGateProps {
  correctPin: string
  onUnlock: () => void
  backHref?: string
  title?: string
  subtitle?: string
  demoPin?: string
}

export function PINGate({
  correctPin,
  onUnlock,
  backHref,
  title = 'Manager Access',
  subtitle = 'Enter your 4-digit PIN to continue',
  demoPin,
}: PINGateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [lastPressed, setLastPressed] = useState<string | null>(null)

  function handleDigit(digit: string) {
    if (pin.length >= 4) return
    const next = pin + digit
    setPin(next)
    setError(false)
    setLastPressed(digit)
    setTimeout(() => setLastPressed(null), 150)

    if (next.length === 4) {
      if (next === correctPin) {
        onUnlock()
      } else {
        setShaking(true)
        setError(true)
        setTimeout(() => {
          setShaking(false)
          setPin('')
        }, 500)
      }
    }
  }

  function handleBackspace() {
    setPin((p) => p.slice(0, -1))
    setError(false)
  }

  return (
    <>
      <style>{shakeStyle}</style>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
        <div className="w-full max-w-xs">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <Lock className="h-8 w-8 text-white/40" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">{title}</h1>
          <p className="text-sm text-white/50 text-center mb-8">{subtitle}</p>

          {/* PIN dots */}
          <div className={cn('flex gap-5 justify-center mb-3', shaking && 'pin-shake')}>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'h-4 w-4 rounded-full border-2 transition-all duration-200',
                  i < pin.length
                    ? error
                      ? 'bg-red-500 border-red-500 scale-110'
                      : 'bg-white border-white scale-110'
                    : 'bg-transparent border-white/20'
                )}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center mb-2 font-semibold">Incorrect PIN</p>
          )}

          {demoPin && (
            <p className="text-xs text-white/30 text-center mb-8">
              Demo PIN:{' '}
              <span className="font-mono font-bold text-white/50 tracking-widest">{demoPin}</span>
            </p>
          )}
          {!demoPin && <div className="mb-8" />}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className={cn(
                  'h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-2xl font-bold text-white',
                  'hover:bg-white/[0.1] active:scale-95 transition-all duration-100 cursor-pointer select-none',
                  lastPressed === d && 'pin-pop bg-white/[0.1]'
                )}
              >
                {d}
              </button>
            ))}
            <div className="h-14" />
            <button
              onClick={() => handleDigit('0')}
              className={cn(
                'h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-2xl font-bold text-white',
                'hover:bg-white/[0.1] active:scale-95 transition-all duration-100 cursor-pointer select-none',
                lastPressed === '0' && 'pin-pop bg-white/[0.1]'
              )}
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] active:scale-95 transition-all duration-100 cursor-pointer"
            >
              <Delete className="h-5 w-5" />
            </button>
          </div>

          {backHref && (
            <div className="mt-8 text-center">
              <a
                href={backHref}
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                ← Back to Staff Mode
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
