import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type ServiceChoice = 'birth_certificate' | 'national_id' | 'passport' | 'marriage_certificate'
type RegistrationType = 'new' | 'late' | 'correction'

const services: { value: ServiceChoice; label: string }[] = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'national_id', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'marriage_certificate', label: 'Marriage Certificate' },
]

const registrationTypes: { value: RegistrationType; label: string }[] = [
  { value: 'new', label: 'New Birth Registration' },
  { value: 'late', label: 'Late Birth Registration' },
  { value: 'correction', label: 'Replacement / Correction' },
]

// Illustrative only — see the note below the results. Final legal
// requirements should be sourced from the Ministry / backend once available.
const requirementsByType: Record<RegistrationType, string[]> = {
  new: ['Hospital birth record', "Mother's National ID", "Father's National ID", 'Additional supporting documents where applicable'],
  late: ["Mother's and Father's National IDs", 'Affidavit explaining the delay', 'Supporting evidence of birth (e.g. clinic card)', 'Additional supporting documents where applicable'],
  correction: ['Original birth certificate', 'Supporting evidence for the correction requested', "Parents' National IDs", 'Additional supporting documents where applicable'],
}

const genericRequirements: Record<Exclude<ServiceChoice, 'birth_certificate'>, string[]> = {
  national_id: ['Birth certificate', 'Proof of residence', 'Additional supporting documents where applicable'],
  passport: ['National ID', 'Birth certificate', 'Additional supporting documents where applicable'],
  marriage_certificate: ['National IDs of both parties', 'Proof of age', 'Additional supporting documents where applicable'],
}

export function RequirementsWizard() {
  const [service, setService] = useState<ServiceChoice | null>(null)
  const [regType, setRegType] = useState<RegistrationType | null>(null)

  const reset = () => {
    setService(null)
    setRegType(null)
  }

  const showResults = service && (service !== 'birth_certificate' || regType)
  const results = showResults
    ? service === 'birth_certificate'
      ? requirementsByType[regType as RegistrationType]
      : genericRequirements[service as Exclude<ServiceChoice, 'birth_certificate'>]
    : null

  return (
    <div className="card-gov p-6 sm:p-8">
      {!showResults && (
        <>
          <p className="text-sm font-semibold text-gold-600">Step {service ? 2 : 1} of {service === 'birth_certificate' ? 2 : 1}</p>
          <h3 className="mt-1 text-lg font-semibold text-charcoal-900">
            {service ? 'What type of registration?' : 'What service do you need?'}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {!service &&
              services.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setService(s.value)}
                  className="rounded-[var(--radius-control)] border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-charcoal-900 hover:border-forest-500 hover:bg-forest-50"
                >
                  {s.label}
                </button>
              ))}
            {service === 'birth_certificate' &&
              registrationTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setRegType(t.value)}
                  className="rounded-[var(--radius-control)] border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-charcoal-900 hover:border-forest-500 hover:bg-forest-50"
                >
                  {t.label}
                </button>
              ))}
          </div>
          {service && (
            <button type="button" onClick={reset} className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600">
              ← Start over
            </button>
          )}
        </>
      )}

      {showResults && results && (
        <div>
          <h3 className="text-lg font-semibold text-charcoal-900">Required Documents</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {results.map((r) => (
              <li key={r} className={cn('flex items-start gap-2.5 text-sm text-charcoal-900')}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            These requirements are illustrative. Confirm the official, up-to-date requirements at your nearest
            registry office or via the Resources section before applying.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Start Over
            </Button>
            {service === 'birth_certificate' ? (
              <Link to="/e-services/birth-certificate/apply">
                <Button size="sm">Start Application</Button>
              </Link>
            ) : service === 'national_id' ? (
              <Link to="/e-services/national-id/apply">
                <Button size="sm">Start Application</Button>
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
