'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Keyboard, VideoOff } from 'lucide-react'
import { hapticLight, hapticSuccess } from '@/lib/haptics'
import { DEMO_ORDERS } from '@/lib/demo-data'
import { isDemoMode } from '@/lib/supabase'
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode'

export default function ScannerPage() {
  const router = useRouter()
  const scannerRef = useRef<Html5QrcodeType | null>(null)
  const scannedRef = useRef(false)
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [cameraUnavailable, setCameraUnavailable] = useState(false)
  const [digits, setDigits] = useState(['', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize scanner once on mount — hide via CSS when code entry is shown
  useEffect(() => {
    let scanner: Html5QrcodeType | null = null

    const initScanner = async () => {
      const { Html5Qrcode } = await import('html5-qrcode')

      scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      const cameras = await Html5Qrcode.getCameras().catch(() => [])
      if (!cameras.length) {
        setCameraUnavailable(true)
        return
      }

      // Prefer rear camera on mobile
      const cameraId = cameras.find((c) => /back|rear|environment/i.test(c.label))?.id ?? cameras[0].id

      await scanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          if (scannedRef.current) return
          scannedRef.current = true

          let token = decodedText.trim()
          try {
            const url = new URL(decodedText)
            const t = url.searchParams.get('token')
            if (t) token = t
          } catch {
            // not a URL — use raw text as token
          }

          scanner?.stop().catch(() => {})
          hapticSuccess()
          router.push(`/dashboard/scanner/verify?token=${encodeURIComponent(token)}`)
        },
        () => {} // silent scan failures
      ).catch(() => {}) // ignore permission denied / no camera
    }

    initScanner()

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {})
      }
    }
  }, [router])

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
      hapticLight()
    }

    // Auto-submit when all 5 digits entered
    if (newDigits.every((d) => d !== '')) {
      const code = newDigits.join('')
      hapticSuccess()
      router.push(`/dashboard/scanner/verify?code=${encodeURIComponent(code)}`)
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center px-6">
      {/* QR reader container — always mounted, hidden when code entry is shown */}
      <div
        id="qr-reader"
        className="w-full max-w-sm mb-6"
        style={{ display: showCodeEntry ? 'none' : 'block' }}
        suppressHydrationWarning
      />

      {!showCodeEntry ? (
        <>
          {/* Camera unavailable fallback */}
          {cameraUnavailable && (
            <div className="w-full max-w-sm mb-6 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
              <VideoOff className="h-8 w-8 text-white/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white/60 mb-1">Camera Unavailable</p>
              <p className="text-xs text-white/30">Use manual code entry below</p>
            </div>
          )}

          {/* QR Scanner Mode */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-7 w-7 text-white/60" />
            </div>
            <h1 className="text-xl font-bold mb-1">Scan QR Code</h1>
            <p className="text-white/40 text-sm">Point camera at creator&apos;s QR code</p>
          </div>

          {/* Manual code entry toggle */}
          <button
            onClick={() => {
              setShowCodeEntry(true)
              scannerRef.current?.stop().catch(() => {})
              hapticLight()
            }}
            className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 active:text-white transition-colors mb-4"
          >
            <Keyboard className="h-4 w-4" />
            Enter 5-digit code manually
          </button>

          {/* Demo shortcuts */}
          {isDemoMode && (
            <div className="w-full max-w-sm mt-4">
              <p className="text-xs text-white/20 text-center mb-3 uppercase tracking-widest font-semibold">Demo Orders</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ORDERS.slice(0, 4).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      hapticLight()
                      router.push(`/dashboard/scanner/verify?token=${encodeURIComponent(order.qr_token)}`)
                    }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-3 text-left hover:border-white/15 active:bg-white/[0.06] transition-colors"
                  >
                    <p className="text-xs font-bold text-white/70 font-mono tracking-wider">#{order.redemption_code}</p>
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{order.restaurant_name}</p>
                    <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Manual Code Entry Mode */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Keyboard className="h-7 w-7 text-white/60" />
            </div>
            <h1 className="text-xl font-bold mb-1">Enter Code</h1>
            <p className="text-white/40 text-sm">Type the creator&apos;s 5-digit code</p>
          </div>

          {/* 5-digit code entry */}
          <div className="flex gap-3 mb-6">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 bg-white/[0.03] text-white outline-none transition-colors ${
                  digit ? 'border-white/30' : 'border-white/10'
                } focus:border-white/50`}
              />
            ))}
          </div>

          {/* Switch back to QR */}
          <button
            onClick={() => {
              setShowCodeEntry(false)
              setDigits(['', '', '', '', ''])
              // Restart camera when switching back to QR mode
              if (scannerRef.current && !cameraUnavailable) {
                import('html5-qrcode').then(({ Html5Qrcode }) => {
                  Html5Qrcode.getCameras().then((cameras) => {
                    if (!cameras.length) return
                    const cameraId = cameras.find((c) => /back|rear|environment/i.test(c.label))?.id ?? cameras[0].id
                    scannerRef.current?.start(
                      cameraId,
                      { fps: 10, qrbox: { width: 250, height: 250 } },
                      (decodedText: string) => {
                        if (scannedRef.current) return
                        scannedRef.current = true
                        let token = decodedText.trim()
                        try { const url = new URL(decodedText); const t = url.searchParams.get('token'); if (t) token = t } catch { /* raw token */ }
                        scannerRef.current?.stop().catch(() => {})
                        hapticSuccess()
                        router.push(`/dashboard/scanner/verify?token=${encodeURIComponent(token)}`)
                      },
                      () => {}
                    ).catch(() => {})
                  }).catch(() => {})
                })
              }
            }}
            className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 active:text-white transition-colors"
          >
            <QrCode className="h-4 w-4" />
            Scan QR code instead
          </button>
        </>
      )}
    </div>
  )
}
