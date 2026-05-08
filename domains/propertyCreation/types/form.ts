import type { ManagementType, UnitType } from '@/domains/shared/types/property'

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
