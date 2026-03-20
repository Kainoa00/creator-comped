import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Capture 100% of errors in production
  sampleRate: 1.0,

  // Strip sensitive data from breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Don't log auth-related fetch URLs
    if (breadcrumb.category === 'fetch' && breadcrumb.data?.url?.includes('/auth/')) {
      return null
    }
    return breadcrumb
  },
})
