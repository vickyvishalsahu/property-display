import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import type { PropertyImport, ImportBuilding, ImportAddress, ImportUnit } from '@/domains/shared/types/propertyImport'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a property management data extraction assistant specialising in German real estate documents.

Extract property information from the document and return a single JSON object.

RULES:
- Return ONLY valid JSON. No markdown, no explanation, no code blocks.
- Use null for any field not present in the document. Never invent data.
- All text fields must use the original language from the document.

SCHEMA:
{
  "name": string | null,
  "managementType": "WEG" | "MV" | null,
  "buildings": [
    {
      "addresses": [
        { "streetName": string | null, "streetNumber": string | null, "postalCode": string | null, "city": string | null }
      ],
      "units": [
        {
          "number": string | null,
          "type": "apartment" | "office" | "garden" | "parking" | null,
          "floor": number | null,
          "entrance": string | null,
          "size": number | null,
          "rooms": number | null,
          "constructionYear": number | null,
          "coOwnershipShare": number | null
        }
      ]
    }
  ]
}

FIELD NOTES:
- name: the property or community name (e.g. "Musterstraße Eigentümergemeinschaft")
- managementType:
    "WEG" if document mentions Eigentümergemeinschaft, WEG, Teilungserklärung, Miteigentumsanteil, MEA, or co-ownership shares
    "MV"  if document mentions Mietverwaltung, Mietvertrag, or rental management
    null  if unclear or not mentioned
- buildings.addresses: extract all addresses. A corner building may have 2 addresses.
- units.number: the unit identifier as it appears in the document (e.g. "1", "OG links", "B-04")
- units.type: Wohnung→apartment | Büro/Gewerbe→office | Stellplatz/PKW→parking | Garten→garden
- units.floor: 0=EG/Erdgeschoss, negative=UG/Keller, positive=OG number
- units.size: floor area in m²
- units.coOwnershipShare: MEA value — only present in WEG documents
- units.constructionYear: year the building was built (not the document date)`

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

const validateExtraction = (raw: unknown): PropertyImport | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>

  if (!Array.isArray(data.buildings)) return null

  const buildings: ImportBuilding[] = []
  for (const buildingRaw of data.buildings) {
    if (!buildingRaw || typeof buildingRaw !== 'object') return null
    const building = buildingRaw as Record<string, unknown>

    if (!Array.isArray(building.addresses) || building.addresses.length === 0) return null

    const primaryAddress = validateAddress(building.addresses[0])
    const secondAddress =
      building.addresses[1] !== undefined ? validateAddress(building.addresses[1]) : undefined

    const units: ImportUnit[] = []
    if (Array.isArray(building.units)) {
      for (const unitRaw of building.units) {
        const unit = validateUnit(unitRaw)
        if (unit !== null) units.push(unit)
      }
    }

    buildings.push({
      addresses:
        secondAddress !== undefined
          ? [primaryAddress ?? {}, secondAddress]
          : [primaryAddress ?? {}],
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

type Message = { role: 'system' | 'user' | 'assistant'; content: string }

const buildMessages = (
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

const MAX_RETRIES = 2

const extractWithRetry = async (text: string): Promise<PropertyImport> => {
  let lastError = ''
  let lastResponse = ''

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const messages = buildMessages(text, attempt, lastError, lastResponse)

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages,
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    lastResponse = raw

    try {
      const parsed = JSON.parse(raw)
      const validated = validateExtraction(parsed)
      if (validated) return validated
      lastError = 'Response did not match the required schema structure.'
    } catch {
      lastError = 'Response was not valid JSON.'
    }
  }

  throw new Error('EXTRACTION_FAILED')
}

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null)
  const text = body?.text

  if (!text || typeof text !== 'string' || text.trim().length < 50) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const result = await extractWithRetry(text)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'EXTRACTION_FAILED' }, { status: 422 })
  }
}
