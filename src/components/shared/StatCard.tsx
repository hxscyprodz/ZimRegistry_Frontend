import type { ReactNode } from 'react'

export function StatCard({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-gold-400 pl-4">
      <span className="font-display text-3xl font-bold text-white sm:text-4xl">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
  )
}
