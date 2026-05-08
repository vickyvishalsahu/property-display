'use client'

import Link from 'next/link'
import { ALL_MOCK_STAFF } from '@/domains/shared/mock/staff'
import { MANAGEMENT_TYPE_LABELS } from '@/domains/shared/constants/propertyTypes'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import { DraftCard } from '@/domains/propertyCreation/components/DraftCard'
import type { Property } from '@/domains/shared/types/property'

const resolveStaffName = (staffId: string) =>
  ALL_MOCK_STAFF.find((staffMember) => staffMember.id === staffId)?.name ?? '—'

const countTotalUnits = (property: Property) =>
  property.buildings.reduce((total, building) => total + building.units.length, 0)

const MANAGEMENT_TYPE_DOT: Record<string, string> = {
  WEG: 'bg-blue-400',
  MV: 'bg-emerald-400',
}

const MANAGEMENT_TYPE_TEXT: Record<string, string> = {
  WEG: 'text-blue-600',
  MV: 'text-emerald-600',
}

const PropertyCard = ({ property }: { property: Property }) => {
  const totalUnits = countTotalUnits(property)
  const managerName = resolveStaffName(property.managerId)
  const dotColor = MANAGEMENT_TYPE_DOT[property.managementType]
  const textColor = MANAGEMENT_TYPE_TEXT[property.managementType]

  return (
    <Link
      href={`/property-creation/${property.id}`}
      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span className={`text-xs font-medium ${textColor}`}>
            {MANAGEMENT_TYPE_LABELS[property.managementType]}
          </span>
        </div>
        <h2 className="font-semibold text-gray-900 text-base leading-snug">{property.name}</h2>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          <span className="font-medium text-gray-900">{property.buildings.length}</span>{' '}
          {property.buildings.length === 1 ? 'building' : 'buildings'}
        </span>
        <span className="text-gray-300">·</span>
        <span>
          <span className="font-medium text-gray-900">{totalUnits}</span>{' '}
          {totalUnits === 1 ? 'unit' : 'units'}
        </span>
      </div>

      <div className="pt-1 border-t border-gray-100 text-xs text-gray-400">
        Manager: <span className="font-medium text-gray-600">{managerName}</span>
      </div>
    </Link>
  )
}

const Dashboard = () => {
  const { properties: allProperties, removeProperty } = useProperties()
  const draftProperties = allProperties.filter((property) => property.isDraft)
  const completeProperties = allProperties.filter((property) => !property.isDraft)
  const totalCount = allProperties.length

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-4xl">🏢</div>
      <h2 className="text-lg font-semibold text-gray-900">No properties yet</h2>
      <p className="text-sm text-gray-500 max-w-xs">Add your first property to get started.</p>
      <Link
        href="/property-creation/new"
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
