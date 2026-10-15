import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ShieldCheck, Users, Scale, Award } from 'lucide-react'

const coreValues = [
  { icon: ShieldCheck, label: 'Integrity' },
  { icon: Users, label: 'Team Work' },
  { icon: Scale, label: 'Impartiality' },
  { icon: Award, label: 'Excellence' },
]

export function AboutPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">About the Ministry</h1>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600">
              The Ministry of Home Affairs and Cultural Heritage is responsible for civil registration, national
              identity, immigration, policing and the preservation of Zimbabwe's cultural and documentary heritage.
              The Registrar General's Office, through the Central Registry, administers birth, death, marriage and
              national identity records for all citizens.
            </p>

            <div className="mt-8 card-gov p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Mandate</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                The Ministry is responsible for making the country a safe and secure place to live in, through
                the maintenance of public order and security, control of entry and exit of people across
                Zimbabwe's borders, issuance of personal documents, and preservation of national monuments and
                archival records.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="card-gov p-6">
                <h2 className="text-base font-semibold text-charcoal-900">Vision</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  A secure and peaceful Zimbabwe promoting and preserving its cultural heritage by 2020.
                </p>
              </div>
              <div className="card-gov p-6">
                <h2 className="text-base font-semibold text-charcoal-900">Mission</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  To promote a secure and peaceful environment through maintaining law and order, combating
                  corruption, managing migration, timely registration and issuance of secure identification
                  documents, regulation of gaming and entertainment activities, and preservation of national
                  heritage and historic documents.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Core Values</h2>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {coreValues.map((value) => (
                  <div key={value.label} className="card-gov flex flex-col items-center gap-2 p-4 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
                      <value.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-charcoal-900">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="card-gov h-fit p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Strategic Objectives</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <li>Modernise civil registration service delivery</li>
              <li>Expand access to registration centres nationwide</li>
              <li>Strengthen national identity security</li>
              <li>Preserve national cultural heritage and archives</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  )
}
