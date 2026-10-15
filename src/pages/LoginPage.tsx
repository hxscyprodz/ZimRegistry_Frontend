import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '@/layouts/AuthLayout'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { useLogin } from '@/hooks/useAuth'

export function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  return (
    <AuthLayout title="Sign in to your account" subtitle="Access your civil registration applications.">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit((values) => login.mutate(values))}>
        <FormField label="Email Address" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className={inputClass(!!errors.email)} {...register('email')} />
        </FormField>
        <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
          <input id="password" type="password" className={inputClass(!!errors.password)} {...register('password')} />
        </FormField>

        {login.isError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {(login.error as Error).message || 'Something went wrong. Please try again.'}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-semibold text-forest-700">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" loading={login.isPending} className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-forest-700">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
