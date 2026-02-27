'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_ORDERS } from '@/lib/demo-data'
import { FullPageSpinner } from '@/components/ui/spinner'

/**
 * Creator portal entry point.
 * If there is an active confirmed order → lock creator into /creator/proof.
 * Otherwise → send to the discovery map.
 */
export default function CreatorPage() {
  const router = useRouter()

  useEffect(() => {
    // Check for any order in 'confirmed' status for the active creator
    const hasConfirmedOrder = DEMO_ORDERS.some(
      (o) => o.creator_id === 'creator-001' && o.status === 'confirmed'
    )

    if (hasConfirmedOrder) {
      router.replace('/creator/proof')
    } else {
      router.replace('/creator/discover')
    }
  }, [router])

  return <FullPageSpinner />
}
