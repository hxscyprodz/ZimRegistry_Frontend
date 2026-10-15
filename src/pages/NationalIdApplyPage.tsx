import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { StepIndicator } from '@/components/shared/StepIndicator'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Select } from '@/components/ui/Select'
import { FileUploader } from '@/components/shared/FileUploader'
import { SubmissionSuccess } from '@/components/shared/SubmissionSuccess'
import { EligibilityGate } from '@/components/shared/EligibilityGate'
import { nationalIdApplicationSchema, type NationalIdApplicationFormValues } from '@/schemas/national-id.schema'
import { useSubmitNationalIdApplication } from '@/hooks/useSubmitApplications'
import { useStations } from '@/hooks/useLocations'
import { deleteDocument } from '@/api/upload.api'
import type { NationalIdApplication } from '@/types'

const steps = ['Application Details', 'Confirm & Submit']

export function NationalIdApplyPage() {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<NationalIdApplicationFormValues | null>(null)
  const [submitted, setSubmitted] = useState<NationalIdApplication | null>(null)
  const submitMutation = useSubmitNationalIdApplication()

  // Tracks whichever document URL is currently uploaded, regardless of
  // step, so the cleanup effect below knows what to delete if the citizen
  // abandons the flow without submitting. Refs (not state) so the unmount
  // effect always reads the latest value rather than a stale closure.
  const submittedRef = useRef<NationalIdApplication | null>(null)
  const uploadedUrlRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    submittedRef.current = submitted
  }, [submitted])

  useEffect(() => {
    return () => {
      // Leaving the flow entirely without a successful submission — clean
      // up whatever document is currently uploaded rather than leaving an
      // orphaned file in the bucket. Can't catch a hard tab close/refresh;
      // see the equivalent note in BirthCertificateApplyPage.
      if (!submittedRef.current && uploadedUrlRef.current) {
        deleteDocument(uploadedUrlRef.current).catch(() => {})
      }
    }
  }, [])

  // Collection points come from the real backend (GET /api/v1/stations),
  // not districts — a station belongs to exactly one district.
  const { data: stations, isLoading: isLoadingStations, isError: isStationsError, refetch: refetchStations } = useStations()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NationalIdApplicationFormValues>({ resolver: zodResolver(nationalIdApplicationSchema) })

  const selectedStationName = (id: string) => {
    const station = stations?.find((s) => s.id === id)
    return station ? `${station.name} — ${station.district.name}` : undefined
  }

  if (submitted) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'e-Services', to: '/e-services' }, { label: 'National ID' }]} />
        <div className="container-gov max-w-2xl py-12">
          <SubmissionSuccess serviceName="National ID" reference={submitted.reference} submittedAt={submitted.submittedAt} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'e-Services', to: '/e-services' }, { label: 'National ID Application' }]} />
      <div className="container-gov max-w-2xl py-10">
        <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">National ID Application</h1>
        <p className="mt-2 text-sm text-slate-500">A quick, guided application for your National ID.</p>

        <div className="mt-10">
          <EligibilityGate>
            <div className="mb-8">
              <StepIndicator steps={steps} currentStep={step} />
            </div>
            <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 sm:p-8">
              {step === 1 && (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit((v) => {
                    setValues(v)
                    setStep(2)
                  })}
                >
                  <h2 className="text-lg font-semibold text-charcoal-900">Application Details</h2>
                  <FormField
                    label="National ID Number on Birth Certificate"
                    htmlFor="nationalIdNumber"
                    required
                    error={errors.nationalIdNumber?.message}
                    hint="The 14-character identity number printed on your birth certificate, used to verify your record."
                  >
                    <input id="nationalIdNumber" maxLength={14} className={inputClass(!!errors.nationalIdNumber)} {...register('nationalIdNumber')} />
                  </FormField>

                  <Controller
                    name="birthCertificateImageUrl"
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        label="Birth Certificate Photo"
                        folder="national-id/birth-certificate"
                        value={field.value}
                        onChange={(url) => {
                          uploadedUrlRef.current = url
                          field.onChange(url)
                        }}
                        hasError={!!errors.birthCertificateImageUrl}
                        required
                      />
                    )}
                  />
                  {errors.birthCertificateImageUrl && (
                    <p role="alert" className="-mt-3 text-xs font-medium text-red-600">
                      {errors.birthCertificateImageUrl.message}
                    </p>
                  )}

                  <h2 className="mt-2 text-lg font-semibold text-charcoal-900">Collection Details</h2>

                  {isStationsError ? (
                    <div className="flex items-start gap-2 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <div>
                        <p>We couldn't load the list of stations. Please check your connection and try again.</p>
                        <button
                          type="button"
                          onClick={() => refetchStations()}
                          className="mt-1 font-semibold underline underline-offset-2"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <FormField
                      label="Station for Collection"
                      htmlFor="station"
                      required
                      error={errors.station?.message}
                      hint="Choose the registry station where you'd like to collect your ID."
                    >
                      <Select
                        id="station"
                        hasError={!!errors.station}
                        disabled={isLoadingStations}
                        defaultValue=""
                        {...register('station')}
                      >
                        <option value="" disabled>
                          {isLoadingStations ? 'Loading stations…' : 'Select a station'}
                        </option>
                        {stations?.map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.name} — {station.district.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isStationsError}>Continue</Button>
                  </div>
                </form>
              )}

              {step === 2 && values && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal-900">Application Details</h2>
                    <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                      <dt className="text-slate-400">National ID Number</dt>
                      <dd className="text-charcoal-900">{values.nationalIdNumber}</dd>
                      <dt className="text-slate-400">Birth Certificate Image</dt>
                      <dd className="truncate text-charcoal-900">{values.birthCertificateImageUrl}</dd>
                    </dl>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal-900">Collection Details</h2>
                    <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                      <dt className="text-slate-400">Station</dt>
                      <dd className="text-charcoal-900">{selectedStationName(values.station) ?? values.station}</dd>
                    </dl>
                  </div>

                  {submitMutation.isError && (
                    <p role="alert" className="text-sm font-medium text-red-600">
                      {(submitMutation.error as Error).message || 'We could not submit your application. Please try again.'}
                    </p>
                  )}

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button
                      loading={submitMutation.isPending}
                      onClick={() =>
                        submitMutation.mutate(
                          { ...values, stationName: selectedStationName(values.station) },
                          { onSuccess: (application) => setSubmitted(application) },
                        )
                      }
                    >
                      Confirm &amp; Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </EligibilityGate>
        </div>
      </div>
    </div>
  )
}
