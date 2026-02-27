// ============================================================
// CreatorComped — Active Order / Redemption State Store
// Persists the generated redemption code and QR token so the
// redeem page can display them even after navigation.
// ============================================================
import { create } from 'zustand'

export interface ActiveRedemption {
  orderId: string
  restaurantName: string
  redemptionCode: string
  qrToken: string
  expiresAt: string
  items: Array<{ name: string; qty: number }>
}

interface OrderStore {
  activeRedemption: ActiveRedemption | null
  setActiveRedemption: (r: ActiveRedemption) => void
  clearRedemption: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  activeRedemption: null,
  setActiveRedemption: (r) => set({ activeRedemption: r }),
  clearRedemption: () => set({ activeRedemption: null }),
}))
