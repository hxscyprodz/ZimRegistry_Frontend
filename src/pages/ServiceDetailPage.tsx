import { Link } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { CheckCircle2 } from 'lucide-react'

export function ServiceDetailPage({
  title,
  description,
  applyTo,
  requirements,
}: {
  title: string
  description: string
  applyTo?: string
  requirements: string[]
}) {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Civil Registration', to: '/services' }, { label: title }]} />
      <div className="container-gov py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-charcoal-900">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="card-gov p-6 lg:col-span-2">
            <h2 className="text-base font-semibold text-charcoal-900">What you'll typically need</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-charcoal-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              Requirements shown are illustrative. Confirm official requirements via Resources or at your nearest
              office before applying.
            </p>
          </div>
          <aside className="card-gov h-fit p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Ready to apply?</h2>
            <p className="mt-2 text-sm text-slate-500">Start your application online in a few guided steps.</p>
            {applyTo ? (
              <Link to={applyTo} className="mt-4 block">
                <Button className="w-full">Start Application</Button>
              </Link>
            ) : (
              <Link to="/e-services" className="mt-4 block">
                <Button className="w-full" variant="secondary">Explore e-Services</Button>
              </Link>
            )}
            <Link to="/offices" className="mt-3 block text-center text-sm font-semibold text-forest-700">
              Or visit an office →
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
