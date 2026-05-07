'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepReview } from '@/domains/propertyCreation/components/StepReview'

const ReviewStep = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const { form, submit } = usePropertyForm(propertyId)

  const handleBack = () => {
    router.push(`/properties/${propertyId}/buildings`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
      <PropertyStepper activeStep={2} />
      <StepReview form={form} onBack={handleBack} onSubmit={submit} />
    </div>
  )
}

export default ReviewStep
