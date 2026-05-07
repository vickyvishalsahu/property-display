import { describe, it, expect, beforeEach } from 'vitest'
import { useDraft } from '@/domains/propertyCreation/hooks/useDraft'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const minimalForm: FormState = {
  managementType: 'WEG',
  name: 'Togostraße EG',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  buildings: [],
}

const DRAFTS_KEY = 'buena_property_drafts'

describe('useDraft', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('readDrafts', () => {
    it('returns [] when localStorage is empty', () => {
      const { readDrafts } = useDraft()
      expect(readDrafts()).toEqual([])
    })

    it('returns parsed array when drafts exist', () => {
      const entries = [{ id: 'abc', savedAt: 1000, form: minimalForm }]
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(entries))
      const { readDrafts } = useDraft()
      expect(readDrafts()).toEqual(entries)
    })
  })

  describe('saveDraft', () => {
    it('appends a new entry when id is new', () => {
      const { saveDraft, readDrafts } = useDraft()
      saveDraft('id-1', minimalForm)
      const drafts = readDrafts()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].id).toBe('id-1')
      expect(drafts[0].form).toEqual(minimalForm)
    })

    it('upserts existing entry when id matches', () => {
      const { saveDraft, readDrafts } = useDraft()
      saveDraft('id-1', minimalForm)
      const updated = { ...minimalForm, name: 'Updated Name' }
      saveDraft('id-1', updated)
      const drafts = readDrafts()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].form.name).toBe('Updated Name')
    })

    it('updates savedAt on every save', () => {
      const { saveDraft, readDrafts } = useDraft()
      saveDraft('id-1', minimalForm)
      const first = readDrafts()[0].savedAt
      saveDraft('id-1', minimalForm)
      const second = readDrafts()[0].savedAt
      expect(second).toBeGreaterThanOrEqual(first)
    })
  })

  describe('clearDraft', () => {
    it('removes only the matching entry', () => {
      const { saveDraft, clearDraft, readDrafts } = useDraft()
      saveDraft('id-1', minimalForm)
      saveDraft('id-2', minimalForm)
      clearDraft('id-1')
      const drafts = readDrafts()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].id).toBe('id-2')
    })
  })

  describe('clearAllDrafts', () => {
    it('empties the array', () => {
      const { saveDraft, clearAllDrafts, readDrafts } = useDraft()
      saveDraft('id-1', minimalForm)
      saveDraft('id-2', minimalForm)
      clearAllDrafts()
      expect(readDrafts()).toEqual([])
    })
  })
})
