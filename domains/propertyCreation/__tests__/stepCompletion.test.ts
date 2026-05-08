import { describe, it, expect } from 'vitest'
import { getPropertyStepState, getBuildingsStepState, getStepStates } from '@/domains/propertyCreation/utils/stepCompletion'
import type { FormState } from '@/domains/propertyCreation/types/form'

const emptyForm: FormState = {
  managementType: null,
  name: '',
  managerId: '',
  accountantId: '',
  buildings: [],
}

const completeAddress = { streetName: 'Togostraße', streetNumber: '10', postalCode: '13351', city: 'Berlin' }
const partialAddress = { streetName: 'Togostraße', streetNumber: '', postalCode: '', city: '' }

describe('getPropertyStepState', () => {
  it('returns empty when all fields are blank', () => {
    expect(getPropertyStepState(emptyForm)).toBe('empty')
  })

  it('returns partial when only name is filled', () => {
    expect(getPropertyStepState({ ...emptyForm, name: 'Test Property' })).toBe('partial')
  })

  it('returns partial when only managerId is filled', () => {
    expect(getPropertyStepState({ ...emptyForm, managerId: 'mgr-1' })).toBe('partial')
  })

  it('returns partial when two of three fields are filled', () => {
    expect(getPropertyStepState({ ...emptyForm, name: 'Test', managerId: 'mgr-1' })).toBe('partial')
  })

  it('returns complete when name, managerId, and accountantId are all filled', () => {
    expect(getPropertyStepState({ ...emptyForm, name: 'Test', managerId: 'mgr-1', accountantId: 'acc-1' })).toBe('complete')
  })

  it('trims name before checking', () => {
    expect(getPropertyStepState({ ...emptyForm, name: '   ' })).toBe('empty')
  })
})

describe('getStepStates', () => {
  it('returns a three-element array of step states derived from form', () => {
    const states = getStepStates(emptyForm)
    expect(states).toHaveLength(3)
    expect(states[0]).toBe('empty')
    expect(states[1]).toBe('empty')
    expect(states[2]).toBe('empty')
  })

  it('reflects property step completion in the first element', () => {
    const states = getStepStates({ ...emptyForm, name: 'Test', managerId: 'mgr-1', accountantId: 'acc-1' })
    expect(states[0]).toBe('complete')
  })

  it('always returns empty for the review step', () => {
    const states = getStepStates({ ...emptyForm, name: 'Test', managerId: 'mgr-1', accountantId: 'acc-1' })
    expect(states[2]).toBe('empty')
  })
})

describe('getBuildingsStepState', () => {
  it('returns empty when there are no buildings', () => {
    expect(getBuildingsStepState(emptyForm)).toBe('empty')
  })

  it('returns partial when a building has an incomplete primary address', () => {
    const form: FormState = {
      ...emptyForm,
      buildings: [{ id: 'b-1', addresses: [partialAddress, null], units: [] }],
    }
    expect(getBuildingsStepState(form)).toBe('partial')
  })

  it('returns complete when all buildings have complete primary addresses', () => {
    const form: FormState = {
      ...emptyForm,
      buildings: [{ id: 'b-1', addresses: [completeAddress, null], units: [] }],
    }
    expect(getBuildingsStepState(form)).toBe('complete')
  })

  it('returns partial when at least one building has an incomplete address', () => {
    const form: FormState = {
      ...emptyForm,
      buildings: [
        { id: 'b-1', addresses: [completeAddress, null], units: [] },
        { id: 'b-2', addresses: [partialAddress, null], units: [] },
      ],
    }
    expect(getBuildingsStepState(form)).toBe('partial')
  })
})
