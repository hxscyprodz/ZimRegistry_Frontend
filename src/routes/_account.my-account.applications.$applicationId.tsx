import { createFileRoute } from '@tanstack/react-router'
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage'

function ApplicationDetailRouteComponent() {
  const { applicationId } = Route.useParams()
  return <ApplicationDetailPage applicationId={applicationId} />
}

export const Route = createFileRoute('/_account/my-account/applications/$applicationId')({
  component: ApplicationDetailRouteComponent,
})
