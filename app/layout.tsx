import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CreatorComped',
    template: '%s | CreatorComped',
  },
  description: 'Get comped. Create content. Win prizes. The invite-only creator network for local restaurants.',
  keywords: ['creator', 'food', 'restaurant', 'comped', 'Utah', 'content creator', 'instagram', 'tiktok'],
  openGraph: {
    title: 'CreatorComped',
    description: 'Get comped. Create content. Win prizes.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body suppressHydrationWarning className="bg-white text-cc-text antialiased min-h-dvh font-[family-name:var(--font-manrope)]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
