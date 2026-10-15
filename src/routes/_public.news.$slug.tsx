import { createFileRoute } from '@tanstack/react-router'
import { NewsArticlePage } from '@/pages/NewsArticlePage'

export const Route = createFileRoute('/_public/news/$slug')({
  component: () => {
    const { slug } = Route.useParams()
    return <NewsArticlePage slug={slug} />
  },
})
