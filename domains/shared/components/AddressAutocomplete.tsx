'use client'

import { useState, useEffect, useRef } from 'react'
import { usePlaces, getAddressObject } from '@/domains/shared/hooks/usePlaces'
import type { FormAddress } from '@/domains/propertyCreation/types/form'
import { ADDRESS_AUTOCOMPLETE } from '@/domains/shared/constants/strings'

type Prediction = {
  description: string
  place_id: string
}

type Props = {
  address: FormAddress
  onSelect: (address: FormAddress) => void
}

const formatAddress = (address: FormAddress): string => {
  const parts = [
    address.streetName && address.streetNumber
      ? `${address.streetName} ${address.streetNumber}`
      : address.streetName || address.streetNumber,
    address.postalCode && address.city
      ? `${address.postalCode} ${address.city}`
      : address.postalCode || address.city,
  ].filter(Boolean)
  return parts.join(', ')
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900'

export const AddressAutocomplete = ({ address, onSelect }: Props) => {
  const { fetchPredictions, fetchAddressDetails, attributionRef } = usePlaces()

  const [prevAddress, setPrevAddress] = useState(address)
  const [query, setQuery] = useState(() => formatAddress(address))
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showNumberHint, setShowNumberHint] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  if (
    address.streetName !== prevAddress.streetName ||
    address.streetNumber !== prevAddress.streetNumber ||
    address.postalCode !== prevAddress.postalCode ||
    address.city !== prevAddress.city
  ) {
    setPrevAddress(address)
    setQuery(formatAddress(address))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (showNumberHint) setShowNumberHint(false)
    setQuery(value)
    setIsOpen(true)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!value.trim()) {
      setPredictions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimer.current = setTimeout(async () => {
      const results = await fetchPredictions(value)
      setPredictions(results)
      setIsLoading(false)
    }, 300)
  }

  const handleSelect = async (prediction: Prediction) => {
    setIsOpen(false)
    setQuery(prediction.description)
    setPredictions([])

    const placeResult = await fetchAddressDetails(prediction.place_id)
    if (!placeResult) return

    const parsed = getAddressObject(placeResult)
    if (!parsed) return

    if (!parsed.streetNumber) {
      setQuery(parsed.streetName + ' ')
      setShowNumberHint(true)
      inputRef.current?.focus()
      return
    }

    setShowNumberHint(false)
    onSelect(parsed)
  }

  const handleFocus = () => {
    if (predictions.length > 0) setIsOpen(true)
  }

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
