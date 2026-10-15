import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { newsletterSchema, type NewsletterFormValues } from '@/schemas/newsletter.schema'
import { useSubscribeNewsletter } from '@/hooks/usePublicContent'

export function NewsletterSignup() {
  const subscribe = useSubscribeNewsletter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) })

  const onSubmit = (values: NewsletterFormValues) => {
    subscribe.mutate(values.email, { onSuccess: () => reset() })
  }

  return (
    <div className="card-gov flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-charcoal-900">Stay Informed</h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Subscribe to receive news, public notices and service updates from the Ministry by email.
          </p>
        </div>
      </div>

      {subscribe.isSuccess ? (
        <div className="flex items-center gap-2 rounded-[var(--radius-control)] bg-forest-500/10 px-4 py-3 text-sm font-semibold text-forest-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          You're subscribed. Thank you.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-start"
        >
          <div className="flex-1 sm:w-72">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-[var(--radius-control)] border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
              {...register('email')}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {errors.email.message}
              </p>
            )}
            {subscribe.isError && (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                We couldn't subscribe you right now. Please try again.
              </p>
            )}
          </div>
          <Button type="submit" loading={subscribe.isPending} className="shrink-0">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
