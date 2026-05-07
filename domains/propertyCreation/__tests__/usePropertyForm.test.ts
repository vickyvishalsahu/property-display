import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/domains/shared/hooks/useProperties', () => ({
  useProperties: () => ({ addProperty: vi.fn(), properties: [] }),
}))

describe('usePropertyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with null managementType and empty fields', () => {
      const { result } = renderHook(() => usePropertyForm())
      expect(result.current.form.managementType).toBeNull()
      expect(result.current.form.name).toBe('')
      expect(result.current.form.managerId).toBe('')
      expect(result.current.form.accountantId).toBe('')
    })

    it('starts with one building containing one unit', () => {
      const { result } = renderHook(() => usePropertyForm())
      expect(result.current.form.buildings).toHaveLength(1)
      expect(result.current.form.buildings[0].units).toHaveLength(1)
    })

    it('starts with no second address on the initial building', () => {
      const { result } = renderHook(() => usePropertyForm())
      expect(result.current.form.buildings[0].addresses[1]).toBeNull()
    })
  })

  describe('setManagementType', () => {
    it('sets WEG', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setManagementType('WEG') })
      expect(result.current.form.managementType).toBe('WEG')
    })

    it('sets MV', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setManagementType('MV') })
      expect(result.current.form.managementType).toBe('MV')
    })
  })

  describe('addBuilding / removeBuilding', () => {
    it('addBuilding appends a new building', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.addBuilding() })
      expect(result.current.form.buildings).toHaveLength(2)
    })

    it('removeBuilding removes the correct building', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.addBuilding() })
      const firstId = result.current.form.buildings[0].id
      act(() => { result.current.removeBuilding(firstId) })
      expect(result.current.form.buildings).toHaveLength(1)
      expect(result.current.form.buildings[0].id).not.toBe(firstId)
    })

    it('removeBuilding is a no-op when only one building remains', () => {
      const { result } = renderHook(() => usePropertyForm())
      const onlyId = result.current.form.buildings[0].id
      act(() => { result.current.removeBuilding(onlyId) })
      expect(result.current.form.buildings).toHaveLength(1)
    })
  })

  describe('toggleSecondAddress', () => {
    it('adds a second address when none exists', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.toggleSecondAddress(buildingId) })
      expect(result.current.form.buildings[0].addresses[1]).not.toBeNull()
    })

    it('removes the second address when toggled again', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.toggleSecondAddress(buildingId) })
      act(() => { result.current.toggleSecondAddress(buildingId) })
      expect(result.current.form.buildings[0].addresses[1]).toBeNull()
    })

    it('only affects the targeted building', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.addBuilding() })
      const firstId = result.current.form.buildings[0].id
      act(() => { result.current.toggleSecondAddress(firstId) })
      expect(result.current.form.buildings[1].addresses[1]).toBeNull()
    })
  })

  describe('updateAddress', () => {
    it('updates the specified field on the correct address', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.updateAddress(buildingId, 0, 'streetName', 'Togostraße') })
      expect(result.current.form.buildings[0].addresses[0].streetName).toBe('Togostraße')
    })

    it('does not affect other address fields', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.updateAddress(buildingId, 0, 'city', 'Berlin') })
      expect(result.current.form.buildings[0].addresses[0].streetName).toBe('')
    })
  })

  describe('addUnit / removeUnit', () => {
    it('addUnit appends a unit to the correct building', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.addUnit(buildingId) })
      expect(result.current.form.buildings[0].units).toHaveLength(2)
    })

    it('removeUnit removes the correct unit', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      act(() => { result.current.addUnit(buildingId) })
      const firstUnitId = result.current.form.buildings[0].units[0].id
      act(() => { result.current.removeUnit(buildingId, firstUnitId) })
      expect(result.current.form.buildings[0].units).toHaveLength(1)
      expect(result.current.form.buildings[0].units[0].id).not.toBe(firstUnitId)
    })
  })

  describe('updateUnit', () => {
    it('updates the specified field on the correct unit', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      const unitId = result.current.form.buildings[0].units[0].id
      act(() => { result.current.updateUnit(buildingId, unitId, 'number', '1A') })
      expect(result.current.form.buildings[0].units[0].number).toBe('1A')
    })

    it('does not affect other unit fields', () => {
      const { result } = renderHook(() => usePropertyForm())
      const buildingId = result.current.form.buildings[0].id
      const unitId = result.current.form.buildings[0].units[0].id
      act(() => { result.current.updateUnit(buildingId, unitId, 'floor', '2') })
      expect(result.current.form.buildings[0].units[0].number).toBe('')
    })
  })
})
