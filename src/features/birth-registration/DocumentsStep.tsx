import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FileUploader } from '@/components/shared/FileUploader'
import { documentsSchema, type DocumentsFormValues } from '@/schemas/birth-certificate.schema'
import { useBirthApplicationStore } from '@/stores/birthApplicationStore'

export function DocumentsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const documentUrls = useBirthApplicationStore((s) => s.documentUrls)
  const setDocumentUrls = useBirthApplicationStore((s) => s.setDocumentUrls)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: documentUrls,
  })

  const onSubmit = (values: DocumentsFormValues) => {
    setDocumentUrls({ ...values, fatherIdImageUrl: values.fatherIdImageUrl || undefined })
    onNext()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-charcoal-900">Supporting Documents</h2>

      <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-forest-500/20 bg-forest-500/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
        <div className="text-sm text-charcoal-900">
          <p className="font-medium">Your documents are securely transmitted for application processing.</p>
          <p className="mt-1 text-slate-500">
            Only upload clear images of the requested official documents. For ID cards, make sure the entire document
            is visible in the frame.
          </p>
        </div>
      </div>

      <Controller
        name="hospitalRecordImageUrl"
        control={control}
        render={({ field }) => (
          <FileUploader
            label="Hospital Birth Record"
            folder="birth-certificate/hospital-record"
            value={field.value}
            onChange={(url: string | undefined) => {
              setDocumentUrls({ hospitalRecordImageUrl: url })
              field.onChange(url)
            }}
            hasError={!!errors.hospitalRecordImageUrl}
            required
          />
        )}
      />
      {errors.hospitalRecordImageUrl && (
        <p role="alert" className="-mt-4 text-xs font-medium text-red-600">{errors.hospitalRecordImageUrl.message}</p>
      )}

      <Controller
        name="motherIdImageUrl"
        control={control}
        render={({ field }) => (
          <FileUploader
            label="Mother's National ID"
            folder="birth-certificate/mothers-id"
            value={field.value}
            onChange={(url: string | undefined) => {
              setDocumentUrls({ motherIdImageUrl: url })
              field.onChange(url)
            }}
            hasError={!!errors.motherIdImageUrl}
            required
          />
        )}
      />
      {errors.motherIdImageUrl && (
        <p role="alert" className="-mt-4 text-xs font-medium text-red-600">{errors.motherIdImageUrl.message}</p>
      )}

      <Controller
        name="fatherIdImageUrl"
        control={control}
        render={({ field }) => (
          <FileUploader
            label="Father's National ID (Optional)"
            folder="birth-certificate/fathers-id"
            value={field.value}
            onChange={(url: string | undefined) => {
              setDocumentUrls({ fatherIdImageUrl: url })
              field.onChange(url)
            }}
            hasError={!!errors.fatherIdImageUrl}
          />
        )}
      />
      {errors.fatherIdImageUrl && (
        <p role="alert" className="-mt-4 text-xs font-medium text-red-600">{errors.fatherIdImageUrl.message}</p>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}
