import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '@/layouts/AuthLayout'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema'
import { useRegister } from '@/hooks/useAuth'

export function RegisterPage() {
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  return (
    <AuthLayout title="Create your citizen account" subtitle="Register to apply for and track civil registration documents.">
      <form
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
      >
        <FormField label="First Name" htmlFor="firstName" required error={errors.firstName?.message}>
          <input id="firstName" className={inputClass(!!errors.firstName)} {...register('firstName')} />
        </FormField>
        <FormField label="Surname" htmlFor="surname" required error={errors.surname?.message}>
          <input id="surname" className={inputClass(!!errors.surname)} {...register('surname')} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField
            label="National ID Number"
            htmlFor="nationalIdNumber"
            required
            error={errors.nationalIdNumber?.message}
            hint="The 14-character ID number on your birth certificate — must match our records exactly."
          >
            <input id="nationalIdNumber" maxLength={14} className={inputClass(!!errors.nationalIdNumber)} {...register('nationalIdNumber')} />
          </FormField>
        </div>
        <FormField label="Email Address" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className={inputClass(!!errors.email)} {...register('email')} />
        </FormField>
        <FormField label="Phone Number" htmlFor="phone" required error={errors.phone?.message} hint="International format, e.g. +263771234567. You'll verify this number with a one-time code after registering.">
          <input id="phone" type="tel" placeholder="+263771234567" className={inputClass(!!errors.phone)} {...register('phone')} />
        </FormField>
        <FormField label="Password" htmlFor="password" required error={errors.password?.message} hint="8–12 characters.">
          <input id="password" type="password" className={inputClass(!!errors.password)} {...register('password')} />
        </FormField>
        <FormField label="Confirm Password" htmlFor="confirmPassword" required error={errors.confirmPassword?.message}>
          <input id="confirmPassword" type="password" className={inputClass(!!errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>

        {registerMutation.isError && (
          <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
            {(registerMutation.error as Error).message || 'Something went wrong. Please try again.'}
          </p>
        )}

        <div className="sm:col-span-2">
          <Button type="submit" loading={registerMutation.isPending} className="w-full">
            Create Account
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500 sm:col-span-2">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-forest-700">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
