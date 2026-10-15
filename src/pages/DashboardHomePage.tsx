import { Link } from '@tanstack/react-router'
import { FileText, IdCard, Search, FileStack, Smartphone } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useApplications } from '@/hooks/useApplications'
import { ApplicationStatus } from '@/components/shared/ApplicationStatus'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'
import type { ApplicationStatus as StatusType } from '@/types'

const quickActions = [
  { icon: FileText, label: 'Apply for Birth Certificate', to: '/e-services/birth-certificate/apply' },
  { icon: IdCard, label: 'Apply for National ID', to: '/e-services/national-id/apply' },
  { icon: Search, label: 'Track Application', to: '/track-application' },
  { icon: FileStack, label: 'View Applications', to: '/my-account/applications' },
]

const summaryBuckets: { key: StatusType[]; label: string }[] = [
  { key: ['submitted', 'received', 'under_review'], label: 'Pending' },
  { key: ['processing'], label: 'Processing' },
  { key: ['approved'], label: 'Approved' },
  { key: ['rejected'], label: 'Rejected' },
]

export function DashboardHomePage() {
  const citizen = useAuthStore((s) => s.citizen)
  const { data: applications, isLoading } = useApplications()

  const counts = summaryBuckets.map((bucket) => ({
    label: bucket.label,
    count: applications?.filter((a) => bucket.key.includes(a.status)).length ?? 0,
  }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Welcome, {citizen?.firstName || citizen?.email || 'Citizen'}</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your civil registration applications and track their progress.</p>
      </div>

      {citizen && !citizen.phoneVerified && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="flex items-center gap-2 text-sm text-amber-800">
            <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
            Your phone number isn't verified yet. You'll need to verify it before you can apply for documents.
          </p>
          <Link to="/my-account/profile" className="text-sm font-semibold text-forest-700">
            Verify Now →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="card-gov flex items-center gap-3 p-4 text-sm font-semibold text-charcoal-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
              <action.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <div key={c.label} className="card-gov p-5 text-center">
            <p className="font-display text-3xl font-bold text-forest-700">{c.count}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-charcoal-900">Recent Applications</h2>
          <Link to="/my-account/applications" className="text-sm font-semibold text-forest-700">View All →</Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-slate-200 bg-white">
          {isLoading && <div className="p-5"><CardSkeleton /></div>}
          {!isLoading && applications?.length === 0 && (
            <div className="p-6">
              <EmptyState icon={FileStack} title="No applications yet" description="Start your first application to see it listed here." />
            </div>
          )}
          {!isLoading && applications && applications.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="hidden bg-surface-slate text-xs font-semibold uppercase tracking-wide text-slate-500 sm:table-header-group">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="block sm:table-row">
                    <td className="block px-5 pt-4 font-semibold text-charcoal-900 sm:table-cell sm:py-3">{app.reference}</td>
                    <td className="block px-5 text-slate-500 sm:table-cell sm:py-3">
                      {app.service === 'birth_certificate' ? 'Birth Certificate' : 'National ID'}
                    </td>
                    <td className="block px-5 text-slate-500 sm:table-cell sm:py-3">{formatDate(app.submittedAt, 'short') || '—'}</td>
                    <td className="block px-5 py-2 sm:table-cell sm:py-3">
                      <ApplicationStatus status={app.status} />
                    </td>
                    <td className="block px-5 pb-4 sm:table-cell sm:py-3">
                      <Link
                        to="/my-account/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        className="text-sm font-semibold text-forest-700"
                      >
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
    </div>
  )
}
