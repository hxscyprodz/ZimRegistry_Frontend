import { AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function PublicNotice({
  title = 'PUBLIC NOTICE',
  children,
  to,
}: {
  title?: string
  children: React.ReactNode
  to?: string
}) {
  return (
    <div className="flex gap-4 rounded-[var(--radius-card)] border-l-4 border-gold-400 bg-gold-400/10 p-5">
      <AlertTriangle className="h-6 w-6 shrink-0 text-gold-600" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gold-600">{title}</p>
        <p className="mt-1 text-sm text-charcoal-900">{children}</p>
        {to && (
          <Link to={to} className="mt-2 inline-block text-sm font-semibold text-forest-700">
            Read Full Notice →
          </Link>
        )}
      </div>
    </div>
  )
}
