import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Select } from '@/components/ui/Select'
import { FileUploader } from '@/components/shared/FileUploader'
import { editBirthApplicationSchema, type EditBirthApplicationFormValues } from '@/schemas/birth-certificate.schema'
import { useUpdateBirthCertificateApplication } from '@/hooks/useSubmitApplications'
import { useDistricts, useHospitals } from '@/hooks/useLocations'
import { deleteDocument } from '@/api/upload.api'
import type { UpdateBirthCertificatePayload } from '@/api/birth-certificates.api'
import type { BirthCertificateApplication } from '@/types'

type DocumentKey = 'hospitalRecordImageUrl' | 'motherIdImageUrl' | 'fatherIdImageUrl'

const DOCUMENTS: { key: DocumentKey; label: string; folder: string }[] = [
  { key: 'hospitalRecordImageUrl', label: 'Replace Hospital Birth Record', folder: 'birth-certificate/hospital-record' },
  { key: 'motherIdImageUrl', label: "Replace Mother's National ID", folder: 'birth-certificate/mothers-id' },
  { key: 'fatherIdImageUrl', label: "Replace Father's National ID", folder: 'birth-certificate/fathers-id' },
]

/**
 * Correct-and-resubmit form for a REJECTED birth certificate application.
 * Resubmits the *same* application (PUT /api/v1/applications/birth/:id) and
 * sends only what changed — the backend refuses an empty update and one where
 * nothing differs from what's on file, so the button stays disabled until
 * something actually changes.
 *
 * Two fields can't be prefilled because the detail endpoint doesn't return
 * them (date of birth and district of origin): they're left empty and mean
 * "keep what's on file" unless the citizen fills them in.
 */
