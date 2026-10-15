import { createFileRoute } from '@tanstack/react-router'
import { OfficesPage } from '@/pages/OfficesPage'

export const Route = createFileRoute('/_public/offices')({
  component: OfficesPage,
})
