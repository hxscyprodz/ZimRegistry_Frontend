import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { Baby, IdCard, Skull, Plane, Heart, Landmark } from 'lucide-react'

const services = [
  { icon: Baby, title: 'Birth Certificates', description: 'Register a birth and apply for a certified birth certificate.', to: '/services/birth-certificates', ctaLabel: 'View Service', prominent: true },
  { icon: IdCard, title: 'National ID', description: 'Apply for or renew your national identity document.', to: '/services/national-id', ctaLabel: 'View Service', prominent: true },
  { icon: Skull, title: 'Death Certificates', description: 'Register a death and request an official death certificate.', to: '/services/death-certificates', ctaLabel: 'View Service' },
  { icon: Plane, title: 'Passports', description: 'Information on travel document applications and renewals.', to: '/services/passports', ctaLabel: 'View Service' },
  { icon: Heart, title: 'Marriage Certificates', description: 'Marriage registration and licensing information.', to: '/services/marriage-certificates', ctaLabel: 'View Service' },
  { icon: Landmark, title: 'Citizenship Services', description: 'Citizenship and renunciation service information.', to: '/services/citizenship', ctaLabel: 'View Service' },
]

export function ServicesPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Civil Registration' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Civil Registration Services</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Explore the civil registration services offered by the Central Registry.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </div>
  )
}
