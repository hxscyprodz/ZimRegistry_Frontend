import { createFileRoute } from '@tanstack/react-router'
import { ResourcesPage } from '@/pages/ResourcesPage'

export const Route = createFileRoute('/_public/resources/requirements')({
  component: () => <ResourcesPage initialCategory="Requirements" />,
})
