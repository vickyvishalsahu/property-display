export type ManagementType = 'WEG' | 'MV'

export type UnitType = 'apartment' | 'office' | 'garden' | 'parking'

export type Address = {
  streetName: string
  streetNumber: string
  postalCode: string
  city: string
}

type BaseUnit = {
  id: string
  number: string
  type: UnitType
  floor: number
  entrance: string
  size: number
  constructionYear: number
  rooms: number
}

export type WEGUnit = BaseUnit & { coOwnershipShare: number }
export type MVUnit = BaseUnit

type BaseBuilding = {
  id: string
  addresses: [Address, ...Address[]]
}

export type WEGBuilding = BaseBuilding & { units: WEGUnit[] }
export type MVBuilding = BaseBuilding & { units: MVUnit[] }

type BaseProperty = {
  id: string
  name: string
  managerId: string
  accountantId: string
  isDraft: boolean
  isDemo?: boolean
}

export type WEGProperty = BaseProperty & {
  managementType: 'WEG'
  buildings: WEGBuilding[]
}

export type MVProperty = BaseProperty & {
  managementType: 'MV'
  buildings: MVBuilding[]
}

export type Property = WEGProperty | MVProperty
