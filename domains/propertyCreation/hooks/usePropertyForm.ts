'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import type { ManagementType, UnitType, Address, WEGProperty, MVProperty, WEGUnit, MVUnit, Property } from '@/domains/shared/types/property'

export type FormAddress = {
  streetName: string
  streetNumber: string
  postalCode: string
  city: string
}

export type FormUnit = {
  id: string
  number: string
  type: UnitType | ''
  floor: string
  entrance: string
  size: string
  rooms: string
  constructionYear: string
  coOwnershipShare: string
}

export type FormBuilding = {
  id: string
  addresses: [FormAddress, FormAddress | null]
  units: FormUnit[]
}

export type FormState = {
  managementType: ManagementType | null
  name: string
  managerId: string
  accountantId: string
  buildings: FormBuilding[]
}

const emptyAddress = (): FormAddress => ({
  streetName: '',
  streetNumber: '',
  postalCode: '',
  city: '',
})

const emptyUnit = (): FormUnit => ({
  id: crypto.randomUUID(),
  number: '',
  type: '',
  floor: '',
  entrance: '',
  size: '',
  rooms: '',
  constructionYear: '',
  coOwnershipShare: '',
})

const emptyBuilding = (): FormBuilding => ({
  id: crypto.randomUUID(),
  addresses: [emptyAddress(), null],
  units: [emptyUnit()],
})

const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 6)}`

const toAddress = (formAddress: FormAddress): Address => ({
  streetName: formAddress.streetName,
  streetNumber: formAddress.streetNumber,
  postalCode: formAddress.postalCode,
  city: formAddress.city,
})

const safeInt = (value: string) => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? 0 : parsed
}

const safeFloat = (value: string) => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

const safeString = (value: number) => (isNaN(value) ? '' : String(value))

const buildProperty = (form: FormState, propertyId: string, isDraft: boolean): WEGProperty | MVProperty => {
  const base = {
    id: propertyId,
    name: form.name,
    managerId: form.managerId,
    accountantId: form.accountantId,
    isDraft,
  }

  if (form.managementType === 'WEG') {
    return {
      ...base,
      managementType: 'WEG',
      buildings: form.buildings.map((building) => {
        const addresses: [Address, ...Address[]] = building.addresses[1]
          ? [toAddress(building.addresses[0]), toAddress(building.addresses[1])]
          : [toAddress(building.addresses[0])]

        const units: WEGUnit[] = building.units.map((unit) => ({
          id: unit.id,
          number: unit.number,
          type: unit.type as UnitType,
          floor: safeInt(unit.floor),
          entrance: unit.entrance,
          size: safeFloat(unit.size),
          rooms: safeInt(unit.rooms),
          constructionYear: safeInt(unit.constructionYear),
          coOwnershipShare: safeFloat(unit.coOwnershipShare),
        }))

        return { id: building.id, addresses, units }
      }),
    }
  }

  return {
    ...base,
    managementType: 'MV',
    buildings: form.buildings.map((building) => {
      const addresses: [Address, ...Address[]] = building.addresses[1]
        ? [toAddress(building.addresses[0]), toAddress(building.addresses[1])]
        : [toAddress(building.addresses[0])]

      const units: MVUnit[] = building.units.map((unit) => ({
        id: unit.id,
        number: unit.number,
        type: unit.type as UnitType,
        floor: safeInt(unit.floor),
        entrance: unit.entrance,
        size: safeFloat(unit.size),
        rooms: safeInt(unit.rooms),
        constructionYear: safeInt(unit.constructionYear),
      }))

      return { id: building.id, addresses, units }
    }),
  }
}

const formFromProperty = (property: Property): FormState => ({
  managementType: property.managementType,
  name: property.name,
  managerId: property.managerId,
  accountantId: property.accountantId,
  buildings: property.buildings.map((building) => ({
    id: building.id,
    addresses: [
      {
        streetName: building.addresses[0].streetName,
        streetNumber: building.addresses[0].streetNumber,
        postalCode: building.addresses[0].postalCode,
        city: building.addresses[0].city,
      },
      building.addresses[1]
        ? {
            streetName: building.addresses[1].streetName,
            streetNumber: building.addresses[1].streetNumber,
            postalCode: building.addresses[1].postalCode,
            city: building.addresses[1].city,
          }
        : null,
    ] as [FormAddress, FormAddress | null],
    units: building.units.map((unit) => ({
      id: unit.id,
      number: unit.number,
      type: unit.type,
      floor: safeString(unit.floor),
      entrance: unit.entrance,
      size: safeString(unit.size),
      rooms: safeString(unit.rooms),
      constructionYear: safeString(unit.constructionYear),
      coOwnershipShare: 'coOwnershipShare' in unit ? safeString(unit.coOwnershipShare) : '',
    })),
  })),
})

export const usePropertyForm = (initialPropertyId?: string) => {
  const initialFormState: FormState = {
    managementType: null,
    name: '',
    managerId: '',
    accountantId: '',
    buildings: [emptyBuilding()],
  }
  const [form, setForm] = useState<FormState>(initialFormState)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [originalIsDraft, setOriginalIsDraft] = useState(true)

  const { properties, upsertProperty, removeProperty, isLoaded } = useProperties()

  const isLoading = !isLoaded
  const isPropertyNotFound = isLoaded && !!initialPropertyId && !propertyId
  const router = useRouter()

  useEffect(() => {
    if (!initialPropertyId || propertyId) return
    const match = properties.find((property) => property.id === initialPropertyId)
    if (match) {
      setForm(formFromProperty(match))
      setPropertyId(initialPropertyId)
      setOriginalIsDraft(match.isDraft)
    }
  }, [properties])

  useEffect(() => {
    if (!propertyId) return
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
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    addBuilding,
    removeBuilding,
    toggleSecondAddress,
    updateAddress,
    addUnit,
    removeUnit,
    updateUnit,
    submit,
    activateDraft,
    removeProperty,
  }
}
