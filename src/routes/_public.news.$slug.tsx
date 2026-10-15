import { createFileRoute } from '@tanstack/react-router'
import { NewsArticlePage } from '@/pages/NewsArticlePage'

function NewsArticleRouteComponent() {
  const { slug } = Route.useParams()
  return <NewsArticlePage slug={slug} />
}

export const Route = createFileRoute('/_public/news/$slug')({
  component: NewsArticleRouteComponent,
})
