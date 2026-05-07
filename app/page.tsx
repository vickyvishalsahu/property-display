'use client'

import Link from 'next/link'
import { MOCK_PROPERTIES } from '@/domains/shared/mock/properties'
import { ALL_MOCK_STAFF } from '@/domains/shared/mock/staff'
import { MANAGEMENT_TYPE_LABELS } from '@/domains/shared/constants/propertyTypes'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import { DraftCard } from '@/domains/propertyCreation/components/DraftCard'
import type { Property } from '@/domains/shared/types/property'

const formatPropertyNumber = (id: string) => `#${id.replace('prop-', '')}`

const resolveStaffName = (staffId: string) =>
  ALL_MOCK_STAFF.find((staffMember) => staffMember.id === staffId)?.name ?? '—'

const countTotalUnits = (property: Property) =>
  property.buildings.reduce((total, building) => total + building.units.length, 0)

const MANAGEMENT_TYPE_STYLES: Record<string, string> = {
  WEG: 'bg-blue-50 text-blue-700',
  MV: 'bg-emerald-50 text-emerald-700',
}

const PropertyCard = ({ property }: { property: Property }) => {
  const totalUnits = countTotalUnits(property)
  const managerName = resolveStaffName(property.managerId)
  const propertyNumber = formatPropertyNumber(property.id)
  const typeStyle = MANAGEMENT_TYPE_STYLES[property.managementType]

  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-mono">{propertyNumber}</span>
          <h2 className="font-semibold text-gray-900 text-base leading-snug">{property.name}</h2>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyle}`}>
          {MANAGEMENT_TYPE_LABELS[property.managementType]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          <span className="font-medium text-gray-900">{property.buildings.length}</span>{' '}
          {property.buildings.length === 1 ? 'building' : 'buildings'}
        </span>
        <span>
          <span className="font-medium text-gray-900">{totalUnits}</span>{' '}
          {totalUnits === 1 ? 'unit' : 'units'}
        </span>
      </div>

      <div className="pt-1 border-t border-gray-100 text-xs text-gray-400">
        Manager: <span className="text-gray-600">{managerName}</span>
      </div>
    </Link>
  )
}

const Dashboard = () => {
  const { properties: userProperties, removeProperty } = useProperties()
  const allProperties = [...MOCK_PROPERTIES, ...userProperties]
  const draftProperties = allProperties.filter((property) => property.isDraft)
  const completeProperties = allProperties.filter((property) => !property.isDraft)
  const totalCount = allProperties.length

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-4xl">🏢</div>
      <h2 className="text-lg font-semibold text-gray-900">No properties yet</h2>
      <p className="text-sm text-gray-500 max-w-xs">Add your first property to get started.</p>
      <Link
        href="/properties/new"
        className="mt-2 text-sm bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Add Property
      </Link>
    </div>
  )

  const renderProperties = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {draftProperties.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onDiscard={removeProperty} />
      ))}
      {completeProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Properties</h1>
        {totalCount > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">{totalCount} total</p>
        )}
      </div>
      {totalCount === 0 ? renderEmptyState() : renderProperties()}
    </div>
  )
}

export default Dashboard
