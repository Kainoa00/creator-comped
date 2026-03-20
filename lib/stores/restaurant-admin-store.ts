import { create } from 'zustand'
import type { Restaurant, MenuItem, Order } from '@/lib/types'

interface RestaurantAdminStoreState {
  restaurant: Restaurant | null
  menuItems: MenuItem[]
  orders: Order[]
  dateFilter: 'today' | 'week' | 'month' | 'all'
  setRestaurant: (r: Restaurant) => void
  setMenuItems: (items: MenuItem[]) => void
  setOrders: (orders: Order[]) => void
  setDateFilter: (f: 'today' | 'week' | 'month' | 'all') => void
}

export const useRestaurantAdminStore = create<RestaurantAdminStoreState>((set) => ({
  restaurant: null,
  menuItems: [],
  orders: [],
  dateFilter: 'month',
  setRestaurant: (r) => set({ restaurant: r }),
  setMenuItems: (items) => set({ menuItems: items }),
  setOrders: (orders) => set({ orders }),
  setDateFilter: (f) => set({ dateFilter: f }),
}))
