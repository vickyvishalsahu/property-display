import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DraftBanner } from '@/domains/propertyCreation/components/DraftBanner'
import type { DraftEntry } from '@/domains/propertyCreation/hooks/useDraft'

const makeDraft = (id: string, name: string): DraftEntry => ({
  id,
  savedAt: Date.now(),
  form: { managementType: 'WEG', name, managerId: 'mgr-1', accountantId: 'acc-1', buildings: [] },
})

describe('DraftBanner', () => {
  it('renders the draft property name', () => {
    render(
      <DraftBanner
        draft={makeDraft('id-1', 'Togostraße EG')}
        totalDrafts={1}
        onRestore={vi.fn()}
        onDiscard={vi.fn()}
      />,
    )
    expect(screen.getByText(/Togostraße EG/)).toBeInTheDocument()
  })

  it('does not show extra drafts link when totalDrafts is 1', () => {
    render(
      <DraftBanner
        draft={makeDraft('id-1', 'Draft A')}
        totalDrafts={1}
        onRestore={vi.fn()}
        onDiscard={vi.fn()}
      />,
    )
    expect(screen.queryByText(/more on dashboard/i)).not.toBeInTheDocument()
  })

  it('shows "+ 2 more on dashboard" when totalDrafts is 3', () => {
    render(
      <DraftBanner
        draft={makeDraft('id-1', 'Draft A')}
        totalDrafts={3}
        onRestore={vi.fn()}
        onDiscard={vi.fn()}
      />,
    )
    expect(screen.getByText(/\+\s*2 more on dashboard/i)).toBeInTheDocument()
  })

  it('calls onRestore with draft id when Continue draft is clicked', async () => {
    const onRestore = vi.fn()
    render(
      <DraftBanner
        draft={makeDraft('id-1', 'Draft A')}
        totalDrafts={1}
        onRestore={onRestore}
        onDiscard={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /continue draft/i }))
    expect(onRestore).toHaveBeenCalledWith('id-1')
  })

  it('calls onDiscard with draft id when Start fresh is clicked', async () => {
    const onDiscard = vi.fn()
    render(
      <DraftBanner
        draft={makeDraft('id-1', 'Draft A')}
        totalDrafts={1}
        onRestore={vi.fn()}
        onDiscard={onDiscard}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /start fresh/i }))
    expect(onDiscard).toHaveBeenCalledWith('id-1')
  })
})
