import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth.api'
import { profileApi, type UpdateProfilePayload } from '@/api/profile.api'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

export function useCurrentUser() {
  const setCitizen = useAuthStore((s) => s.setCitizen)
  const setHydrated = useAuthStore((s) => s.setHydrated)
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const citizen = await authApi.getCurrentUser()
      setCitizen(citizen)
      setHydrated(true)
      return citizen
    },
    staleTime: Infinity,
  })
}

export function useLogin() {
  const setCitizen = useAuthStore((s) => s.setCitizen)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (citizen) => {
      setCitizen(citizen)
      queryClient.setQueryData(['auth', 'me'], citizen)
      navigate({ to: '/my-account' })
    },
  })
}

export function useRegister() {
  const setCitizen = useAuthStore((s) => s.setCitizen)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (citizen) => {
      setCitizen(citizen)
      queryClient.setQueryData(['auth', 'me'], citizen)
      navigate({ to: '/my-account' })
    },
  })
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clear()
      queryClient.setQueryData(['auth', 'me'], null)
      navigate({ to: '/login' })
    },
  })
}

/** Step 1 of phone verification: asks the backend to send a one-time code to the citizen's phone. */
export function useRequestPhoneVerification() {
  return useMutation({ mutationFn: () => authApi.requestPhoneVerification() })
}

/** Step 2: submits the code. On success the citizen is refreshed from the profile so `phoneVerified` flips everywhere. */
export function useVerifyPhone() {
  const setCitizen = useAuthStore((s) => s.setCitizen)
  const citizen = useAuthStore((s) => s.citizen)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (otp: string) => authApi.verifyPhone(otp),
    onSuccess: (fresh) => {
      // If the follow-up profile read failed, the verify call itself still
      // succeeded — so mark the local citizen verified rather than leaving
      // them stuck behind the gate.
      const updated = fresh ?? (citizen ? { ...citizen, phoneVerified: true } : null)
      setCitizen(updated)
      queryClient.setQueryData(['auth', 'me'], updated)
    },
  })
}

/** Connected to the real backend: PUT /api/v1/profile. Only email, phone and password are updatable — identity fields (name, National ID) come from the linked birth certificate and aren't editable here. */
export function useUpdateProfile() {
  const setCitizen = useAuthStore((s) => s.setCitizen)
  const citizen = useAuthStore((s) => s.citizen)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.update(payload),
    onSuccess: async (partialProfile) => {
      if (!citizen) return
      const phoneChanged = !!partialProfile.phoneNumber && partialProfile.phoneNumber !== citizen.phone
      const updated: typeof citizen = {
        ...citizen,
        email: partialProfile.email ?? citizen.email,
        phone: partialProfile.phoneNumber ?? citizen.phone,
        // A new phone number can't still count as verified — assume the
        // backend resets it, then confirm against the real profile below.
        phoneVerified: phoneChanged ? false : citizen.phoneVerified,
      }
      setCitizen(updated)
      queryClient.setQueryData(['auth', 'me'], updated)
      if (phoneChanged) {
        const fresh = await authApi.getCurrentUser()
        if (fresh) {
          setCitizen(fresh)
          queryClient.setQueryData(['auth', 'me'], fresh)
        }
      }
    },
  })
}
