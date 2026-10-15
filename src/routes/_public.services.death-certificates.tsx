import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/death-certificates')({
  component: () => (
    <ServiceDetailPage
      title="Death Certificates"
      description="Register a death with the Central Registry and apply for a certified death certificate — required for estate, insurance, pension and burial-related matters."
      requirements={[
        'Notification of death (from hospital, clinic, or medical practitioner where applicable)',
        "Deceased's National ID",
        'Proof of identity of the person reporting the death',
        'Additional supporting documents where applicable',
      ]}
    />
  ),
})
