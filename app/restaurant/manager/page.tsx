'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DEMO_RESTAURANTS, DEMO_ORDERS } from '@/lib/demo-data'
import { cn, formatDate } from '@/lib/utils'
import {
  Lock,
  Utensils,
  Settings,
  ClipboardList,
  BarChart3,
  Delete,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  FileVideo,
  AlertTriangle,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]
const DEMO_PIN = restaurant.manager_pin

const shakeStyle = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.shake { animation: shake 0.4s ease-in-out; }

@keyframes pinPop {
  0% { transform: scale(1); }
  40% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.pin-pop { animation: pinPop 0.15s ease-out; }
`

const todayOrders = DEMO_ORDERS.filter(
  (o) => o.restaurant_id === restaurant.id &&
    (o.status === 'confirmed' || o.status === 'approved' || o.status === 'proof_submitted')
)
const todayComps = todayOrders.length
const dailyCap = restaurant.settings.daily_comp_cap ?? 0
const videosDue = DEMO_ORDERS.filter((o) => o.status === 'proof_submitted').length
const weekOrders = DEMO_ORDERS.filter(
  (o) =>
    o.restaurant_id === restaurant.id &&
    o.status !== 'rejected' &&
    o.status !== 'expired'
).length

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

const NAV_CARDS = [
  {
    label: 'Comp Menu',
    description: 'Add and manage comped items',
    icon: Utensils,
    href: '/restaurant/manager/menu',
  },
  {
    label: 'Settings',
    description: 'Hours, caps, cooldowns',
    icon: Settings,
    href: '/restaurant/manager/settings',
  },
  {
    label: 'History',
    description: 'Full redemption log',
    icon: ClipboardList,
    href: '/restaurant/manager/history',
  },
  {
    label: 'Analytics',
    description: 'Performance metrics',
    icon: BarChart3,
    href: '/restaurant/manager/analytics',
  },
]

export default function ManagerPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const [lastPressedDigit, setLastPressedDigit] = useState<string | null>(null)

  function handleDigit(digit: string) {
    if (pin.length >= 4) return
    const next = pin + digit
    setPin(next)
    setPinError(false)
    setLastPressedDigit(digit)
    setTimeout(() => setLastPressedDigit(null), 150)

    if (next.length === 4) {
      if (next === DEMO_PIN) {
        setUnlocked(true)
      } else {
        setShaking(true)
        setPinError(true)
        setTimeout(() => {
          setShaking(false)
          setPin('')
        }, 500)
      }
    }
  }

  function handleBackspace() {
    setPin((p) => p.slice(0, -1))
    setPinError(false)
  }

  function handleLock() {
    setUnlocked(false)
    setPin('')
    setPinError(false)
    setShowLockConfirm(false)
  }

  // ── Manager Dashboard ──
  if (unlocked) {
    return (
      <div className="p-6">
        <div className="cc-inner">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Good {getTimeOfDay()}, Manager!
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-medium">
                {restaurant.name} — {formatDate(new Date().toISOString())}
              </p>
            </div>
            <button
              onClick={() => setShowLockConfirm(true)}
              className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors rounded-lg px-4 py-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              Lock
            </button>
          </div>

          {/* Pause warning */}
          {restaurant.settings.pause_comps && (
            <div className="mb-6 flex items-center gap-3 border border-slate-200 rounded-lg px-5 py-4">
              <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600">
                All comps are currently paused. Go to Settings to resume.
              </p>
            </div>
          )}

          {/* Today's Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-slate-200 rounded-lg p-5">
              <p className="text-3xl font-black text-slate-900">
                {todayComps}
                {dailyCap > 0 && (
                  <span className="text-lg font-normal text-slate-400">/{dailyCap}</span>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Today&apos;s Comps</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-5">
              <p className="text-3xl font-black text-slate-900">{videosDue}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Videos Due</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-5">
              <p className="text-3xl font-black text-slate-900">{weekOrders}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">This Week</p>
            </div>
          </div>

          {/* Nav Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NAV_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.href}
                  onClick={() => router.push(card.href)}
                  className="border border-slate-200 rounded-lg p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer group flex items-center gap-4"
                >
                  <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{card.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{card.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-cc-accent transition-colors shrink-0" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Lock Confirm Modal */}
        <Modal
          open={showLockConfirm}
          onClose={() => setShowLockConfirm(false)}
          title="Lock Manager Mode?"
          description="Staff will need the PIN to access manager settings again."
        >
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowLockConfirm(false)}>Cancel</Button>
            <Button variant="secondary" leftIcon={<Lock className="h-4 w-4" />} onClick={handleLock}>
              Lock
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }

  // ── PIN Entry ──
  return (
    <>
      <style>{shakeStyle}</style>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-white">
        <div className="w-full max-w-sm">

          {/* Large centered lock icon */}
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-lg border border-slate-200 flex items-center justify-center">
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 text-center mb-2">Manager Access</h1>
          <p className="text-sm text-slate-500 text-center mb-8 font-medium">
            Enter your 4-digit PIN to continue
          </p>

          {/* PIN dots — larger and more prominent */}
          <div className={cn('flex gap-5 justify-center mb-3', shaking && 'shake')}>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'h-5 w-5 rounded-full border-2 transition-all duration-200',
                  i < pin.length
                    ? pinError
                      ? 'bg-red-500 border-red-500 scale-110'
                      : 'bg-slate-900 border-slate-900 scale-110'
                    : 'bg-transparent border-slate-300'
                )}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-sm text-red-500 text-center mb-2 font-bold">Incorrect PIN</p>
          )}

          <p className="text-xs text-slate-400 text-center mb-8 font-medium">
            Demo PIN:{' '}
            <span className="font-mono font-black text-cc-accent tracking-widest">{DEMO_PIN}</span>
          </p>

          {/* Numeric Keypad — w-16 h-16 large digit circles */}
          <div className="grid grid-cols-3 gap-4">
            {['1','2','3','4','5','6','7','8','9'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className={cn(
                  'h-16 w-full rounded-lg bg-white border border-slate-200 text-3xl font-black text-slate-900',
                  'hover:bg-slate-50',
                  'active:scale-95 transition-all duration-100 cursor-pointer select-none',
                  lastPressedDigit === d && 'pin-pop bg-slate-50'
                )}
              >
                {d}
              </button>
            ))}

            {/* Bottom row: empty, 0, backspace */}
            <div className="h-16" />
            <button
              onClick={() => handleDigit('0')}
              className={cn(
                'h-16 w-full rounded-lg bg-white border border-slate-200 text-3xl font-black text-slate-900',
                'hover:bg-slate-50',
                'active:scale-95 transition-all duration-100 cursor-pointer select-none',
                lastPressedDigit === '0' && 'pin-pop bg-slate-50'
              )}
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-100 cursor-pointer"
            >
              <Delete className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/restaurant')}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors font-medium"
            >
              ← Back to Staff Mode
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
