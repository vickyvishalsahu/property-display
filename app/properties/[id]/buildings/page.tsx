'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepBuildings } from '@/domains/propertyCreation/components/StepBuildings'

const BuildingsStep = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const {
    form,
    addBuilding,
    removeBuilding,
    toggleSecondAddress,
    updateAddress,
    addUnit,
    removeUnit,
    updateUnit,
  } = usePropertyForm(propertyId)

  const handleBack = () => {
    router.push(`/properties/${propertyId}`)
  }

  const handleNext = () => {
    router.push(`/properties/${propertyId}/review`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
      <PropertyStepper activeStep={1} />
      <StepBuildings
        managementType={form.managementType ?? 'MV'}
        buildings={form.buildings}
        addBuilding={addBuilding}
        removeBuilding={removeBuilding}
        toggleSecondAddress={toggleSecondAddress}
        updateAddress={updateAddress}
        addUnit={addUnit}
        removeUnit={removeUnit}
        updateUnit={updateUnit}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  )
}

export default BuildingsStep
