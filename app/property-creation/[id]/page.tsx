'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { PropertyNotFound } from '@/domains/propertyCreation/components/PropertyNotFound'

const EditProperty = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const {
    form,
    isLoading,
    isPropertyNotFound,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
  } = usePropertyForm(propertyId)

  const handleNext = () => {
    router.push(`/property-creation/${propertyId}/buildings`)
  }

  const renderLoading = () => null

  const renderNotFound = () => <PropertyNotFound />

  const renderForm = () => (
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

  if (isLoading) return renderLoading()
  if (isPropertyNotFound) return renderNotFound()
  return renderForm()
}

export default EditProperty
