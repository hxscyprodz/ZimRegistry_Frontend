import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string, style: 'short' | 'long' = 'long'): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  })
}

export function maskNationalId(id: string): string {
  // Zimbabwean National ID format looks like 63-1234567-A-42; mask the
  // sequence digits while keeping the district/office codes visible.
  const match = id.match(/^(\d{2})-(\d+)-([A-Za-z])-(\d{2})$/)
  if (!match) return id
  const [, prefix, digits, letter, suffix] = match
  return `${prefix}-${'X'.repeat(digits.length)}-${letter}-${suffix}`
}
