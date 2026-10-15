import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

export const Route = createFileRoute('/_public/services/birth-certificates')({
  component: () => (
    <ServiceDetailPage
      title="Birth Certificates"
      description="Register a birth with the Central Registry and apply for a certified birth certificate — the foundation document for National ID, passports and school enrolment."
      applyTo="/e-services/birth-certificate/apply"
      requirements={['Hospital birth record', "Mother's National ID", "Father's National ID", 'Additional supporting documents where applicable']}
    />
  ),
})
