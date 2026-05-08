'use client'

import { useState } from 'react'
import { MOCK_MANAGERS, MOCK_ACCOUNTANTS } from '@/domains/shared/mock/staff'
import { HelpSection } from '@/domains/shared/components/HelpSection'
import { getPropertyStepState } from '@/domains/propertyCreation/utils/stepCompletion'
import type { FormState } from '@/domains/propertyCreation/types/form'

type Props = {
  form: FormState
  setName: (name: string) => void
  setManagerId: (id: string) => void
  setAccountantId: (id: string) => void
  onBack?: () => void
  onNext: () => void
}

const baseInputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2'

const fieldClass = (hasError: boolean) =>
  `${baseInputClass} ${hasError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-900'}`

const renderFieldError = (message = 'Required') => (
  <p className="text-xs text-red-500 mt-1">{message}</p>
)

export const StepProperty = ({
  form,
  setName,
  setManagerId,
  setAccountantId,
  onBack,
  onNext,
}: Props) => {
  const [submitted, setSubmitted] = useState(false)

  const canProceed = getPropertyStepState(form) === 'complete'

  const nameError = submitted && form.name.trim() === ''
  const managerError = submitted && form.managerId === ''
  const accountantError = submitted && form.accountantId === ''

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canProceed) {
      setSubmitted(true)
      return
    }
    onNext()
  }

  const renderManagementTypeInfo = () => (
    <p className="text-xs text-gray-400">
      Management type: <span className="text-gray-500 font-medium">{form.managementType}</span>
    </p>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {renderManagementTypeInfo()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Property name</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Togostraße Eigentümergemeinschaft"
          className={fieldClass(nameError)}
        />
        {nameError && renderFieldError()}
      </div>

      <HelpSection label="Administration" termId="administration">
        <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Manager</label>
            <select
              value={form.managerId}
              onChange={(event) => setManagerId(event.target.value)}
              className={fieldClass(managerError)}
            >
              <option value="">Select manager</option>
              {MOCK_MANAGERS.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            {managerError && renderFieldError()}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Accountant</label>
            <select
              value={form.accountantId}
              onChange={(event) => setAccountantId(event.target.value)}
              className={fieldClass(accountantError)}
            >
              <option value="">Select accountant</option>
              {MOCK_ACCOUNTANTS.map((accountant) => (
                <option key={accountant.id} value={accountant.id}>
                  {accountant.name}
                </option>
              ))}
            </select>
            {accountantError && renderFieldError()}
          </div>
        </div>
      </HelpSection>

      <div className="flex justify-between items-center pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
        )}
        <button
          type="submit"
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ml-auto"
        >
          Next
        </button>
      </div>
    </form>
  )
}
