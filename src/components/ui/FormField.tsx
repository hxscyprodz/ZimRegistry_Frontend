import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-charcoal-900">
        {label} {required && <span className="text-forest-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-600" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

export function inputClass(hasError?: boolean) {
  return cn(
    'w-full rounded-[var(--radius-control)] border bg-white px-3.5 py-2.5 text-sm text-charcoal-900 shadow-sm transition-colors placeholder:text-slate-400',
    'focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
    hasError ? 'border-red-400' : 'border-slate-300',
  )
}
