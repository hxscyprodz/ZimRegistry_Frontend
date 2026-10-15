import { delay } from './client'
import { mockOffices } from './mock-data'
import type { Office } from '@/types'

export interface OfficeFilter {
  province?: string
  district?: string
  service?: string
}

export const officesApi = {
  async list(filter?: OfficeFilter): Promise<Office[]> {
    let results = mockOffices
    if (filter?.province) results = results.filter((o) => o.province === filter.province)
    if (filter?.district) results = results.filter((o) => o.district === filter.district)
    if (filter?.service) results = results.filter((o) => o.services.includes(filter.service!))
    return delay(results, 500)
  },
}
