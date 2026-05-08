'use client'

import { ALL_MOCK_STAFF } from '@/domains/shared/mock/staff'
import { MANAGEMENT_TYPE_LABELS } from '@/domains/shared/constants/propertyTypes'
import { UNIT_TYPE_LABELS } from '@/domains/propertyCreation/constants/unitTypes'
import { STEP_REVIEW } from '@/domains/propertyCreation/constants/strings'
import type { FormState, FormAddress } from '@/domains/propertyCreation/types/form'
import type { UnitType } from '@/domains/shared/types/property'

type Props = {
  form: FormState
  onBack: () => void
  onSubmit: () => void
}

const resolveStaffName = (staffId: string) =>
  ALL_MOCK_STAFF.find((staffMember) => staffMember.id === staffId)?.name ?? '—'

const formatAddress = (address: FormAddress) =>
  `${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}`

export const StepReview = ({ form, onBack, onSubmit }: Props) => {
  const managerName = resolveStaffName(form.managerId)
  const accountantName = resolveStaffName(form.accountantId)
  const typeLabel = form.managementType ? MANAGEMENT_TYPE_LABELS[form.managementType] : '—'

  const renderBuildings = () =>
    form.buildings.map((building, buildingIndex) => {
      const validAddresses = building.addresses.filter(
        (address): address is FormAddress => address !== null
      )

      return (
        <div key={building.id} className="flex flex-col gap-3 pt-4 border-t border-gray-100 first:border-0 first:pt-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {STEP_REVIEW.buildingHeading(buildingIndex + 1)}
          </p>
          <div className="flex flex-col gap-1">
            {validAddresses.map((address, addressIndex) => (
              <p key={addressIndex} className="text-sm text-gray-700">
                {formatAddress(address)}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {building.units.map((unit, unitIndex) => {
              const unitTypeLabel = unit.type ? UNIT_TYPE_LABELS[unit.type as UnitType] : '—'
              const showCoOwnership = form.managementType === 'WEG'

              return (
                <div key={unit.id} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-gray-400 text-xs w-10 shrink-0">{STEP_REVIEW.unitLabel(unitIndex + 1)}</span>
                  <span className="font-medium text-gray-900">#{unit.number}</span>
                  <span>{unitTypeLabel}</span>
                  <span className="text-gray-400">·</span>
                  <span>{unit.size} {STEP_REVIEW.sizeSuffix}</span>
                  <span className="text-gray-400">·</span>
                  <span>{unit.rooms} {STEP_REVIEW.roomsSuffix}</span>
                  {showCoOwnership && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span>{unit.coOwnershipShare} {STEP_REVIEW.meaSuffix}</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    })

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{STEP_REVIEW.propertyNameLabel}</p>
          <p className="text-sm font-semibold text-gray-900">{form.name}</p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{STEP_REVIEW.typeLabel}</p>
            <p className="text-sm text-gray-900">{typeLabel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{STEP_REVIEW.managerLabel}</p>
            <p className="text-sm text-gray-900">{managerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{STEP_REVIEW.accountantLabel}</p>
            <p className="text-sm text-gray-900">{accountantName}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
        {renderBuildings()}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {STEP_REVIEW.backButton}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {STEP_REVIEW.createButton}
        </button>
      </div>
    </div>
  )
}
