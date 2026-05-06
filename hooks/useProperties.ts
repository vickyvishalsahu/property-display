'use client'

import { useState, useEffect } from 'react'
import type { Property } from '@/types/property'

const STORAGE_KEY = 'buena_properties'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setProperties(JSON.parse(stored))
    }
  }, [])

  const addProperty = (property: Property) => {
    setProperties((previousProperties) => {
      const updated = [property, ...previousProperties]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return { properties, addProperty }
}
