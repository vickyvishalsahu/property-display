'use client'

import Link from 'next/link'
import type { DraftEntry } from '@/domains/propertyCreation/hooks/useDraft'

type Props = {
  draft: DraftEntry
  totalDrafts: number
  onRestore: (id: string) => void
  onDiscard: (id: string) => void
}

export const DraftBanner = ({ draft, totalDrafts, onRestore, onDiscard }: Props) => {
  const extraCount = totalDrafts - 1

  const renderExtraLink = () => {
    if (extraCount <= 0) return null
    return (
      <Link href="/" className="text-xs text-amber-700 hover:text-amber-900 underline">
        + {extraCount} more on dashboard
      </Link>
    )
  }

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-amber-900">
          You have an unfinished property:{' '}
          <span className="font-semibold">&ldquo;{draft.form.name}&rdquo;</span>
        </p>
        {renderExtraLink()}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => onDiscard(draft.id)}
          className="text-sm text-amber-700 hover:text-amber-900"
        >
          Start fresh
        </button>
        <button
          type="button"
          onClick={() => onRestore(draft.id)}
          className="text-sm bg-amber-900 text-white px-4 py-1.5 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Continue draft
        </button>
      </div>
    </div>
  )
}
