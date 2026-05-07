import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DraftBanner } from '@/domains/propertyCreation/components/DraftBanner'
import type { FormState } from '@/domains/propertyCreation/hooks/usePropertyForm'

const draft: FormState = {
  managementType: 'WEG',
  name: 'Togostraße EG',
  managerId: 'mgr-1',
  accountantId: 'acc-1',
  buildings: [],
}

describe('DraftBanner', () => {
  it('renders the draft property name', () => {
    render(<DraftBanner pendingDraft={draft} onRestore={vi.fn()} onDiscard={vi.fn()} />)
    expect(screen.getByText(/Togostraße EG/)).toBeInTheDocument()
  })

  it('calls onRestore when Continue draft is clicked', async () => {
    const onRestore = vi.fn()
    render(<DraftBanner pendingDraft={draft} onRestore={onRestore} onDiscard={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /continue draft/i }))
    expect(onRestore).toHaveBeenCalledOnce()
  })

  it('calls onDiscard when Start fresh is clicked', async () => {
    const onDiscard = vi.fn()
    render(<DraftBanner pendingDraft={draft} onRestore={vi.fn()} onDiscard={onDiscard} />)
    await userEvent.click(screen.getByRole('button', { name: /start fresh/i }))
    expect(onDiscard).toHaveBeenCalledOnce()
  })
})
