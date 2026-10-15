import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TrackApplicationPage } from '@/pages/TrackApplicationPage'

function TrackApplicationRouteComponent() {
  const { reference } = Route.useSearch()
  return <TrackApplicationPage initialReference={reference} />
}

export const Route = createFileRoute('/_public/track-application')({
  validateSearch: z.object({ reference: z.string().optional() }),
  component: TrackApplicationRouteComponent,
})
