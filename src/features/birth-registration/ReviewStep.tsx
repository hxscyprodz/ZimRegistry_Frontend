import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useBirthApplicationStore } from '@/stores/birthApplicationStore'
import { useSubmitBirthApplication } from '@/hooks/useSubmitApplications'
import { formatDate } from '@/lib/utils'
import type { BirthCertificateApplication, ChildDetails, ParentDetails } from '@/types'

export function ReviewStep({
  onBack,
  onEditStep,
  onSubmitted,
}: {
  onBack: () => void
  onEditStep: (step: number) => void
  onSubmitted: (application: BirthCertificateApplication) => void
}) {
  const { childDetails, parentDetails, documentUrls, confirmed, setConfirmed } = useBirthApplicationStore()
  const submitMutation = useSubmitBirthApplication()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = () => {
    setSubmitError(null)
    submitMutation.mutate(
      {
        child: childDetails as ChildDetails,
        parents: parentDetails as ParentDetails,
        hospitalRecordImageUrl: documentUrls.hospitalRecordImageUrl ?? '',
        motherIdImageUrl: documentUrls.motherIdImageUrl ?? '',
        fatherIdImageUrl: documentUrls.fatherIdImageUrl,
      },
      {
        onSuccess: (application) => onSubmitted(application),
        onError: (error) => setSubmitError((error as Error).message || 'We could not submit your application. Please check your connection and try again.'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-semibold text-charcoal-900">Review Your Application</h2>

      <section className="rounded-[var(--radius-card)] border border-slate-200">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">Child Information</h3>
          <button type="button" onClick={() => onEditStep(1)} className="text-sm font-semibold text-forest-700">Edit</button>
        </header>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2">
          <Row label="Full Name" value={`${childDetails.firstName ?? ''} ${childDetails.middleNames ?? ''} ${childDetails.surname ?? ''}`.replace(/\s+/g, ' ').trim()} />
          <Row label="Sex" value={childDetails.sex === 'FEMALE' ? 'Female' : childDetails.sex === 'MALE' ? 'Male' : '—'} />
          <Row label="Date of Birth" value={childDetails.dateOfBirth ? formatDate(childDetails.dateOfBirth) : '—'} />
          <Row label="Place of Birth" value={childDetails.placeOfBirth ?? '—'} />
          <Row label="Village of Origin" value={childDetails.villageOfOrigin ?? '—'} />
          <Row label="District of Origin" value={childDetails.districtOfOriginName ?? '—'} />
          <Row label="Home Address" value={childDetails.address ?? '—'} full />
          <Row label="Hospital of Birth" value={childDetails.hospitalName ?? '—'} />
          <Row label="Station for Collection" value={childDetails.stationName ?? '—'} />
        </dl>
      </section>

      <section className="rounded-[var(--radius-card)] border border-slate-200">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">Parent Information</h3>
          <button type="button" onClick={() => onEditStep(2)} className="text-sm font-semibold text-forest-700">Edit</button>
        </header>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2">
          <Row label="Mother's National ID" value={parentDetails.motherNationalId ?? '—'} />
          <Row label="Father's National ID" value={parentDetails.fatherNationalId ?? 'Not provided'} />
        </dl>
      </section>

      <section className="rounded-[var(--radius-card)] border border-slate-200">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">Supporting Documents</h3>
          <button type="button" onClick={() => onEditStep(3)} className="text-sm font-semibold text-forest-700">Edit</button>
        </header>
        <ul className="px-5 py-4 text-sm text-charcoal-900">
          <li className="flex items-center justify-between py-1">
            <span>Hospital Birth Record</span>
            <span className="max-w-[60%] truncate text-slate-500">{documentUrls.hospitalRecordImageUrl || 'Not provided'}</span>
          </li>
          <li className="flex items-center justify-between py-1">
            <span>Mother's National ID</span>
            <span className="max-w-[60%] truncate text-slate-500">{documentUrls.motherIdImageUrl || 'Not provided'}</span>
          </li>
          <li className="flex items-center justify-between py-1">
            <span>Father's National ID</span>
            <span className="max-w-[60%] truncate text-slate-500">{documentUrls.fatherIdImageUrl || 'Not provided'}</span>
          </li>
        </ul>
      </section>

      <label className="flex items-start gap-3 text-sm text-charcoal-900">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
        />
        I confirm that the information provided is accurate and complete.
      </label>

      {submitError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} loading={submitMutation.isPending} disabled={!confirmed}>
          Submit Application
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-charcoal-900">{value}</dd>
    </div>
  )
}
