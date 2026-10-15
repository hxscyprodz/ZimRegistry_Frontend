import { useQuery } from '@tanstack/react-query'
import { locationsApi } from '@/api/locations.api'

export function useDistricts() {
  return useQuery({
    queryKey: ['locations', 'districts'],
    queryFn: locationsApi.getDistricts,
    staleTime: 5 * 60 * 1000, // districts change rarely — avoid refetching on every visit
  })
}

export function useProvinces() {
  return useQuery({
    queryKey: ['locations', 'provinces'],
    queryFn: locationsApi.getProvinces,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStations() {
  return useQuery({
    queryKey: ['locations', 'stations'],
    queryFn: locationsApi.getStations,
    staleTime: 5 * 60 * 1000,
  })
}

export function useHospitals() {
  return useQuery({
    queryKey: ['locations', 'hospitals'],
    queryFn: locationsApi.getHospitals,
    staleTime: 5 * 60 * 1000,
  })
}
