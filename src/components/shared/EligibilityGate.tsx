import { Link } from '@tanstack/react-router'
import { UserPlus, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageLoading } from '@/components/shared/LoadingSkeleton'
import { useAuthStore } from '@/stores/authStore'
import { PhoneVerification } from '@/components/shared/PhoneVerification'

export function EligibilityGate({ children }: { children: React.ReactNode }) {
  const { citizen, isAuthenticated, hasHydrated } = useAuthStore()

  if (!hasHydrated) {
    return <PageLoading label="Checking your account…" />
  }

  if (!isAuthenticated) {
    return (
      <div className="card-gov mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
          <UserPlus className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-charcoal-900">You need a citizen account to apply</h2>
        <p className="mt-2 text-sm text-slate-500">
          Register for a free citizen account, or sign in if you already have one, to start this application. This
          lets you track its progress and view it later from your dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/register">
            <Button>Create an Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>
        <p className="mt-5 text-xs text-slate-400">
          Already applied? Sign in to{' '}
          <Link to="/track-application" className="font-semibold text-forest-700">
            track your application
          </Link>
          .
        </p>
      </div>
    )
  }

  if (!citizen?.phoneVerified) {
    return (
      <div className="card-gov mx-auto max-w-lg p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Smartphone className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-charcoal-900">Verify your phone number to continue</h2>
          <p className="mt-2 text-sm text-slate-500">
            Please verify your phone number before applying for civil registration documents.
          </p>
        </div>
        <div className="mt-6">
          <PhoneVerification phone={citizen?.phone ?? ''} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
