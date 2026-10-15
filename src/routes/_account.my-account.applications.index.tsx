import { createFileRoute } from '@tanstack/react-router'
import { ApplicationsListPage } from '@/pages/ApplicationsListPage'

export const Route = createFileRoute('/_account/my-account/applications/')({
  component: ApplicationsListPage,
})
