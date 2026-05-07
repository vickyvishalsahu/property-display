'use client'

import type { ManagementType } from '@/types/property'
import { MOCK_MANAGERS, MOCK_ACCOUNTANTS } from '@/mock/staff'
import { HelpTrigger } from '@/components/HelpTrigger'
import type { FormState } from '@/hooks/usePropertyForm'

type Props = {
  form: FormState
  setManagementType: (managementType: ManagementType) => void
  setName: (name: string) => void
  setManagerId: (id: string) => void
  setAccountantId: (id: string) => void
  onNext: () => void
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900'

export const StepProperty = ({
  form,
  setManagementType,
  setName,
  setManagerId,
  setAccountantId,
  onNext,
}: Props) => {
  const canProceed =
    !!form.managementType &&
    form.name.trim() !== '' &&
    form.managerId !== '' &&
    form.accountantId !== ''

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (canProceed) onNext()
  }

  const renderTypeToggle = () => (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="text-sm font-medium text-gray-700">Management type</label>
        <HelpTrigger termId="weg" />
      </div>
      <div className="flex gap-3">
        {(['WEG', 'MV'] as ManagementType[]).map((managementType) => {
          const isSelected = form.managementType === managementType
          const buttonClass = isSelected
            ? 'bg-gray-900 text-white border-gray-900'
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
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {renderTypeToggle()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Property name</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="e.g. Togostraße Eigentümergemeinschaft"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Manager</label>
        <select
          value={form.managerId}
          onChange={(event) => setManagerId(event.target.value)}
          required
          className={inputClass}
        >
          <option value="">Select manager</option>
          {MOCK_MANAGERS.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Accountant</label>
        <select
          value={form.accountantId}
          onChange={(event) => setAccountantId(event.target.value)}
          required
          className={inputClass}
        >
          <option value="">Select accountant</option>
          {MOCK_ACCOUNTANTS.map((accountant) => (
            <option key={accountant.id} value={accountant.id}>
              {accountant.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!canProceed}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </form>
  )
}
