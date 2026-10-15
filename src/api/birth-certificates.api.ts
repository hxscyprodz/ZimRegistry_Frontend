import { apiRequest } from './client'
import { mapBackendStatus, buildTimelineFromBackendStatus } from './backend-mapping'
import type { ApplicationStatus, BirthCertificateApplication, ChildDetails, ParentDetails } from '@/types'

export interface SubmitBirthCertificatePayload {
  child: ChildDetails
  parents: ParentDetails
  hospitalRecordImageUrl: string
  motherIdImageUrl: string
  fatherIdImageUrl?: string
}

/**
 * Body of PUT /api/v1/applications/birth/:id — `CreateBirthCertificateApplication
 * .partial()` on the backend. Send ONLY fields that changed: an empty body is
 * rejected ("No update data provided"), and so is one where nothing differs
 * from what's on file ("No changes found in the application"). `station` is
 * not updatable and is intentionally absent.
 */
export interface UpdateBirthCertificatePayload {
  firstName?: string
  middleNames?: string
  surname?: string
  sex?: 'MALE' | 'FEMALE'
  dateOfBirth?: string
  placeOfBirth?: string
  villageOfOrigin?: string
  districtOfOrigin?: string
  address?: string
  hospital?: string
  motherIdNumber?: string
  fatherIdNumber?: string
  hospitalRecordImageUrl?: string
  motherIdImageUrl?: string
  fatherIdImageUrl?: string
}

interface CreateApplicationResponse {
  success: boolean
  message: string
  application: {
    id: string
    user: string
    type: 'BIRTH' | 'ID'
    trackingId: string
    station: string
    status: string
    createdAt: string
    firstName: string
    middleNames?: string
    surname: string
    sex: 'MALE' | 'FEMALE'
    dateOfBirth: string
    villageOfOrigin: string
    placeOfBirth: string
    districtOfOrigin: string
    address: string
  } | null
}

/**
 * Connected to the real backend: POST /api/v1/applications/birth (requires
 * the citizen to be signed in). The backend verifies both parents' ID
 * numbers against existing birth certificate records (father optional),
 * rejects duplicate applications for the same child name + mother, and
 * generates a real "BT-"-prefixed tracking id.
 *
 * KNOWN GAP: same as the National ID flow — no file-upload endpoint exists
 * yet, so the three document fields are collected as direct image URLs,
 * clearly labelled as temporary in the UI.
 */
export const birthCertificatesApi = {
  async submit(payload: SubmitBirthCertificatePayload): Promise<BirthCertificateApplication> {
    const response = await apiRequest<CreateApplicationResponse>('/api/v1/applications/birth', {
      method: 'POST',
      body: JSON.stringify({
        firstName: payload.child.firstName,
        middleNames: payload.child.middleNames || undefined,
        surname: payload.child.surname,
        sex: payload.child.sex,
        dateOfBirth: payload.child.dateOfBirth,
        address: payload.child.address,
        station: payload.child.station,
        hospital: payload.child.hospital,
        placeOfBirth: payload.child.placeOfBirth,
        villageOfOrigin: payload.child.villageOfOrigin,
        districtOfOrigin: payload.child.districtOfOrigin,
        motherIdNumber: payload.parents.motherNationalId,
        fatherIdNumber: payload.parents.fatherNationalId || undefined,
        hospitalRecordImageUrl: payload.hospitalRecordImageUrl,
        motherIdImageUrl: payload.motherIdImageUrl,
        fatherIdImageUrl: payload.fatherIdImageUrl || undefined,
      }),
    })

    const record = response.application
    if (!record) {
      throw new Error(response.message || 'We could not submit your application.')
    }

    // A CREATE response — "now" is genuinely accurate here.
    const now = new Date().toISOString()
    return {
      id: record.id,
      reference: record.trackingId,
      service: 'birth_certificate',
      status: mapBackendStatus(record.status),
      submittedAt: now,
      updatedAt: now,
      child: {
        firstName: record.firstName,
        middleNames: record.middleNames,
        surname: record.surname,
        sex: record.sex,
        dateOfBirth: record.dateOfBirth,
        placeOfBirth: record.placeOfBirth,
        villageOfOrigin: record.villageOfOrigin,
        districtOfOrigin: record.districtOfOrigin,
        districtOfOriginName: payload.child.districtOfOriginName,
        address: record.address,
        hospital: payload.child.hospital,
        hospitalName: payload.child.hospitalName,
        station: record.station,
        stationName: payload.child.stationName,
      },
      parents: payload.parents,
      hospitalRecordImageUrl: payload.hospitalRecordImageUrl,
      motherIdImageUrl: payload.motherIdImageUrl,
      fatherIdImageUrl: payload.fatherIdImageUrl,
      timeline: buildTimelineFromBackendStatus(record.status),
    }
  },

  /**
   * Connected to the real backend: PUT /api/v1/applications/birth/:id
   * (permission `application:update`, owner-only — someone else's id comes
   * back as "Application not found").
   *
   * Corrects a REJECTED application and resubmits that same application
   * rather than starting a new one. Server-side rules, surfaced through the
   * error message:
   *   - only REJECTED applications can be updated
   *   - at least one field must be provided, and at least one must differ
   *     from what's on file
   * On success the Applications row's status becomes RESUBMITTED (shown as
   * "processing"), the "application received" WhatsApp message is re-sent,
   * and — if any document URL was sent — the images are re-queued for
   * automated validation, which can reject the application again.
   *
   * Response: { success, message, application: { id, status, updatedAt,
   * ...updated fields } }. Note `id` there is the birth-certificate-details
   * row's id (it overrides the application id when the backend merges the
   * two), so only `status` is read from it.
   */
  async update(applicationId: string, payload: UpdateBirthCertificatePayload): Promise<{ status: ApplicationStatus }> {
    const response = await apiRequest<{
      success: boolean
      message: string
      application: { status: string } | null
    }>(`/api/v1/applications/birth/${encodeURIComponent(applicationId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    if (!response.application) {
      throw new Error(response.message || 'We could not resubmit your application.')
    }
    return { status: mapBackendStatus(response.application.status) }
  },
}
