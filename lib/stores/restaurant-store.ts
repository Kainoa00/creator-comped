import { create } from 'zustand'
import type { Restaurant, RestaurantUser } from '@/lib/types'

interface RestaurantStoreState {
  restaurant: Restaurant | null
  restaurantUser: RestaurantUser | null
  managerUnlocked: boolean
  setRestaurant: (r: Restaurant) => void
  setRestaurantUser: (u: RestaurantUser | null) => void
  setManagerUnlocked: (v: boolean) => void
  lockManager: () => void
}

export const useRestaurantStore = create<RestaurantStoreState>((set) => ({
  restaurant: null,
  restaurantUser: null,
  managerUnlocked: false,
  setRestaurant: (r) => set({ restaurant: r }),
  setRestaurantUser: (u) => set({ restaurantUser: u }),
  setManagerUnlocked: (v) => set({ managerUnlocked: v }),
  lockManager: () => set({ managerUnlocked: false }),
}))
