'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { StepManagementType } from '@/domains/propertyCreation/components/StepManagementType'
import { PropertyNotFound } from '@/domains/propertyCreation/components/PropertyNotFound'
import type { ManagementType } from '@/domains/shared/types/property'

const EditProperty = () => {
  const params = useParams()
  const propertyId = params.id as string
  const router = useRouter()

  const [mode, setMode] = useState<'type' | 'form'>('form')

  const {
    form,
    isLoading,
    isPropertyNotFound,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    updateUnit,
  } = usePropertyForm(propertyId)

  const handleNext = () => {
    router.push(`/property-creation/${propertyId}/buildings`)
  }

  const handleTypeSelect = (managementType: ManagementType) => {
    if (managementType === form.managementType) {
      setMode('form')
      return
    }

    const message =
      managementType === 'MV'
        ? 'Switching to MV will clear co-ownership shares from all units. Continue?'
        : 'Switching to WEG will require you to add co-ownership shares for each unit. Continue?'

    if (!window.confirm(message)) return

    setManagementType(managementType)

    if (managementType === 'MV') {
      form.buildings.forEach((building) => {
        building.units.forEach((unit) => {
          updateUnit(building.id, unit.id, 'coOwnershipShare', '')
        })
      })
    }

    setMode('form')
  }

  const renderLoading = () => null

  const renderNotFound = () => <PropertyNotFound />

  const renderTypeStep = () => (
    <StepManagementType
      selected={form.managementType}
      onSelect={handleTypeSelect}
      onBack={() => router.back()}
    />
  )

  const renderForm = () => (
    <>
      <PropertyStepper activeStep={0} />
      <StepProperty
        form={form}
        setName={setName}
        setManagerId={setManagerId}
        setAccountantId={setAccountantId}
        onBack={() => setMode('type')}
        onNext={handleNext}
      />
    </>
  )

  if (isLoading) return renderLoading()
  if (isPropertyNotFound) return renderNotFound()
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit Property</h1>
      {mode === 'type' ? renderTypeStep() : renderForm()}
    </div>
  )
}

export default EditProperty
