import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = 'https://creatorcomped.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
