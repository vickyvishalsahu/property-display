import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import type { Property } from '@/domains/shared/types/property'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockUpsertProperty = vi.fn()
const mockRemoveProperty = vi.fn()
let mockProperties: Property[] = []

vi.mock('@/domains/shared/hooks/useProperties', () => ({
  useProperties: () => ({
    upsertProperty: mockUpsertProperty,
    removeProperty: mockRemoveProperty,
    properties: mockProperties,
  }),
}))

describe('usePropertyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
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

  describe('draft behaviour', () => {
    beforeEach(() => {
      mockProperties = []
      mockUpsertProperty.mockClear()
      mockRemoveProperty.mockClear()
    })

    const makeDraftProperty = (id: string, name: string): Property => ({
      id,
      name,
      managerId: 'mgr-1',
      accountantId: 'acc-1',
      isDraft: true,
      managementType: 'WEG',
      buildings: [],
    })

    it('does not call upsertProperty before activateDraft is called', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setName('Test') })
      expect(mockUpsertProperty).not.toHaveBeenCalled()
    })

    it('activateDraft calls upsertProperty with isDraft: true', async () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setName('Test Property') })
      await act(async () => { result.current.activateDraft() })
      expect(mockUpsertProperty).toHaveBeenCalledWith(
        expect.objectContaining({ isDraft: true, name: 'Test Property' }),
      )
    })

    it('activateDraft is idempotent — calling twice does not create a second property', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      const callCountAfterFirst = mockUpsertProperty.mock.calls.length
      await act(async () => { result.current.activateDraft() })
      expect(mockUpsertProperty.mock.calls.length).toBe(callCountAfterFirst)
    })

    it('form changes after activation call upsertProperty with updated data', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      mockUpsertProperty.mockClear()
      act(() => { result.current.setName('Updated Name') })
      expect(mockUpsertProperty).toHaveBeenCalledWith(
        expect.objectContaining({ isDraft: true, name: 'Updated Name' }),
      )
    })

    it('all upsertProperty calls use the same property id', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      act(() => { result.current.setName('First') })
      act(() => { result.current.setName('Second') })
      const ids = mockUpsertProperty.mock.calls.map((call: [Property]) => call[0].id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(1)
    })

    it('submit calls upsertProperty with isDraft: false', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      act(() => { result.current.setManagementType('MV') })
      mockUpsertProperty.mockClear()
      act(() => { result.current.submit() })
      expect(mockUpsertProperty).toHaveBeenCalledWith(
        expect.objectContaining({ isDraft: false }),
      )
    })

    it('auto-restores form when initialDraftId matches a property in the list', async () => {
      mockProperties = [makeDraftProperty('id-auto', 'Auto Restored')]
      const { result } = renderHook(() => usePropertyForm('id-auto'))
      await act(async () => {})
      expect(result.current.form.name).toBe('Auto Restored')
      expect(result.current.form.managementType).toBe('WEG')
    })

    it('auto-restore activates saving to the same property id', async () => {
      mockProperties = [makeDraftProperty('id-auto', 'Auto Restored')]
      const { result } = renderHook(() => usePropertyForm('id-auto'))
      await act(async () => {})
      mockUpsertProperty.mockClear()
      act(() => { result.current.setName('Modified') })
      expect(mockUpsertProperty).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'id-auto', name: 'Modified' }),
      )
    })
  })
})
