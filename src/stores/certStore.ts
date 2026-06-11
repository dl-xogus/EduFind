import { create } from 'zustand'
import axios from 'axios'
import { Cert } from '@/types/Main'

interface CertStore {
  certs: Cert[]
  fetched: boolean
  loading: boolean
  fetchCerts: () => Promise<void>
}

export const useCertStore = create<CertStore>((set, get) => ({
  certs: [],
  fetched: false,
  loading: false,

  fetchCerts: async () => {
    if (get().fetched) return
    set({ loading: true })
    const { data } = await axios.get('/api/certs')
    set({ certs: data.certs ?? [], fetched: true, loading: false })
  },
}))
