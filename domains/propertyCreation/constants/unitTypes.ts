import type { UnitType } from '@/domains/shared/types/property'

export const VALID_UNIT_TYPES: UnitType[] = ['apartment', 'office', 'garden', 'parking']

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  apartment: 'Apartment',
  office: 'Office',
  garden: 'Garden',
  parking: 'Parking',
}
