'use client'

import Link from 'next/link'

const NewProperty = () => (
  <div className="max-w-lg">
    <div className="mb-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
        ← Back to dashboard
      </Link>
      <h1 className="text-xl font-semibold text-gray-900 mt-3">Add Property</h1>
    </div>
    <p className="text-sm text-gray-500">Property creation flow — coming soon.</p>
  </div>
)

export default NewProperty
