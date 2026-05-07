'use client'

import { useState, useEffect } from 'react'
import { useDraft } from '@/domains/propertyCreation/hooks/useDraft'
import type { DraftEntry } from '@/domains/propertyCreation/hooks/useDraft'

export const useDraftList = () => {
  const [drafts, setDrafts] = useState<DraftEntry[]>([])
  const { readDrafts, clearDraft } = useDraft()

  useEffect(() => {
    setDrafts(readDrafts())
  }, [])

  const discardDraft = (id: string) => {
    clearDraft(id)
    setDrafts((previous) => previous.filter((draft) => draft.id !== id))
  }

  return { drafts, discardDraft }
}
