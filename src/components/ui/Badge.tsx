import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'green' | 'red' | 'amber'
  className?: string
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    gold: 'bg-gold-400/15 text-gold-600 border border-gold-400/40',
    green: 'bg-forest-500/10 text-forest-700 border border-forest-500/20',
    red: 'bg-red-50 text-red-700 border border-red-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
