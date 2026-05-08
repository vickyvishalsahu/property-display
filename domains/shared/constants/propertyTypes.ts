import type { ManagementType } from '@/domains/shared/types/property'

export const VALID_MANAGEMENT_TYPES: ManagementType[] = ['WEG', 'MV']

export const MANAGEMENT_TYPE_LABELS: Record<ManagementType, string> = {
  WEG: 'Eigentümergemeinschaft',
  MV: 'Mietverwaltung',
}
