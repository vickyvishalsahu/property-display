'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import type { ManagementType } from '@/domains/shared/types/property'
import type { FormAddress, FormUnit, FormState } from '@/domains/propertyCreation/types/form'
import {
  emptyBuilding,
  emptyAddress,
  emptyUnit,
  makeId,
  buildProperty,
  formFromProperty,
} from './utils'

export const usePropertyForm = (
  initialPropertyId?: string,
  initialFormOverrides?: Partial<FormState>
) => {
  const defaultFormState: FormState = {
    managementType: null,
    name: '',
    managerId: '',
    accountantId: '',
    buildings: [emptyBuilding()],
  }
  const [form, setForm] = useState<FormState>(
    initialFormOverrides ? { ...defaultFormState, ...initialFormOverrides } : defaultFormState
  )
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [originalIsDraft, setOriginalIsDraft] = useState(true)
  const [initialized, setInitialized] = useState(!initialPropertyId)

  const { properties, upsertProperty, removeProperty, isLoaded } = useProperties()
  const router = useRouter()

  // Initialize form from stored property the first time data is available.
  // Called during render (not in an effect) so no cascading setState occurs.
  if (isLoaded && !initialized) {
    const match = initialPropertyId
      ? properties.find((property) => property.id === initialPropertyId)
      : null
    if (match && initialPropertyId) {
      setForm(formFromProperty(match))
      setPropertyId(initialPropertyId)
      setOriginalIsDraft(match.isDraft)
    }
    setInitialized(true)
  }

  const isLoading = !initialized
  const isPropertyNotFound = initialized && !!initialPropertyId && !propertyId
  const isCompleted = initialized && !originalIsDraft

  const propertyStepIsValid =
    form.name.trim() !== '' &&
    form.managerId !== '' &&
    form.accountantId !== ''

  useEffect(() => {
    if (!propertyId) return
    if (isCompleted && !propertyStepIsValid) return
    upsertProperty(buildProperty(form, propertyId, originalIsDraft))
  }, [form, propertyId])

  const activateDraft = () => {
    if (propertyId) return
    setPropertyId(makeId('prop'))
  }

  const setManagementType = (managementType: ManagementType) =>
    setForm((previousForm) => ({ ...previousForm, managementType }))

  const setName = (name: string) =>
    setForm((previousForm) => ({ ...previousForm, name }))

  const setManagerId = (managerId: string) =>
    setForm((previousForm) => ({ ...previousForm, managerId }))

  const setAccountantId = (accountantId: string) =>
    setForm((previousForm) => ({ ...previousForm, accountantId }))

  const addBuilding = () =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: [...previousForm.buildings, emptyBuilding()],
    }))

  const removeBuilding = (buildingId: string) =>
    setForm((previousForm) => {
      if (previousForm.buildings.length <= 1) return previousForm
      return {
        ...previousForm,
        buildings: previousForm.buildings.filter((building) => building.id !== buildingId),
      }
    })

  const toggleSecondAddress = (buildingId: string) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        const secondAddress: FormAddress | null = building.addresses[1] ? null : emptyAddress()
        return {
          ...building,
          addresses: [building.addresses[0], secondAddress] as [FormAddress, FormAddress | null],
        }
      }),
    }))

  const setAddress = (buildingId: string, addressIndex: 0 | 1, address: FormAddress) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        const updatedAddresses: [FormAddress, FormAddress | null] = [
          building.addresses[0],
          building.addresses[1],
        ]
        updatedAddresses[addressIndex] = address
        return { ...building, addresses: updatedAddresses }
      }),
    }))

  const updateAddress = (
    buildingId: string,
    addressIndex: 0 | 1,
    field: keyof FormAddress,
    fieldValue: string
  ) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        const currentAddress = building.addresses[addressIndex]
        if (!currentAddress) return building
        const updatedAddresses: [FormAddress, FormAddress | null] = [
          building.addresses[0],
          building.addresses[1],
        ]
        updatedAddresses[addressIndex] = { ...currentAddress, [field]: fieldValue }
        return { ...building, addresses: updatedAddresses }
      }),
    }))

  const addUnit = (buildingId: string) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        return { ...building, units: [...building.units, emptyUnit()] }
      }),
    }))

  const removeUnit = (buildingId: string, unitId: string) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        return {
          ...building,
          units: building.units.filter((unit) => unit.id !== unitId),
        }
      }),
    }))

  const updateUnit = (buildingId: string, unitId: string, field: keyof FormUnit, fieldValue: string) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        return {
          ...building,
          units: building.units.map((unit) => {
            if (unit.id !== unitId) return unit
            return { ...unit, [field]: fieldValue }
          }),
        }
      }),
    }))

  const submit = () => {
    upsertProperty(buildProperty(form, propertyId!, false))
    router.push('/')
  }

  return {
    form,
    propertyId,
    isLoading,
    isPropertyNotFound,
    isCompleted,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    addBuilding,
    removeBuilding,
    toggleSecondAddress,
    setAddress,
    updateAddress,
    addUnit,
    removeUnit,
    updateUnit,
    submit,
    activateDraft,
    removeProperty,
  }
}
