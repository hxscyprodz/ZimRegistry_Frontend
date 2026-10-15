import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/80', className)} aria-hidden="true" />
}

export function CardSkeleton() {
  return (
    <div className="card-gov flex flex-col gap-3 p-5">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  )
}

export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-500 border-t-transparent" />
    </div>
  )
}
