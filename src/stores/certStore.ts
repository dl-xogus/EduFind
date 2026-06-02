import { create } from 'zustand'
import axios from 'axios'
import { Cert } from '@/types/Main'

interface CertStore {
  certs: Cert[]
  fetched: boolean
  fetchCerts: () => Promise<void>
}

export const useCertStore = create<CertStore>((set, get) => ({
  certs: [],
  fetched: false,

  fetchCerts: async () => {
    if (get().fetched) return
    const { data } = await axios.get('/api/certs')
    set({ certs: data.certs ?? [], fetched: true })
  },
}))
