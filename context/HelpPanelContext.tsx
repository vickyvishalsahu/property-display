'use client'

import { createContext, useState, useContext } from 'react'

type HelpPanelContextValue = {
  activeTerm: string | null
  openPanel: (termId: string) => void
  closePanel: () => void
}

const HelpPanelContext = createContext<HelpPanelContextValue>({
  activeTerm: null,
  openPanel: () => {},
  closePanel: () => {},
})

export const HelpPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null)

  const openPanel = (termId: string) => setActiveTerm(termId)
  const closePanel = () => setActiveTerm(null)

  return (
    <HelpPanelContext.Provider value={{ activeTerm, openPanel, closePanel }}>
      {children}
    </HelpPanelContext.Provider>
  )
}

export const useHelpPanel = () => useContext(HelpPanelContext)
