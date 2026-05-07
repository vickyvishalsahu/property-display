'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'

const EditProperty = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const {
    form,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
  } = usePropertyForm(propertyId)

  const handleNext = () => {
    router.push(`/properties/${propertyId}/buildings`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
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

export default EditProperty
