import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/passports')({
  component: () => (
    <ServiceDetailPage
      title="Passports"
      description="Information on applying for and renewing Zimbabwean travel documents through the Department of Immigration."
      requirements={['National ID', 'Birth certificate', 'Additional supporting documents where applicable']}
    />
  ),
})
