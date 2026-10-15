import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowLeft, CheckCircle2, Pencil } from 'lucide-react'
import { useApplication } from '@/hooks/useApplications'
import { useStations } from '@/hooks/useLocations'
import { ApplicationStatus } from '@/components/shared/ApplicationStatus'
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline'
import { ErrorState } from '@/components/shared/ErrorState'
import { PageLoading } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/Button'
import { EditNationalIdForm } from '@/features/national-id/EditNationalIdForm'
import { EditBirthApplicationForm } from '@/features/birth-registration/EditBirthApplicationForm'
import { formatDate, maskNationalId } from '@/lib/utils'

export function ApplicationDetailPage({ applicationId }: { applicationId: string }) {
  const { data: application, isLoading, isError } = useApplication(applicationId)
  const { data: stations } = useStations()
  const [isEditing, setIsEditing] = useState(false)
  const [justResubmitted, setJustResubmitted] = useState(false)

  if (isLoading) return <PageLoading label="Loading application…" />
  if (isError || !application) return <ErrorState kind="not-found" />

  const hasDetail =
    application.service === 'birth_certificate'
      ? !!application.child.firstName || !!application.parents.motherNationalId
      : !!application.nationalIdNumber

  const stationName =
    application.service === 'national_id'
      ? application.stationName ?? stations?.find((s) => s.id === application.station)?.name ?? application.station
      : undefined

  return (
    <div className="flex flex-col gap-6">
      <Link to="/my-account/applications" className="flex items-center gap-1.5 text-sm font-semibold text-forest-700">
        <ArrowLeft className="h-4 w-4" /> Back to My Applications
      </Link>

      <div className="card-gov p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {application.service === 'birth_certificate' ? 'Birth Certificate' : 'National ID'}
            </p>
            <h1 className="mt-1 text-xl font-bold text-charcoal-900">{application.reference}</h1>
          </div>
          <ApplicationStatus status={application.status} />
        </div>

        {(application.submittedAt || application.updatedAt) && (
          <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4">
            {application.submittedAt && (
              <>
                <dt className="text-slate-400">Submitted</dt>
                <dd className="text-charcoal-900">{formatDate(application.submittedAt)}</dd>
              </>
            )}
            {application.updatedAt && (
              <>
                <dt className="text-slate-400">Last Updated</dt>
                <dd className="text-charcoal-900">{formatDate(application.updatedAt)}</dd>
              </>
            )}
          </dl>
        )}

        {justResubmitted && (
          <div className="mt-6 flex gap-3 rounded-[var(--radius-card)] border border-forest-100 bg-forest-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold text-forest-800">Application resubmitted</p>
              <p className="mt-1 text-forest-700">
                Your corrected application is back in review. We'll message you when there's an update. If your new
                photos don't pass our automated document check, the application may be returned to you again.
              </p>
            </div>
          </div>
        )}

        {application.status === 'rejected' && (application.service === 'national_id' || hasDetail) && !justResubmitted && (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-3 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-semibold text-red-800">Application Rejected</p>
                {application.officialMessage ? (
                  <>
                    <p className="mt-1 text-red-700">
                      <span className="font-semibold">Reason:</span> {application.officialMessage}
                    </p>
                    <p className="mt-1 text-red-700">
                      Correct what's mentioned above, then resubmit — you don't need to start a new application.
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-red-700">
                    {application.service === 'national_id'
                      ? "We couldn't approve this application. Check that your National ID number matches your birth certificate and that the photo is clear and shows the whole document, then correct and resubmit."
                      : "We couldn't approve this application. Check the child's details, both parents' National ID numbers and that every document photo is clear and shows the whole document, then correct and resubmit."}
                  </p>
                )}
                {!isEditing && (
                  <Button size="sm" className="mt-3" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit &amp; Resubmit
                  </Button>
                )}
              </div>
            </div>
            {isEditing &&
              (application.service === 'national_id' ? (
                <EditNationalIdForm
                  application={application}
                  stationName={stationName}
                  onCancel={() => setIsEditing(false)}
                  onResubmitted={() => {
                    setIsEditing(false)
                    setJustResubmitted(true)
                  }}
                />
              ) : (
                <EditBirthApplicationForm
                  application={application}
                  onCancel={() => setIsEditing(false)}
                  onResubmitted={() => {
                    setIsEditing(false)
                    setJustResubmitted(true)
                  }}
                />
              ))}
          </div>
        )}

        {application.status === 'additional_information_required' && (
          <div className="mt-6 flex gap-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800">Action Required</p>
              <p className="mt-1 text-amber-700">
                The Registrar's Office requires additional information before your application can continue.
              </p>
              <Button size="sm" variant="secondary" className="mt-3">Provide Information</Button>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Application Timeline</h2>
            <div className="mt-4"><ApplicationTimeline events={application.timeline} /></div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Submitted Information</h2>
            {!hasDetail && (
              <p className="mt-3 rounded-[var(--radius-card)] border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Detailed application information isn't available from this view yet — only the reference, status
                and timeline are currently returned for applications listed this way.
              </p>
            )}
            {application.service === 'birth_certificate' ? (
              hasDetail && (
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Child's Name</dt>
                  <dd className="text-charcoal-900">
                    {application.child.firstName} {application.child.middleNames} {application.child.surname}
                  </dd>
                  <dt className="text-slate-400">Sex</dt>
                  <dd className="text-charcoal-900">{application.child.sex === 'FEMALE' ? 'Female' : 'Male'}</dd>
                  {application.child.dateOfBirth && (
                    <>
                      <dt className="text-slate-400">Date of Birth</dt>
                      <dd className="text-charcoal-900">{formatDate(application.child.dateOfBirth)}</dd>
                    </>
                  )}
                  <dt className="text-slate-400">Place of Birth</dt>
                  <dd className="text-charcoal-900">{application.child.placeOfBirth}</dd>
                  <dt className="text-slate-400">Village of Origin</dt>
                  <dd className="text-charcoal-900">{application.child.villageOfOrigin}</dd>
                  {application.child.districtOfOriginName && (
                    <>
                      <dt className="text-slate-400">District of Origin</dt>
                      <dd className="text-charcoal-900">{application.child.districtOfOriginName}</dd>
                    </>
                  )}
                  <dt className="text-slate-400">Home Address</dt>
                  <dd className="text-charcoal-900">{application.child.address}</dd>
                  <dt className="text-slate-400">Hospital of Birth</dt>
                  <dd className="text-charcoal-900">{application.child.hospitalName ?? application.child.hospital}</dd>
                  <dt className="text-slate-400">Collection Station</dt>
                  <dd className="text-charcoal-900">{application.child.stationName ?? application.child.station}</dd>
                  <dt className="text-slate-400">Mother's National ID</dt>
                  <dd className="text-charcoal-900">
                    {maskNationalId(application.parents.motherNationalId)}
                    {application.motherFirstName && ` (${application.motherFirstName} ${application.motherSurname})`}
                  </dd>
                  {application.parents.fatherNationalId && (
                    <>
                      <dt className="text-slate-400">Father's National ID</dt>
                      <dd className="text-charcoal-900">
                        {maskNationalId(application.parents.fatherNationalId)}
                        {application.fatherFirstName && ` (${application.fatherFirstName} ${application.fatherSurname})`}
                      </dd>
                    </>
                  )}
                </dl>
              )
            ) : (
              hasDetail && (
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  {(application.applicantFirstName || application.applicantSurname) && (
                    <>
                      <dt className="text-slate-400">Applicant</dt>
                      <dd className="text-charcoal-900">{application.applicantFirstName} {application.applicantSurname}</dd>
                    </>
                  )}
                  {application.applicantDateOfBirth && (
                    <>
                      <dt className="text-slate-400">Date of Birth</dt>
                      <dd className="text-charcoal-900">{formatDate(application.applicantDateOfBirth)}</dd>
                    </>
                  )}
                  <dt className="text-slate-400">National ID Number</dt>
                  <dd className="text-charcoal-900">{maskNationalId(application.nationalIdNumber)}</dd>
                  <dt className="text-slate-400">Collection Station</dt>
                  <dd className="text-charcoal-900">{stationName}</dd>
                </dl>
              )
            )}

            {application.service === 'birth_certificate' && hasDetail && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Documents</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-charcoal-900">
                  <li className="flex items-center justify-between gap-3">
                    <span>Hospital Birth Record</span>
                    <span className="max-w-[60%] truncate text-xs text-slate-500">{application.hospitalRecordImageUrl}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Mother's National ID</span>
                    <span className="max-w-[60%] truncate text-xs text-slate-500">{application.motherIdImageUrl}</span>
                  </li>
                  {application.fatherIdImageUrl && (
                    <li className="flex items-center justify-between gap-3">
                      <span>Father's National ID</span>
                      <span className="max-w-[60%] truncate text-xs text-slate-500">{application.fatherIdImageUrl}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
