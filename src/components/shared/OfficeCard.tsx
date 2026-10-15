import { MapPin, Phone, Clock, Fingerprint } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Office } from '@/types'

export function OfficeCard({ office }: { office: Office }) {
  return (
    <div className="card-gov flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-charcoal-900">{office.name}</h3>
        {office.biometricEnrollment && (
          <Badge tone="gold" className="shrink-0">
            <Fingerprint className="h-3 w-3" /> Biometric
          </Badge>
        )}
      </div>
      <p className="flex items-start gap-2 text-sm text-slate-500">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
        {office.address}
      </p>
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Phone className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
        {office.phone}
      </p>
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Clock className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
        {office.hours}
      </p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {office.services.map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-2 text-sm font-semibold text-forest-700 hover:text-forest-800"
      >
        View on Map →
      </a>
    </div>
  )
}
