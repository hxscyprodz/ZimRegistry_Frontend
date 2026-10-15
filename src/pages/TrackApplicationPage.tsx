import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Search, AlertTriangle, LogIn, FileStack, ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { ApplicationStatus } from '@/components/shared/ApplicationStatus'
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline'
import { ErrorState } from '@/components/shared/ErrorState'
import { PageLoading, CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { trackApplicationSchema, type TrackApplicationFormValues } from '@/schemas/track-application.schema'
import { useTrackApplication, useApplications } from '@/hooks/useApplications'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/lib/utils'

export function TrackApplicationPage({ initialReference }: { initialReference?: string }) {
  const [reference, setReference] = useState<string | null>(initialReference ?? null)
  const { data, isLoading, isError, error, refetch } = useTrackApplication(reference)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  // Tracking is owner-only on the backend (see applications.api.ts): it
  // needs a signed-in citizen, and only finds applications submitted from
  // that citizen's own account. Surface a missing session distinctly from
  // "not found", since retrying won't help until the citizen signs in.
  const requiresSignIn = isError && /access token|unauthori[sz]ed/i.test((error as Error)?.message ?? '')

  // Let signed-in citizens pick straight from their own applications
  // instead of having to type/copy a reference number.
  const { data: myApplications, isLoading: isLoadingMyApplications } = useApplications({ enabled: isAuthenticated })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrackApplicationFormValues>({
    resolver: zodResolver(trackApplicationSchema),
    defaultValues: { reference: initialReference ?? '' },
  })

  const trackReference = (value: string) => {
    setValue('reference', value)
    setReference(value)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Track Application' }]} />
      <div className="container-gov max-w-2xl py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Track Your Application</h1>
        <p className="mt-3 text-sm text-slate-600">
          Check the current status of an application you submitted. For your privacy, you can only track applications
          made from your own account.
        </p>

        {!hasHydrated && (
          <div className="mt-10">
            <PageLoading label="Checking your account…" />
          </div>
        )}

        {hasHydrated && !isAuthenticated && (
          <div className="card-gov mt-8 flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
              <LogIn className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-charcoal-900">Sign in to track your applications</h2>
            <p className="max-w-sm text-sm text-slate-500">
              Application tracking is only available to the citizen who submitted the application. Sign in to see your
              applications and their progress.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Link to="/login">
                <Button size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="secondary">Create an Account</Button>
              </Link>
            </div>
          </div>
        )}

        {hasHydrated && isAuthenticated && <>
        <form
          className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={handleSubmit((values) => setReference(values.reference))}
        >
          <div className="flex-1">
            <FormField label="Application Reference Number" htmlFor="reference" required error={errors.reference?.message} hint="Starts with BT- (birth certificate) or ID- (National ID).">
              <input id="reference" className={inputClass(!!errors.reference)} {...register('reference')} />
            </FormField>
          </div>
          <Button type="submit" loading={isLoading}>
            <Search className="h-4 w-4" /> Track Application
          </Button>
        </form>

          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gold-600">
              <FileStack className="h-4 w-4" aria-hidden="true" />
              Or Pick One of Your Applications
            </h2>
            {isLoadingMyApplications && (
              <div className="mt-3">
                <CardSkeleton />
              </div>
            )}
            {!isLoadingMyApplications && myApplications?.length === 0 && (
              <p className="mt-3 text-sm text-slate-500">You haven't submitted any applications yet.</p>
            )}
            {!isLoadingMyApplications && myApplications && myApplications.length > 0 && (
              <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-[var(--radius-card)] border border-slate-200 bg-white">
                {myApplications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => trackReference(app.reference)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-forest-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-charcoal-900">{app.reference}</p>
                      <p className="text-xs text-slate-500">
                        {app.service === 'birth_certificate' ? 'Birth Certificate' : 'National ID'}
                        {app.submittedAt && ` · ${formatDate(app.submittedAt, 'short')}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <ApplicationStatus status={app.status} />
                      <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>


        <div className="mt-10">
          {isLoading && <PageLoading label="Looking up your application…" />}

          {!isLoading && requiresSignIn && (
            <div className="card-gov flex flex-col items-center gap-3 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
                <LogIn className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-charcoal-900">Sign in to track this application</h3>
              <p className="max-w-sm text-sm text-slate-500">
                Tracking is only available to the citizen who submitted the application. Your session may have expired — sign in again and retry.
              </p>
              <Link to="/login">
                <Button size="sm" className="mt-2">Sign In</Button>
              </Link>
            </div>
          )}

          {!isLoading && isError && !requiresSignIn && (
            <ErrorState kind="not-found" onAction={() => refetch()} />
          )}

          {!isLoading && data && (
            <div className="card-gov p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Application Found</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal-900">
                    {data.service === 'birth_certificate' ? 'Birth Certificate' : 'National ID'}
                  </p>
                </div>
                <ApplicationStatus status={data.status} />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-slate-400">Reference</dt>
                <dd className="text-charcoal-900">{data.reference}</dd>
                {data.submittedAt && (
                  <>
                    <dt className="text-slate-400">Submitted</dt>
                    <dd className="text-charcoal-900">{formatDate(data.submittedAt)}</dd>
                  </>
                )}
              </dl>

              {data.status === 'additional_information_required' && (
                <div className="mt-6 flex gap-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800">Action Required</p>
                    <p className="mt-1 text-amber-700">
                      The Registrar's Office requires additional information before your application can continue.
                    </p>
                    {data.officialMessage && <p className="mt-1 text-amber-700">Reason: {data.officialMessage}</p>}
                    <Button size="sm" variant="secondary" className="mt-3">Provide Information</Button>
                  </div>
                </div>
              )}

              {data.status === 'rejected' && (
                <div className="mt-6 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Application Rejected</p>
                  <p className="mt-1">{data.officialMessage ?? 'Please visit your nearest registry office for details on next steps.'}</p>
                  {(data.service === 'national_id' || data.service === 'birth_certificate') && (
                    <>
                      <p className="mt-1">
                        You can correct this application and resubmit it — you don't need to start a new one.
                      </p>
                      <Link to="/my-account/applications/$applicationId" params={{ applicationId: data.id }}>
                        <Button size="sm" className="mt-3">Edit &amp; Resubmit</Button>
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">Application Timeline</h2>
                <div className="mt-4">
                  <ApplicationTimeline events={data.timeline} />
                </div>
              </div>
            </div>
          )}
        </div>
        </>}
      </div>
    </div>
  )
}
