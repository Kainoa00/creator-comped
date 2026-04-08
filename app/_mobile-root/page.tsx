'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, roleRedirectPath } from '@/lib/auth'

export default function MobileRootPage() {
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
        router.replace(roleRedirectPath(session.role))
      } else {
        router.replace('/login')
      }
    })
  }, [router])

  return null
}
