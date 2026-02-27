'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_ORDERS,
  DEMO_CREATORS,
  DEMO_RESTAURANTS,
} from '@/lib/demo-data'
import { relativeTime, formatTime, cn } from '@/lib/utils'
import {
  Camera,
  QrCode,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]
const RECENT_REDEMPTIONS = DEMO_ORDERS.slice(0, 5)

function getCreator(creatorId: string) {
  return DEMO_CREATORS.find((c) => c.id === creatorId) ?? null
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function LiveClock() {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>{time}</span>
}

const shakeStyle = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.shake { animation: shake 0.4s ease-in-out; }

@keyframes scanLine {
  0%, 100% { transform: translateY(0px); opacity: 0.9; }
  50% { transform: translateY(80px); opacity: 0.6; }
}
.scan-line {
  animation: scanLine 2s ease-in-out infinite;
}

@keyframes scanPulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}
.scan-pulse {
  animation: scanPulse 2s ease-in-out infinite;
}
`

export default function RestaurantStaffPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [showScanner, setShowScanner] = useState(false)
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', ''])
  const [codeError, setCodeError] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [expiredModal, setExpiredModal] = useState(false)
  const [alreadyRedeemedModal, setAlreadyRedeemedModal] = useState<{ open: boolean; time?: string }>({ open: false })

  const fullCode = codeDigits.join('')

  useEffect(() => {
    if (fullCode.length === 5 && !codeDigits.includes('')) {
      handleCodeSubmit(fullCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullCode])

  function handleDigitChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...codeDigits]
    next[idx] = val.slice(-1)
    setCodeDigits(next)
    setCodeError(null)
    if (val && idx < 4) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handleDigitKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !codeDigits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  function handleCodeSubmit(code: string) {
    const order = DEMO_ORDERS.find((o) => o.redemption_code === code)

    if (!order) {
      setCodeError('Code not found. Please try again.')
      triggerShake()
      toast({ type: 'error', title: 'Invalid code', message: 'No order found for this code.' })
      setCodeDigits(['', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
      return
    }

    if (order.status === 'expired') {
      setCodeDigits(['', '', '', '', ''])
      setExpiredModal(true)
      return
    }

    if (
      order.status === 'confirmed' ||
      order.status === 'approved' ||
      order.status === 'proof_submitted'
    ) {
      setCodeDigits(['', '', '', '', ''])
      setAlreadyRedeemedModal({
        open: true,
        time: order.confirmed_at ? formatTime(order.confirmed_at) : undefined,
      })
      return
    }

    router.push(`/restaurant/ticket/${order.id}`)
  }

  function handleDemoScan() {
    setShowScanner(false)
    const demoOrder = DEMO_ORDERS.find((o) => o.status === 'created') ?? DEMO_ORDERS[0]
    router.push(`/restaurant/ticket/${demoOrder.id}`)
  }

  return (
    <>
      <style>{shakeStyle}</style>

      <div className="p-6 min-h-full">
        {/* ── Status Bar / Greeting Header ── */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-1">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Staff Mode</p>
              <h1 className="text-2xl font-black text-slate-900">
                {getGreeting()}, {restaurant.name}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                <LiveClock />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Pause banner */}
        {restaurant.settings.pause_comps && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-700">
              Comps are currently paused. Contact your manager to resume.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 cc-inner">

          {/* ── LEFT: Scan + Manual Entry ── */}
          <div className="flex flex-col gap-5 h-full">

            {/* Big scan button with animated scan line */}
            <button
              onClick={() => setShowScanner(true)}
              className="relative w-full min-h-[200px] rounded-2xl bg-cc-accent hover:bg-cc-accent-dark active:scale-[0.99] transition-all flex flex-col items-center justify-center gap-4 text-white shadow-lg shadow-cc-accent/20 cursor-pointer select-none overflow-hidden"
            >
              {/* Subtle grid pattern background */}
              <div className="scan-pulse absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)'
              }} />

              {/* Animated scan line */}
              <div className="scan-line absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full top-8" />

              {/* Icon + text */}
              <div className="relative z-10 h-20 w-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-2xl font-black tracking-tight">Scan QR Code</p>
                <p className="text-sm text-white/75 mt-1 font-medium">Point camera at creator&apos;s screen</p>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or enter code</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Manual code entry card */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-7">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-5">5-Digit Redemption Code</p>
              <div className={cn('flex gap-4 justify-center', shaking && 'shake')}>
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    className={cn(
                      'w-16 h-16 text-center text-3xl font-black rounded-2xl bg-slate-50 border-2 text-slate-900',
                      'focus:outline-none focus:border-cc-accent focus:bg-white focus:shadow-sm',
                      'transition-all duration-150',
                      codeError ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    )}
                  />
                ))}
              </div>

              {codeError && (
                <p className="text-sm text-red-500 text-center mt-4 font-medium">{codeError}</p>
              )}

              <p className="text-xs text-slate-400 text-center mt-4">
                Auto-submits when all 5 digits are entered
              </p>

              {/* Demo shortcuts */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 mb-2.5 font-medium">Demo — try a code:</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {DEMO_ORDERS.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => router.push(`/restaurant/ticket/${o.id}`)}
                      className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-cc-accent hover:border-cc-accent hover:bg-blue-50 transition-colors font-bold"
                    >
                      {o.redemption_code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── How it works card ── */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-auto">
              <p className="text-sm font-bold text-slate-900 mb-4">How it works</p>
              <div className="flex flex-col gap-3">
                {[
                  'Creator opens the app and selects items',
                  'They show you their QR code or 5-digit code',
                  'You scan or enter the code to confirm',
                  'The comp is applied — no cash needed',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cc-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-cc-text-secondary leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Recent Redemptions ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Today&apos;s Redemptions</h2>
              </div>
              <span className="bg-blue-50 text-cc-accent text-xs font-black rounded-full px-3 py-1 tabular-nums">
                {RECENT_REDEMPTIONS.length}
              </span>
            </div>

            {RECENT_REDEMPTIONS.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center px-6 flex-1">
                <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-semibold">No redemptions yet today</p>
                <p className="text-sm text-slate-400">Scan a creator&apos;s QR code to get started</p>
              </div>
            ) : (
              <ul className="flex-1">
                {RECENT_REDEMPTIONS.map((order, i) => {
                  const creator = getCreator(order.creator_id)
                  const isConfirmed =
                    order.status === 'confirmed' ||
                    order.status === 'approved' ||
                    order.status === 'proof_submitted'
                  const isRejected = order.status === 'rejected'

                  return (
                    <li
                      key={order.id}
                      className={cn(
                        'flex items-center gap-4 pr-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer',
                        i < RECENT_REDEMPTIONS.length - 1 && 'border-b border-slate-100',
                        isConfirmed ? 'border-l-4 border-l-emerald-400 pl-4' : isRejected ? 'border-l-4 border-l-red-400 pl-4' : 'border-l-4 border-l-amber-400 pl-4'
                      )}
                      onClick={() => router.push(`/restaurant/ticket/${order.id}`)}
                    >
                      {/* Status icon */}
                      <div className="shrink-0">
                        {isConfirmed ? (
                          <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                          </div>
                        ) : isRejected ? (
                          <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                            <XCircle className="h-4.5 w-4.5 text-red-400" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-300">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                        )}
                      </div>

                      <Avatar
                        src={creator?.photo_url ?? null}
                        name={creator?.name ?? 'Unknown'}
                        size="sm"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {creator?.name ?? 'Unknown Creator'}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {order.items.map((item) => item.menu_item_name).join(', ')}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <OrderStatusBadge status={order.status} />
                        <div className="flex items-center gap-2">
                          {order.items.length > 0 && (
                            <span className="text-xs bg-slate-100 text-slate-500 font-semibold rounded-full px-2 py-0.5">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {relativeTime(order.confirmed_at ?? order.created_at)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── QR Scanner Modal ── */}
      <Modal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        hideClose
        maxWidth="max-w-md"
      >
        <div className="relative">
          <button
            onClick={() => setShowScanner(false)}
            className="absolute top-0 right-0 h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-6 py-2">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900">Scan Creator&apos;s QR Code</h2>
              <p className="text-sm text-slate-500 mt-1">
                Point camera at creator&apos;s QR code on their phone
              </p>
            </div>

            {/* Viewfinder */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="w-56 h-56 border-2 border-dashed border-cc-accent rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50">
                <QrCode className="h-14 w-14 text-cc-accent opacity-30" />
                <p className="text-xs text-slate-400 text-center px-4">
                  Camera preview would appear here
                </p>
              </div>
              {/* Corner bracket markers */}
              {[
                ['top-0 left-0', 'border-t-4 border-l-4 rounded-tl-lg'],
                ['top-0 right-0', 'border-t-4 border-r-4 rounded-tr-lg'],
                ['bottom-0 left-0', 'border-b-4 border-l-4 rounded-bl-lg'],
                ['bottom-0 right-0', 'border-b-4 border-r-4 rounded-br-lg'],
              ].map(([pos, border], i) => (
                <div
                  key={i}
                  className={cn('absolute w-7 h-7 border-cc-accent', pos, border)}
                />
              ))}
            </div>

            {/* Demo simulate */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-3 w-full max-w-xs">
                <div className="flex-1 border-t border-slate-200" />
                <span className="text-xs text-slate-400 font-medium">DEMO MODE</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>
              <button
                onClick={handleDemoScan}
                className="w-full max-w-xs min-h-[48px] bg-cc-accent hover:bg-cc-accent-dark text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                Simulate QR Scan
              </button>
              <p className="text-xs text-slate-400">
                Simulates scanning a valid creator QR code
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Expired Code Modal ── */}
      <Modal
        open={expiredModal}
        onClose={() => setExpiredModal(false)}
        title="Code Expired"
        description="This redemption code is no longer valid."
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="h-14 w-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Clock className="h-7 w-7 text-amber-500" />
          </div>
          <p className="text-sm text-slate-600 text-center">
            QR codes expire 20 minutes after generation. Ask the creator to generate a new code in the app.
          </p>
        </div>
        <ModalFooter>
          <Button variant="primary" onClick={() => setExpiredModal(false)}>
            Got It
          </Button>
        </ModalFooter>
      </Modal>

      {/* ── Already Redeemed Modal ── */}
      <Modal
        open={alreadyRedeemedModal.open}
        onClose={() => setAlreadyRedeemedModal({ open: false })}
        title="Already Redeemed"
        description="This code has already been used."
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="h-14 w-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <XCircle className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-sm text-slate-600 text-center">
            This code was already redeemed
            {alreadyRedeemedModal.time ? ` at ${alreadyRedeemedModal.time}` : ''}.
            Each code can only be used once.
          </p>
        </div>
        <ModalFooter>
          <Button variant="primary" onClick={() => setAlreadyRedeemedModal({ open: false })}>
            Got It
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
