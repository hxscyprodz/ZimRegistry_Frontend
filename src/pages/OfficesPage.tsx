import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { OfficeCard } from '@/components/shared/OfficeCard'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Select } from '@/components/ui/Select'
import { useOffices } from '@/hooks/usePublicContent'
import { MapPinOff } from 'lucide-react'

export function OfficesPage() {
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [service, setService] = useState('')
  const { data: allOffices } = useOffices()
  const { data, isLoading } = useOffices({
    province: province || undefined,
    district: district || undefined,
    service: service || undefined,
  })

  const provinces = useMemo(() => Array.from(new Set(allOffices?.map((o) => o.province))), [allOffices])
  const districts = useMemo(
    () => Array.from(new Set(allOffices?.filter((o) => !province || o.province === province).map((o) => o.district))),
    [allOffices, province],
  )
  const services = useMemo(() => Array.from(new Set(allOffices?.flatMap((o) => o.services))), [allOffices])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Offices' }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Office Finder</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Locate a Central Registry office near you and see the services it offers.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-charcoal-900">Province</span>
            <Select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value)
                setDistrict('')
              }}
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-charcoal-900">District</span>
            <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-charcoal-900">Service</span>
            <Select value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          {!isLoading && data?.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon={MapPinOff} title="No offices found" description="Try a different province, district or service." />
            </div>
          )}
          {data?.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>
      </div>
    </div>
  )
}
