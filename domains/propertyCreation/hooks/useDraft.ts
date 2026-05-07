import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const DRAFT_KEY = 'buena_property_draft'

export const useDraft = () => {
  const readDraft = (): FormState | null => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      return stored ? (JSON.parse(stored) as FormState) : null
    } catch {
      return null
    }
  }

  const saveDraft = (form: FormState): void => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      // localStorage unavailable (sandboxed iframe, storage quota exceeded)
    }
  }

  const clearDraft = (): void => {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // localStorage unavailable
    }
  }

  return { readDraft, saveDraft, clearDraft }
}
