'use client'

import { HelpTrigger } from '@/components/HelpTrigger'

type Props = {
  label: string
  termId: string
  children: React.ReactNode
  className?: string
}

export const HelpSection = ({ label, termId, children, className }: Props) => (
  <div className={className}>
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <HelpTrigger termId={termId} />
    </div>
    {children}
  </div>
)
