'use client'

import { BuildingForm } from './BuildingForm'
import type { FormBuilding, FormAddress, FormUnit } from '@/domains/propertyCreation/hooks/usePropertyForm'

type Props = {
  managementType: 'WEG' | 'MV'
  buildings: FormBuilding[]
  addBuilding: () => void
  removeBuilding: (buildingId: string) => void
  toggleSecondAddress: (buildingId: string) => void
  setAddress: (buildingId: string, addressIndex: 0 | 1, address: FormAddress) => void
  addUnit: (buildingId: string) => void
  removeUnit: (buildingId: string, unitId: string) => void
  updateUnit: (buildingId: string, unitId: string, field: keyof FormUnit, fieldValue: string) => void
  onBack: () => void
  onNext: () => void
}

export const StepBuildings = ({
  managementType,
  buildings,
  addBuilding,
  removeBuilding,
  toggleSecondAddress,
  setAddress,
  addUnit,
  removeUnit,
  updateUnit,
  onBack,
  onNext,
}: Props) => {
  const isWEG = managementType === 'WEG'

  const isAddressComplete = (address: FormAddress) =>
    address.streetName.trim() !== '' && address.streetNumber.trim() !== ''

  const canProceed = buildings.every(
    (building) =>
      isAddressComplete(building.addresses[0]) &&
      (building.addresses[1] === null || isAddressComplete(building.addresses[1]))
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (canProceed) onNext()
  }

  const renderBuildings = () =>
    buildings.map((building, buildingIndex) => (
      <BuildingForm
        key={building.id}
        building={building}
        buildingIndex={buildingIndex}
        isWEG={isWEG}
        canRemove={buildings.length > 1}
        onRemove={() => removeBuilding(building.id)}
        onToggleSecondAddress={() => toggleSecondAddress(building.id)}
        onSetAddress={(addressIndex, address) => setAddress(building.id, addressIndex, address)}
        onAddUnit={() => addUnit(building.id)}
        onRemoveUnit={(unitId) => removeUnit(building.id, unitId)}
        onUpdateUnit={(unitId, field, fieldValue) => updateUnit(building.id, unitId, field, fieldValue)}
      />
    ))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {renderBuildings()}

      <button
        type="button"
        onClick={addBuilding}
        className="text-sm text-gray-400 hover:text-gray-700 text-left py-2"
      >
        + Add building
      </button>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!canProceed}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </form>
  )
}
