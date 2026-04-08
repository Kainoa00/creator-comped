'use client'

import { useState, useEffect } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { DEMO_ORDERS } from '@/lib/demo-data'
import type { Order } from '@/lib/types'

/** Live order subscription for the scanner page */
export function useRealtimeOrders(restaurantId?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    if (isDemoMode || !restaurantId) {
      const filtered = restaurantId
        ? DEMO_ORDERS.filter((o) => o.restaurant_id === restaurantId)
        : DEMO_ORDERS
      setOrders(filtered)
      setLoading(false)
      return
    }

    if (!supabase) {
      setError('Database not configured')
      setLoading(false)
      return
    }

    // Initial fetch
    supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setOrders((data ?? []) as Order[])
        setLoading(false)
      })

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`orders:restaurant:${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev].slice(0, 100))
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o))
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnected(true)
        if (status === 'CHANNEL_ERROR' || status === 'CLOSED') setConnected(false)
      })

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [restaurantId])

  return { orders, loading, error, connected }
}
