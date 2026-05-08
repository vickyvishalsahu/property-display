'use client'

import { useRef } from 'react'
import { usePropertyExtraction } from '@/domains/extraction/hooks/usePropertyExtraction'
import type { PropertyImport } from '@/domains/shared/types/propertyImport'

const renderSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

type Props = {
  onSuccess?: (propertyImport: PropertyImport) => void
}

export const PdfImport = ({ onSuccess }: Props = {}) => {
  const { state, extract, reset } = usePropertyExtraction({ onSuccess })
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) extract(file)
    event.target.value = ''
  }

  const handleClick = () => inputRef.current?.click()

  const renderIdle = () => (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 hover:text-gray-700 transition-colors"
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
      Import from PDF
    </button>
  )

  const renderLoading = () => {
    const label = state.status === 'extracting' ? 'Reading PDF…' : 'Extracting property data…'
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
        {renderSpinner()}
        <span>{label}</span>
      </div>
    )
  }

  const renderError = () => {
    const message =
      state.status === 'error' && state.reason === 'pdf'
        ? 'Could not read this PDF. Make sure it contains selectable text and try again.'
        : 'Could not extract property data. Try again or add the property manually.'

    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-red-500">{message}</p>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-gray-500 underline hover:text-gray-700 text-left"
        >
          Try again
        </button>
      </div>
    )
  }

  const renderContent = () => {
    if (state.status === 'extracting' || state.status === 'calling') return renderLoading()
    if (state.status === 'error') return renderError()
    return renderIdle()
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
      {renderContent()}
    </>
  )
}
