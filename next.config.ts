import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
        hostname: 'api.dicebear.com',  // demo avatar URLs
      },
    ],
  },
}

export default nextConfig
