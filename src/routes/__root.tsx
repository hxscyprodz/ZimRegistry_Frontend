import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/useAuth'

function RootComponent() {
  useCurrentUser()
  return <Outlet />
}

export const Route = createRootRoute({
  component: RootComponent,
})
