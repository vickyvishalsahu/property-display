import type { ManagementType, UnitType } from '@/domains/shared/types/property'

export type ImportAddress = {
  streetName?: string | null
  streetNumber?: string | null
  postalCode?: string | null
  city?: string | null
}

export type ImportUnit = {
  number?: string | null
  type?: UnitType | null
  floor?: number | null
  entrance?: string | null
  size?: number | null
  rooms?: number | null
  constructionYear?: number | null
  coOwnershipShare?: number | null
}

export type ImportBuilding = {
  addresses: [ImportAddress, ImportAddress?]
  units: ImportUnit[]
}

export type PropertyImport = {
  name?: string | null
  managementType?: ManagementType | null
  buildings: ImportBuilding[]
}
