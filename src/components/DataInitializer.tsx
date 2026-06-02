'use client'

import { useEffect } from 'react'
import { useAcademyStore } from '@/stores/academyStore'
import { useCertStore } from '@/stores/certStore'

export default function DataInitializer() {
  const fetchAcademies = useAcademyStore(s => s.fetchAcademies)
  const fetchCerts = useCertStore(s => s.fetchCerts)

  useEffect(() => {
    fetchAcademies()
    fetchCerts()
  }, [])

  return null
}
