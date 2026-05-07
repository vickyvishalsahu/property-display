import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepReview } from '@/domains/propertyCreation/components/StepReview'
import { MOCK_MANAGERS, MOCK_ACCOUNTANTS } from '@/domains/shared/mock/staff'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const baseUnit = {
  id: 'unit-1',
  number: '1',
  type: 'apartment' as const,
  floor: '1',
  entrance: 'A',
  size: '68',
  rooms: '2',
  constructionYear: '1990',
  coOwnershipShare: '85.5',
}

const baseBuilding = {
  id: 'bld-1',
  addresses: [
    { streetName: 'Togostraße', streetNumber: '75', postalCode: '13351', city: 'Berlin' },
    null,
  ] as [{ streetName: string; streetNumber: string; postalCode: string; city: string }, null],
  units: [baseUnit],
}

const wegForm: FormState = {
  managementType: 'WEG',
  name: 'Test WEG Property',
  managerId: MOCK_MANAGERS[0].id,
  accountantId: MOCK_ACCOUNTANTS[0].id,
  buildings: [baseBuilding],
}

const mvForm: FormState = {
  ...wegForm,
  managementType: 'MV',
  name: 'Test MV Property',
}

const renderReview = (form: FormState) => {
  const onBack = vi.fn()
  const onSubmit = vi.fn()
  render(<StepReview form={form} onBack={onBack} onSubmit={onSubmit} />)
  return { onBack, onSubmit }
}

describe('StepReview', () => {
  describe('property summary', () => {
    it('shows the property name', () => {
      renderReview(wegForm)
      expect(screen.getByText('Test WEG Property')).toBeInTheDocument()
    })

    it('resolves and shows the manager name', () => {
      renderReview(wegForm)
      expect(screen.getByText(MOCK_MANAGERS[0].name)).toBeInTheDocument()
    })

    it('resolves and shows the accountant name', () => {
      renderReview(wegForm)
      expect(screen.getByText(MOCK_ACCOUNTANTS[0].name)).toBeInTheDocument()
    })
  })

  describe('WEG co-ownership share', () => {
    it('shows MEA value for WEG properties', () => {
      renderReview(wegForm)
      expect(screen.getByText(/85.5 MEA/)).toBeInTheDocument()
    })

    it('hides MEA value for MV properties', () => {
      renderReview(mvForm)
      expect(screen.queryByText(/MEA/)).not.toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onBack when Back is clicked', async () => {
      const { onBack } = renderReview(wegForm)
      await userEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(onBack).toHaveBeenCalledOnce()
    })

    it('calls onSubmit when Create Property is clicked', async () => {
      const { onSubmit } = renderReview(wegForm)
      await userEvent.click(screen.getByRole('button', { name: /create property/i }))
      expect(onSubmit).toHaveBeenCalledOnce()
    })
  })
})
