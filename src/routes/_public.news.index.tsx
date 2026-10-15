import { createFileRoute } from '@tanstack/react-router'
import { NewsPage } from '@/pages/NewsPage'

export const Route = createFileRoute('/_public/news/')({
  component: NewsPage,
})
