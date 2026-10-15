import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { FileText, IdCard, Search, FileStack } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const actions = [
  { icon: FileText, title: 'Birth Certificate', description: 'Apply for a birth certificate online.', to: '/e-services/birth-certificate/apply', ctaLabel: 'Start Application', prominent: true },
  { icon: IdCard, title: 'National ID', description: 'Apply for a national identity document.', to: '/e-services/national-id/apply', ctaLabel: 'Start Application', prominent: true },
  { icon: Search, title: 'Track Application', description: 'Track your submitted application.', to: '/track-application', ctaLabel: 'Track Now' },
  { icon: FileStack, title: 'My Applications', description: 'View applications linked to your account.', to: '/my-account/applications', ctaLabel: 'View Applications' },
]

export function EServicesHomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <div>
      <Breadcrumbs items={[{ label: 'e-Services' }]} />
      <div className="container-gov py-12">
        <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Central Registry</p>
        <h1 className="mt-2 text-3xl font-bold text-charcoal-900">Civil Registration Services</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Apply for civil registration documents, track existing applications, and manage everything from your
          citizen account.
        </p>
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-slate-500">
            Don't have an account yet? <a href="/register" className="font-semibold text-forest-700">Register</a> or{' '}
            <a href="/login" className="font-semibold text-forest-700">sign in</a> to track applications from your dashboard.
          </p>
        )}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {actions.map((a) => (
            <ServiceCard key={a.title} {...a} />
          ))}
        </div>
      </div>
    </div>
  )
}
