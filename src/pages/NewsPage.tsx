import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { NewsCard } from '@/components/shared/NewsCard'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { useNews } from '@/hooks/usePublicContent'

export function NewsPage() {
  const { data, isLoading } = useNews()
  return (
    <div>
      <Breadcrumbs items={[{ label: 'News & Notices' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">News &amp; Public Notices</h1>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          {data?.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}
