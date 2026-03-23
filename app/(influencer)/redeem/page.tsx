'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { AlertTriangle, Clock, QrCode, ArrowRight, RefreshCw } from 'lucide-react'
import { Countdown } from '@/components/ui/countdown'
import { secondsRemaining } from '@/lib/utils'
import { useOrderStore } from '@/lib/stores/order-store'

export default function RedeemPage() {
  const router = useRouter()
  const { activeRedemption, clearRedemption } = useOrderStore()
  const [expired, setExpired] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    async function requestWakeLock() {
      if ('wakeLock' in navigator) {
        try { wakeLockRef.current = await navigator.wakeLock.request('screen') } catch { /* ignore */ }
      }
    }
    requestWakeLock()
    return () => { wakeLockRef.current?.release().catch(() => {}) }
  }, [])

  useEffect(() => {
    if (activeRedemption) {
      if (secondsRemaining(activeRedemption.expiresAt) === 0) setExpired(true)
    }
  }, [activeRedemption])

  const handleExpired = () => setExpired(true)

  // Empty state
  if (!activeRedemption) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ paddingBottom: '80px' }}>
        <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <QrCode className="h-11 w-11 text-gray-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">No active comp</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">Browse restaurants, add items, and place an order to get your redemption code.</p>
        </div>
        <button
          onClick={() => router.push('/discover')}
          className="flex items-center gap-2 text-white font-bold rounded-[18px] px-8 py-3.5 text-sm"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          Browse Restaurants
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const { restaurantName, redemptionCode, qrToken, expiresAt, items } = activeRedemption
  const secsLeft = secondsRemaining(expiresAt)
  const timerColor = expired ? 'text-red-500' : secsLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <span className="text-xs text-gray-300 font-medium truncate max-w-[160px]">{restaurantName}</span>
        </div>
        <h1 className="text-xl font-bold text-white">{restaurantName}</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Show to Restaurant Staff</p>
        <p className="text-sm text-gray-400 mt-1">Ask them to scan the QR code or enter the 5-digit code</p>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pb-28 gap-5">
        {/* QR Code */}
        <div className="relative">
          <div className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col items-center ${expired ? 'opacity-40' : ''}`}>
            <QRCodeSVG
              value={qrToken}
              size={200}
              bgColor="#1a1a1a"
              fgColor="#ffffff"
              level="M"
              includeMargin={false}
            />
            <p className="text-sm font-semibold text-gray-400 text-center mt-4">@ {restaurantName}</p>
          </div>
          {expired && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/70">
              <span className="text-red-500 font-bold text-2xl tracking-tight">EXPIRED</span>
            </div>
          )}
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-[10px] text-gray-600 font-bold tracking-widest">OR</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        {/* 5-digit code */}
        <div className="text-center">
          <div
            className={`font-bold tracking-[0.3em] font-mono text-5xl transition-colors ${expired ? 'text-gray-700' : 'text-white'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {redemptionCode}
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold">5-Digit Code</p>
        </div>

        {/* Countdown */}
        <div className={`bg-[#1a1a1a] border rounded-2xl px-6 py-4 flex flex-col items-center gap-1 w-full max-w-xs ${expired ? 'border-red-500/30' : secsLeft < 300 ? 'border-red-500/30' : 'border-[#2a2a2a]'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`h-3.5 w-3.5 ${expired ? 'text-red-400' : secsLeft < 300 ? 'text-red-400' : 'text-gray-500'}`} />
            <p className={`text-[10px] font-bold uppercase tracking-widest ${expired ? 'text-red-400' : secsLeft < 300 ? 'text-red-400' : 'text-gray-500'}`}>
              {expired ? 'Code Expired' : 'Expires in'}
            </p>
          </div>
          {!expired ? (
            <Countdown deadline={expiresAt} onExpired={handleExpired} showHours={false} size="lg" className={timerColor} />
          ) : (
            <span className="text-5xl font-bold font-mono tracking-widest text-red-500">00:00</span>
          )}
        </div>

        {/* Items ordered */}
        <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Items ordered</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-[#252525] border border-[#2a2a2a] rounded-xl px-3 py-1.5 text-sm font-semibold text-white">
                {item.name}
                {item.qty > 1 && (
                  <span className="bg-white/10 text-gray-400 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{item.qty}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 w-full">
          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">Do not leave this screen until staff confirms your order.</p>
        </div>
      </div>

      {/* Expired overlay */}
      {expired && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="h-11 w-11 text-red-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Code Expired</h2>
            <p className="text-gray-400 mt-2.5 text-sm leading-relaxed">Your 20-minute window has passed. Go back and generate a new order.</p>
          </div>
          <button
            onClick={() => { clearRedemption(); router.push('/discover') }}
            className="flex items-center gap-2.5 text-white font-bold rounded-[18px] px-8 py-4 text-sm"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            <RefreshCw className="h-4 w-4" />
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}
