import { createFileRoute } from '@tanstack/react-router'
import { ResourcesPage } from '@/pages/ResourcesPage'

export const Route = createFileRoute('/_public/resources/downloads')({
  component: () => <ResourcesPage initialCategory="Application Forms" />,
})
