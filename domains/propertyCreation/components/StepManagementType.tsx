'use client'

import Image from 'next/image'
import type { ManagementType } from '@/domains/shared/types/property'
import { STEP_MANAGEMENT_TYPE } from '@/domains/propertyCreation/constants/strings'

type Props = {
  selected: ManagementType | null
  onSelect: (managementType: ManagementType) => void
  onBack: () => void
}

type TypeOption = {
  type: ManagementType
  title: string
  description: string
  image: string
}

const TYPES: TypeOption[] = [
  {
    type: 'WEG',
    title: 'WEG Properties',
    description:
      'Communities of owners who share responsibility for common areas. Legally complex, with voting and joint decisions.',
    image: '/WEG.png',
  },
  {
    type: 'MV',
    title: 'MV Properties',
    description:
      'Rental properties managed for landlords. Focused on tenant contracts, rent collection, and maintenance.',
    image: '/MV.png',
  },
]

export const StepManagementType = ({ selected, onSelect, onBack }: Props) => {
  const renderCards = () =>
    TYPES.map((typeOption) => {
      const { type, title, description, image } = typeOption
      const isSelected = selected === type
      const cardClass = isSelected
        ? 'shadow-2xl scale-[1.03] opacity-100'
        : 'opacity-40 hover:opacity-65'

      return (
        <div
          key={type}
          onClick={() => onSelect(type)}
          className={`rounded-xl overflow-hidden cursor-pointer transition-all ${cardClass}`}
        >
          <div className="relative aspect-3/4">
            <Image src={image} alt={title} fill sizes="30vw" className="object-cover" />
          </div>
          <div className="py-2 px-4 flex flex-col gap-1">
            <p className="text-gray-900 font-semibold text-sm">{title}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
          </div>
        </div>
      )
    })

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 mb-4">{STEP_MANAGEMENT_TYPE.prompt}</p>
      <div className="grid grid-cols-2 gap-6">{renderCards()}</div>

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
