import { apiRequest, ApiRequestError } from './client'
import { profileApi } from './profile.api'
import { mapBackendStatus, buildTimelineFromBackendStatus } from './backend-mapping'
import type { Application, NationalIdApplication, BirthCertificateApplication } from '@/types'

function toApplication(row: { id: string; trackingId: string; status: string; createdAt: string }): Application {
  const status = mapBackendStatus(row.status)
  const timeline = buildTimelineFromBackendStatus(row.status)
  // The profile endpoint doesn't return which service each application is
  // for — inferred from the trackingId prefix, matching the backend's own
  // GenerateIds.ApplicationID convention: "BT" for birth certificates
  // (NOT "BC" — confirmed against src/utils/GenerateID.ts), otherwise
  // National ID.
  const isBirthCert = row.trackingId.toUpperCase().startsWith('BT')

  if (isBirthCert) {
    // Only summary fields are available here — full detail isn't returned
    // by /api/v1/profile. getById() enriches this via a dedicated detail
    // call; ApplicationDetailPage shows a note if that also comes up empty.
    return {
      id: row.id,
      reference: row.trackingId,
      service: 'birth_certificate',
      status,
      submittedAt: row.createdAt,
      updatedAt: row.createdAt,
      child: { firstName: '', surname: '', sex: 'MALE', dateOfBirth: '', placeOfBirth: '', villageOfOrigin: '', districtOfOrigin: '', address: '', hospital: '', station: '' },
      parents: { motherNationalId: '' },
      hospitalRecordImageUrl: '',
      motherIdImageUrl: '',
      timeline,
    } satisfies BirthCertificateApplication
  }

  return {
    id: row.id,
    reference: row.trackingId,
    service: 'national_id',
    status,
    submittedAt: row.createdAt,
    updatedAt: row.createdAt,
    nationalIdNumber: '',
    station: '',
    birthCertificateImageUrl: '',
    timeline,
  } satisfies NationalIdApplication
}

