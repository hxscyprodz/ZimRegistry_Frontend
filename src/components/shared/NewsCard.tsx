import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { FallbackImage } from '@/components/shared/FallbackImage'
import { formatDate } from '@/lib/utils'
import type { NewsArticle } from '@/types'

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="card-gov group flex flex-col overflow-hidden p-0">
      {article.image && (
        <div className="h-36 w-full overflow-hidden">
          <FallbackImage
            src={article.image}
            alt=""
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={article.category === 'Public Notice' ? 'amber' : 'green'}>{article.category}</Badge>
          <time dateTime={article.date} className="text-xs text-slate-400">
            {formatDate(article.date, 'short')}
          </time>
        </div>
        <h3 className="text-base font-semibold text-charcoal-900">{article.title}</h3>
        <p className="text-sm text-slate-500">{article.summary}</p>
        <Link
          to="/news/$slug"
          params={{ slug: article.slug }}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700"
        >
          Read More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
