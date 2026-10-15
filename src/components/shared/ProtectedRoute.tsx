import { type ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { PageLoading } from '@/components/shared/LoadingSkeleton'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, hasHydrated } = useAuthStore()

  if (!hasHydrated) return <PageLoading label="Checking your session…" />
  if (!isAuthenticated) return <Navigate to="/login" />
  return <>{children}</>
}
