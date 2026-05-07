import { describe, it, expect, beforeEach } from 'vitest'
import { useDraft } from '@/domains/propertyCreation/hooks/useDraft'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const minimalDraft: FormState = {
  managementType: 'WEG',
  name: 'Togostraße EG',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  buildings: [],
}

describe('useDraft', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('readDraft returns null when localStorage is empty', () => {
    const { readDraft } = useDraft()
    expect(readDraft()).toBeNull()
  })

  it('readDraft returns parsed FormState when draft exists', () => {
    localStorage.setItem('buena_property_draft', JSON.stringify(minimalDraft))
    const { readDraft } = useDraft()
    expect(readDraft()).toEqual(minimalDraft)
  })

  it('saveDraft writes serialized form to localStorage', () => {
    const { saveDraft } = useDraft()
    saveDraft(minimalDraft)
    expect(localStorage.getItem('buena_property_draft')).toBe(JSON.stringify(minimalDraft))
  })

  it('clearDraft removes the draft key from localStorage', () => {
    localStorage.setItem('buena_property_draft', JSON.stringify(minimalDraft))
    const { clearDraft } = useDraft()
    clearDraft()
    expect(localStorage.getItem('buena_property_draft')).toBeNull()
  })
})
