import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import { MOCK_PROPERTIES } from '@/domains/shared/mock/properties'
import type { Property } from '@/domains/shared/types/property'

const makeProperty = (id: string, isDraft = false): Property => ({
  id,
  name: `Property ${id}`,
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  isDraft,
  managementType: 'MV',
  buildings: [],
})

const STORAGE_KEY = 'property_manager_properties'

describe('useProperties', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('includes mock properties when localStorage is empty', async () => {
    const { result } = renderHook(() => useProperties())
    await act(async () => {})
    const ids = result.current.properties.map((property) => property.id)
    MOCK_PROPERTIES.forEach((mockProperty) => {
      expect(ids).toContain(mockProperty.id)
    })
  })

  it('merges localStorage properties with mocks on mount', async () => {
    const stored = [makeProperty('prop-user-1')]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    const { result } = renderHook(() => useProperties())
    await act(async () => {})
    const ids = result.current.properties.map((property) => property.id)
    expect(ids).toContain('prop-user-1')
    MOCK_PROPERTIES.forEach((mockProperty) => {
      expect(ids).toContain(mockProperty.id)
    })
  })

  it('isLoaded is true after mount', async () => {
    const { result } = renderHook(() => useProperties())
    await act(async () => {})
    expect(result.current.isLoaded).toBe(true)
  })

  describe('upsertProperty', () => {
    it('inserts when id is new', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-new')) })
      const ids = result.current.properties.map((property) => property.id)
      expect(ids).toContain('prop-new')
    })

    it('updates existing entry when id matches', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1', true)) })
      act(() => { result.current.upsertProperty({ ...makeProperty('prop-1'), isDraft: false, name: 'Updated' }) })
      const match = result.current.properties.find((property) => property.id === 'prop-1')
      expect(match?.name).toBe('Updated')
      expect(match?.isDraft).toBe(false)
    })

    it('persists upserted property to localStorage', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      const stored: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored.some((property) => property.id === 'prop-1')).toBe(true)
    })
  })

  describe('removeProperty', () => {
    it('removes the matching entry', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      act(() => { result.current.upsertProperty(makeProperty('prop-2')) })
      act(() => { result.current.removeProperty('prop-1') })
      const ids = result.current.properties.map((property) => property.id)
      expect(ids).not.toContain('prop-1')
      expect(ids).toContain('prop-2')
    })

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      act(() => { result.current.removeProperty('prop-1') })
      const stored: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored.some((property) => property.id === 'prop-1')).toBe(false)
    })
  })
})
