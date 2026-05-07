'use client'

import { VALID_UNIT_TYPES, UNIT_TYPE_LABELS } from '@/domains/propertyCreation/constants/unitTypes'
import type { FormBuilding, FormAddress, FormUnit } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { AddressAutocomplete } from '@/domains/propertyCreation/components/AddressAutocomplete'

type Props = {
  building: FormBuilding
  buildingIndex: number
  isWEG: boolean
  canRemove: boolean
  onRemove: () => void
  onToggleSecondAddress: () => void
  onSetAddress: (addressIndex: 0 | 1, address: FormAddress) => void
  onAddUnit: () => void
  onRemoveUnit: (unitId: string) => void
  onUpdateUnit: (unitId: string, field: keyof FormUnit, fieldValue: string) => void
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900'

export const BuildingForm = ({
  building,
  buildingIndex,
  isWEG,
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
          + Add second address (corner building)
        </button>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address 2</p>
          <button
            type="button"
            onClick={onToggleSecondAddress}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Remove
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
    building.units.map((unit, unitIndex) => (
      <div key={unit.id} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Unit {unitIndex + 1}</span>
          {canRemoveUnit && (
            <button
              type="button"
              onClick={() => onRemoveUnit(unit.id)}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Remove
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Number</label>
            <input
              type="text"
              required
              value={unit.number}
              onChange={(event) => onUpdateUnit(unit.id, 'number', event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              required
              value={unit.type}
              onChange={(event) => onUpdateUnit(unit.id, 'type', event.target.value)}
              className={inputClass}
            >
              <option value="">Select</option>
              {VALID_UNIT_TYPES.map((unitType) => (
                <option key={unitType} value={unitType}>
                  {UNIT_TYPE_LABELS[unitType]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Floor</label>
            <input
              type="number"
              required
              value={unit.floor}
              onChange={(event) => onUpdateUnit(unit.id, 'floor', event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Entrance</label>
            <input
              type="text"
              required
              value={unit.entrance}
              onChange={(event) => onUpdateUnit(unit.id, 'entrance', event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Size (m²)</label>
            <input
              type="number"
              required
              min="1"
              value={unit.size}
              onChange={(event) => onUpdateUnit(unit.id, 'size', event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Rooms</label>
            <input
              type="number"
              required
              min="0"
              value={unit.rooms}
              onChange={(event) => onUpdateUnit(unit.id, 'rooms', event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Constr. year</label>
            <input
              type="number"
              required
              min="1800"
              max="2100"
              value={unit.constructionYear}
              onChange={(event) => onUpdateUnit(unit.id, 'constructionYear', event.target.value)}
              className={inputClass}
            />
          </div>
          {isWEG && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Co-own. share</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={unit.coOwnershipShare}
                onChange={(event) => onUpdateUnit(unit.id, 'coOwnershipShare', event.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>
    ))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Building {buildingIndex + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Remove building
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address 1</p>
        <AddressAutocomplete
          address={building.addresses[0]}
          onSelect={(address) => onSetAddress(0, address)}
        />
      </div>

      {renderSecondAddress()}

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Units</p>
        {renderUnits()}
        <button
          type="button"
          onClick={onAddUnit}
          className="text-xs text-gray-400 hover:text-gray-700 text-left py-1"
        >
          + Add unit
        </button>
      </div>
    </div>
  )
}
