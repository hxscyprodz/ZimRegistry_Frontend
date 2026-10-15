import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MegaMenuSection } from './nav-data'

export function MegaMenuTrigger({ section }: { section: MegaMenuSection }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const openNow = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150)
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 py-2 text-sm font-medium text-charcoal-900 hover:text-forest-700"
      >
        {section.label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-40 w-72 -translate-x-1/2 rounded-[var(--radius-card)] border border-slate-200 bg-white p-2 shadow-xl"
        >
          {section.links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-charcoal-900 hover:bg-forest-50 hover:text-forest-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
