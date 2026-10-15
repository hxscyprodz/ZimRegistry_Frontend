import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StepIndicator({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0" aria-label="Application progress">
      {steps.map((label, i) => {
        const stepNumber = i + 1
        const isComplete = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        return (
          <li key={label} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-start">
            <div className="flex items-center gap-3 sm:w-full">
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
                  isComplete && 'border-forest-500 bg-forest-500 text-white',
                  isCurrent && !isComplete && 'border-gold-400 bg-gold-400 text-charcoal-900',
                  !isComplete && !isCurrent && 'border-slate-300 bg-white text-slate-400',
                )}
              >
                {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : String(stepNumber).padStart(2, '0')}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn('hidden h-0.5 flex-1 sm:block', isComplete ? 'bg-forest-500' : 'bg-slate-200')}
                  aria-hidden="true"
                />
              )}
            </div>
            <span
              className={cn(
                'text-xs font-semibold sm:mt-1',
                isCurrent ? 'text-forest-700' : 'text-slate-500',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
