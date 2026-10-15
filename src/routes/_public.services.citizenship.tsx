import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/citizenship')({
  component: () => (
    <ServiceDetailPage
      title="Citizenship Services"
      description="Information on citizenship applications, confirmation, and renunciation matters administered by the Ministry of Home Affairs and Cultural Heritage."
      requirements={[
        'Birth certificate',
        'National ID (where held)',
        "Proof of parentage or descent, where applicable",
        'Additional supporting documents where applicable',
      ]}
    />
  ),
})
