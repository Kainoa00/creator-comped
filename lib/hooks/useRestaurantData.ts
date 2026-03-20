'use client'

import { useState, useEffect } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import {
  DEMO_RESTAURANTS,
  DEMO_MENU_ITEMS,
  DEMO_ORDERS,
  DEMO_PROOF_SUBMISSIONS,
} from '@/lib/demo-data'
import type { Restaurant, MenuItem, Order, ProofSubmission } from '@/lib/types'

// ── useRestaurant ─────────────────────────────────────────────
export function useRestaurant(restaurantId?: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      const r = restaurantId
        ? DEMO_RESTAURANTS.find((r) => r.id === restaurantId) ?? DEMO_RESTAURANTS[0]
        : DEMO_RESTAURANTS[0]
      setRestaurant(r)
      setLoading(false)
      return
    }

    const id = restaurantId ?? ''
    if (!id) { setLoading(false); return }

    supabase!
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setRestaurant(data as Restaurant | null)
        setLoading(false)
      })
  }, [restaurantId])

  return { restaurant, loading, error }
}

// ── useMenuItems ──────────────────────────────────────────────
export function useMenuItems(restaurantId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      const items = restaurantId
        ? DEMO_MENU_ITEMS.filter((m) => m.restaurant_id === restaurantId)
        : DEMO_MENU_ITEMS.filter((m) => m.restaurant_id === 'restaurant-001')
      setMenuItems(items)
      setLoading(false)
      return
    }

    const id = restaurantId ?? ''
    if (!id) { setLoading(false); return }

    supabase!
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', id)
      .order('created_at')
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setMenuItems((data ?? []) as MenuItem[])
        setLoading(false)
      })
  }, [restaurantId])

  return { menuItems, setMenuItems, loading, error }
}

// ── useOrders ─────────────────────────────────────────────────
export function useOrders(restaurantId?: string, statusFilter?: string[]) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      let filtered = restaurantId
        ? DEMO_ORDERS.filter((o) => o.restaurant_id === restaurantId)
        : DEMO_ORDERS
      if (statusFilter?.length) {
        filtered = filtered.filter((o) => statusFilter.includes(o.status))
      }
      setOrders(filtered)
      setLoading(false)
      return
    }

    const id = restaurantId ?? ''
    if (!id) { setLoading(false); return }

    let query = supabase!.from('orders').select('*').eq('restaurant_id', id)
    if (statusFilter?.length) {
      query = query.in('status', statusFilter)
    }

    query.order('created_at', { ascending: false }).then(({ data, error: err }) => {
      if (err) setError(err.message)
      else setOrders((data ?? []) as Order[])
      setLoading(false)
    })
  }, [restaurantId, statusFilter?.join(',')])

  return { orders, setOrders, loading, error }
}

// ── useProofSubmissions ───────────────────────────────────────
export function useProofSubmissions(restaurantId?: string) {
  const [proofs, setProofs] = useState<ProofSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      setProofs(DEMO_PROOF_SUBMISSIONS)
      setLoading(false)
      return
    }

    const id = restaurantId ?? ''
    if (!id) { setLoading(false); return }

    supabase!
      .from('proof_submissions')
      .select('*, orders!inner(restaurant_id)')
      .eq('orders.restaurant_id', id)
      .order('submitted_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setProofs((data ?? []) as ProofSubmission[])
        setLoading(false)
      })
  }, [restaurantId])

  return { proofs, loading, error }
}
