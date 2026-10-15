import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { parentDetailsSchema, type ParentDetailsFormValues } from '@/schemas/birth-certificate.schema'
import { useBirthApplicationStore } from '@/stores/birthApplicationStore'

export function ParentDetailsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const parentDetails = useBirthApplicationStore((s) => s.parentDetails)
  const setParentDetails = useBirthApplicationStore((s) => s.setParentDetails)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentDetailsFormValues>({
    resolver: zodResolver(parentDetailsSchema),
    defaultValues: parentDetails,
  })

  const onSubmit = (values: ParentDetailsFormValues) => {
    setParentDetails({ ...values, fatherNationalId: values.fatherNationalId || undefined })
    onNext()
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-charcoal-900">Parent Information</h2>
      <p className="-mt-4 text-sm text-slate-500">
        Both parents must already have their own registered birth certificate on file — we use their National ID
        number to verify this.
      </p>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">Mother</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="National ID Number"
            htmlFor="motherNationalId"
            required
            error={errors.motherNationalId?.message}
            hint="14 characters, matching her existing birth certificate record."
          >
            <input id="motherNationalId" maxLength={14} className={inputClass(!!errors.motherNationalId)} {...register('motherNationalId')} />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">Father (Optional)</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="National ID Number"
            htmlFor="fatherNationalId"
            error={errors.fatherNationalId?.message}
            hint="14 characters. Leave blank if not applicable."
          >
            <input id="fatherNationalId" maxLength={14} className={inputClass(!!errors.fatherNationalId)} {...register('fatherNationalId')} />
          </FormField>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}
