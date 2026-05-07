import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepProperty } from '@/domains/propertyCreation/components/StepProperty'
import { HelpPanelProvider } from '@/domains/shared/context/HelpPanelContext'
import { MOCK_MANAGERS, MOCK_ACCOUNTANTS } from '@/domains/shared/mock/staff'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const emptyForm: FormState = {
  managementType: null,
  name: '',
  managerId: '',
  accountantId: '',
  buildings: [],
}

const fullForm: FormState = {
  managementType: 'WEG',
  name: 'Test Property',
  managerId: MOCK_MANAGERS[0].id,
  accountantId: MOCK_ACCOUNTANTS[0].id,
  buildings: [],
}

const renderStep = (form: FormState, overrides: Partial<Parameters<typeof StepProperty>[0]> = {}) => {
  const props = {
    form,
    setManagementType: vi.fn(),
    setName: vi.fn(),
    setManagerId: vi.fn(),
    setAccountantId: vi.fn(),
    onNext: vi.fn(),
    ...overrides,
  }
  render(
    <HelpPanelProvider>
      <StepProperty {...props} />
    </HelpPanelProvider>
  )
  return props
}

describe('StepProperty', () => {
  describe('Next button gating', () => {
    it('is disabled when managementType is null', () => {
      renderStep(emptyForm)
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    it('is disabled when name is empty', () => {
      renderStep({ ...emptyForm, managementType: 'WEG' })
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    it('is disabled when managerId is missing', () => {
      renderStep({ ...emptyForm, managementType: 'WEG', name: 'Test', accountantId: MOCK_ACCOUNTANTS[0].id })
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    it('is enabled when all required fields are filled', () => {
      renderStep(fullForm)
      expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
    })
  })

  describe('management type toggle', () => {
    it('calls setManagementType with WEG when WEG is clicked', async () => {
      const { setManagementType } = renderStep(emptyForm)
      await userEvent.click(screen.getByRole('button', { name: 'WEG' }))
      expect(setManagementType).toHaveBeenCalledWith('WEG')
    })

    it('calls setManagementType with MV when MV is clicked', async () => {
      const { setManagementType } = renderStep(emptyForm)
      await userEvent.click(screen.getByRole('button', { name: 'MV' }))
      expect(setManagementType).toHaveBeenCalledWith('MV')
    })
  })

  describe('field interactions', () => {
    it('calls setName when name input changes', async () => {
      const { setName } = renderStep(emptyForm)
      await userEvent.type(screen.getByPlaceholderText(/Togostraße/), 'A')
      expect(setName).toHaveBeenCalledWith('A')
    })

    it('calls setManagerId when manager is selected', async () => {
      const { setManagerId } = renderStep(emptyForm)
      const [managerSelect] = screen.getAllByRole('combobox')
      await userEvent.selectOptions(managerSelect, MOCK_MANAGERS[0].id)
      expect(setManagerId).toHaveBeenCalledWith(MOCK_MANAGERS[0].id)
    })

    it('calls setAccountantId when accountant is selected', async () => {
      const { setAccountantId } = renderStep(emptyForm)
      const [, accountantSelect] = screen.getAllByRole('combobox')
      await userEvent.selectOptions(accountantSelect, MOCK_ACCOUNTANTS[0].id)
      expect(setAccountantId).toHaveBeenCalledWith(MOCK_ACCOUNTANTS[0].id)
    })
  })

  describe('form submission', () => {
    it('calls onNext when form is submitted with all fields', async () => {
      const { onNext } = renderStep(fullForm)
      await userEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(onNext).toHaveBeenCalledOnce()
    })

    it('does not call onNext when form is incomplete', async () => {
      const { onNext } = renderStep(emptyForm)
      await userEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(onNext).not.toHaveBeenCalled()
    })
  })
})
