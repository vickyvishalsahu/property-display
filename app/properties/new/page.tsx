'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePropertyForm } from '@/domains/propertyCreation/hooks/usePropertyForm'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { StepBuildings } from '@/domains/propertyCreation/components/StepBuildings'
import { StepReview } from '@/domains/propertyCreation/components/StepReview'
import { DraftBanner } from '@/domains/propertyCreation/components/DraftBanner'

const STEPS = ['Property', 'Buildings', 'Review']

const NewPropertyContent = () => {
  const searchParams = useSearchParams()
  const initialDraftId = searchParams.get('draft') ?? undefined

  const [currentStep, setCurrentStep] = useState(0)
  const {
    form,
    setManagementType,
    setName,
    setManagerId,
    setAccountantId,
    addBuilding,
    removeBuilding,
    toggleSecondAddress,
    updateAddress,
    addUnit,
    removeUnit,
    updateUnit,
    submit,
    pendingDrafts,
    activateDraft,
    restoreDraft,
    discardDraft,
  } = usePropertyForm(initialDraftId)

  const goNext = () => setCurrentStep((previousStep) => Math.min(previousStep + 1, STEPS.length - 1))
  const goBack = () => setCurrentStep((previousStep) => Math.max(previousStep - 1, 0))

  const handlePropertyStepNext = () => {
    activateDraft()
    goNext()
  }

  const renderStepper = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((stepLabel, stepIndex) => {
        const isActive = stepIndex === currentStep
        const isComplete = stepIndex < currentStep
        const dotClass =
          isComplete || isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
        const labelClass = isActive ? 'font-semibold text-gray-900' : 'text-gray-400'
        const showSeparator = stepIndex < STEPS.length - 1

        return (
          <div key={stepLabel} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${dotClass}`}
            >
              {stepIndex + 1}
            </div>
            <span className={`text-sm ${labelClass}`}>{stepLabel}</span>
            {showSeparator && <span className="text-gray-300 mx-1">—</span>}
          </div>
        )
      })}
    </div>
  )

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <StepProperty
          form={form}
          setManagementType={setManagementType}
          setName={setName}
          setManagerId={setManagerId}
          setAccountantId={setAccountantId}
          onNext={handlePropertyStepNext}
        />
      )
    }

    if (currentStep === 1) {
      return (
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
          onBack={goBack}
          onNext={goNext}
        />
      )
    }

    return <StepReview form={form} onBack={goBack} onSubmit={submit} />
  }

  const renderDraftBanner = () => {
    if (pendingDrafts.length === 0) return null
    const newestDraft = [...pendingDrafts].sort((draftA, draftB) => draftB.savedAt - draftA.savedAt)[0]
    return (
      <DraftBanner
        draft={newestDraft}
        totalDrafts={pendingDrafts.length}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
      />
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Add Property</h1>
      {renderDraftBanner()}
      {renderStepper()}
      {renderStep()}
    </div>
  )
}

const NewProperty = () => (
  <Suspense>
    <NewPropertyContent />
  </Suspense>
)

export default NewProperty
