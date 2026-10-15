import { useEffect, useRef, useState } from 'react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { StepIndicator } from '@/components/shared/StepIndicator'
import { SubmissionSuccess } from '@/components/shared/SubmissionSuccess'
import { EligibilityGate } from '@/components/shared/EligibilityGate'
import { ChildDetailsStep } from '@/features/birth-registration/ChildDetailsStep'
import { ParentDetailsStep } from '@/features/birth-registration/ParentDetailsStep'
import { DocumentsStep } from '@/features/birth-registration/DocumentsStep'
import { ReviewStep } from '@/features/birth-registration/ReviewStep'
import { useBirthApplicationStore } from '@/stores/birthApplicationStore'
import { deleteDocument } from '@/api/upload.api'
import type { BirthCertificateApplication } from '@/types'

const steps = ['Child Details', 'Parent Details', 'Supporting Documents', 'Review']

export function BirthCertificateApplyPage() {
  const currentStep = useBirthApplicationStore((s) => s.currentStep)
  const setStep = useBirthApplicationStore((s) => s.setStep)
  const reset = useBirthApplicationStore((s) => s.reset)
  const [submitted, setSubmitted] = useState<BirthCertificateApplication | null>(null)

  // Tracked in a ref (not just the `submitted` state) so the unmount
  // effect below reads the latest value rather than a stale closure from
  // when the effect was first set up.
  const submittedRef = useRef<BirthCertificateApplication | null>(null)
  useEffect(() => {
    submittedRef.current = submitted
  }, [submitted])

  useEffect(() => {
    return () => {
      // Leaving the flow entirely (route change, back button, etc.). If the
      // application was never successfully submitted, any documents
      // already uploaded to Supabase are now orphaned — clean them up
      // rather than leaving them in the bucket. Skipped entirely on a
      // successful submission, since those files are now legitimately
      // referenced by the created application.
      //
      // Note: this can't catch a hard tab close or browser refresh — there's
      // no reliable client-side hook for that. A periodic server-side sweep
      // of unreferenced Storage objects is the robust long-term fix for
      // those cases.
      if (!submittedRef.current) {
        const { documentUrls } = useBirthApplicationStore.getState()
        Object.values(documentUrls).forEach((url) => {
          if (url) deleteDocument(url).catch(() => {})
        })
        reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (submitted) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'e-Services', to: '/e-services' }, { label: 'Birth Certificate' }]} />
        <div className="container-gov max-w-2xl py-12">
          <SubmissionSuccess
            serviceName="Birth Certificate"
            reference={submitted.reference}
            submittedAt={submitted.submittedAt}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'e-Services', to: '/e-services' }, { label: 'Birth Certificate Application' }]} />
      <div className="container-gov max-w-3xl py-10">
        <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">Birth Certificate Application</h1>
        <p className="mt-2 text-sm text-slate-500">Complete each step to submit your application to the Central Registry.</p>

        <div className="mt-10">
          <EligibilityGate>
            <div className="mb-8">
              <StepIndicator steps={steps} currentStep={currentStep} />
            </div>
            <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 sm:p-8">
              {currentStep === 1 && <ChildDetailsStep onNext={() => setStep(2)} />}
              {currentStep === 2 && <ParentDetailsStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {currentStep === 3 && <DocumentsStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
              {currentStep === 4 && (
                <ReviewStep
                  onBack={() => setStep(3)}
                  onEditStep={(step) => setStep(step)}
                  onSubmitted={(application) => {
                    setSubmitted(application)
                    reset()
                  }}
                />
              )}
            </div>
          </EligibilityGate>
        </div>
      </div>
    </div>
  )
}
