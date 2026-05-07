import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DraftCard } from '@/domains/propertyCreation/components/DraftCard'
import type { Property } from '@/domains/shared/types/property'

const makeDraftProperty = (overrides: Partial<Property> = {}): Property => ({
  id: 'prop-abc',
  name: 'Togostraße EG',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  isDraft: true,
  managementType: 'WEG',
  buildings: [],
  ...overrides,
})

describe('DraftCard', () => {
  it('renders the property name', () => {
    render(<DraftCard draft={makeDraftProperty()} onDiscard={vi.fn()} />)
    expect(screen.getByText('Togostraße EG')).toBeInTheDocument()
  })

  it('renders "Untitled draft" when name is empty', () => {
    render(<DraftCard draft={makeDraftProperty({ name: '' })} onDiscard={vi.fn()} />)
    expect(screen.getByText('Untitled draft')).toBeInTheDocument()
  })

  it('shows the Draft badge', () => {
    render(<DraftCard draft={makeDraftProperty()} onDiscard={vi.fn()} />)
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('Continue link points to /properties/new?draft=<id>', () => {
    render(<DraftCard draft={makeDraftProperty()} onDiscard={vi.fn()} />)
    const link = screen.getByRole('link', { name: /continue/i })
    expect(link).toHaveAttribute('href', '/properties/new?draft=prop-abc')
  })

  it('calls onDiscard with property id when Discard is clicked', async () => {
    const onDiscard = vi.fn()
    render(<DraftCard draft={makeDraftProperty()} onDiscard={onDiscard} />)
    await userEvent.click(screen.getByRole('button', { name: /discard/i }))
    expect(onDiscard).toHaveBeenCalledWith('prop-abc')
  })
})
