'use client'

import { useState, useEffect } from 'react'
import type { Property } from '@/domains/shared/types/property'

const STORAGE_KEY = 'buena_properties'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setProperties(JSON.parse(stored))
  }, [])

  const persist = (updated: Property[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  }

  const upsertProperty = (property: Property) => {
    setProperties((previous) => {
      const exists = previous.some((existingProperty) => existingProperty.id === property.id)
      const updated = exists
        ? previous.map((existingProperty) =>
            existingProperty.id === property.id ? property : existingProperty
          )
        : [property, ...previous]
      return persist(updated)
    })
  }

  const removeProperty = (id: string) => {
    setProperties((previous) => persist(previous.filter((property) => property.id !== id)))
  }

  return { properties, upsertProperty, removeProperty }
}
