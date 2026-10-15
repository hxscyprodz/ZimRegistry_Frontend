import { Download, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Resource } from '@/types'

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="card-gov flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-forest-500/10 text-forest-600">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-charcoal-900">{resource.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Badge tone="neutral">{resource.fileType}</Badge>
          <span>{resource.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={resource.date}>{formatDate(resource.date, 'short')}</time>
        </div>
      </div>
      <button
        type="button"
        className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] border border-forest-700/20 px-3 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-50"
        aria-label={`Download ${resource.title}`}
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        Download
      </button>
    </div>
  )
}
