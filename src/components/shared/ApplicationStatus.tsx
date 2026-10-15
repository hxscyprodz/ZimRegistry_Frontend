import { CheckCircle2, Clock, FileSearch, Loader2, XCircle, AlertTriangle, FileEdit, Ban, PackageCheck } from 'lucide-react'
import type { ApplicationStatus as StatusType } from '@/types'
import { cn } from '@/lib/utils'

const config: Record<StatusType, { label: string; icon: typeof Clock; className: string }> = {
  draft: { label: 'Draft', icon: FileEdit, className: 'bg-slate-100 text-slate-600' },
  submitted: { label: 'Submitted', icon: Clock, className: 'bg-slate-100 text-slate-700' },
  received: { label: 'Received', icon: FileSearch, className: 'bg-forest-500/10 text-forest-700' },
  under_review: { label: 'Under Review', icon: FileSearch, className: 'bg-gold-400/15 text-gold-600' },
  additional_information_required: { label: 'Action Required', icon: AlertTriangle, className: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Processing', icon: Loader2, className: 'bg-forest-500/10 text-forest-700' },
  approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-forest-500/15 text-forest-700' },
  collected: { label: 'Collected', icon: PackageCheck, className: 'bg-gold-400/20 text-gold-600' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-50 text-red-700' },
  cancelled: { label: 'Cancelled', icon: Ban, className: 'bg-slate-100 text-slate-500' },
}

export function ApplicationStatus({ status, className }: { status: StatusType; className?: string }) {
  const { label, icon: Icon, className: toneClass } = config[status]
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        toneClass,
        className,
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', status === 'processing' && 'animate-spin')} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
