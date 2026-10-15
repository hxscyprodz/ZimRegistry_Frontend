import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationTimelineEvent } from '@/types'

export function ApplicationTimeline({ events }: { events: ApplicationTimelineEvent[] }) {
  const activeIndex = events.reduce((acc, e, i) => (e.completed ? i : acc), -1)
  return (
    <ol className="relative ml-3 border-l-2 border-slate-200 pl-6">
      {events.map((event, i) => {
        const isCurrent = i === activeIndex
        return (
          <li key={event.id} className="mb-6 last:mb-0">
            <span
              className={cn(
                'absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2',
                event.completed
                  ? 'border-forest-500 bg-forest-500 text-white'
                  : 'border-slate-300 bg-white',
              )}
              aria-hidden="true"
            >
              {event.completed && <Check className="h-3 w-3" />}
            </span>
            <p className={cn('text-sm font-semibold', isCurrent ? 'text-forest-700' : 'text-charcoal-900')}>
              {event.label}
              {isCurrent && <span className="ml-2 text-xs font-normal text-gold-600">Current stage</span>}
            </p>
            {event.description && <p className="mt-0.5 text-sm text-slate-500">{event.description}</p>}
          </li>
        )
      })}
    </ol>
  )
}
