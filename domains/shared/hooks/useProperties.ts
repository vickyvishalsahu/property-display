'use client'

import { useState, useEffect } from 'react'
import type { Property } from '@/domains/shared/types/property'
import { MOCK_PROPERTIES } from '@/domains/shared/mock/properties'

const STORAGE_KEY = 'buena_properties'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const storedProperties: Property[] = JSON.parse(stored)
      const storedIds = new Set(storedProperties.map((property) => property.id))
      const mockDemoIds = new Set(MOCK_PROPERTIES.filter((property) => property.isDemo).map((property) => property.id))
      const mergedStored = storedProperties.map((property) =>
        mockDemoIds.has(property.id) ? { ...property, isDemo: true } : property
      )
      setProperties([...MOCK_PROPERTIES.filter((property) => !storedIds.has(property.id)), ...mergedStored])
    }
    setIsLoaded(true)
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

  return { properties, upsertProperty, removeProperty, isLoaded }
}
