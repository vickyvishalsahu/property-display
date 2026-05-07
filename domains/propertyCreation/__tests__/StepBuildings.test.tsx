import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepBuildings } from '@/domains/propertyCreation/components/StepBuildings'
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

const makeBuilding = (id: string): FormBuilding => ({
  id,
  addresses: [emptyAddress(), null],
  units: [emptyUnit()],
})

vi.mock('@vis.gl/react-google-maps', () => ({
  useMapsLibrary: () => null,
}))

const defaultProps = {
  managementType: 'MV' as const,
  buildings: [makeBuilding('bld-1')],
  addBuilding: vi.fn(),
  removeBuilding: vi.fn(),
  toggleSecondAddress: vi.fn(),
  setAddress: vi.fn(),
  addUnit: vi.fn(),
  removeUnit: vi.fn(),
  updateUnit: vi.fn(),
  onBack: vi.fn(),
  onNext: vi.fn(),
}

describe('StepBuildings', () => {
  it('renders one BuildingForm per building', () => {
    render(<StepBuildings {...defaultProps} buildings={[makeBuilding('b1'), makeBuilding('b2')]} />)
    expect(screen.getAllByText(/^Building \d/)).toHaveLength(2)
  })

  it('calls addBuilding when Add building is clicked', async () => {
    const addBuilding = vi.fn()
    render(<StepBuildings {...defaultProps} addBuilding={addBuilding} />)
    await userEvent.click(screen.getByRole('button', { name: /add building/i }))
    expect(addBuilding).toHaveBeenCalledOnce()
  })

  it('renders Back and Next buttons', () => {
    render(<StepBuildings {...defaultProps} />)
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('calls onBack when Back is clicked', async () => {
    const onBack = vi.fn()
    render(<StepBuildings {...defaultProps} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
