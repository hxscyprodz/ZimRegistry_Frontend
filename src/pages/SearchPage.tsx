import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { EmptyState } from '@/components/shared/EmptyState'
import { useNews, useResources, useDepartments } from '@/hooks/usePublicContent'
import { SearchX } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function SearchPage({ query }: { query: string }) {
  const { data: news } = useNews()
  const { data: resources } = useResources()
  const { data: departments } = useDepartments()

  const q = query.toLowerCase()
  const newsResults = news?.filter((n) => n.title.toLowerCase().includes(q)) ?? []
  const resourceResults = resources?.filter((r) => r.title.toLowerCase().includes(q)) ?? []
  const departmentResults = departments?.filter((d) => d.name.toLowerCase().includes(q)) ?? []
  const total = newsResults.length + resourceResults.length + departmentResults.length

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <div className="container-gov py-12">
        <h1 className="text-2xl font-bold text-charcoal-900">
          Search results for <span className="text-forest-700">"{query}"</span>
        </h1>

        {total === 0 && (
          <div className="mt-8">
            <EmptyState icon={SearchX} title="No results found" description="Try different keywords, or browse Services, Resources or News from the menu." />
          </div>
        )}

        {departmentResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Departments</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {departmentResults.map((d) => (
                <li key={d.id}><Link to="/departments" className="text-sm font-semibold text-forest-700">{d.name}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {resourceResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Resources</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {resourceResults.map((r) => (
                <li key={r.id}><Link to="/resources" className="text-sm font-semibold text-forest-700">{r.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {newsResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">News &amp; Notices</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {newsResults.map((n) => (
                <li key={n.id}>
                  <Link to="/news/$slug" params={{ slug: n.slug }} className="text-sm font-semibold text-forest-700">
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
