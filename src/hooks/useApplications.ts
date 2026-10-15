import { useQuery } from '@tanstack/react-query'
import { applicationsApi } from '@/api/applications.api'

export function useApplications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.list,
    enabled: options?.enabled ?? true,
  })
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationsApi.getById(id as string),
    enabled: !!id,
  })
}

export function useTrackApplication(reference: string | null) {
  return useQuery({
    queryKey: ['applications', 'track', reference],
    queryFn: () => applicationsApi.trackByReference(reference as string),
    enabled: !!reference,
    retry: false,
  })
}
