'use client'

interface Props {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: Props) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1 bg-dark-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < currentStep
                  ? 'bg-brand-600 text-white'
                  : i === currentStep
                  ? 'bg-brand-500 text-dark-950 ring-2 ring-brand-400 ring-offset-2 ring-offset-dark-950'
                  : 'bg-dark-800 text-gray-500'
              }`}
            >
              {i < currentStep ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] font-medium hidden sm:block transition-colors duration-300 ${
                i === currentStep ? 'text-brand-400' : i < currentStep ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
