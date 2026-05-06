'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from './useProperties'
import type { ManagementType, UnitType, Address, WEGProperty, MVProperty, WEGUnit, MVUnit } from '@/types/property'

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

const buildProperty = (form: FormState): WEGProperty | MVProperty => {
  const base = {
    id: makeId('prop'),
    name: form.name,
    managerId: form.managerId,
    accountantId: form.accountantId,
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
          id: makeId('unit'),
          number: unit.number,
          type: unit.type as UnitType,
          floor: parseInt(unit.floor, 10),
          entrance: unit.entrance,
          size: parseFloat(unit.size),
          rooms: parseInt(unit.rooms, 10),
          constructionYear: parseInt(unit.constructionYear, 10),
          coOwnershipShare: parseFloat(unit.coOwnershipShare),
        }))

        return { id: makeId('bld'), addresses, units }
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
        id: makeId('unit'),
        number: unit.number,
        type: unit.type as UnitType,
        floor: parseInt(unit.floor, 10),
        entrance: unit.entrance,
        size: parseFloat(unit.size),
        rooms: parseInt(unit.rooms, 10),
        constructionYear: parseInt(unit.constructionYear, 10),
      }))

      return { id: makeId('bld'), addresses, units }
    }),
  }
}

export const usePropertyForm = () => {
  const [form, setForm] = useState<FormState>({
    managementType: null,
    name: '',
    managerId: '',
    accountantId: '',
    buildings: [emptyBuilding()],
  })

  const { addProperty } = useProperties()
  const router = useRouter()

  const setManagementType = (type: ManagementType) =>
    setForm((previousForm) => ({ ...previousForm, managementType: type }))

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
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.filter((building) => building.id !== buildingId),
    }))

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
    value: string
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
        updatedAddresses[addressIndex] = { ...currentAddress, [field]: value }
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

  const updateUnit = (buildingId: string, unitId: string, field: keyof FormUnit, value: string) =>
    setForm((previousForm) => ({
      ...previousForm,
      buildings: previousForm.buildings.map((building) => {
        if (building.id !== buildingId) return building
        return {
          ...building,
          units: building.units.map((unit) => {
            if (unit.id !== unitId) return unit
            return { ...unit, [field]: value }
          }),
        }
      }),
    }))

  const submit = () => {
    const property = buildProperty(form)
    addProperty(property)
    router.push('/')
  }

  return {
    form,
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
  }
}
