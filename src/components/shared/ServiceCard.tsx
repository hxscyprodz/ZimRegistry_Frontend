import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FallbackImage } from '@/components/shared/FallbackImage'

export function ServiceCard({
  icon: Icon,
  title,
  description,
  to,
  ctaLabel,
  prominent,
  image,
  badge,
}: {
  icon: LucideIcon
  title: string
  description: string
  to: string
  ctaLabel: string
  prominent?: boolean
  /** Optional photo shown as a card header — used on richer service grids. */
  image?: string
  /** Optional short status pill, e.g. "Available Online". */
  badge?: string
}) {
  return (
    <div
      className={cn(
        'card-gov group flex flex-col overflow-hidden p-0',
        prominent && 'ring-1 ring-gold-400/50',
      )}
    >
      {image && (
        <div className="relative h-36 w-full overflow-hidden">
          <FallbackImage
            src={image}
            alt=""
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {badge && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-forest-700 shadow-sm">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              prominent ? 'bg-gold-400/20 text-gold-600' : 'bg-forest-500/10 text-forest-600',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          {!image && badge && (
            <span className="flex items-center gap-1 rounded-full bg-forest-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-forest-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {badge}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-charcoal-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
        <Link
          to={to}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
