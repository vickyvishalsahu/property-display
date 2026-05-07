import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BuildingForm } from '@/domains/propertyCreation/components/BuildingForm'
import type { FormBuilding } from '@/domains/propertyCreation/hooks/usePropertyForm'

const emptyAddress = () => ({
  streetName: '',
  streetNumber: '',
  postalCode: '',
  city: '',
})

const emptyUnit = (id = 'unit-1') => ({
  id,
  number: '',
  type: '' as const,
  floor: '',
  entrance: '',
  size: '',
  rooms: '',
  constructionYear: '',
  coOwnershipShare: '',
})

const baseBuilding: FormBuilding = {
  id: 'bld-1',
  addresses: [emptyAddress(), null],
  units: [emptyUnit()],
}

const defaultProps = {
  building: baseBuilding,
  buildingIndex: 0,
  isWEG: false,
  canRemove: false,
  onRemove: vi.fn(),
  onToggleSecondAddress: vi.fn(),
  onUpdateAddress: vi.fn(),
  onAddUnit: vi.fn(),
  onRemoveUnit: vi.fn(),
  onUpdateUnit: vi.fn(),
}

describe('BuildingForm', () => {
  describe('co-ownership share field', () => {
    it('renders co-ownership share field for WEG', () => {
      render(<BuildingForm {...defaultProps} isWEG={true} />)
      expect(screen.getByText('Co-own. share')).toBeInTheDocument()
    })

    it('hides co-ownership share field for MV', () => {
      render(<BuildingForm {...defaultProps} isWEG={false} />)
      expect(screen.queryByText('Co-own. share')).not.toBeInTheDocument()
    })
  })

  describe('remove building button', () => {
    it('shows Remove building when canRemove is true', () => {
      render(<BuildingForm {...defaultProps} canRemove={true} />)
      expect(screen.getByRole('button', { name: /remove building/i })).toBeInTheDocument()
    })

    it('hides Remove building when canRemove is false', () => {
      render(<BuildingForm {...defaultProps} canRemove={false} />)
      expect(screen.queryByRole('button', { name: /remove building/i })).not.toBeInTheDocument()
    })

    it('calls onRemove when clicked', async () => {
      const onRemove = vi.fn()
      render(<BuildingForm {...defaultProps} canRemove={true} onRemove={onRemove} />)
      await userEvent.click(screen.getByRole('button', { name: /remove building/i }))
      expect(onRemove).toHaveBeenCalledOnce()
    })
  })

  describe('second address toggle', () => {
    it('shows add second address button when no second address', () => {
      render(<BuildingForm {...defaultProps} />)
      expect(screen.getByRole('button', { name: /add second address/i })).toBeInTheDocument()
    })

    it('calls onToggleSecondAddress when toggle button is clicked', async () => {
      const onToggleSecondAddress = vi.fn()
      render(<BuildingForm {...defaultProps} onToggleSecondAddress={onToggleSecondAddress} />)
      await userEvent.click(screen.getByRole('button', { name: /add second address/i }))
      expect(onToggleSecondAddress).toHaveBeenCalledOnce()
    })

    it('shows Remove button and second address fields when second address exists', () => {
      const buildingWithSecondAddress: FormBuilding = {
        ...baseBuilding,
        addresses: [emptyAddress(), emptyAddress()],
      }
      render(<BuildingForm {...defaultProps} building={buildingWithSecondAddress} />)
      expect(screen.getByText('Address 2')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^remove$/i })).toBeInTheDocument()
    })
  })

  describe('unit management', () => {
    it('calls onAddUnit when Add unit is clicked', async () => {
      const onAddUnit = vi.fn()
      render(<BuildingForm {...defaultProps} onAddUnit={onAddUnit} />)
      await userEvent.click(screen.getByRole('button', { name: /add unit/i }))
      expect(onAddUnit).toHaveBeenCalledOnce()
    })

    it('hides Remove unit button when only one unit', () => {
      render(<BuildingForm {...defaultProps} />)
      expect(screen.queryByRole('button', { name: /^remove$/i })).not.toBeInTheDocument()
    })

    it('shows Remove unit button when multiple units', () => {
      const buildingWithTwoUnits: FormBuilding = {
        ...baseBuilding,
        units: [emptyUnit('u1'), emptyUnit('u2')],
      }
      render(<BuildingForm {...defaultProps} building={buildingWithTwoUnits} />)
      expect(screen.getAllByRole('button', { name: /^remove$/i })).toHaveLength(2)
    })
  })
})
