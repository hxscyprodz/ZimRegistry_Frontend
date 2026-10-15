import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-white">
      <div className="container-gov flex items-center gap-1.5 overflow-x-auto py-3 text-sm text-slate-500">
        <Link to="/" className="flex items-center gap-1 hover:text-forest-700">
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={item.label} className="flex items-center gap-1.5 whitespace-nowrap">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            {item.to && i !== items.length - 1 ? (
              <Link to={item.to} className="hover:text-forest-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-charcoal-900" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
