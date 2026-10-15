import { createFileRoute } from '@tanstack/react-router'
import { BirthCertificateApplyPage } from '@/pages/BirthCertificateApplyPage'

export const Route = createFileRoute('/_public/e-services/birth-certificate/apply')({
  component: BirthCertificateApplyPage,
})
