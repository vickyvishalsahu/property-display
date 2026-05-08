import type { FormState } from '@/domains/propertyCreation/types/form'

export type StepState = 'empty' | 'partial' | 'complete'

export const getPropertyStepState = (form: FormState): StepState => {
  const filledCount =
    (form.name.trim() !== '' ? 1 : 0) +
    (form.managerId !== '' ? 1 : 0) +
    (form.accountantId !== '' ? 1 : 0)
  if (filledCount === 3) return 'complete'
  if (filledCount > 0) return 'partial'
  return 'empty'
}

export const getBuildingsStepState = (form: FormState): StepState => {
  if (form.buildings.length === 0) return 'empty'
  const allComplete = form.buildings.every((building) => {
    const { streetName, streetNumber, postalCode, city } = building.addresses[0]
    return streetName.trim() !== '' && streetNumber.trim() !== '' && postalCode.trim() !== '' && city.trim() !== ''
  })
  return allComplete ? 'complete' : 'partial'
}

export const getStepStates = (form: FormState): StepState[] => [
  getPropertyStepState(form),
  getBuildingsStepState(form),
  'empty',
]
