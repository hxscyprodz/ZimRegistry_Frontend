import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, FileText, IdCard, Search, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Apply for Birth Certificate', to: '/e-services/birth-certificate/apply', icon: FileText },
  { label: 'Apply for National ID', to: '/e-services/national-id/apply', icon: IdCard },
  { label: 'Track Application', to: '/track-application', icon: Search },
  { label: 'Citizen Login', to: '/login', icon: LogIn },
] as const

export function EServicesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-gold-400 px-4 py-2.5 text-sm font-bold text-charcoal-900 shadow-sm transition-colors hover:bg-gold-500"
      >
        e-Services
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-72 rounded-[var(--radius-card)] border border-slate-200 bg-white p-2 shadow-xl"
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-charcoal-900 hover:bg-forest-50"
            >
              <item.icon className="h-4 w-4 text-forest-600" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
