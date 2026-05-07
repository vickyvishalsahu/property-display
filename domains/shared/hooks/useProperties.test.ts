import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProperties } from '@/domains/shared/hooks/useProperties'
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

const STORAGE_KEY = 'buena_properties'

describe('useProperties', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty list when localStorage is empty', () => {
    const { result } = renderHook(() => useProperties())
    expect(result.current.properties).toEqual([])
  })

  it('loads properties from localStorage on mount', async () => {
    const stored = [makeProperty('prop-1')]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    const { result } = renderHook(() => useProperties())
    await act(async () => {})
    expect(result.current.properties).toEqual(stored)
  })

  describe('upsertProperty', () => {
    it('inserts when id is new', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-new')) })
      expect(result.current.properties).toHaveLength(1)
      expect(result.current.properties[0].id).toBe('prop-new')
    })

    it('updates existing entry when id matches', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1', true)) })
      act(() => { result.current.upsertProperty({ ...makeProperty('prop-1'), isDraft: false, name: 'Updated' }) })
      expect(result.current.properties).toHaveLength(1)
      expect(result.current.properties[0].name).toBe('Updated')
      expect(result.current.properties[0].isDraft).toBe(false)
    })

    it('persists to localStorage', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored).toHaveLength(1)
    })
  })

  describe('removeProperty', () => {
    it('removes the matching entry', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      act(() => { result.current.upsertProperty(makeProperty('prop-2')) })
      act(() => { result.current.removeProperty('prop-1') })
      expect(result.current.properties).toHaveLength(1)
      expect(result.current.properties[0].id).toBe('prop-2')
    })

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useProperties())
      act(() => { result.current.upsertProperty(makeProperty('prop-1')) })
      act(() => { result.current.removeProperty('prop-1') })
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored).toHaveLength(0)
    })
  })
})
