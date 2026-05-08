import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PropertyStepper } from '@/domains/propertyCreation/components/PropertyStepper'

const getDot = (stepNumber: 1 | 2 | 3) => screen.getByText(String(stepNumber))

describe('PropertyStepper', () => {
  describe('dot backgrounds', () => {
    it('renders the active step with black bg', () => {
      render(<PropertyStepper activeStep={1} />)
      expect(getDot(2)).toHaveClass('bg-gray-900', 'text-white')
    })

    it('renders a past step with black bg', () => {
      render(<PropertyStepper activeStep={2} />)
      expect(getDot(1)).toHaveClass('bg-gray-900', 'text-white')
    })

    it('renders a future step with grey bg', () => {
      render(<PropertyStepper activeStep={0} />)
      expect(getDot(3)).toHaveClass('bg-gray-200')
    })
  })

  describe('step rings', () => {
    it('shows no ring when step state is empty', () => {
      render(<PropertyStepper activeStep={0} stepStates={['empty', 'empty', 'empty']} />)
      expect(getDot(1)).not.toHaveClass('ring-2')
      expect(getDot(1)).not.toHaveStyle({ outline: '2px dashed #22c55e' })
    })

    it('shows solid green ring when step state is complete', () => {
      render(<PropertyStepper activeStep={1} stepStates={['complete', 'empty', 'empty']} />)
      expect(getDot(1)).toHaveClass('ring-2', 'ring-green-500')
    })

    it('shows dashed green outline when step state is partial', () => {
      render(<PropertyStepper activeStep={1} stepStates={['partial', 'empty', 'empty']} />)
      expect(getDot(1)).toHaveStyle({ outline: '2px dashed #22c55e' })
    })

    it('applies rings independently per step', () => {
      render(<PropertyStepper activeStep={2} stepStates={['complete', 'partial', 'empty']} />)
      expect(getDot(1)).toHaveClass('ring-2', 'ring-green-500')
      expect(getDot(2)).toHaveStyle({ outline: '2px dashed #22c55e' })
      expect(getDot(3)).not.toHaveClass('ring-2')
    })

    it('defaults to no ring when stepStates is not provided', () => {
      render(<PropertyStepper activeStep={0} />)
      expect(getDot(1)).not.toHaveClass('ring-2')
    })
  })
})
