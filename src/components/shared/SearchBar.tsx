import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function SearchBar({ compact }: { compact?: boolean }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    navigate({ to: '/search', search: { q: value.trim() } })
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Search the Ministry website
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search services, resources, news…"
        className={`w-full rounded-[var(--radius-control)] border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 ${compact ? 'py-2' : ''}`}
      />
    </form>
  )
}
