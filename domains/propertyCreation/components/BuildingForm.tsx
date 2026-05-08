'use client'

import { VALID_UNIT_TYPES, UNIT_TYPE_LABELS } from '@/domains/propertyCreation/constants/unitTypes'
import type { FormBuilding, FormAddress, FormUnit } from '@/domains/propertyCreation/types/form'
import { AddressAutocomplete } from '@/domains/propertyCreation/components/AddressAutocomplete'
import { HelpSection } from '@/domains/shared/components/HelpSection'
import { BUILDING_FORM } from '@/domains/propertyCreation/constants/strings'

type Props = {
  building: FormBuilding
  buildingIndex: number
  isWEG: boolean
  submitted: boolean
  canRemove: boolean
  onRemove: () => void
  onToggleSecondAddress: () => void
  onSetAddress: (addressIndex: 0 | 1, address: FormAddress) => void
  onAddUnit: () => void
  onRemoveUnit: (unitId: string) => void
  onUpdateUnit: (unitId: string, field: keyof FormUnit, fieldValue: string) => void
}

const baseInputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2'

const fieldClass = (hasError: boolean) =>
  `${baseInputClass} ${hasError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-900'}`

const renderFieldError = () => <p className="text-xs text-red-500 mt-1">{BUILDING_FORM.required}</p>

export const BuildingForm = ({
  building,
  buildingIndex,
  isWEG,
  submitted,
  canRemove,
  onRemove,
  onToggleSecondAddress,
  onSetAddress,
  onAddUnit,
  onRemoveUnit,
  onUpdateUnit,
}: Props) => {
  const canRemoveUnit = building.units.length > 1

  const renderSecondAddress = () => {
    if (!building.addresses[1]) {
      return (
        <button
          type="button"
          onClick={onToggleSecondAddress}
          className="text-xs text-gray-400 hover:text-gray-600 text-left"
        >
          {BUILDING_FORM.addSecondAddressButton}
        </button>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{BUILDING_FORM.address2Label}</p>
          <button
            type="button"
            onClick={onToggleSecondAddress}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            {BUILDING_FORM.removeAddressButton}
          </button>
        </div>
        <AddressAutocomplete
          address={building.addresses[1]}
          onSelect={(address) => onSetAddress(1, address)}
        />
      </div>
    )
  }

  const renderUnits = () =>
    building.units.map((unit, unitIndex) => {
      const numberError = submitted && unit.number.trim() === ''
      const typeError = submitted && unit.type === ''
      const floorError = submitted && unit.floor.trim() === ''
      const sizeError = submitted && unit.size.trim() === ''
      const roomsError = submitted && unit.rooms.trim() === ''
      const constructionYearError = submitted && unit.constructionYear.trim() === ''
      const coOwnershipShareError = isWEG && submitted && unit.coOwnershipShare.trim() === ''

      return (
        <div key={unit.id} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">{BUILDING_FORM.unitLabel(unitIndex + 1)}</span>
            {canRemoveUnit && (
              <button
                type="button"
                onClick={() => onRemoveUnit(unit.id)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                {BUILDING_FORM.removeUnitButton}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.numberLabel}</label>
              <input
                type="text"
                value={unit.number}
                onChange={(event) => onUpdateUnit(unit.id, 'number', event.target.value)}
                className={fieldClass(numberError)}
              />
              {numberError && renderFieldError()}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.typeLabel}</label>
              <select
                value={unit.type}
                onChange={(event) => onUpdateUnit(unit.id, 'type', event.target.value)}
                className={fieldClass(typeError)}
              >
                <option value="">{BUILDING_FORM.typeSelectPlaceholder}</option>
                {VALID_UNIT_TYPES.map((unitType) => (
                  <option key={unitType} value={unitType}>
                    {UNIT_TYPE_LABELS[unitType]}
                  </option>
                ))}
              </select>
              {typeError && renderFieldError()}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.floorLabel}</label>
              <input
                type="number"
                value={unit.floor}
                onChange={(event) => onUpdateUnit(unit.id, 'floor', event.target.value)}
                className={fieldClass(floorError)}
              />
              {floorError && renderFieldError()}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.entranceLabel}</label>
              <input
                type="text"
                value={unit.entrance}
                onChange={(event) => onUpdateUnit(unit.id, 'entrance', event.target.value)}
                className={fieldClass(false)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.sizeLabel}</label>
              <input
                type="number"
                min="1"
                value={unit.size}
                onChange={(event) => onUpdateUnit(unit.id, 'size', event.target.value)}
                className={fieldClass(sizeError)}
              />
              {sizeError && renderFieldError()}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.roomsLabel}</label>
              <input
                type="number"
                min="0"
                value={unit.rooms}
                onChange={(event) => onUpdateUnit(unit.id, 'rooms', event.target.value)}
                className={fieldClass(roomsError)}
              />
              {roomsError && renderFieldError()}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.constructionYearLabel}</label>
              <input
                type="number"
                min="1800"
                max="2100"
                value={unit.constructionYear}
                onChange={(event) => onUpdateUnit(unit.id, 'constructionYear', event.target.value)}
                className={fieldClass(constructionYearError)}
              />
              {constructionYearError && renderFieldError()}
            </div>
            {isWEG && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">{BUILDING_FORM.coOwnershipShareLabel}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unit.coOwnershipShare}
                  onChange={(event) => onUpdateUnit(unit.id, 'coOwnershipShare', event.target.value)}
                  className={fieldClass(coOwnershipShareError)}
                />
                {coOwnershipShareError && renderFieldError()}
              </div>
            )}
          </div>
        </div>
      )
    })

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{BUILDING_FORM.buildingHeading(buildingIndex + 1)}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            {BUILDING_FORM.removeBuildingButton}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{BUILDING_FORM.address1Label}</p>
        <AddressAutocomplete
          address={building.addresses[0]}
          onSelect={(address) => onSetAddress(0, address)}
        />
      </div>

      {renderSecondAddress()}

      <HelpSection label={BUILDING_FORM.unitsLabel} termId="units">
        <div className="flex flex-col gap-3">
          {renderUnits()}
          <button
            type="button"
            onClick={onAddUnit}
            className="text-xs text-gray-400 hover:text-gray-700 text-left py-1"
          >
            {BUILDING_FORM.addUnitButton}
          </button>
        </div>
      </HelpSection>
    </div>
  )
}
