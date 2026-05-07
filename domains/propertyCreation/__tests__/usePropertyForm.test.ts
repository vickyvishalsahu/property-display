import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import type { DraftEntry } from '@/domains/propertyCreation/hooks/useDraft'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/domains/shared/hooks/useProperties', () => ({
  useProperties: () => ({ addProperty: vi.fn(), properties: [] }),
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
    const DRAFTS_KEY = 'buena_property_drafts'

    const makeDraftEntry = (id: string, name: string): DraftEntry => ({
      id,
      savedAt: Date.now(),
      form: { managementType: 'WEG', name, managerId: 'mgr-1', accountantId: 'acc-1', buildings: [] },
    })

    const seedDrafts = (entries: DraftEntry[]) => {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(entries))
    }

    const readDraftsFromStorage = (): DraftEntry[] => {
      const stored = localStorage.getItem(DRAFTS_KEY)
      return stored ? JSON.parse(stored) : []
    }

    it('pendingDrafts is [] on mount when localStorage is empty', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      expect(result.current.pendingDrafts).toEqual([])
    })

    it('pendingDrafts contains all stored drafts on mount', async () => {
      const entries = [makeDraftEntry('id-1', 'Draft A'), makeDraftEntry('id-2', 'Draft B')]
      seedDrafts(entries)
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      expect(result.current.pendingDrafts).toHaveLength(2)
    })

    it('does not save to localStorage before activateDraft is called', () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setName('Test') })
      expect(readDraftsFromStorage()).toHaveLength(0)
    })

    it('saves a new draft entry to localStorage when activateDraft is called', async () => {
      const { result } = renderHook(() => usePropertyForm())
      act(() => { result.current.setName('Test Property') })
      await act(async () => { result.current.activateDraft() })
      expect(readDraftsFromStorage()).toHaveLength(1)
      expect(readDraftsFromStorage()[0].form.name).toBe('Test Property')
    })

    it('saves updated form to the same draft entry on every change after activation', async () => {
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      act(() => { result.current.setName('Updated Name') })
      const drafts = readDraftsFromStorage()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].form.name).toBe('Updated Name')
    })

    it('restoreDraft(id) replaces form state with the matching draft', async () => {
      const entry = makeDraftEntry('id-1', 'Togostraße EG')
      seedDrafts([entry])
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      act(() => { result.current.restoreDraft('id-1') })
      expect(result.current.form.name).toBe('Togostraße EG')
      expect(result.current.form.managementType).toBe('WEG')
    })

    it('restoreDraft(id) removes the restored draft from pendingDrafts', async () => {
      const entries = [makeDraftEntry('id-1', 'Draft A'), makeDraftEntry('id-2', 'Draft B')]
      seedDrafts(entries)
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      act(() => { result.current.restoreDraft('id-1') })
      expect(result.current.pendingDrafts).toHaveLength(1)
      expect(result.current.pendingDrafts[0].id).toBe('id-2')
    })

    it('restoreDraft(id) continues saving to the same draft slot', async () => {
      const entry = makeDraftEntry('id-1', 'Original Name')
      seedDrafts([entry])
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      act(() => { result.current.restoreDraft('id-1') })
      act(() => { result.current.setName('Modified Name') })
      const drafts = readDraftsFromStorage()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].id).toBe('id-1')
      expect(drafts[0].form.name).toBe('Modified Name')
    })

    it('discardDraft(id) removes only the matching entry from localStorage', async () => {
      const entries = [makeDraftEntry('id-1', 'Draft A'), makeDraftEntry('id-2', 'Draft B')]
      seedDrafts(entries)
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => {})
      act(() => { result.current.discardDraft('id-1') })
      const drafts = readDraftsFromStorage()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].id).toBe('id-2')
      expect(result.current.pendingDrafts).toHaveLength(1)
    })

    it('submit clears only the current session draft from localStorage', async () => {
      const otherEntry = makeDraftEntry('other-id', 'Other Draft')
      seedDrafts([otherEntry])
      const { result } = renderHook(() => usePropertyForm())
      await act(async () => { result.current.activateDraft() })
      act(() => { result.current.setManagementType('MV') })
      act(() => { result.current.submit() })
      const remaining = readDraftsFromStorage()
      expect(remaining).toHaveLength(1)
      expect(remaining[0].id).toBe('other-id')
    })

    it('auto-restores draft and activates saving when initialDraftId matches', async () => {
      const entry = makeDraftEntry('id-auto', 'Auto Restored')
      seedDrafts([entry])
      const { result } = renderHook(() => usePropertyForm('id-auto'))
      await act(async () => {})
      expect(result.current.form.name).toBe('Auto Restored')
      act(() => { result.current.setName('Modified After Restore') })
      const drafts = readDraftsFromStorage()
      expect(drafts[0].id).toBe('id-auto')
      expect(drafts[0].form.name).toBe('Modified After Restore')
    })
  })
})
