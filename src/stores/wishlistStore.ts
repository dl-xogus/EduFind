import { create } from 'zustand'
import axios from 'axios'

interface WishItem {
  itemId: number
  itemType: 'academy' | 'cert'
}

interface WishlistStore {
  items: WishItem[]
  fetchWishlist: (email: string) => Promise<void>
  toggle: (email: string, itemId: number, itemType: 'academy' | 'cert') => Promise<void>
  isWished: (itemId: number, itemType: 'academy' | 'cert') => boolean
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  fetchWishlist: async (email) => {
    const { data } = await axios.get(`/api/wishlist?email=${encodeURIComponent(email)}`)
    set({ items: data.items.map((i: any) => ({ itemId: i.itemId, itemType: i.itemType })) })
  },

  toggle: async (email, itemId, itemType) => {
    const { data } = await axios.post('/api/wishlist', { email, itemId, itemType })
    if (data.wished) {
      set(s => ({ items: [...s.items, { itemId, itemType }] }))
    } else {
      set(s => ({ items: s.items.filter(i => !(i.itemId === itemId && i.itemType === itemType)) }))
    }
  },

  isWished: (itemId, itemType) =>
    get().items.some(i => i.itemId === itemId && i.itemType === itemType),
}))
