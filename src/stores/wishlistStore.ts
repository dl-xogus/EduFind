import { create } from 'zustand'
import axios from 'axios'

interface WishItem {
  itemId: number
  itemType: 'academy' | 'cert'
}

interface WishlistStore {
  items: WishItem[]
  fetchWishlist: () => Promise<void>
  toggle: (itemId: number, itemType: 'academy' | 'cert') => Promise<void>
  isWished: (itemId: number, itemType: 'academy' | 'cert') => boolean
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  fetchWishlist: async () => {
    const { data } = await axios.get('/api/wishlist')
    set({ items: data.items.map((i: any) => ({ itemId: i.itemId, itemType: i.itemType })) })
  },

  toggle: async (itemId, itemType) => {
    const { data } = await axios.post('/api/wishlist', { itemId, itemType })
    if (data.wished) {
      set(s => ({ items: [...s.items, { itemId, itemType }] }))
    } else {
      set(s => ({ items: s.items.filter(i => !(i.itemId === itemId && i.itemType === itemType)) }))
    }
  },

  isWished: (itemId, itemType) =>
    get().items.some(i => i.itemId === itemId && i.itemType === itemType),
}))
