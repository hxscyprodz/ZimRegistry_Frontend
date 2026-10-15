import { Link } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export function SubmissionSuccess({
  serviceName,
  reference,
  submittedAt,
}: {
  serviceName: string
  reference: string
  submittedAt: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
        <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-charcoal-900">Application Submitted Successfully</h2>

      <div className="mt-2 rounded-[var(--radius-card)] border border-gold-400/40 bg-gold-400/10 px-8 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Reference Number</p>
        <p className="mt-1 font-display text-2xl font-bold text-charcoal-900">{reference}</p>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
        <dt className="text-slate-400">Service</dt>
        <dd className="text-left text-charcoal-900">{serviceName}</dd>
        <dt className="text-slate-400">Date Submitted</dt>
        <dd className="text-left text-charcoal-900">{formatDate(submittedAt)}</dd>
        <dt className="text-slate-400">Current Status</dt>
        <dd className="text-left text-charcoal-900">Submitted</dd>
      </dl>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Keep this reference number safe — you'll need it to track your application's progress.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link to="/track-application" search={{ reference }}>
          <Button>Track This Application</Button>
        </Link>
        <Link to="/my-account">
          <Button variant="secondary">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
