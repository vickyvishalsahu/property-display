'use client'

import Link from 'next/link'
import type { Property } from '@/domains/shared/types/property'
import { MANAGEMENT_TYPE_LABELS } from '@/domains/shared/constants/propertyTypes'

type Props = {
  draft: Property
  onDiscard: (id: string) => void
}

export const DraftCard = ({ draft, onDiscard }: Props) => {
  const displayName = draft.name || 'Untitled draft'
  const managementLabel = MANAGEMENT_TYPE_LABELS[draft.managementType]

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-amber-600 font-mono">{managementLabel}</span>
          <h2 className="font-semibold text-gray-900 text-base leading-snug">{displayName}</h2>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
          Draft
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-amber-200">
        <Link
          href={`/properties/new?draft=${draft.id}`}
          className="text-sm font-medium text-amber-900 hover:text-amber-700"
        >
          Continue →
        </Link>
        <button
          type="button"
          onClick={() => onDiscard(draft.id)}
          className="text-xs text-amber-600 hover:text-amber-900"
        >
          Discard
        </button>
      </div>
    </div>
  )
}
