'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepBuildings } from '@/domains/propertyCreation/components/StepBuildings'
import { PropertyNotFound } from '@/domains/propertyCreation/components/PropertyNotFound'

const BuildingsStep = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const {
    form,
    isLoading,
    isPropertyNotFound,
    addBuilding,
    removeBuilding,
    toggleSecondAddress,
    setAddress,
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

  const renderLoading = () => null

  const renderNotFound = () => <PropertyNotFound />

  const renderForm = () => (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
      <PropertyStepper activeStep={1} />
      <StepBuildings
        managementType={form.managementType ?? 'MV'}
        buildings={form.buildings}
        addBuilding={addBuilding}
        removeBuilding={removeBuilding}
        toggleSecondAddress={toggleSecondAddress}
        setAddress={setAddress}
        addUnit={addUnit}
        removeUnit={removeUnit}
        updateUnit={updateUnit}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  )

  if (isLoading) return renderLoading()
  if (isPropertyNotFound) return renderNotFound()
  return renderForm()
}

export default BuildingsStep
