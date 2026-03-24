'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, roleRedirectPath } from '@/lib/auth'

export default function MobileRootPage() {
  const router = useRouter()

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
