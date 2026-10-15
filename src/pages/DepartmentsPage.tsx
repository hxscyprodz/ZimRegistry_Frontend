import { Link } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { useDepartments } from '@/hooks/usePublicContent'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Landmark } from 'lucide-react'

export function DepartmentsPage() {
  const departments = useDepartments()
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Departments' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Ministry Departments</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          The Ministry operates through the following departments and units.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.isLoading && Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
          {departments.data?.map((dep) => (
            <div key={dep.id} className="card-gov flex flex-col gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <Link to="/departments/$departmentId" params={{ departmentId: dep.id }}>
                <h2 className="text-base font-semibold text-charcoal-900 hover:text-forest-700">{dep.name}</h2>
              </Link>
              <p className="text-sm text-slate-500">{dep.description}</p>
              <Link
                to="/departments/$departmentId"
                params={{ departmentId: dep.id }}
                className="mt-auto text-left text-sm font-semibold text-forest-700"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
