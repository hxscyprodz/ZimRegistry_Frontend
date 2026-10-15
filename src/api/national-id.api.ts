import { apiRequest } from './client'
import { mapBackendStatus, buildTimelineFromBackendStatus } from './backend-mapping'
import type { ApplicationStatus, NationalIdApplication } from '@/types'

export interface SubmitNationalIdPayload {
  nationalIdNumber: string
  station: string
  birthCertificateImageUrl: string
  /** Not sent to the backend — kept so the success screen can show a friendly station name instead of a raw UUID. */
  stationName?: string
}

interface CreateApplicationResponse {
  success: boolean
  message: string
  // Confirmed against ApplicationsServices.nationalIdApplication: returns a
  // single merged object (Applications row + NationalIDsApplications row),
  // not an array this time — this backend doesn't have the earlier
  // repo's Drizzle .returning()-always-an-array quirk here.
  application: {
    id: string
    station: string
    type: 'BIRTH' | 'ID'
    status: string
    isPrinted: boolean
    trackingId: string
    birthCertificateImageUrl: string
  } | null
}

/**
 * Connected to the real backend: POST /api/v1/applications/id (requires
 * the citizen to be signed in — the session cookie is attached
 * automatically by apiRequest via credentials: 'include'). The backend
 * looks up the applicant's existing birth certificate by
 * `nationalIdNumber`, validates `station` against the stations table, and
 * rejects if a National ID application already exists for that person or
 * they already hold a National ID.
 *
 * KNOWN GAP: the backend has no file-upload endpoint yet, so there's no
 * real way to turn an uploaded photo into the `birthCertificateImageUrl`
 * this expects. NationalIdApplyPage currently collects that as a direct
 * URL field, clearly labelled as temporary, until an upload endpoint
 * exists.
 *
 * KNOWN BACKEND BUG (as of this build): the tracking id is hardcoded
 * (`const trackingId = "ID-202608100"` in ApplicationsServices.ts) rather
 * than generated per-application — every submission after the first will
 * fail on the trackingId uniqueness constraint until that's fixed.
 */
export interface UpdateNationalIdPayload {
  /** Only send when it actually changed — the backend rejects a number identical to the current one. */
  nationalIdNumber?: string
  /** Only send when a new photo was uploaded; omitted keeps the existing one. */
  birthCertificateImageUrl?: string
}

export const nationalIdApi = {
  async submit(payload: SubmitNationalIdPayload): Promise<NationalIdApplication> {
    const response = await apiRequest<CreateApplicationResponse>('/api/v1/applications/id', {
      method: 'POST',
      body: JSON.stringify({
        nationalIdNumber: payload.nationalIdNumber,
        station: payload.station,
        birthCertificateImageUrl: payload.birthCertificateImageUrl,
      }),
    })

    const record = response.application
    if (!record) {
      throw new Error(response.message || 'We could not submit your application.')
    }

    // A CREATE response — "now" is genuinely accurate here, unlike
    // reconstructing a past submission date the backend doesn't return.
    const now = new Date().toISOString()
    return {
      id: record.id,
      reference: record.trackingId,
      service: 'national_id',
      status: mapBackendStatus(record.status),
      submittedAt: now,
      updatedAt: now,
      nationalIdNumber: payload.nationalIdNumber,
      station: payload.station,
      stationName: payload.stationName,
      birthCertificateImageUrl: record.birthCertificateImageUrl,
      timeline: buildTimelineFromBackendStatus(record.status),
    }
  },

  /**
   * Connected to the real backend: PUT /api/v1/applications/id/:id
   * (permission `application:update`, owner-only — someone else's id comes
   * back as "Application doesn't exist").
   *
   * Used to correct a REJECTED application and resubmit that same one
   * instead of starting a new application: on success the backend sets the
   * status back to PENDING_REVIEW, re-sends the "application received"
   * WhatsApp message, and — if a new photo was supplied — re-queues it for
   * automated image validation (which can reject it again).
   *
   * Body is `CreateIdApplication.partial()`; the backend only applies
   * `nationalIdNumber` and `birthCertificateImageUrl` (station changes are
   * ignored). Rules enforced server-side, surfaced via the error message:
   *   - APPROVED / COLLECTED applications can't be updated
   *   - a new National ID number must differ from the current one, be
   *     registered on a birth certificate, not already hold a National ID,
   *     and not already have another National ID application
   * An empty body is accepted too — it resubmits the application as-is.
   *
   * Response: { success, message, application: { id, status } } — the
   * controller drops `applicationDetails`.
   */
  async update(applicationId: string, payload: UpdateNationalIdPayload): Promise<{ id: string; status: ApplicationStatus }> {
    const response = await apiRequest<{
      success: boolean
      message: string
      application: { id: string; status: string } | null
    }>(`/api/v1/applications/id/${encodeURIComponent(applicationId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    if (!response.application) {
      throw new Error(response.message || 'We could not resubmit your application.')
    }
    return { id: response.application.id, status: mapBackendStatus(response.application.status) }
  },
}
