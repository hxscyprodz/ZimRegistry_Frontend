import { apiRequest } from './client'
import type { District, Province, Station, Hospital } from '@/types'

/**
 * Connected to the real backend. Route paths moved from the old
 * `/api/v1/locations/*` under a single group to top-level resource groups,
 * and now require authentication (all mounted behind `Authenticate` in the
 * backend's app.ts) — fine for us, since every place that reads these is
 * already behind a signed-in gate.
 *
 * Each list endpoint returns `{ success, message, <resourceName>: [...], count }`
 * — note the array lives under a resource-specific key (`districts`,
 * `provinces`, etc.), not a generic `data` key.
 */

interface DistrictsResponse {
  success: boolean
  message: string
  districts: District[]
  count: number
}

interface ProvincesResponse {
  success: boolean
  message: string
  provinces: Province[]
  count: number
}

interface StationsResponse {
  success: boolean
  message: string
  stations: Station[]
  count: number
}

interface HospitalsResponse {
  success: boolean
  message: string
  hospitals: Hospital[]
  count: number
}

const STATIONS_PAGE_SIZE = 50
/** Safety valve so a misbehaving endpoint can never cause an endless request loop. */
const MAX_STATION_PAGES = 40

export const locationsApi = {
  async getDistricts(): Promise<District[]> {
    const response = await apiRequest<DistrictsResponse>('/api/v1/districts')
    return response.districts
  },
  async getProvinces(): Promise<Province[]> {
    const response = await apiRequest<ProvincesResponse>('/api/v1/provinces')
    return response.provinces
  },
  /** One page of stations. `/api/v1/stations` accepts `page` and `limit` query params. */
  async getStationsPage(page: number, limit = STATIONS_PAGE_SIZE): Promise<Station[]> {
    const response = await apiRequest<StationsResponse>(`/api/v1/stations?page=${page}&limit=${limit}`)
    return response.stations ?? []
  },
  /**
   * Every station, across all pages. The dropdowns in both apply forms
   * need the full list, so this walks the pages until one comes back
   * empty (or adds nothing new — which also protects against a server that
   * ignores `page`). It deliberately doesn't rely on `count` or on a short
   * page signalling the end, since the backend may cap `limit` below what
   * we ask for.
   */
  async getStations(): Promise<Station[]> {
    const byId = new Map<string, Station>()
    for (let page = 1; page <= MAX_STATION_PAGES; page++) {
      const batch = await locationsApi.getStationsPage(page)
      const before = byId.size
      for (const station of batch) byId.set(station.id, station)
      if (batch.length === 0 || byId.size === before) break
    }
    return [...byId.values()]
  },
  async getHospitals(): Promise<Hospital[]> {
    const response = await apiRequest<HospitalsResponse>('/api/v1/hospitals')
    return response.hospitals
  },
}
