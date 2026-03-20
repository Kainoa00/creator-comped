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

const BASE_URL = 'https://creatorcomped.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CreatorComped — Get Comped. Create Content. Win Rewards.',
    template: '%s | CreatorComped',
  },
  description:
    'Creator Comped connects food creators with local restaurants. Redeem complimentary meals, create authentic content, and compete for monthly prizes.',
  keywords: [
    'creator comped',
    'food creator',
    'restaurant comps',
    'content creator food',
    'comped meals',
    'Utah restaurant',
    'instagram food creator',
    'tiktok food',
    'restaurant marketing',
  ],
  authors: [{ name: 'Liaison Technologies' }],
  creator: 'Liaison Technologies',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'CreatorComped',
    title: 'CreatorComped — Get Comped. Create Content. Win Rewards.',
    description:
      'Connects food creators with local restaurants. Redeem complimentary meals, create authentic content, and win monthly prizes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CreatorComped — Food creator platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorComped — Get Comped. Create Content. Win Rewards.',
    description: 'Connects food creators with local restaurants for authentic content and comped meals.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Liaison Technologies',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'CreatorComped',
      operatingSystem: 'iOS, Android',
      applicationCategory: 'FoodAndDrinkApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Creator Comped connects food content creators with local restaurants for complimentary meals in exchange for authentic social media content.',
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-dvh font-[family-name:var(--font-manrope)]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
