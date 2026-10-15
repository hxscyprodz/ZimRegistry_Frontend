import { useQuery, useMutation } from '@tanstack/react-query'
import { officesApi, type OfficeFilter } from '@/api/offices.api'
import { publicContentApi } from '@/api/public-content.api'

export function useOffices(filter?: OfficeFilter) {
  return useQuery({ queryKey: ['offices', filter], queryFn: () => officesApi.list(filter) })
}

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: publicContentApi.getDepartments })
}

export function useDepartment(id: string | undefined) {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => publicContentApi.getDepartmentById(id as string),
    enabled: !!id,
  })
}

export function useNews() {
  return useQuery({ queryKey: ['news'], queryFn: publicContentApi.getNews })
}

export function useResources() {
  return useQuery({ queryKey: ['resources'], queryFn: publicContentApi.getResources })
}

export function useServiceStats() {
  return useQuery({ queryKey: ['stats'], queryFn: publicContentApi.getStats })
}

export function useSubscribeNewsletter() {
  return useMutation({ mutationFn: (email: string) => publicContentApi.subscribeToNewsletter(email) })
}
