import type { MetadataRoute } from 'next'

const BASE_URL = 'https://creatorcomped.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/internal-admin/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
