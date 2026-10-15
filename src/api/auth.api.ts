import { apiRequest, delay } from './client'
import { profileApi, profileToCitizen } from './profile.api'
import type { Citizen } from '@/types'

export interface RegisterPayload {
  firstName: string
  surname: string
  nationalIdNumber: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface LoginPayload {
  email: string
  password: string
}

// The backend now serves both this citizen portal and a separate registrar
// staff dashboard from the same /api/v1/auth endpoints, so every
// login/register request must say which platform it's for — the backend
// applies different role checks per platform (registrar-portal requires
// staff/super_admin; citizen-portal currently has no such check).
const PLATFORM = 'citizen-portal' as const

/** Phone-verification routes — see the note on `authApi.requestPhoneVerification`. */
export const PHONE_VERIFICATION = {
  requestPath: '/api/v1/auth/request-phone-number-verification',
  verifyPath: '/api/v1/auth/verify-phone-number',
  otpField: 'otp',
} as const

/** The backend's OTP lifetime, used to pace the "resend" countdown in the UI. */
export const OTP_TTL_SECONDS = 5 * 60

interface AuthResponse {
  success: boolean
  message: string
  user: {
    id: string
    userId?: string
    email: string
    firstName?: string
    surname?: string
    roles: string[]
    permissions?: string[]
    /** Added to the auth payload for the WhatsApp integration. */
    phoneNumber?: string
  } & Record<string, unknown>
}

/**
 * Login/register now return firstName/surname directly (joined from the
 * linked birth certificate), so a Citizen can usually be built straight
 * from the auth response without a follow-up call. Still falls back to
 * GET /api/v1/profile if either name is missing, to fill in
 * nationalIdNumber/phone/phone-verification status, which the auth response doesn't
 * carry.
 */
async function resolveCitizen(authUser: AuthResponse['user']): Promise<Citizen> {
  if (authUser.firstName && authUser.surname) {
    try {
      const profile = await profileApi.get()
      return profileToCitizen(profile)
    } catch {
      return {
        id: authUser.id,
        userId: authUser.userId,
        firstName: authUser.firstName,
        surname: authUser.surname,
        nationalIdNumber: '',
        email: authUser.email,
        phone: authUser.phoneNumber ?? '',
        phoneVerified: false,
      }
    }
  }

  try {
    const profile = await profileApi.get()
    return profileToCitizen(profile)
  } catch {
    return {
      id: authUser.id,
      userId: authUser.userId,
      firstName: authUser.firstName ?? '',
      surname: authUser.surname ?? '',
      nationalIdNumber: '',
      email: authUser.email,
      phone: authUser.phoneNumber ?? '',
      phoneVerified: false,
    }
  }
}

export const authApi = {
  /**
   * Connected to the real backend: POST /api/v1/auth/register.
   * Requires firstName + surname + nationalIdNumber to exactly match an
   * existing birth certificate record. Sets httpOnly session cookies —
   * nothing is returned to store client-side.
   */
  async register(payload: RegisterPayload): Promise<Citizen> {
    const response = await apiRequest<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...payload, platform: PLATFORM }),
    })
    return resolveCitizen(response.user)
  },

  /** Connected to the real backend: POST /api/v1/auth/login. */
  async login(payload: LoginPayload): Promise<Citizen> {
    const response = await apiRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...payload, platform: PLATFORM }),
    })
    return resolveCitizen(response.user)
  },

  /** Connected to the real backend: POST /api/v1/auth/logout — clears the session cookies server-side. */
  async logout(): Promise<void> {
    await apiRequest<{ success: boolean; message: string }>('/api/v1/auth/logout', { method: 'POST' })
  },

  async getCurrentUser(): Promise<Citizen | null> {
    try {
      const profile = await profileApi.get()
      return profileToCitizen(profile)
    } catch {
      return null
    }
  },

  /** Connected to the real backend: POST /api/v1/auth/refresh — exchanges the refresh-token cookie for a new access token. */
  async refreshSession(): Promise<Citizen | null> {
    try {
      await apiRequest<{ success: boolean; message: string }>('/api/v1/auth/refresh', { method: 'POST' })
    } catch {
      return null
    }
    return authApi.getCurrentUser()
  },

  // Not yet connected — no forgot/reset-password endpoints exist on this
  // backend yet.
  async forgotPassword(_email: string): Promise<{ sent: boolean }> {
    return delay({ sent: true }, 900)
  },
  async resetPassword(_token: string, _newPassword: string): Promise<{ reset: boolean }> {
    return delay({ reset: true }, 900)
  },

  /**
   * Phone-number verification (replaces the old email verification).
   * Two-step OTP flow, both calls made as the signed-in citizen — the
   * backend reads the phone number off their session, so no phone number
   * is sent from here:
   *   1. requestPhoneVerification() — backend generates a one-time code
   *      (valid for 5 minutes, stored in Redis) and sends it to the
   *      citizen's phone. It rejects a new request while a still-valid
   *      code exists, to stop re-send spam.
   *   2. verifyPhone(otp) — submits the code. Rejected if the account is
   *      already verified or the code is wrong/expired.
   *
   * NOTE: the service methods are `requestPhoneNumberVerification` /
   * `verifyPhoneNumber` on the backend, but their exact route paths and
   * the verify body's field name could not be read from the public PR
   * pages — confirm them against the backend routes and adjust
   * PHONE_VERIFICATION below (the only place they live) if they differ.
   */
  async requestPhoneVerification(): Promise<{ message: string }> {
    const response = await apiRequest<{ success: boolean; message: string }>(PHONE_VERIFICATION.requestPath, {
      method: 'POST',
    })
    return { message: response.message }
  },

  /** Submits the OTP, then re-reads the profile so `phoneVerified` reflects the server's truth. */
  async verifyPhone(otp: string): Promise<Citizen | null> {
    await apiRequest<{ success: boolean; message: string }>(PHONE_VERIFICATION.verifyPath, {
      method: 'POST',
      body: JSON.stringify({ [PHONE_VERIFICATION.otpField]: otp }),
    })
    return authApi.getCurrentUser()
  },
}
