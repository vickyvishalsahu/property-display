'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { formFromImport } from '@/domains/propertyCreation/hooks/formFromImport'
import type { PropertyImport } from '@/domains/shared/types/propertyImport'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const resolveImportOverrides = (importKey: string | null): Partial<FormState> | undefined => {
  if (!importKey) return undefined
  try {
    const stored = sessionStorage.getItem(`property-import-${importKey}`)
    if (!stored) return undefined
    const propertyImport: PropertyImport = JSON.parse(stored)
    sessionStorage.removeItem(`property-import-${importKey}`)
    return formFromImport(propertyImport)
  } catch {
    return undefined
  }
}

const NewProperty = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const importKey = searchParams.get('import')
  const initialFormOverrides = resolveImportOverrides(importKey)

  const {
    form,
    propertyId,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    activateDraft,
  } = usePropertyForm(undefined, initialFormOverrides)

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

const NewPropertyPage = () => (
  <Suspense>
    <NewProperty />
  </Suspense>
)

export default NewPropertyPage
