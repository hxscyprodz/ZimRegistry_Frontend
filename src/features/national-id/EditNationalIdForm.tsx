import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { FileUploader } from '@/components/shared/FileUploader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { editNationalIdApplicationSchema, type EditNationalIdApplicationFormValues } from '@/schemas/national-id.schema'
import { useUpdateNationalIdApplication } from '@/hooks/useSubmitApplications'
import { deleteDocument } from '@/api/upload.api'
import type { UpdateNationalIdPayload } from '@/api/national-id.api'
import type { NationalIdApplication } from '@/types'

/**
 * Correct-and-resubmit form for a REJECTED National ID application.
 * Resubmits the *same* application (PUT /api/v1/applications/id/:id) rather
 * than starting a new one, and only sends the fields that actually changed:
 * the backend refuses a National ID number identical to the current one, and
 * a missing photo simply keeps the existing one.
 */
export function EditNationalIdForm({
  application,
  stationName,
  onCancel,
  onResubmitted,
}: {
  application: NationalIdApplication
  stationName?: string
  onCancel: () => void
  onResubmitted: () => void
}) {
  const update = useUpdateNationalIdApplication()
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined)
  const [confirmUnchanged, setConfirmUnchanged] = useState(false)

  // Refs (not state) so the unmount cleanup always sees the latest values:
  // if the citizen uploads a replacement photo but leaves without
  // resubmitting, that file is orphaned and gets removed.
  const newImageRef = useRef<string | undefined>(undefined)
  const resubmittedRef = useRef(false)
  useEffect(() => {
    return () => {
      if (!resubmittedRef.current && newImageRef.current) {
        deleteDocument(newImageRef.current).catch(() => {})
      }
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditNationalIdApplicationFormValues>({
    resolver: zodResolver(editNationalIdApplicationSchema),
    defaultValues: { nationalIdNumber: application.nationalIdNumber },
  })

  const send = (payload: UpdateNationalIdPayload) => {
    update.mutate(
      { applicationId: application.id, payload },
      {
        onSuccess: () => {
          resubmittedRef.current = true
          // The replaced photo is no longer referenced by anything.
          if (payload.birthCertificateImageUrl && application.birthCertificateImageUrl) {
            deleteDocument(application.birthCertificateImageUrl).catch(() => {})
          }
          onResubmitted()
        },
      },
    )
  }

  const onSubmit = (values: EditNationalIdApplicationFormValues) => {
    const payload: UpdateNationalIdPayload = {}
    if (values.nationalIdNumber !== application.nationalIdNumber) payload.nationalIdNumber = values.nationalIdNumber
    if (newImageUrl) payload.birthCertificateImageUrl = newImageUrl

    if (Object.keys(payload).length === 0) {
      setConfirmUnchanged(true)
      return
    }
    send(payload)
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-forest-100 bg-forest-50/40 p-5">
      <h2 className="text-base font-semibold text-charcoal-900">Correct &amp; Resubmit</h2>
      <p className="mt-1 text-sm text-slate-600">
        Update the details below and resubmit this same application — you don't need to start a new one. It will go
        back into review once you resubmit.
      </p>

      <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="National ID Number on Birth Certificate"
          htmlFor="edit-nationalIdNumber"
          required
          error={errors.nationalIdNumber?.message}
          hint="The 14-character identity number printed on your birth certificate. Leave it as is if it was correct."
        >
          <input
            id="edit-nationalIdNumber"
            maxLength={14}
            className={inputClass(!!errors.nationalIdNumber)}
            {...register('nationalIdNumber')}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <FileUploader
            label="Replace Birth Certificate Photo"
            folder="national-id/birth-certificate"
            value={newImageUrl}
            onChange={(url) => {
              newImageRef.current = url
              setNewImageUrl(url)
            }}
          />
          <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
            {newImageUrl
              ? 'This photo will replace your current one when you resubmit.'
              : 'Optional — if you don\'t upload a new photo, your current one is kept.'}
            {application.birthCertificateImageUrl && !newImageUrl && (
              <a
                href={application.birthCertificateImageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-forest-700 underline underline-offset-2"
              >
                View current photo <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </p>
        </div>

        <FormField
          label="Collection Station"
          htmlFor="edit-station"
          hint="The collection station can't be changed when resubmitting."
        >
          <input id="edit-station" disabled value={stationName ?? application.station} className={inputClass()} />
        </FormField>

        {update.isError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {(update.error as Error).message || 'We could not resubmit your application. Please try again.'}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={update.isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={update.isPending}>
            Resubmit Application
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmUnchanged}
        title="Resubmit without changes?"
        description="You haven't changed any details or uploaded a new photo. Resubmitting as-is puts the application back in review, but it may be rejected again for the same reason."
        confirmLabel="Resubmit As-Is"
        onCancel={() => setConfirmUnchanged(false)}
        onConfirm={() => {
          setConfirmUnchanged(false)
          send({})
        }}
      />
    </div>
  )
}
