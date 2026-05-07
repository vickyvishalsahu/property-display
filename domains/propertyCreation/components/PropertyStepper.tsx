'use client'

const STEPS = ['Property', 'Buildings', 'Review']

type Props = { activeStep: 0 | 1 | 2 }

export const PropertyStepper = ({ activeStep }: Props) => (
  <div className="flex items-center gap-2 mb-8">
    {STEPS.map((stepLabel, stepIndex) => {
      const isActive = stepIndex === activeStep
      const isComplete = stepIndex < activeStep
      const dotClass =
        isComplete || isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
      const labelClass = isActive ? 'font-semibold text-gray-900' : 'text-gray-400'
      const showSeparator = stepIndex < STEPS.length - 1

      return (
        <div key={stepLabel} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${dotClass}`}
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
