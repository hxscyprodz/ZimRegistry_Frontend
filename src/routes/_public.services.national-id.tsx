import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/national-id')({
  component: () => (
    <ServiceDetailPage
      title="National ID"
      description="Apply for your National Identity Document, required for voting, banking, travel and accessing public services."
      applyTo="/e-services/national-id/apply"
      requirements={['Birth certificate', 'Proof of residence', 'Additional supporting documents where applicable']}
    />
  ),
})
