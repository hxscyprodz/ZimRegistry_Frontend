import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/marriage-certificates')({
  component: () => (
    <ServiceDetailPage
      title="Marriage Certificates"
      description="Information on marriage registration and licensing, and how to apply for a certified marriage certificate through the Central Registry."
      requirements={[
        'National IDs of both parties',
        'Proof of age of both parties',
        'Marriage officer or solemnisation details, where applicable',
        'Additional supporting documents where applicable',
      ]}
    />
  ),
})
