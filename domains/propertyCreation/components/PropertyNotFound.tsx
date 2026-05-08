'use client'

import Link from 'next/link'
import { PROPERTY_NOT_FOUND } from '@/domains/shared/constants/strings'

export const PropertyNotFound = () => {
  const renderMessage = () => (
    <p className="text-sm text-gray-500 max-w-xs">{PROPERTY_NOT_FOUND.description}</p>
  )

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <h2 className="text-lg font-semibold text-gray-900">{PROPERTY_NOT_FOUND.heading}</h2>
      {renderMessage()}
      <Link
        href="/"
        className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {PROPERTY_NOT_FOUND.backLink}
      </Link>
    </div>
  )
}
