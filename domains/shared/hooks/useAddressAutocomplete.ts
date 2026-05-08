'use client'

import { useState, useEffect, useRef } from 'react'
import { usePlaces, getAddressObject } from '@/domains/shared/hooks/usePlaces'
import type { FormAddress } from '@/domains/propertyCreation/types/form'

type Prediction = {
  description: string
  place_id: string
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

export const useAddressAutocomplete = (address: FormAddress, onSelect: (address: FormAddress) => void) => {
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

  return {
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
  }
}
