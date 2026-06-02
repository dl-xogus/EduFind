import { create } from 'zustand'
import axios from 'axios'
import { Academy } from '@/app/types/Main'

interface AcademyStore {
  academies: Academy[]
  fetched: boolean
  fetchAcademies: () => Promise<void>
}

export const useAcademyStore = create<AcademyStore>((set, get) => ({
  academies: [],
  fetched: false,

  fetchAcademies: async () => {
    if (get().fetched) return
    const { data } = await axios.get('/api/academies')
    set({ academies: data.academies ?? [], fetched: true })
  },
}))
