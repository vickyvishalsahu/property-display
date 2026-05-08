'use client'

import type { CSSProperties } from 'react'
import type { StepState } from '@/domains/propertyCreation/utils/stepCompletion'

const STEPS = ['Property', 'Buildings', 'Review']

type Props = {
  activeStep: 0 | 1 | 2
  stepStates?: StepState[]
}

const getRingClass = (state: StepState) =>
  state === 'complete' ? 'ring-2 ring-green-500 ring-offset-1' : ''

const getRingStyle = (state: StepState): CSSProperties =>
  state === 'partial' ? { outline: '2px dashed #22c55e', outlineOffset: '3px' } : {}

export const PropertyStepper = ({ activeStep, stepStates = [] }: Props) => (
  <div className="flex items-center gap-2 mb-8">
    {STEPS.map((stepLabel, stepIndex) => {
      const isActive = stepIndex === activeStep
      const isComplete = stepIndex < activeStep
      const state = stepStates[stepIndex] ?? 'empty'

      const dotClass = isComplete || isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
      const labelClass = isActive ? 'font-semibold text-gray-900' : 'text-gray-400'
      const showSeparator = stepIndex < STEPS.length - 1

      return (
        <div key={stepLabel} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${dotClass} ${getRingClass(state)}`}
            style={getRingStyle(state)}
          >
            {stepIndex + 1}
          </div>
          <span className={`text-sm ${labelClass}`}>{stepLabel}</span>
          {showSeparator && <span className="text-gray-300 mx-1">—</span>}
        </div>
      )
    })}
  </div>
)
