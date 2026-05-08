'use client'

import { useState } from 'react'
import type { ManagementType } from '@/domains/shared/types/property'
import { MOCK_MANAGERS, MOCK_ACCOUNTANTS } from '@/domains/shared/mock/staff'
import { HelpSection } from '@/domains/shared/components/HelpSection'
import type { FormState } from '@/domains/propertyCreation/types/form'

type Props = {
  form: FormState
  setManagementType: (managementType: ManagementType) => void
  setName: (name: string) => void
  setManagerId: (id: string) => void
  setAccountantId: (id: string) => void
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
  setManagementType,
  setName,
  setManagerId,
  setAccountantId,
  onNext,
}: Props) => {
  const [submitted, setSubmitted] = useState(false)

  const canProceed =
    !!form.managementType &&
    form.name.trim() !== '' &&
    form.managerId !== '' &&
    form.accountantId !== ''

  const typeError = submitted && !form.managementType
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

  const renderTypeToggle = () => (
    <HelpSection label="Management type" termId="management-type">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-3">
          {(['WEG', 'MV'] as ManagementType[]).map((managementType) => {
            const isSelected = form.managementType === managementType
            const buttonClass = isSelected
              ? 'bg-gray-900 text-white border-gray-900'
              : typeError
                ? 'bg-white text-gray-700 border-red-300 hover:border-red-400'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'

            return (
              <button
                key={managementType}
                type="button"
                onClick={() => setManagementType(managementType)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${buttonClass}`}
              >
                {managementType}
              </button>
            )
          })}
        </div>
        {typeError && renderFieldError('Select a management type to continue')}
      </div>
    </HelpSection>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {renderTypeToggle()}

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

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  )
}
