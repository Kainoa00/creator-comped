'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ScannerPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    // Prevent double-mount in React strict mode
    if (mountedRef.current) return
    mountedRef.current = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scanner: any = null

    const initScanner = async () => {
      const { Html5QrcodeScanner } = await import('html5-qrcode')

      const onScanSuccess = (decodedText: string) => {
        // Extract token from the QR value — support raw token or full URL
        let token = decodedText.trim()
        try {
          const url = new URL(decodedText)
          const t = url.searchParams.get('token')
          if (t) token = t
        } catch {
          // not a URL — use raw text as token
        }
        router.push(`/dashboard/scanner/verify?token=${encodeURIComponent(token)}`)
      }

      const onScanFailure = (_error: unknown) => {
        // Silently ignore — fires constantly when no QR is in frame
      }

      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false // verbose
      )
      scanner.render(onScanSuccess, onScanFailure)
      scannerRef.current = scanner
    }

    initScanner()

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {})
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-xl font-bold mb-2">Scan QR Code</h1>
      <p className="text-white/40 text-sm mb-6">Point camera at creator&apos;s QR code</p>

      {/* QR reader container — html5-qrcode mounts into this div */}
      <div
        id="qr-reader"
        className="w-full max-w-sm mb-6"
        suppressHydrationWarning
      />

      <button
        onClick={() => router.push('/dashboard/scanner/verify?code=manual')}
        className="text-white/50 text-sm hover:text-white/80 transition-colors mb-4"
      >
        Enter 5-digit code manually
      </button>

      <button
        onClick={() => router.push('/dashboard/scanner/verify')}
        className="text-white/30 text-xs hover:text-white/60 transition-colors"
      >
        Demo
      </button>
    </div>
  )
}
