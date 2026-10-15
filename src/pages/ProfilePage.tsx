import { useForm } from 'react-hook-form'
import { CheckCircle2, Smartphone } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { maskNationalId } from '@/lib/utils'
import { PhoneVerification } from '@/components/shared/PhoneVerification'
import { useUpdateProfile } from '@/hooks/useAuth'

interface EditableProfileValues {
  email: string
  phone: string
  password: string
}

export function ProfilePage() {
  const citizen = useAuthStore((s) => s.citizen)
  const updateProfile = useUpdateProfile()

  const { register, handleSubmit, reset } = useForm<EditableProfileValues>({
    values: { email: citizen?.email ?? '', phone: citizen?.phone ?? '', password: '' },
  })

  if (!citizen) return null

  const onSubmit = (values: EditableProfileValues) => {
    updateProfile.mutate(
      {
        email: values.email !== citizen.email ? values.email : undefined,
        phoneNumber: values.phone !== citizen.phone ? values.phone : undefined,
        password: values.password || undefined,
      },
      { onSuccess: () => reset({ ...values, password: '' }) },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-charcoal-900">Profile</h1>

      <div className="card-gov max-w-xl p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-charcoal-900">Phone Number Verification</p>
          {citizen.phoneVerified ? (
            <Badge tone="green">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </Badge>
          ) : (
            <Badge tone="amber">
              <Smartphone className="h-3 w-3" /> Not Verified
            </Badge>
          )}
        </div>

        {!citizen.phoneVerified && (
          <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-500">
              Verify your phone number to be able to apply for civil registration documents.
            </p>
            <PhoneVerification phone={citizen.phone} />
          </div>
        )}
      </div>

      <div className="card-gov max-w-xl p-6">
        {!citizen.firstName && !citizen.surname && (
          <p className="mb-4 rounded-[var(--radius-card)] border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Your name isn't available yet — sign in again to refresh your profile from the backend.
          </p>
        )}
        <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="First Name" htmlFor="firstName" hint="From your birth certificate — not editable here.">
            <input id="firstName" disabled value={citizen.firstName} className={inputClass()} />
          </FormField>
          <FormField label="Surname" htmlFor="surname" hint="From your birth certificate — not editable here.">
            <input id="surname" disabled value={citizen.surname} className={inputClass()} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="National ID Number" htmlFor="nid" hint="Masked for your security — not editable here.">
              <input id="nid" disabled value={maskNationalId(citizen.nationalIdNumber)} className={inputClass()} />
            </FormField>
          </div>
          <FormField label="Email Address" htmlFor="email">
            <input id="email" type="email" className={inputClass()} {...register('email')} />
          </FormField>
          <FormField label="Phone Number" htmlFor="phone" hint="International format, e.g. +263771234567. Changing your number means you'll need to verify it again.">
            <input id="phone" type="tel" className={inputClass()} {...register('phone')} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="New Password" htmlFor="password" hint="Leave blank to keep your current password.">
              <input id="password" type="password" className={inputClass()} {...register('password')} />
            </FormField>
          </div>

          {updateProfile.isError && (
            <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
              {(updateProfile.error as Error).message || 'We could not save your changes. Please try again.'}
            </p>
          )}
          {updateProfile.isSuccess && (
            <p className="text-sm font-medium text-forest-700 sm:col-span-2">Profile updated.</p>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" loading={updateProfile.isPending}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
