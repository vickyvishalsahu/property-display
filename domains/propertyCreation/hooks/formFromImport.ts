import { VALID_MANAGEMENT_TYPES } from '@/domains/shared/constants/propertyTypes'
import { VALID_UNIT_TYPES } from '@/domains/propertyCreation/constants/unitTypes'
import type { FormState, FormAddress, FormUnit, FormBuilding } from '@/domains/propertyCreation/types/form'
import type { PropertyImport, ImportBuilding, ImportUnit, ImportAddress } from '@/domains/shared/types/propertyImport'

const formAddressFromImport = (importAddress: ImportAddress): FormAddress => ({
  streetName: importAddress.streetName ?? '',
  streetNumber: importAddress.streetNumber ?? '',
  postalCode: importAddress.postalCode ?? '',
  city: importAddress.city ?? '',
})

const formUnitFromImport = (importUnit: ImportUnit): FormUnit => ({
  id: crypto.randomUUID(),
  number: importUnit.number ?? '',
  type: importUnit.type && VALID_UNIT_TYPES.includes(importUnit.type) ? importUnit.type : '',
  floor: importUnit.floor !== undefined && importUnit.floor !== null ? String(importUnit.floor) : '',
  entrance: importUnit.entrance ?? '',
  size: importUnit.size !== undefined && importUnit.size !== null ? String(importUnit.size) : '',
  rooms: importUnit.rooms !== undefined && importUnit.rooms !== null ? String(importUnit.rooms) : '',
  constructionYear:
    importUnit.constructionYear !== undefined && importUnit.constructionYear !== null
      ? String(importUnit.constructionYear)
      : '',
  coOwnershipShare:
    importUnit.coOwnershipShare !== undefined && importUnit.coOwnershipShare !== null
      ? String(importUnit.coOwnershipShare)
      : '',
})

const emptyFormUnit = (): FormUnit => ({
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

const formBuildingFromImport = (importBuilding: ImportBuilding): FormBuilding => {
  const primaryAddress = formAddressFromImport(importBuilding.addresses[0] ?? {})
  const secondAddress = importBuilding.addresses[1]
    ? formAddressFromImport(importBuilding.addresses[1])
    : null

  const units =
    importBuilding.units.length > 0
      ? importBuilding.units.map(formUnitFromImport)
      : [emptyFormUnit()]

  return {
    id: crypto.randomUUID(),
    addresses: [primaryAddress, secondAddress],
    units,
  }
}

export const formFromImport = (propertyImport: PropertyImport): Partial<FormState> => {
  const managementType =
    propertyImport.managementType &&
    VALID_MANAGEMENT_TYPES.includes(propertyImport.managementType)
      ? propertyImport.managementType
      : null

  const buildings =
    propertyImport.buildings.length > 0
      ? propertyImport.buildings.map(formBuildingFromImport)
      : undefined

  return {
    managementType,
    name: propertyImport.name ?? '',
    ...(buildings !== undefined ? { buildings } : {}),
  }
}
