import type { ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, FileStack, User, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'

const links = [
  { label: 'Dashboard', to: '/my-account', icon: LayoutDashboard },
  { label: 'My Applications', to: '/my-account/applications', icon: FileStack },
  { label: 'Profile', to: '/my-account/profile', icon: User },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const citizen = useAuthStore((s) => s.citizen)
  const logout = useLogout()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-surface-slate">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-gov flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-gold-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-bold text-forest-700">Central Registry e-Services</span>
          </Link>
          <div className="flex items-center gap-4">
            {citizen && (
              <span className="hidden text-sm text-slate-500 sm:inline">
                {citizen.firstName || citizen.surname ? `${citizen.firstName} ${citizen.surname}`.trim() : citizen.email}
              </span>
            )}
            <button
              type="button"
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate({ to: '/login' }) })}
              className="flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container-gov flex flex-1 flex-col gap-6 py-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Account">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === '/my-account' }}
                activeProps={{ className: 'bg-forest-500/10 text-forest-700' }}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-control)] px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <link.icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
