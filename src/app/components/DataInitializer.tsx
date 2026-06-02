'use client'

import { useEffect } from 'react'
import { useAcademyStore } from '@/app/stores/academyStore'
import { useCertStore } from '@/app/stores/certStore'

export default function DataInitializer() {
  const fetchAcademies = useAcademyStore(s => s.fetchAcademies)
  const fetchCerts = useCertStore(s => s.fetchCerts)

  useEffect(() => {
    fetchAcademies()
    fetchCerts()
  }, [])

  return null
}
