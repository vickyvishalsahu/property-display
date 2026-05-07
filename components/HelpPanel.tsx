'use client'

import { useEffect } from 'react'
import { useHelpPanel } from '@/context/HelpPanelContext'
import { HELP_CONTENT } from '@/constants/helpContent'

export const HelpPanel = () => {
  const { activeTerm, closePanel } = useHelpPanel()

  const isOpen = activeTerm !== null
  const content = activeTerm ? HELP_CONTENT[activeTerm] : null

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closePanel])

  const renderContent = () => {
    if (!content) return null
    return (
      <>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">{content.title}</h2>
          <button
            onClick={closePanel}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{content.body}</p>
      </>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 z-50 p-6 shadow-lg transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {renderContent()}
      </div>
    </>
  )
}
