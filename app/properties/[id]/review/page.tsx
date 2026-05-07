'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepReview } from '@/domains/propertyCreation/components/StepReview'
import { PropertyNotFound } from '@/domains/propertyCreation/components/PropertyNotFound'

const ReviewStep = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const { form, isLoading, isPropertyNotFound, submit } = usePropertyForm(propertyId)

  const handleBack = () => {
    router.push(`/properties/${propertyId}/buildings`)
  }

  const renderLoading = () => null

  const renderNotFound = () => <PropertyNotFound />

  const renderForm = () => (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
      <PropertyStepper activeStep={2} />
      <StepReview form={form} onBack={handleBack} onSubmit={submit} />
    </div>
  )

  if (isLoading) return renderLoading()
  if (isPropertyNotFound) return renderNotFound()
  return renderForm()
}

export default ReviewStep
