import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { PageLoading } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useDepartment } from '@/hooks/usePublicContent'
import { Landmark, ExternalLink } from 'lucide-react'

export function DepartmentDetailPage({ departmentId }: { departmentId: string }) {
  const { data: department, isLoading, isError } = useDepartment(departmentId)

  if (isLoading) return <PageLoading label="Loading department…" />
  if (isError || !department) {
    return (
      <div className="container-gov py-12">
        <ErrorState kind="not-found" />
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Departments', to: '/departments' }, { label: department.name }]} />
      <div className="container-gov max-w-3xl py-12">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
            <Landmark className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">{department.name}</h1>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-slate-600">{department.description}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {department.about ??
            '[Full department mandate, structure, leadership and contact information — to be sourced from official Ministry content and inserted here.]'}
        </p>

        <div className="mt-8 card-gov flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Official Website</p>
            {department.website ? (
              <a
                href={department.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
              >
                {department.website}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-400">[Official Department Website — not yet available]</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
