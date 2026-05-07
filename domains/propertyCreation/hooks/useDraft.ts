import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

export type DraftEntry = {
  id: string
  savedAt: number
  form: FormState
}

const DRAFTS_KEY = 'buena_property_drafts'

export const useDraft = () => {
  const readDrafts = (): DraftEntry[] => {
    try {
      const stored = localStorage.getItem(DRAFTS_KEY)
      return stored ? (JSON.parse(stored) as DraftEntry[]) : []
    } catch {
      return []
    }
  }

  const saveDraft = (id: string, form: FormState): void => {
    try {
      const drafts = readDrafts()
      const existingIndex = drafts.findIndex((draft) => draft.id === id)
      const entry: DraftEntry = { id, savedAt: Date.now(), form }
      if (existingIndex >= 0) {
        drafts[existingIndex] = entry
      } else {
        drafts.push(entry)
      }
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
    } catch {
      // localStorage unavailable (sandboxed iframe, storage quota exceeded)
    }
  }

  const clearDraft = (id: string): void => {
    try {
      const drafts = readDrafts().filter((draft) => draft.id !== id)
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
    } catch {
      // localStorage unavailable
    }
  }

  const clearAllDrafts = (): void => {
    try {
      localStorage.removeItem(DRAFTS_KEY)
    } catch {
      // localStorage unavailable
    }
  }

  return { readDrafts, saveDraft, clearDraft, clearAllDrafts }
}
