import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    // Silence "multiple lockfiles" warning from workspace root detection
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // demo avatar URLs
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // Old creator routes → new influencer routes
      { source: '/creator', destination: '/discover', permanent: true },
      { source: '/creator/discover', destination: '/discover', permanent: true },
      { source: '/creator/discover/:id', destination: '/discover/:id', permanent: true },
      { source: '/creator/cart', destination: '/cart', permanent: true },
      { source: '/creator/redeem', destination: '/redeem', permanent: true },
      { source: '/creator/proof', destination: '/proof', permanent: true },
      { source: '/creator/profile', destination: '/profile', permanent: true },
      // Old restaurant-admin routes → new business dashboard routes
      { source: '/restaurant-admin', destination: '/dashboard', permanent: true },
      { source: '/restaurant-admin/login', destination: '/login', permanent: true },
      { source: '/restaurant-admin/comps', destination: '/dashboard/comps', permanent: true },
      { source: '/restaurant-admin/spend', destination: '/dashboard/spend', permanent: true },
      { source: '/restaurant-admin/analytics', destination: '/dashboard/analytics', permanent: true },
      { source: '/restaurant-admin/menu', destination: '/dashboard/menu', permanent: true },
      { source: '/restaurant-admin/deliverables', destination: '/dashboard/deliverables', permanent: true },
      { source: '/restaurant-admin/settings', destination: '/dashboard/settings', permanent: true },
      { source: '/restaurant-admin/support', destination: '/dashboard/support', permanent: true },
      { source: '/restaurant-admin/profile', destination: '/dashboard/settings', permanent: true },
      { source: '/restaurant-admin/more', destination: '/dashboard', permanent: true },
      // Old restaurant staff routes → new scanner
      { source: '/restaurant', destination: '/dashboard/scanner', permanent: true },
      // Old internal-admin → new admin
      { source: '/internal-admin/login', destination: '/login', permanent: true },
      { source: '/internal-admin', destination: '/admin', permanent: true },
      { source: '/internal-admin/submissions', destination: '/admin/submissions', permanent: true },
      { source: '/internal-admin/support', destination: '/admin/support', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(self)',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Only apply HSTS in production — prevents browser refusing HTTP on localhost
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://api.dicebear.com https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
