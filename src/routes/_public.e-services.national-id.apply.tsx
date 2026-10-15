import { createFileRoute } from '@tanstack/react-router'
import { NationalIdApplyPage } from '@/pages/NationalIdApplyPage'

export const Route = createFileRoute('/_public/e-services/national-id/apply')({
  component: NationalIdApplyPage,
})
