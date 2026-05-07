'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'

const NewProperty = () => {
  const router = useRouter()
  const {
    form,
    propertyId,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    activateDraft,
  } = usePropertyForm()

  useEffect(() => {
    if (propertyId) router.push(`/properties/${propertyId}/buildings`)
  }, [propertyId])

  const handleNext = () => {
    activateDraft()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Add Property</h1>
      <PropertyStepper activeStep={0} />
      <StepProperty
        form={form}
        setManagementType={setManagementType}
        setName={setName}
        setManagerId={setManagerId}
        setAccountantId={setAccountantId}
        onNext={handleNext}
      />
    </div>
  )
}

export default NewProperty
