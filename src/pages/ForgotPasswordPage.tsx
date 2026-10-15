import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { AuthLayout } from '@/layouts/AuthLayout'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth.schema'
import { authApi } from '@/api/auth.api'
import { CheckCircle2 } from 'lucide-react'

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const mutation = useMutation({ mutationFn: (values: ForgotPasswordFormValues) => authApi.forgotPassword(values.email) })

  if (mutation.isSuccess) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-forest-600" aria-hidden="true" />
          <p className="text-sm text-slate-600">
            If an account exists for that email address, we've sent instructions to reset your password.
          </p>
          <Link to="/login" className="mt-2 text-sm font-semibold text-forest-700">
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you reset instructions.">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Email Address" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className={inputClass(!!errors.email)} {...register('email')} />
        </FormField>
        <Button type="submit" loading={mutation.isPending} className="w-full">
          Send Reset Instructions
        </Button>
        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-forest-700">
            Back to Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
