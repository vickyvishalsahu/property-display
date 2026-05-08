import { ImportAddress, ImportBuilding, ImportUnit, PropertyImport } from "@/domains/shared/types/propertyImport";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "../constants";
import { Message } from "../types";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })



const validateAddress = (raw: unknown): ImportAddress | null => {
  if (!raw || typeof raw !== 'object') return {}
  const address = raw as Record<string, unknown>
  return {
    streetName: typeof address.streetName === 'string' ? address.streetName : null,
    streetNumber: typeof address.streetNumber === 'string' ? address.streetNumber : null,
    postalCode: typeof address.postalCode === 'string' ? address.postalCode : null,
    city: typeof address.city === 'string' ? address.city : null,
  }
}

const validateUnit = (raw: unknown): ImportUnit | null => {
  if (!raw || typeof raw !== 'object') return null
  const unit = raw as Record<string, unknown>
  const VALID_UNIT_TYPES = ['apartment', 'office', 'garden', 'parking']
  return {
    number: typeof unit.number === 'string' ? unit.number : null,
    type:
      typeof unit.type === 'string' && VALID_UNIT_TYPES.includes(unit.type)
        ? (unit.type as ImportUnit['type'])
        : null,
    floor: typeof unit.floor === 'number' ? unit.floor : null,
    entrance: typeof unit.entrance === 'string' ? unit.entrance : null,
    size: typeof unit.size === 'number' ? unit.size : null,
    rooms: typeof unit.rooms === 'number' ? unit.rooms : null,
    constructionYear: typeof unit.constructionYear === 'number' ? unit.constructionYear : null,
    coOwnershipShare: typeof unit.coOwnershipShare === 'number' ? unit.coOwnershipShare : null,
  }
}

export const validateExtraction = (raw: unknown): PropertyImport | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>

  if (!Array.isArray(data.buildings)) return null

  const buildings: ImportBuilding[] = []
  for (const buildingRaw of data.buildings) {
    if (!buildingRaw || typeof buildingRaw !== 'object') return null
    const building = buildingRaw as Record<string, unknown>

    if (!Array.isArray(building.addresses) || building.addresses.length === 0) return null

    const primaryAddress = validateAddress(building.addresses[0])
    const primaryAddressOrEmpty: ImportAddress = primaryAddress ?? {
      streetName: null,
      streetNumber: null,
      postalCode: null,
      city: null,
    }
    const secondAddressRaw = building.addresses[1]
    const secondAddress =
      secondAddressRaw !== undefined ? validateAddress(secondAddressRaw) ?? undefined : undefined

    const units: ImportUnit[] = []
    if (Array.isArray(building.units)) {
      for (const unitRaw of building.units) {
        const unit = validateUnit(unitRaw)
        if (unit !== null) units.push(unit)
      }
    }
    const addressesForBuilding: [ImportAddress, ImportAddress?] = secondAddress
      ? [primaryAddressOrEmpty, secondAddress]
      : [primaryAddressOrEmpty]

    buildings.push({
      addresses: addressesForBuilding,
      units,
    })
  }

  return {
    name: typeof data.name === 'string' ? data.name : null,
    managementType:
      data.managementType === 'WEG' || data.managementType === 'MV'
        ? data.managementType
        : null,
    buildings,
  }
}

export const buildMessages = (
  text: string,
  attempt: number,
  lastError: string,
  lastResponse: string
): Message[] => {
  if (attempt === 0) {
    return [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ]
  }
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: text },
    { role: 'assistant', content: lastResponse },
    {
      role: 'user',
      content: `Your response was invalid. Issue: ${lastError}\nReturn corrected JSON only, matching the schema exactly.`,
    },
  ]
}
