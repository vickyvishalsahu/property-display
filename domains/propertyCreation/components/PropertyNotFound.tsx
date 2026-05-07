'use client'

import Link from 'next/link'

export const PropertyNotFound = () => {
  const renderMessage = () => (
    <p className="text-sm text-gray-500 max-w-xs">
      This property does not exist or may have been removed.
    </p>
  )

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Property not found</h2>
      {renderMessage()}
      <Link
        href="/"
        className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Back to properties
      </Link>
    </div>
  )
}
