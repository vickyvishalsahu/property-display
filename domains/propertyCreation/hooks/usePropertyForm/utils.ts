import type { ManagementType, UnitType, Address, WEGProperty, MVProperty, WEGUnit, MVUnit, Property } from '@/domains/shared/types/property'
import type { FormAddress, FormUnit, FormBuilding, FormState } from '@/domains/propertyCreation/types/form'

export const emptyAddress = (): FormAddress => ({
  streetName: '',
  streetNumber: '',
  postalCode: '',
  city: '',
})

export const emptyUnit = (): FormUnit => ({
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

export const emptyBuilding = (): FormBuilding => ({
  id: crypto.randomUUID(),
  addresses: [emptyAddress(), null],
  units: [emptyUnit()],
})

export const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 6)}`

export const toAddress = (formAddress: FormAddress): Address => ({
  streetName: formAddress.streetName,
  streetNumber: formAddress.streetNumber,
  postalCode: formAddress.postalCode,
  city: formAddress.city,
})

export const safeInt = (value: string) => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? 0 : parsed
}

export const safeFloat = (value: string) => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

export const safeString = (value: number) => (isNaN(value) ? '' : String(value))

export const buildProperty = (form: FormState, propertyId: string, isDraft: boolean): WEGProperty | MVProperty => {
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

export const formFromProperty = (property: Property): FormState => ({
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
