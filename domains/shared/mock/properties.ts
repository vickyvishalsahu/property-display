import type { WEGProperty, MVProperty } from '@/domains/shared/types/property'

const wegProperty1: WEGProperty = {
  id: 'prop-001',
  name: 'Togostraße Eigentümergemeinschaft',
  managementType: 'WEG',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  buildings: [
    {
      id: 'bld-001',
      addresses: [
        { streetName: 'Togostraße', streetNumber: '75-77', postalCode: '13351', city: 'Berlin' },
      ],
      units: [
        { id: 'unit-001', number: '1', type: 'apartment', floor: 0, entrance: 'A', size: 68, constructionYear: 1962, rooms: 2, coOwnershipShare: 85.5 },
        { id: 'unit-002', number: '2', type: 'apartment', floor: 1, entrance: 'A', size: 72, constructionYear: 1962, rooms: 3, coOwnershipShare: 90.0 },
        { id: 'unit-003', number: '3', type: 'parking', floor: -1, entrance: 'A', size: 14, constructionYear: 1962, rooms: 0, coOwnershipShare: 12.5 },
      ],
    },
  ],
}

const wegProperty2: WEGProperty = {
  id: 'prop-002',
  name: 'Kameruner Eck WEG',
  managementType: 'WEG',
  managerId: 'mgr-2',
  accountantId: 'acc-2',
  buildings: [
    {
      id: 'bld-002',
      addresses: [
        { streetName: 'Kameruner Straße', streetNumber: '12', postalCode: '13351', city: 'Berlin' },
        { streetName: 'Togostraße', streetNumber: '69', postalCode: '13351', city: 'Berlin' },
      ],
      units: [
        { id: 'unit-004', number: '1', type: 'apartment', floor: 1, entrance: 'B', size: 55, constructionYear: 1975, rooms: 2, coOwnershipShare: 70.0 },
        { id: 'unit-005', number: '2', type: 'office', floor: 0, entrance: 'B', size: 48, constructionYear: 1975, rooms: 3, coOwnershipShare: 62.5 },
      ],
    },
  ],
}

const mvProperty1: MVProperty = {
  id: 'prop-003',
  name: 'Schönhauser Allee Rentals',
  managementType: 'MV',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  buildings: [
    {
      id: 'bld-003',
      addresses: [
        { streetName: 'Schönhauser Allee', streetNumber: '45', postalCode: '10437', city: 'Berlin' },
      ],
      units: [
        { id: 'unit-006', number: '1L', type: 'apartment', floor: 2, entrance: 'L', size: 80, constructionYear: 1990, rooms: 3 },
        { id: 'unit-007', number: '1R', type: 'apartment', floor: 2, entrance: 'R', size: 76, constructionYear: 1990, rooms: 3 },
        { id: 'unit-008', number: 'EG', type: 'office', floor: 0, entrance: 'L', size: 95, constructionYear: 1990, rooms: 4 },
      ],
    },
  ],
}

const mvProperty2: MVProperty = {
  id: 'prop-004',
  name: 'Prenzlauer Wohnpark',
  managementType: 'MV',
  managerId: 'mgr-2',
  accountantId: 'acc-2',
  buildings: [
    {
      id: 'bld-004',
      addresses: [
        { streetName: 'Danziger Straße', streetNumber: '22', postalCode: '10435', city: 'Berlin' },
      ],
      units: [
        { id: 'unit-009', number: '01', type: 'apartment', floor: 1, entrance: 'A', size: 62, constructionYear: 2003, rooms: 2 },
        { id: 'unit-010', number: '02', type: 'apartment', floor: 1, entrance: 'A', size: 58, constructionYear: 2003, rooms: 2 },
      ],
    },
    {
      id: 'bld-005',
      addresses: [
        { streetName: 'Danziger Straße', streetNumber: '24', postalCode: '10435', city: 'Berlin' },
      ],
      units: [
        { id: 'unit-011', number: '01', type: 'apartment', floor: 0, entrance: 'A', size: 90, constructionYear: 2003, rooms: 4 },
        { id: 'unit-012', number: 'P1', type: 'parking', floor: -1, entrance: 'A', size: 16, constructionYear: 2003, rooms: 0 },
      ],
    },
  ],
}

export const MOCK_PROPERTIES = [wegProperty1, wegProperty2, mvProperty1, mvProperty2]
