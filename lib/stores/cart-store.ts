// ============================================================
// CreatorComped — Cart Zustand Store
// Persists cart data so items survive app restarts.
// ============================================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ssrSafeStorage } from '@/lib/storage'
import type { CartItem, MenuItem, Restaurant, DeliverableRequirement } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  restaurant: Restaurant | null
  deliverableReq: DeliverableRequirement | null
  addItem: (item: MenuItem) => void
  removeItem: (menuItemId: string) => void
  updateQty: (menuItemId: string, qty: number) => void
  clearCart: () => void
  setRestaurant: (r: Restaurant, req: DeliverableRequirement | null) => void
  totalItems: () => number
  totalUniqueItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      deliverableReq: null,

      addItem: (item: MenuItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.menu_item.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menu_item.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { menu_item: item, qty: 1 }] }
        }),

      removeItem: (menuItemId: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.menu_item.id !== menuItemId),
        })),

      updateQty: (menuItemId: string, qty: number) =>
        set((state) => ({
          items:
            qty === 0
              ? state.items.filter((i) => i.menu_item.id !== menuItemId)
              : state.items.map((i) =>
                  i.menu_item.id === menuItemId ? { ...i, qty } : i
                ),
        })),

      clearCart: () => set({ items: [], restaurant: null, deliverableReq: null }),

      setRestaurant: (r: Restaurant, req: DeliverableRequirement | null) =>
        set({ restaurant: r, deliverableReq: req }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalUniqueItems: () => get().items.length,
    }),
    {
      name: 'hive-cart',
      storage: createJSONStorage(() => ssrSafeStorage()),
    }
  )
)
