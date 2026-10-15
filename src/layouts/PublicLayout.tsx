import type { ReactNode } from 'react'
import { GovernmentHeader } from '@/components/layout/GovernmentHeader'
import { Footer } from '@/components/layout/Footer'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-cream">
      <GovernmentHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
