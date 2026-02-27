'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { RefreshCw, AlertTriangle, Clock, QrCode, ArrowRight } from 'lucide-react'
import { Countdown } from '@/components/ui/countdown'
import { CCLogoWithMark } from '@/components/cc-logo'
import { cn, secondsRemaining } from '@/lib/utils'
import { useOrderStore } from '@/lib/stores/order-store'

export default function RedeemPage() {
  const router = useRouter()
  const { activeRedemption, clearRedemption } = useOrderStore()
  const [expired, setExpired] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  // Request WakeLock to keep screen on
  useEffect(() => {
    async function requestWakeLock() {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
        } catch {
          // WakeLock not available — ignore gracefully
        }
      }
    }
    requestWakeLock()

    return () => {
      wakeLockRef.current?.release().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (activeRedemption) {
      const secs = secondsRemaining(activeRedemption.expiresAt)
      if (secs === 0) setExpired(true)
    }
  }, [activeRedemption])

  const handleExpired = () => setExpired(true)

  // ── Empty state ───────────────────────────────────────────────
  if (!activeRedemption) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '0 24px 64px', textAlign: 'center', zIndex: 10 }}>
        {/* Big QR icon */}
        <div className="w-24 h-24 rounded-3xl bg-cc-accent-subtle flex items-center justify-center shadow-inner">
          <QrCode className="h-11 w-11 text-cc-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">No active comp</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Browse restaurants, add items to your cart, and place an order to get your redemption code.
          </p>
        </div>
        <button
          onClick={() => router.push('/creator/discover')}
          className="flex items-center gap-2 bg-cc-accent text-white font-black rounded-2xl px-8 py-3.5 text-sm hover:bg-cc-accent-dark active:scale-95 transition-all shadow-sm shadow-cc-accent/30"
        >
          Browse Restaurants
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const { restaurantName, redemptionCode, qrToken, expiresAt, items } = activeRedemption

  // Determine urgency for timer coloring
  const secsLeft = secondsRemaining(expiresAt)
  const timerColor =
    expired
      ? 'text-red-500'
      : secsLeft < 43200 // < 12h
      ? 'text-red-500 animate-pulse'
      : secsLeft < 86400 // < 24h
      ? 'text-amber-500'
      : 'text-emerald-600'

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pt-safe">
        <header className="flex items-center justify-between px-5 pt-5 pb-3">
          <CCLogoWithMark size="sm" />
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs text-slate-700 font-medium truncate max-w-[120px]">
              {restaurantName}
            </span>
          </div>
        </header>

        {/* Restaurant name + instruction */}
        <div className="text-center px-5 pb-5">
          <h1 className="text-lg font-bold text-slate-900">{restaurantName}</h1>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">
            Show to Restaurant Staff
          </p>
          <p className="text-sm text-slate-500 mt-1.5 leading-snug">
            Ask them to scan the QR code or enter the 5-digit code
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center px-5 pt-2 pb-8 gap-5">
        {/* QR Code container */}
        <div className="relative w-full">
          <div
            className={cn(
              'bg-white border rounded-xl p-6 flex flex-col items-center mx-auto w-fit transition-all',
              expired ? 'border-red-200 opacity-40' : 'border-slate-200'
            )}
          >
            <QRCodeSVG
              value={qrToken}
              size={220}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
              includeMargin={false}
            />
            <p className="text-sm font-bold text-slate-500 text-center mt-4">
              @ {restaurantName}
            </p>
          </div>
          {expired && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/85 backdrop-blur-sm">
              <span className="text-red-500 font-black text-2xl tracking-tight">EXPIRED</span>
            </div>
          )}
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] text-slate-400 font-black tracking-widest">OR</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* 5-Digit Code */}
        <div className="text-center">
          <div
            className={cn(
              'font-black tracking-[0.3em] font-mono transition-colors text-5xl',
              expired ? 'text-slate-200' : 'text-slate-900'
            )}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {redemptionCode}
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-black">
            5-Digit Code
          </p>
        </div>

        {/* Countdown timer */}
        <div
          className={cn(
            'rounded-lg px-6 py-4 flex flex-col items-center gap-1 w-full max-w-xs border',
            expired
              ? 'border-red-200'
              : secsLeft < 43200
              ? 'border-red-200'
              : secsLeft < 86400
              ? 'border-amber-200'
              : 'border-slate-200'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock
              className={cn(
                'h-3.5 w-3.5',
                expired ? 'text-red-400' : secsLeft < 43200 ? 'text-red-400' : secsLeft < 86400 ? 'text-amber-500' : 'text-emerald-500'
              )}
            />
            <p
              className={cn(
                'text-[10px] font-black uppercase tracking-widest',
                expired ? 'text-red-400' : secsLeft < 43200 ? 'text-red-400' : secsLeft < 86400 ? 'text-amber-500' : 'text-emerald-600'
              )}
            >
              {expired ? 'Code Expired' : 'Expires in'}
            </p>
          </div>
          {!expired ? (
            <Countdown
              deadline={expiresAt}
              onExpired={handleExpired}
              showHours={false}
              size="lg"
              className={timerColor}
            />
          ) : (
            <span className={cn('text-5xl font-black font-mono tracking-widest', timerColor)}>00:00</span>
          )}
        </div>

        {/* Items ordered */}
        <div className="w-full border border-slate-200 rounded-lg px-4 py-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">
            Items ordered
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 text-sm font-bold text-slate-700"
              >
                {item.name}
                {item.qty > 1 && (
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {item.qty}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2.5 border border-slate-200 rounded-lg px-4 py-3 w-full">
          <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Do not leave this screen until staff confirms your order.
          </p>
        </div>
      </div>

      {/* Expired overlay */}
      {expired && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-red-50 border-2 border-red-200 flex items-center justify-center shadow-inner">
            <AlertTriangle className="h-11 w-11 text-red-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Code Expired</h2>
            <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
              Your 20-minute window has passed. Go back and generate a new order.
            </p>
          </div>
          <button
            onClick={() => {
              clearRedemption()
              router.push('/creator/discover')
            }}
            className="flex items-center gap-2.5 bg-cc-accent text-white font-black rounded-2xl px-8 py-4 text-sm hover:bg-cc-accent-dark active:scale-95 transition-all shadow-sm shadow-cc-accent/30"
          >
            <RefreshCw className="h-4 w-4" />
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}
