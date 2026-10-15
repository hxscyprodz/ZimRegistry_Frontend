import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  birthCertificatesApi,
  type SubmitBirthCertificatePayload,
  type UpdateBirthCertificatePayload,
} from '@/api/birth-certificates.api'
import { nationalIdApi, type SubmitNationalIdPayload, type UpdateNationalIdPayload } from '@/api/national-id.api'

export function useSubmitBirthApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitBirthCertificatePayload) => birthCertificatesApi.submit(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useSubmitNationalIdApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitNationalIdPayload) => nationalIdApi.submit(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

/** Corrects a rejected National ID application and resubmits that same application (PUT /api/v1/applications/id/:id). */
export function useUpdateNationalIdApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, payload }: { applicationId: string; payload: UpdateNationalIdPayload }) =>
      nationalIdApi.update(applicationId, payload),
    // Everything application-related is keyed under 'applications' — list,
    // detail and tracking — so one invalidation refreshes them all.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

/** Corrects a rejected birth certificate application and resubmits that same application (PUT /api/v1/applications/birth/:id). */
export function useUpdateBirthCertificateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, payload }: { applicationId: string; payload: UpdateBirthCertificatePayload }) =>
      birthCertificatesApi.update(applicationId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}
