'use client'

import type { ManagementType } from '@/domains/shared/types/property'
import { HelpSection } from '@/domains/shared/components/HelpSection'
import { STEP_MANAGEMENT_TYPE } from '@/domains/propertyCreation/constants/strings'

type Props = {
  selected: ManagementType | null
  onSelect: (managementType: ManagementType) => void
  onBack: () => void
}

const TYPES: { type: ManagementType; title: string; subtitle: string; description: string }[] = [
  {
    type: 'WEG',
    title: 'WEG',
    subtitle: 'Wohnungseigentümergemeinschaft',
    description:
      'Co-ownership structure. Multiple owners each hold a unit and share common areas. Each unit carries a co-ownership share (MEA) used for cost allocation.',
  },
  {
    type: 'MV',
    title: 'MV',
    subtitle: 'Mietverwaltung',
    description:
      'Rental management on behalf of an owner. No shared ownership, no co-ownership shares.',
  },
]

export const StepManagementType = ({ selected, onSelect, onBack }: Props) => {
  const renderCards = () =>
    TYPES.map(({ type, title, subtitle, description }) => {
      const isSelected = selected === type
      const cardClass = isSelected
        ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
        : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'

      return (
        <div
          key={type}
          onClick={() => onSelect(type)}
          className={`rounded-xl border p-6 flex flex-col gap-1.5 cursor-pointer transition-all ${cardClass}`}
        >
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </span>
            <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
              {subtitle}
            </span>
          </div>
          <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      )
    })

  return (
    <div className="flex flex-col gap-6">
      <HelpSection label={STEP_MANAGEMENT_TYPE.sectionLabel} termId="management-type">
        <div className="flex flex-col gap-3">{renderCards()}</div>
      </HelpSection>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 text-left"
      >
        {STEP_MANAGEMENT_TYPE.backButton}
      </button>
    </div>
  )
}
