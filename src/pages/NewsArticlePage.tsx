import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { PageLoading } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { FallbackImage } from '@/components/shared/FallbackImage'
import { formatDate } from '@/lib/utils'
import { useNews } from '@/hooks/usePublicContent'

export function NewsArticlePage({ slug }: { slug: string }) {
  const { data, isLoading } = useNews()
  const article = data?.find((a) => a.slug === slug)

  if (isLoading) return <PageLoading />
  if (!article) return <div className="container-gov py-12"><ErrorState kind="not-found" /></div>

  return (
    <div>
      <Breadcrumbs items={[{ label: 'News & Notices', to: '/news' }, { label: article.title }]} />
      <article className="container-gov max-w-2xl py-12">
        {article.image && (
          <FallbackImage
            src={article.image}
            alt=""
            className="mb-6 h-56 w-full rounded-[var(--radius-card)] sm:h-72"
          />
        )}
        <div className="flex items-center gap-3">
          <Badge tone={article.category === 'Public Notice' ? 'amber' : 'green'}>{article.category}</Badge>
          <time dateTime={article.date} className="text-xs text-slate-400">{formatDate(article.date)}</time>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-charcoal-900 sm:text-3xl">{article.title}</h1>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">{article.summary}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          [Full notice content to be supplied by the Ministry / content management system.]
        </p>
      </article>
    </div>
  )
}
