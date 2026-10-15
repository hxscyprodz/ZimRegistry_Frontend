import { WifiOff, SearchX, ShieldAlert, TimerOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Kind = 'network' | 'not-found' | 'forbidden' | 'session-expired'

const presets: Record<Kind, { icon: typeof WifiOff; title: string; description: string; actionLabel: string }> = {
  network: {
    icon: WifiOff,
    title: "We couldn't connect to the service",
    description: 'Please check your internet connection and try again.',
    actionLabel: 'Retry',
  },
  'not-found': {
    icon: SearchX,
    title: 'Application Not Found',
    description: "We couldn't find that application on your account. Check the reference number, and make sure you're signed in with the account that submitted it.",
    actionLabel: 'Try Again',
  },
  forbidden: {
    icon: ShieldAlert,
    title: "You don't have access to this page",
    description: 'This area is restricted. If you believe this is a mistake, contact the Central Registry support desk.',
    actionLabel: 'Go Back',
  },
  'session-expired': {
    icon: TimerOff,
    title: 'Your session has expired',
    description: 'Please sign in again to continue.',
    actionLabel: 'Sign In',
  },
}

export function ErrorState({ kind = 'network', onAction }: { kind?: Kind; onAction?: () => void }) {
  const preset = presets[kind]
  const Icon = preset.icon
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-red-100 bg-red-50/40 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-charcoal-900">{preset.title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{preset.description}</p>
      {onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {preset.actionLabel}
        </Button>
      )}
    </div>
  )
}
