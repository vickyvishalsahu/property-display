'use client'

import { useHelpPanel } from '@/domains/shared/context/HelpPanelContext'

type Props = {
  termId: string
}

export const HelpTrigger = ({ termId }: Props) => {
  const { openPanel } = useHelpPanel()

  return (
    <button
      type="button"
      onClick={() => openPanel(termId)}
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-xs hover:bg-gray-200 hover:text-gray-600 transition-colors"
      aria-label={`Learn about ${termId}`}
    >
      ?
    </button>
  )
}
