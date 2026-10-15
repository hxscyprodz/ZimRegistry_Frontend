import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, FileStack } from 'lucide-react'
import { useApplications } from '@/hooks/useApplications'
import { ApplicationStatus } from '@/components/shared/ApplicationStatus'
import { EmptyState } from '@/components/shared/EmptyState'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Select } from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'
import type { ApplicationServiceType, ApplicationStatus as StatusType } from '@/types'

export function ApplicationsListPage() {
  const { data, isLoading } = useApplications()
  const [query, setQuery] = useState('')
  const [service, setService] = useState<ApplicationServiceType | 'all'>('all')
  const [status, setStatus] = useState<StatusType | 'all'>('all')

  const filtered = useMemo(() => {
    if (!data) return []
    return data
      .filter((a) => (service === 'all' ? true : a.service === service))
      .filter((a) => (status === 'all' ? true : a.status === status))
      .filter((a) => a.reference.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [data, service, status, query])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-charcoal-900">My Applications</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference number…"
            className="w-full rounded-[var(--radius-control)] border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
          />
        </div>
        <Select
          value={service}
          onChange={(e) => setService(e.target.value as ApplicationServiceType | 'all')}
          className="sm:w-52"
        >
          <option value="all">All Services</option>
          <option value="birth_certificate">Birth Certificate</option>
          <option value="national_id">National ID</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusType | 'all')}
          className="sm:w-52"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-slate-200 bg-white">
        {isLoading && <div className="p-5"><CardSkeleton /></div>}
        {!isLoading && filtered.length === 0 && (
          <div className="p-6">
            <EmptyState icon={FileStack} title="No applications found" description="Try adjusting your search or filters." />
          </div>
        )}
        {!isLoading && filtered.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="hidden bg-surface-slate text-xs font-semibold uppercase tracking-wide text-slate-500 sm:table-header-group">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} className="block sm:table-row">
                  <td className="block px-5 pt-4 font-semibold text-charcoal-900 sm:table-cell sm:py-3">{app.reference}</td>
                  <td className="block px-5 text-slate-500 sm:table-cell sm:py-3">
                    {app.service === 'birth_certificate' ? 'Birth Certificate' : 'National ID'}
                  </td>
                  <td className="block px-5 text-slate-500 sm:table-cell sm:py-3">{formatDate(app.submittedAt, 'short') || '—'}</td>
                  <td className="block px-5 py-2 sm:table-cell sm:py-3"><ApplicationStatus status={app.status} /></td>
                  <td className="block px-5 text-slate-500 sm:table-cell sm:py-3">{formatDate(app.updatedAt, 'short') || '—'}</td>
                  <td className="block px-5 pb-4 sm:table-cell sm:py-3">
                    <Link to="/my-account/applications/$applicationId" params={{ applicationId: app.id }} className="text-sm font-semibold text-forest-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