export const applicationsApi = {
  /**
   * Connected to the real backend — but indirectly. There's no dedicated
   * "list my applications" endpoint; GET /api/v1/profile bundles the
   * citizen's applications array alongside their profile, so that's what
   * this reads.
   */
  async list(): Promise<Application[]> {
    const profile = await profileApi.get()
    return profile.applications.map(toApplication)
  },

  /**
   * Finds the application via the profile-bundled summary list first (the
   * only place we can look up by internal id), then enriches it with the
   * matching detail endpoint:
   *   - National ID:        GET /api/v1/applications/id/:id
   *   - Birth Certificate:  GET /api/v1/applications/birth/:id
   * Both join through to birth certificate record(s) for real
   * names/DOB/parent detail that the profile summary doesn't carry.
   */
  async getById(id: string): Promise<Application> {
    const all = await applicationsApi.list()
    const summary = all.find((a) => a.id === id)
    if (!summary) throw new ApiRequestError('Application not found.', 'NOT_FOUND')

    try {
      if (summary.service === 'national_id') {
        const response = await apiRequest<{
          success: boolean
          message: string
          application: {
            id: string
            type: 'BIRTH' | 'ID'
            trackingId: string
            status: string
            station: string
            createdAt: string
            /**
             * Why a REJECTED application was rejected. The backend now
             * returns this on GET /api/v1/applications/id/:id. The exact
             * placement/name wasn't visible when this was wired up — the
             * staff endpoint calls it `rejectionReason`, so that's assumed,
             * and it's read from either the record or `details` (see
             * `rejectionReasonOf`). Absent for non-rejected applications.
             */
            rejectionReason?: string | null
            details: {
              firstName: string
              surname: string
              dateOfBirth: string
              nationalIdNumber: string
              birthCertificateImageUrl: string
              rejectionReason?: string | null
            }
          } | null
        }>(`/api/v1/applications/id/${id}`)

        if (!response.application) return summary
        const { details, ...record } = response.application
        return {
          ...summary,
          nationalIdNumber: details.nationalIdNumber,
          station: record.station,
          birthCertificateImageUrl: details.birthCertificateImageUrl,
          applicantFirstName: details.firstName,
          applicantSurname: details.surname,
          applicantDateOfBirth: details.dateOfBirth,
          officialMessage:
            summary.status === 'rejected' ? (details.rejectionReason ?? record.rejectionReason ?? undefined) || undefined : undefined,
        } satisfies NationalIdApplication
      }

      const response = await apiRequest<{
        success: boolean
        message: string
        application: {
          id: string
          type: 'BIRTH' | 'ID'
          firstName: string
          middleNames?: string
          surname: string
          sex: 'MALE' | 'FEMALE'
          placeOfBirth: string
          villageOfOrigin: string
          address: string
          hospital: { id: string; name: string }
          mother: { firstName: string | null; surname: string | null; nationalIdNumber: string | null }
          // Drizzle returns the entire aliased object as `null` for a
          // leftJoin with no match — not an object with null fields — since
          // the father is optional. Confirmed against ApplicationsServices
          // .getBirthCertificateApplication's .leftJoin(FatherCertificates, ...).
          father: { firstName: string | null; surname: string | null; nationalIdNumber: string | null } | null
          hospitalRecordImageUrl: string
          motherIdImageUrl: string
          fatherImageUrl: string | null
          trackingId: string
          status: string
          station: { id: string; name: string }
          createdAt: string
          /** Assumed name, same as the National ID detail endpoint — see `rejectionReason` there. */
          rejectionReason?: string | null
        } | null
      }>(`/api/v1/applications/birth/${id}`)

      if (!response.application) return summary
      const record = response.application
      return {
        ...summary,
        child: {
          firstName: record.firstName,
          middleNames: record.middleNames,
          surname: record.surname,
          sex: record.sex,
          // The detail endpoint doesn't select dateOfBirth or
          // districtOfOrigin (confirmed against
          // ApplicationsServices.getBirthCertificateApplication) even
          // though they're required at creation — carried over from the
          // summary (blank there too) rather than fabricated.
          dateOfBirth: summary.child.dateOfBirth,
          placeOfBirth: record.placeOfBirth,
          villageOfOrigin: record.villageOfOrigin,
          districtOfOrigin: summary.child.districtOfOrigin,
          address: record.address,
          hospital: record.hospital.id,
          hospitalName: record.hospital.name,
          station: record.station.id,
          stationName: record.station.name,
        },
        parents: {
          motherNationalId: record.mother.nationalIdNumber ?? '',
          fatherNationalId: record.father?.nationalIdNumber ?? undefined,
        },
        motherFirstName: record.mother.firstName ?? undefined,
        motherSurname: record.mother.surname ?? undefined,
        fatherFirstName: record.father?.firstName ?? undefined,
        fatherSurname: record.father?.surname ?? undefined,
        hospitalRecordImageUrl: record.hospitalRecordImageUrl,
        motherIdImageUrl: record.motherIdImageUrl,
        fatherIdImageUrl: record.fatherImageUrl ?? undefined,
        officialMessage: summary.status === 'rejected' ? record.rejectionReason || undefined : undefined,
      } satisfies BirthCertificateApplication
    } catch (error) {
      // Detail fetch failed for some reason — summary-only is still a
      // reasonable result rather than failing the whole page, but log it
      // so a real bug doesn't masquerade as "no detail available".
      console.error(`Failed to load detail for application ${id}:`, error)
      return summary
    }
  },

  /**
   * Connected to the real backend: GET /api/v1/applications/tracking/:trackingId.
   * Response: { success, message, application: { id, status, isPrinted,
   * trackingId, createdAt } } — a real createdAt this time, no more
   * fabricating or hiding a submission date for tracked applications.
   *
   * IMPORTANT: this route is behind `Authenticate` AND is owner-only —
   * the backend scopes the lookup to the signed-in user's id (the tracking
   * ids are sequential, so an unscoped lookup let anyone guess other
   * citizens' applications). A citizen can therefore only track their own
   * applications; a reference belonging to someone else behaves like "not
   * found". TrackApplicationPage asks signed-out visitors to sign in, and
   * words "not found" as "not found on your account".
   */
  async trackByReference(reference: string): Promise<Application> {
    const trackingId = reference.trim()
    const response = await apiRequest<{
      success: boolean
      message: string
      application: { id: string; status: string; isPrinted: boolean; trackingId: string; createdAt: string } | null
    }>(`/api/v1/applications/tracking/${encodeURIComponent(trackingId)}`)

    if (!response.application) {
      throw new ApiRequestError(
        response.message || "We couldn't find that application on your account.",
        'NOT_FOUND',
      )
    }

    return toApplication(response.application)
  },
}
