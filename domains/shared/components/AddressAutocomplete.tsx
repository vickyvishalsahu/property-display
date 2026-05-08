'use client'

import { useAddressAutocomplete } from '@/domains/shared/hooks/useAddressAutocomplete'
import type { FormAddress } from '@/domains/propertyCreation/types/form'
import { ADDRESS_AUTOCOMPLETE } from '@/domains/shared/constants/strings'

type Props = {
  address: FormAddress
  onSelect: (address: FormAddress) => void
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900'

export const AddressAutocomplete = ({ address, onSelect }: Props) => {
  const {
    query,
    predictions,
    isLoading,
    isOpen,
    showNumberHint,
    containerRef,
    inputRef,
    attributionRef,
    handleInputChange,
    handleSelect,
    handleFocus,
  } = useAddressAutocomplete(address, onSelect)

  const renderHint = () => {
    if (!showNumberHint) return null
    return (
      <p className="text-xs text-amber-600 mt-1.5">
        {ADDRESS_AUTOCOMPLETE.noHouseNumberHint}
      </p>
    )
  }

  const renderDropdown = () => {
    if (!isOpen) return null

    if (isLoading) {
      return (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md py-2 px-3">
          <p className="text-sm text-gray-400">{ADDRESS_AUTOCOMPLETE.searching}</p>
        </div>
      )
    }

    if (!predictions.length) return null

    return (
      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {predictions.map((prediction) => (
          <li key={prediction.place_id}>
            <button
              type="button"
              onClick={() => handleSelect(prediction)}
              className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              {prediction.description}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={ADDRESS_AUTOCOMPLETE.placeholder}
        className={inputClass}
        autoComplete="off"
      />
      {renderDropdown()}
      {renderHint()}
      <div ref={attributionRef} className="hidden" />
    </div>
  )
}
