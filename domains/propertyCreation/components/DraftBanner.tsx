'use client'

import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

type Props = {
  pendingDraft: FormState
  onRestore: () => void
  onDiscard: () => void
}

export const DraftBanner = ({ pendingDraft, onRestore, onDiscard }: Props) => (
  <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
    <p className="text-sm text-amber-900">
      You have an unfinished property:{' '}
      <span className="font-semibold">&ldquo;{pendingDraft.name}&rdquo;</span>
    </p>
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onDiscard}
        className="text-sm text-amber-700 hover:text-amber-900"
      >
        Start fresh
      </button>
      <button
        type="button"
        onClick={onRestore}
        className="text-sm bg-amber-900 text-white px-4 py-1.5 rounded-lg hover:bg-amber-800 transition-colors"
      >
        Continue draft
      </button>
    </div>
  </div>
)
