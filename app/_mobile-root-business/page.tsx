'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, roleRedirectPath } from '@/lib/auth'

/**
 * Mobile root page for HIVE Business.
 * Redirects to /dashboard (business portal) or /login.
 */
export default function MobileBusinessRootPage() {
  const router = useRouter()

  // Notify Capgo that the app bundle loaded successfully (enables OTA rollback safety)
  useEffect(() => {
    import('@capgo/capacitor-updater').then(({ CapacitorUpdater }) => {
      CapacitorUpdater.notifyAppReady()
    }).catch(() => {}) // safe no-op on web
  }, [])

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        // Business users go to dashboard, others go to their portal
        router.replace(roleRedirectPath(session.role))
      } else {
        router.replace('/login')
      }
    })
  }, [router])

  return null
}
