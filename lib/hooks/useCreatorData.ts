'use client'

import { useState, useEffect } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { DEMO_ACTIVE_CREATOR, getOrdersForCreator } from '@/lib/demo-data'
import type { Creator, Order } from '@/lib/types'

export interface UseCreatorDataResult {
  creator: Creator | null
  orders: Order[]
  loading: boolean
  error: string | null
}

/**
 * Fetches the current influencer's creator profile and orders.
 * Falls back to demo data when isDemoMode is true or no session exists.
 * On Supabase errors, silently falls back to demo data.
 */
export function useCreatorData(): UseCreatorDataResult {
  const [creator, setCreator] = useState<Creator | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      // Demo mode or no Supabase client → use demo data immediately
      if (isDemoMode || !supabase) {
        if (!cancelled) {
          setCreator(DEMO_ACTIVE_CREATOR)
          setOrders(getOrdersForCreator('creator-001'))
          setLoading(false)
        }
        return
      }

      try {
        const session = await getSession()

        if (!session || !session.creatorId) {
          // No session → fall back to demo data
          if (!cancelled) {
            setCreator(DEMO_ACTIVE_CREATOR)
            setOrders(getOrdersForCreator('creator-001'))
            setLoading(false)
          }
          return
        }

        // Fetch creator profile
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('id', session.creatorId)
          .single()

        if (creatorError || !creatorData) {
          throw new Error(creatorError?.message ?? 'Creator not found')
        }

        // Fetch orders with items (items stored as JSONB in DB)
        const { data: ordersRaw, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            restaurant:restaurants(name, id),
            deliverable_requirement:deliverable_requirements(*)
          `)
          .eq('creator_id', session.creatorId)
          .order('created_at', { ascending: false })

        if (ordersError) {
          throw new Error(ordersError.message)
        }

        // Normalise orders: flatten restaurant_name from join
        const normalisedOrders: Order[] = ((ordersRaw ?? []) as any[]).map((o) => ({
          id: o.id,
          creator_id: o.creator_id,
          restaurant_id: o.restaurant_id,
          restaurant_name: o.restaurant?.name ?? '',
          items: Array.isArray(o.items) ? o.items : [],
          status: o.status,
          redemption_code: o.redemption_code,
          qr_token: o.qr_token,
          expires_at: o.expires_at,
          created_at: o.created_at,
          confirmed_at: o.confirmed_at ?? null,
          rejection_reason: o.rejection_reason ?? null,
          deliverable_requirement: o.deliverable_requirement ?? null,
        }))

        if (!cancelled) {
          setCreator(creatorData as Creator)
          setOrders(normalisedOrders)
          setLoading(false)
        }
      } catch (err) {
        // Supabase error → silently fall back to demo data
        if (!cancelled) {
          setCreator(DEMO_ACTIVE_CREATOR)
          setOrders(getOrdersForCreator('creator-001'))
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { creator, orders, loading, error }
}
