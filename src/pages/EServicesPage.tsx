import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { FileText, IdCard, Search, FileStack } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const services = [
  { icon: FileText, title: 'Birth Certificate', description: 'Apply for a birth certificate online.', to: '/e-services/birth-certificate/apply', ctaLabel: 'Apply Now', prominent: true },
  { icon: IdCard, title: 'National ID', description: 'Apply for a national identity document.', to: '/e-services/national-id/apply', ctaLabel: 'Apply Now', prominent: true },
  { icon: Search, title: 'Track Application', description: 'Track your submitted application.', to: '/track-application', ctaLabel: 'Track Now' },
]

export function EServicesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <div>
      <Breadcrumbs items={[{ label: 'e-Services' }]} />
      <div className="bg-forest-800 py-12">
        <div className="container-gov">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Central Registry</p>
          <h1 className="mt-2 text-3xl font-bold text-white">e-Services</h1>
          <p className="mt-3 max-w-xl text-sm text-white/75">
            Apply for civil registration documents, track submitted applications, and manage everything from a
            secure citizen account.
          </p>
        </div>
      </div>
      <div className="container-gov py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
          <ServiceCard
            icon={FileStack}
            title={isAuthenticated ? 'My Applications' : 'Citizen Login'}
            description={isAuthenticated ? 'View applications linked to your account.' : 'Sign in to view your applications and account.'}
            to={isAuthenticated ? '/my-account/applications' : '/login'}
            ctaLabel={isAuthenticated ? 'View Applications' : 'Sign In'}
          />
        </div>
      </div>
    </div>
  )
}
