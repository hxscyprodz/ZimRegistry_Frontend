import { createFileRoute } from '@tanstack/react-router'
import { EServicesHomePage } from '@/pages/EServicesHomePage'

export const Route = createFileRoute('/_public/e-services/')({
  component: EServicesHomePage,
})
