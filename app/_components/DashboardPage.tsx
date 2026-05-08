'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_MOCK_STAFF } from '@/domains/shared/mock/staff'
import { MANAGEMENT_TYPE_LABELS } from '@/domains/shared/constants/propertyTypes'
import { DASHBOARD, NAVIGATION } from '@/domains/shared/constants/strings'
import { useProperties } from '@/domains/shared/hooks/useProperties'
import { DraftCard } from '@/domains/propertyCreation/components/DraftCard'
import { SkeletonLoading } from '@/domains/shared/components/SkeletonLoading'
import type { Property } from '@/domains/shared/types/property'

const resolveStaffName = (staffId: string) =>
  ALL_MOCK_STAFF.find((staffMember) => staffMember.id === staffId)?.name ?? '—'

const filterProperties = (properties: Property[], query: string): Property[] => {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return properties
  return properties.filter((property) => {
    if (property.name.toLowerCase().includes(trimmed)) return true
    if (resolveStaffName(property.managerId).toLowerCase().includes(trimmed)) return true
    return property.buildings.some((building) =>
      building.addresses.some((address) => {
        const full = `${address.streetName} ${address.streetNumber} ${address.postalCode} ${address.city}`
        return full.toLowerCase().includes(trimmed)
      })
    )
  })
}

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

  const renderDemoBadge = () => (
    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
      {DASHBOARD.demoBadge}
    </span>
  )

  return (
    <Link
      href={`/property-creation/${property.id}`}
      className="h-full bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 flex-1">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${dotColor}`} />
            <span className={`text-xs font-medium truncate ${textColor}`}>
              {MANAGEMENT_TYPE_LABELS[property.managementType]}
            </span>
          </div>
          <h2 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{property.name}</h2>
        </div>
        {property.isDemo && renderDemoBadge()}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{DASHBOARD.buildingCount(property.buildings.length)}</span>
        <span className="text-gray-300">·</span>
        <span>{DASHBOARD.unitCount(totalUnits)}</span>
      </div>

      <div className="pt-1 border-t border-gray-100 text-xs text-gray-400 truncate">
        {DASHBOARD.managerLabel}: <span className="font-medium text-gray-600">{managerName}</span>
      </div>
    </Link>
  )
}

const PROPERTY_CARD_SKELETON = [
  'h-3 w-16 rounded-full',
  'h-5 w-3/4 rounded-md mt-0.5',
  'h-3 w-16 rounded-full mt-2',
  'h-3 w-24 rounded-full mt-1',
]

const Dashboard = () => {
  const { properties: allProperties, removeProperty } = useProperties()
  const [isReady, setIsReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const totalCount = allProperties.length
  const visibleProperties = filterProperties(allProperties, searchQuery)
  const draftProperties = visibleProperties.filter((property) => property.isDraft)
  const completeProperties = visibleProperties.filter((property) => !property.isDraft)

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
          <SkeletonLoading classNameList={PROPERTY_CARD_SKELETON} />
        </div>
      ))}
    </div>
  )

  const renderSearch = () => (
    <div className="mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={DASHBOARD.searchPlaceholder}
        className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
    </div>
  )

  const renderNoResults = () => (
    <p className="text-sm text-gray-400 py-10 text-center">{DASHBOARD.noResults(searchQuery)}</p>
  )

  const renderContent = () => {
    if (!isReady) return renderSkeleton()
    if (totalCount === 0) return renderEmptyState()
    return (
      <>
        {renderSearch()}
        {visibleProperties.length === 0 ? renderNoResults() : renderProperties()}
      </>
    )
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-4xl">🏢</div>
      <h2 className="text-lg font-semibold text-gray-900">{DASHBOARD.emptyHeading}</h2>
      <p className="text-sm text-gray-500 max-w-xs">{DASHBOARD.emptyDescription}</p>
      <Link
        href="/property-creation/new"
        className="mt-2 text-sm bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {NAVIGATION.addProperty}
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
        <h1 className="text-xl font-semibold text-gray-900">{DASHBOARD.title}</h1>
      </div>
      {renderContent()}
    </div>
  )
}

export default Dashboard