export function EditBirthApplicationForm({
  application,
  onCancel,
  onResubmitted,
}: {
  application: BirthCertificateApplication
  onCancel: () => void
  onResubmitted: () => void
}) {
  const update = useUpdateBirthCertificateApplication()
  const { data: districts, isLoading: isLoadingDistricts } = useDistricts()
  const { data: hospitals, isLoading: isLoadingHospitals } = useHospitals()

  const child = application.child
  const [newImages, setNewImages] = useState<Partial<Record<DocumentKey, string>>>({})

  // Refs so the unmount cleanup sees the latest uploads: replacement photos
  // the citizen uploaded but never submitted are orphaned and get removed.
  const newImagesRef = useRef<Partial<Record<DocumentKey, string>>>({})
  const resubmittedRef = useRef(false)
  useEffect(() => {
    return () => {
      if (resubmittedRef.current) return
      for (const url of Object.values(newImagesRef.current)) {
        if (url) deleteDocument(url).catch(() => {})
      }
    }
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditBirthApplicationFormValues>({
    resolver: zodResolver(editBirthApplicationSchema),
    defaultValues: {
      firstName: child.firstName,
      middleNames: child.middleNames ?? '',
      surname: child.surname,
      sex: child.sex,
      dateOfBirth: '',
      placeOfBirth: child.placeOfBirth,
      villageOfOrigin: child.villageOfOrigin,
      districtOfOrigin: '',
      address: child.address,
      hospital: child.hospital,
      motherNationalId: application.parents.motherNationalId,
      fatherNationalId: application.parents.fatherNationalId ?? '',
    },
  })

  /** Only the fields that differ from what's on file — see the component note. */
  const buildPayload = (v: EditBirthApplicationFormValues): UpdateBirthCertificatePayload => {
    const payload: UpdateBirthCertificatePayload = {}
    if (v.firstName !== child.firstName) payload.firstName = v.firstName
    // An existing value can't be cleared via this endpoint, only changed.
    if (v.middleNames && v.middleNames !== (child.middleNames ?? '')) payload.middleNames = v.middleNames
    if (v.surname !== child.surname) payload.surname = v.surname
    if (v.sex !== child.sex) payload.sex = v.sex
    if (v.dateOfBirth && v.dateOfBirth !== child.dateOfBirth) payload.dateOfBirth = v.dateOfBirth
    if (v.placeOfBirth !== child.placeOfBirth) payload.placeOfBirth = v.placeOfBirth
    if (v.villageOfOrigin !== child.villageOfOrigin) payload.villageOfOrigin = v.villageOfOrigin
    if (v.districtOfOrigin && v.districtOfOrigin !== child.districtOfOrigin) payload.districtOfOrigin = v.districtOfOrigin
    if (v.address !== child.address) payload.address = v.address
    if (v.hospital && v.hospital !== child.hospital) payload.hospital = v.hospital
    if (v.motherNationalId !== application.parents.motherNationalId) payload.motherIdNumber = v.motherNationalId
    if (v.fatherNationalId && v.fatherNationalId !== (application.parents.fatherNationalId ?? '')) {
      payload.fatherIdNumber = v.fatherNationalId
    }
    for (const { key } of DOCUMENTS) {
      const url = newImages[key]
      if (url) payload[key] = url
    }
    return payload
  }

  const values = watch()
  const hasChanges = Object.keys(buildPayload(values)).length > 0

  const onSubmit = (v: EditBirthApplicationFormValues) => {
    const payload = buildPayload(v)
    if (Object.keys(payload).length === 0) return
    update.mutate(
      { applicationId: application.id, payload },
      {
        onSuccess: () => {
          resubmittedRef.current = true
          // Photos that were replaced are no longer referenced by anything.
          const previous: Record<DocumentKey, string | undefined> = {
            hospitalRecordImageUrl: application.hospitalRecordImageUrl,
            motherIdImageUrl: application.motherIdImageUrl,
            fatherIdImageUrl: application.fatherIdImageUrl,
          }
          for (const { key } of DOCUMENTS) {
            if (payload[key] && previous[key]) deleteDocument(previous[key]!).catch(() => {})
          }
          onResubmitted()
        },
      },
    )
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-forest-100 bg-forest-50/40 p-5">
      <h2 className="text-base font-semibold text-charcoal-900">Correct &amp; Resubmit</h2>
      <p className="mt-1 text-sm text-slate-600">
        Update whatever needs fixing and resubmit this same application — you don't need to start a new one. Only the
        details you change are sent.
      </p>

      <form className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-sm font-semibold text-charcoal-900 sm:col-span-2">Child Information</h3>

        <FormField label="First Name" htmlFor="edit-firstName" error={errors.firstName?.message}>
          <input id="edit-firstName" className={inputClass(!!errors.firstName)} {...register('firstName')} />
        </FormField>
        <FormField label="Middle Name(s)" htmlFor="edit-middleNames" error={errors.middleNames?.message}>
          <input id="edit-middleNames" className={inputClass(!!errors.middleNames)} {...register('middleNames')} />
        </FormField>
        <FormField label="Surname" htmlFor="edit-surname" error={errors.surname?.message}>
          <input id="edit-surname" className={inputClass(!!errors.surname)} {...register('surname')} />
        </FormField>
        <FormField label="Sex" htmlFor="edit-sex" error={errors.sex?.message}>
          <Select id="edit-sex" hasError={!!errors.sex} {...register('sex')}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </Select>
        </FormField>
        <FormField
          label="Date of Birth"
          htmlFor="edit-dateOfBirth"
          error={errors.dateOfBirth?.message}
          hint="Leave empty to keep the date on file."
        >
          <input id="edit-dateOfBirth" type="date" className={inputClass(!!errors.dateOfBirth)} {...register('dateOfBirth')} />
        </FormField>
        <FormField label="Place of Birth" htmlFor="edit-placeOfBirth" error={errors.placeOfBirth?.message}>
          <input id="edit-placeOfBirth" className={inputClass(!!errors.placeOfBirth)} {...register('placeOfBirth')} />
        </FormField>
        <FormField label="Village of Origin" htmlFor="edit-villageOfOrigin" error={errors.villageOfOrigin?.message}>
          <input id="edit-villageOfOrigin" className={inputClass(!!errors.villageOfOrigin)} {...register('villageOfOrigin')} />
        </FormField>
        <FormField
          label="District of Origin"
          htmlFor="edit-districtOfOrigin"
          error={errors.districtOfOrigin?.message}
          hint="Leave as “Keep current” unless it needs correcting."
        >
          <Select
            id="edit-districtOfOrigin"
            hasError={!!errors.districtOfOrigin}
            disabled={isLoadingDistricts}
            {...register('districtOfOrigin')}
          >
            <option value="">{isLoadingDistricts ? 'Loading districts…' : 'Keep current'}</option>
            {districts?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Home Address" htmlFor="edit-address" error={errors.address?.message}>
            <input id="edit-address" className={inputClass(!!errors.address)} {...register('address')} />
          </FormField>
        </div>
        <FormField label="Hospital of Birth" htmlFor="edit-hospital" error={errors.hospital?.message}>
          <Select id="edit-hospital" hasError={!!errors.hospital} disabled={isLoadingHospitals} {...register('hospital')}>
            <option value="">{isLoadingHospitals ? 'Loading hospitals…' : 'Keep current'}</option>
            {hospitals?.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Collection Station" htmlFor="edit-station" hint="The collection station can't be changed when resubmitting.">
          <input id="edit-station" disabled value={child.stationName ?? child.station} className={inputClass()} />
        </FormField>

        <h3 className="mt-2 text-sm font-semibold text-charcoal-900 sm:col-span-2">Parent Details</h3>
        <FormField
          label="Mother's National ID Number"
          htmlFor="edit-motherNationalId"
          error={errors.motherNationalId?.message}
          hint="Must match a registered birth certificate."
        >
          <input id="edit-motherNationalId" maxLength={14} className={inputClass(!!errors.motherNationalId)} {...register('motherNationalId')} />
        </FormField>
        <FormField
          label="Father's National ID Number"
          htmlFor="edit-fatherNationalId"
          error={errors.fatherNationalId?.message}
          hint={
            application.parents.fatherNationalId
              ? "Can be corrected but not removed."
              : 'Optional — add it if it was missing.'
          }
        >
          <input id="edit-fatherNationalId" maxLength={14} className={inputClass(!!errors.fatherNationalId)} {...register('fatherNationalId')} />
        </FormField>

        <h3 className="mt-2 text-sm font-semibold text-charcoal-900 sm:col-span-2">Supporting Documents</h3>
        <p className="-mt-3 text-xs text-slate-500 sm:col-span-2">
          Optional — upload a new photo only for a document that needs replacing. Anything you don't replace is kept.
        </p>
        <div className="flex flex-col gap-5 sm:col-span-2">
          {DOCUMENTS.map(({ key, label, folder }) => {
            const currentUrl = application[key]
            const replacement = newImages[key]
            return (
              <div key={key} className="flex flex-col gap-2">
                <FileUploader
                  label={label}
                  folder={folder}
                  value={replacement}
                  onChange={(url: string | undefined) => {
                    newImagesRef.current = { ...newImagesRef.current, [key]: url }
                    setNewImages((prev) => ({ ...prev, [key]: url }))
                  }}
                />
                <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
                  {replacement ? 'This photo will replace the current one when you resubmit.' : currentUrl ? 'Your current photo is kept unless you upload a new one.' : 'No photo on file.'}
                  {currentUrl && !replacement && (
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-forest-700 underline underline-offset-2"
                    >
                      View current photo <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </p>
              </div>
            )
          })}
        </div>

        {update.isError && (
          <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
            {(update.error as Error).message || 'We could not resubmit your application. Please try again.'}
          </p>
        )}

        <div className="flex flex-col items-end gap-2 sm:col-span-2">
          {!hasChanges && (
            <p className="text-xs text-slate-500">Change at least one detail or upload a new document to resubmit.</p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={update.isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={update.isPending} disabled={!hasChanges}>
              Resubmit Application
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
