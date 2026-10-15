import { createFileRoute } from '@tanstack/react-router'
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage'

export const Route = createFileRoute('/_account/my-account/applications/$applicationId')({
  component: () => {
    const { applicationId } = Route.useParams()
    return <ApplicationDetailPage applicationId={applicationId} />
  },
})
