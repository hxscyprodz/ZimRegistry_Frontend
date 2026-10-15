import { createFileRoute } from '@tanstack/react-router'
import { DashboardHomePage } from '@/pages/DashboardHomePage'

export const Route = createFileRoute('/_account/my-account/')({
  component: DashboardHomePage,
})
