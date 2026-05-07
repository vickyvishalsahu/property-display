import type { Staff } from '@/domains/shared/types/staff'

export const MOCK_MANAGERS: Staff[] = [
  { id: 'mgr-1', name: 'Anna Becker' },
  { id: 'mgr-2', name: 'Jonas Müller' },
]

export const MOCK_ACCOUNTANTS: Staff[] = [
  { id: 'acc-1', name: 'Sara Klein' },
  { id: 'acc-2', name: 'Felix Wagner' },
]

export const ALL_MOCK_STAFF: Staff[] = [...MOCK_MANAGERS, ...MOCK_ACCOUNTANTS]
