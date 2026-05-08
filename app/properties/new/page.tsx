'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { formFromImport } from '@/domains/propertyCreation/hooks/formFromImport'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { PdfImport } from '@/domains/extraction/components/PdfImport'
import type { PropertyImport } from '@/domains/shared/types/propertyImport'
import type { FormState } from '@/domains/propertyCreation/types/form'

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

type PropertyFormStepProps = {
  importOverrides?: Partial<FormState>
}

const PropertyFormStep = ({ importOverrides }: PropertyFormStepProps) => {
  const router = useRouter()

  const {
    form,
    propertyId,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    activateDraft,
  } = usePropertyForm(undefined, importOverrides)

  useEffect(() => {
    if (propertyId) router.push(`/properties/${propertyId}/buildings`)
  }, [propertyId])

  return (
    <>
      <PropertyStepper activeStep={0} />
      <StepProperty
        form={form}
        setManagementType={setManagementType}
        setName={setName}
        setManagerId={setManagerId}
        setAccountantId={setAccountantId}
        onNext={activateDraft}
      />
    </>
  )
}

type MethodSelectProps = {
  onManual: () => void
  onImport: (propertyImport: PropertyImport) => void
}

const MethodSelect = ({ onManual, onImport }: MethodSelectProps) => (
  <div className="flex flex-col gap-4">
    <div
      onClick={onManual}
      className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <p className="text-sm font-semibold text-gray-900">Enter manually</p>
      <p className="text-sm text-gray-500">Fill in the property details step by step.</p>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-900">Import from PDF</p>
        <p className="text-sm text-gray-500">
          Upload a property document and we'll extract what we can. You'll review and complete the rest.
        </p>
      </div>
      <PdfImport onSuccess={onImport} />
    </div>
  </div>
)

const NewProperty = () => {
  const searchParams = useSearchParams()
  const importKey = searchParams.get('import')

  const [mode, setMode] = useState<'select' | 'form'>(importKey ? 'form' : 'select')
  const [importOverrides, setImportOverrides] = useState<Partial<FormState> | undefined>(
    () => resolveImportOverrides(importKey)
  )

  const handleManual = () => setMode('form')

  const handleImport = (propertyImport: PropertyImport) => {
    setImportOverrides(formFromImport(propertyImport))
    setMode('form')
  }

  const renderContent = () => {
    if (mode === 'form') return <PropertyFormStep importOverrides={importOverrides} />
    return <MethodSelect onManual={handleManual} onImport={handleImport} />
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Add Property</h1>
      {renderContent()}
    </div>
  )
}

const NewPropertyPage = () => (
  <Suspense>
    <NewProperty />
  </Suspense>
)

export default NewPropertyPage
