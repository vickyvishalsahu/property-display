import type { ManagementType } from '@/types/property'

export const VALID_MANAGEMENT_TYPES: ManagementType[] = ['WEG', 'MV']

export const MANAGEMENT_TYPE_LABELS: Record<ManagementType, string> = {
  WEG: 'WEG',
  MV: 'MV',
}
