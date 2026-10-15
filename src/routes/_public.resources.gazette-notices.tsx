import { createFileRoute } from '@tanstack/react-router'
import { ResourcesPage } from '@/pages/ResourcesPage'

export const Route = createFileRoute('/_public/resources/gazette-notices')({
  component: () => <ResourcesPage initialCategory="Gazette Notices" />,
})
