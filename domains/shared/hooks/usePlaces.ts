'use client'

import { useCallback, useRef } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import type { FormAddress } from '@/domains/propertyCreation/hooks/usePropertyForm'

const fieldMap = {
  streetName: ['street_address', 'route'],
  streetNumber: ['street_number'],
  postalCode: ['postal_code'],
  city: ['locality'],
} as const

export const getAddressObject = (place: google.maps.places.PlaceResult): FormAddress | null => {
  if (!place?.address_components) return null

  const address: FormAddress = { streetName: '', streetNumber: '', postalCode: '', city: '' }

  place.address_components.forEach((component) => {
    for (const field in fieldMap) {
      const key = field as keyof typeof fieldMap
      if (fieldMap[key].some((type) => component.types.includes(type))) {
        address[key] = component.long_name
      }
    }
  })

  return address
}

export const usePlaces = () => {
  const places = useMapsLibrary('places')
  const attributionRef = useRef<HTMLDivElement | null>(null)

  const fetchPredictions = useCallback(
    async (query: string): Promise<google.maps.places.AutocompletePrediction[]> => {
      if (!query || !places) return []
      const sessionToken = new places.AutocompleteSessionToken()
      const service = new places.AutocompleteService()
      const response = await service.getPlacePredictions({
        input: query,
        componentRestrictions: { country: 'de' },
        types: ['address'],
        sessionToken,
      })
      return response.predictions
    },
    [places]
  )

  const fetchAddressDetails = useCallback(
    (placeId: string): Promise<google.maps.places.PlaceResult | null> =>
      new Promise((resolve, reject) => {
        if (!places || !attributionRef.current) { resolve(null); return }
        const service = new places.PlacesService(attributionRef.current)
        service.getDetails({ placeId }, (result, status) => {
          if (status === 'OK') resolve(result)
          else reject(status)
        })
      }),
    [places]
  )

  return { fetchPredictions, fetchAddressDetails, attributionRef }
}
