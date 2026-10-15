import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { useResources } from '@/hooks/usePublicContent'
import { FileSearch, Search } from 'lucide-react'
import type { Resource } from '@/types'

const categories: (Resource['category'] | 'All')[] = [
  'All',
  'Application Forms',
  'Requirements',
  'Fees',
  'Acts & Regulations',
  'Gazette Notices',
  'FAQs',
]

export function ResourcesPage({ initialCategory }: { initialCategory?: Resource['category'] }) {
  const { data, isLoading } = useResources()
  const [category, setCategory] = useState<(typeof categories)[number]>(initialCategory ?? 'All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((r) => {
      const matchesCategory = category === 'All' || r.category === category
      const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [data, category, query])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Resources' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Resources &amp; Downloads</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Application forms, requirements, fee schedules, legislation and guides.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources…"
              className="w-full rounded-[var(--radius-control)] border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  category === c ? 'border-forest-500 bg-forest-500 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          {!isLoading && filtered.length === 0 && (
            <div className="sm:col-span-2">
              <EmptyState icon={FileSearch} title="No resources found" description="Try a different search term or category." />
            </div>
          )}
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  )
}
