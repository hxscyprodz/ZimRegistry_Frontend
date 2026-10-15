import { apiRequest } from './client'
import type { Citizen, CitizenRole, CitizenAccountStatus } from '@/types'

/**
 * Connected to the real backend: GET/PUT /api/v1/profile.
 *
 * This single endpoint bundles the citizen's profile, their full
 * applications list, and summary stats — so there's no separate
 * "list my applications" endpoint to call; `applications.api.ts` reads
 * from here instead.
 */

export interface ProfileApplicationSummary {
  id: string
  trackingId: string
  status: string // "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "COLLECTED"
  isPrinted: boolean
  createdAt: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  profile: {
    id: string
    userId: string
    firstName: string
    surname: string
    nationalIdNumber: string
    phoneNumber: string
    email: string
    // Removed from the backend's profile response — role now lives
    // elsewhere (permissions were reworked). Kept optional here rather
    // than removed outright in case it comes back in another form.
    role?: CitizenRole
    /**
     * Phone-verification status. The backend renamed its DB column to
     * `isPhoneNumberVerified`, but GET /api/v1/profile (as of PR #66) still
     * returns the value under the legacy key `isEmailVerified`. Both are
     * accepted here so the frontend keeps working whichever key the
     * backend settles on.
     */
    isEmailVerified?: boolean
    isPhoneNumberVerified?: boolean
    status: CitizenAccountStatus
    createdAt: string
    applications: ProfileApplicationSummary[]
    applicationsStats: Record<string, number>
  }
}

export interface UpdateProfilePayload {
  email?: string
  phoneNumber?: string
  password?: string
}

export const profileApi = {
  async get(): Promise<ProfileResponse['profile']> {
    const response = await apiRequest<ProfileResponse>('/api/v1/profile')
    return response.profile
  },

  async update(payload: UpdateProfilePayload) {
    const response = await apiRequest<{ success: boolean; message: string; profile: Partial<ProfileResponse['profile']> }>(
      '/api/v1/profile',
      { method: 'PUT', body: JSON.stringify(payload) },
    )
    return response.profile
  },
}

/** Maps the profile endpoint's shape onto the app's Citizen type. */
export function profileToCitizen(profile: ProfileResponse['profile']): Citizen {
  return {
    id: profile.id,
    userId: profile.userId,
    firstName: profile.firstName,
    surname: profile.surname,
    nationalIdNumber: profile.nationalIdNumber,
    email: profile.email,
    phone: profile.phoneNumber,
    phoneVerified: profile.isPhoneNumberVerified ?? profile.isEmailVerified ?? false,
    role: profile.role,
    status: profile.status,
  }
}
