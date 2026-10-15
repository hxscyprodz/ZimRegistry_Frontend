import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchPage } from '@/pages/SearchPage'

function SearchRouteComponent() {
  const { q } = Route.useSearch()
  return <SearchPage query={q} />
}

export const Route = createFileRoute('/_public/search')({
  validateSearch: z.object({ q: z.string().default('') }),
  component: SearchRouteComponent,
})
