'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { useRealtimeOrders } from '@/lib/hooks/useRealtimeOrders'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { relativeTime, cn } from '@/lib/utils'
import {
  Camera,
  QrCode,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle,
} from 'lucide-react'
import type { Order } from '@/lib/types'

const restaurant = DEMO_RESTAURANTS[0]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  return 'Evening'
}

function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  )
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }, 1000)
    return () => clearInterval(iv)
  }, [])
  return <span>{time}</span>
}

function statusColor(status: Order['status']) {
  if (status === 'confirmed' || status === 'approved' || status === 'proof_submitted') return 'bg-emerald-500'
  if (status === 'rejected' || status === 'expired') return 'bg-red-500'
  return 'bg-amber-400'
}

const shakeStyle = `
@keyframes ccShake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.cc-shake { animation: ccShake 0.4s ease-in-out; }
`

export default function RestaurantScannerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { orders } = useRealtimeOrders(restaurant.id)

  const [showScanner, setShowScanner] = useState(false)
  const [digits, setDigits] = useState<string[]>(['', '', '', '', ''])
  const [codeError, setCodeError] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const fullCode = digits.join('')

  useEffect(() => {
    if (fullCode.length === 5 && !digits.includes('')) {
      handleCodeSubmit(fullCode)
    }
  }, [fullCode])

  function handleDigitChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[idx] = val.slice(-1)
    setDigits(next)
    setCodeError(null)
    if (val && idx < 4) inputRefs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  function handleCodeSubmit(code: string) {
    const order = orders.find((o) => o.redemption_code === code)
    if (!order) {
      setCodeError('Code not found')
      triggerShake()
      toast({ type: 'error', title: 'Invalid code', message: 'No order found.' })
      setDigits(['', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
      return
    }
    if (order.status === 'expired') {
      toast({ type: 'warning', title: 'Code expired', message: 'Ask creator to generate a new code.' })
      setDigits(['', '', '', '', ''])
      return
    }
    if (['confirmed', 'approved', 'proof_submitted'].includes(order.status)) {
      toast({ type: 'warning', title: 'Already redeemed', message: 'This code was already used.' })
      setDigits(['', '', '', '', ''])
      return
    }
    router.push(`/restaurant/ticket/${order.id}`)
  }

  function handleDemoScan() {
    setShowScanner(false)
    const demoOrder = orders.find((o) => o.status === 'created') ?? orders[0]
    if (demoOrder) router.push(`/restaurant/ticket/${demoOrder.id}`)
  }

  const todayOrders = orders.filter((o) => {
    const today = new Date().toDateString()
    return new Date(o.confirmed_at ?? o.created_at).toDateString() === today &&
      ['confirmed', 'approved', 'proof_submitted', 'rejected'].includes(o.status)
  })

  return (
    <>
      <style>{shakeStyle}</style>
      <div className="px-4 pt-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1">Staff Mode</p>
            <h1 className="text-xl font-bold text-white">
              Good {getGreeting()}!
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{restaurant.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white tabular-nums">
              <LiveClock />
            </p>
            <p className="text-xs text-white/30 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Pause banner */}
        {restaurant.settings.pause_comps && (
          <div className="mb-5 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">Comps are paused. Contact your manager.</p>
          </div>
        )}

        {/* Scan QR button */}
        <button
          onClick={() => setShowScanner(true)}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 p-px mb-4"
        >
          <div className="w-full rounded-[calc(1rem-1px)] bg-[#0a0a0a] flex flex-col items-center justify-center gap-3 py-10 hover:bg-white/[0.03] transition-colors">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">Scan QR Code</p>
              <p className="text-sm text-white/50 mt-0.5">Point camera at creator&apos;s screen</p>
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs text-white/30 font-semibold uppercase tracking-wider">or enter code</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Code entry */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-5">
          <p className="text-xs text-white/40 uppercase tracking-widest text-center mb-5 font-medium">
            5-Digit Redemption Code
          </p>
          <div className={cn('flex gap-2.5 justify-center', shaking && 'cc-shake')}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={cn(
                  'w-12 h-12 text-center text-xl font-bold rounded-xl border text-white',
                  'bg-white/[0.05] focus:outline-none transition-colors',
                  codeError
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-white/[0.08] focus:border-white/30'
                )}
              />
            ))}
          </div>
          {codeError && (
            <p className="text-sm text-red-400 text-center mt-3 font-medium">{codeError}</p>
          )}
          <p className="text-xs text-white/30 text-center mt-3">Auto-submits on 5 digits</p>

          {/* Demo shortcuts */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <p className="text-xs text-white/30 mb-2">Demo — tap a code:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => router.push(`/restaurant/ticket/${o.id}`)}
                  className="text-xs font-mono bg-white/[0.05] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-white/60 hover:text-white hover:border-white/20 transition-colors font-semibold"
                >
                  {o.redemption_code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Redemptions */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden mb-4">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white">Today&apos;s Redemptions</h2>
            </div>
            <span className="text-xs text-white/40 font-medium tabular-nums">{todayOrders.length}</span>
          </div>

          {todayOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center px-6">
              <QrCode className="h-8 w-8 text-white/20" />
              <p className="text-sm text-white/40">No redemptions yet today</p>
            </div>
          ) : (
            <ul>
              {todayOrders.map((order, i) => (
                <li
                  key={order.id}
                  className={cn(
                    'flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors',
                    i < todayOrders.length - 1 && 'border-b border-white/[0.06]'
                  )}
                  onClick={() => router.push(`/restaurant/ticket/${order.id}`)}
                >
                  <span className={cn('h-2 w-2 rounded-full shrink-0', statusColor(order.status))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      #{order.redemption_code}
                    </p>
                    <p className="text-xs text-white/40 truncate mt-0.5">
                      {order.items.map((i) => i.menu_item_name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      'text-xs font-medium capitalize',
                      order.status === 'confirmed' || order.status === 'approved'
                        ? 'text-emerald-400'
                        : order.status === 'rejected'
                        ? 'text-red-400'
                        : 'text-white/40'
                    )}>
                      {order.status}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {relativeTime(order.confirmed_at ?? order.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* QR Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <button
            onClick={() => setShowScanner(false)}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
          <p className="text-sm text-white/50 mb-8 text-center">
            Point the camera at the creator&apos;s screen
          </p>

          {/* Viewfinder */}
          <div className="relative w-64 h-64 mb-8">
            <div className="w-full h-full rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-3">
              <QrCode className="h-16 w-16 text-white/20" />
              <p className="text-xs text-white/30 text-center px-4">Camera preview here</p>
            </div>
            {/* Corner brackets */}
            {[
              'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
              'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
              'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
              'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
            ].map((cls, i) => (
              <div key={i} className={`absolute w-8 h-8 border-orange-500 ${cls}`} />
            ))}
          </div>

          <div className="w-full max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-white/30 font-medium">DEMO MODE</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
            <button
              onClick={handleDemoScan}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Simulate QR Scan
            </button>
          </div>
        </div>
      )}
    </>
  )
}
