export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'received'
  | 'under_review'
  | 'additional_information_required'
  | 'processing'
  | 'approved'
  | 'collected'
  | 'rejected'
  | 'cancelled'

export type ApplicationServiceType = 'birth_certificate' | 'national_id'

export type CitizenRole = 'SUPER_ADMIN' | 'STATION_ADMIN' | 'REGISTRAR_OFFICER' | 'CITIZEN'
export type CitizenAccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'

export interface Citizen {
  id: string
  /** Backend's own human-readable identifier (e.g. "user:0000123"), separate from the UUID `id`. */
  userId?: string
  firstName: string
  surname: string
  nationalIdNumber: string
  email: string
  phone: string
  /** Whether the citizen has confirmed their phone number via a one-time code (the backend moved verification from email to phone). */
  phoneVerified: boolean
  role?: CitizenRole
  status?: CitizenAccountStatus
}

export interface District {
  id: string
  name: string
  provinceId: string
  provinceName: string
  status: 'AVAILABLE' | 'DELETED'
}

export interface Province {
  id: string
  name: string
  status: 'AVAILABLE' | 'DELETED'
}

export interface Station {
  id: string
  name: string
  address: string
  city: string
  /** Nested, not a bare id — confirmed against StationsServices.getStations()'s select shape. */
  district: { id: string; name: string }
  status: 'AVAILABLE' | 'DELETED'
}

export interface Hospital {
  id: string
  name: string
  city: string
  districtId: string
  status: 'AVAILABLE' | 'DELETED'
}

export interface ApplicationTimelineEvent {
  id: string
  status: ApplicationStatus
  label: string
  description?: string
  timestamp: string
  completed: boolean
}

export interface ApplicationDocumentRef {
  id: string
  label: string
  fileName: string
  fileSizeKb: number
  mimeType: string
  uploadedAt: string
  status: 'pending' | 'uploaded' | 'failed'
}

export interface BaseApplication {
  id: string
  reference: string
  service: ApplicationServiceType
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
  timeline: ApplicationTimelineEvent[]
  officialMessage?: string
}

export interface ChildDetails {
  firstName: string
  middleNames?: string
  surname: string
  sex: 'MALE' | 'FEMALE'
  dateOfBirth: string
  placeOfBirth: string
  villageOfOrigin: string
  /** District UUID — the child's district of origin, distinct from `station` (the collection point). */
  districtOfOrigin: string
  districtOfOriginName?: string
  address: string
  /** Hospital UUID (backend: CreateBirthCertificateApplication.hospital). */
  hospital: string
  hospitalName?: string
  /** Station UUID for collection — same concept as the National ID flow's station. */
  station: string
  stationName?: string
}

export interface ParentDetails {
  motherNationalId: string
  /** Optional on the real backend — not every application names a father. */
  fatherNationalId?: string
}

export interface BirthCertificateApplication extends BaseApplication {
  service: 'birth_certificate'
  child: ChildDetails
  parents: ParentDetails
  hospitalRecordImageUrl: string
  motherIdImageUrl: string
  fatherIdImageUrl?: string
  /** Only populated when fetched via GET /api/v1/applications/birth/:id, which joins through to both parents' birth certificates. */
  motherFirstName?: string
  motherSurname?: string
  fatherFirstName?: string
  fatherSurname?: string
}

export interface NationalIdApplication extends BaseApplication {
  service: 'national_id'
  nationalIdNumber: string
  /** Station UUID — validators.ts's CreateIdApplication calls this "station", not "stationId". */
  station: string
  /** Station display name, kept client-side from what was selected (the backend doesn't echo it back). */
  stationName?: string
  birthCertificateImageUrl: string
  /** Only populated when fetched via GET /api/v1/applications/id/:id, which joins through to the linked birth certificate — not available from the profile-bundled summary list. */
  applicantFirstName?: string
  applicantSurname?: string
  applicantDateOfBirth?: string
}

export type Application = BirthCertificateApplication | NationalIdApplication

export interface Office {
  id: string
  name: string
  province: string
  district: string
  address: string
  phone: string
  hours: string
  services: string[]
  biometricEnrollment: boolean
  lat: number
  lng: number
}

export interface Department {
  id: string
  name: string
  description: string
  about?: string
  website?: string
}

export interface NewsArticle {
  id: string
  slug: string
  category: 'News' | 'Public Notice' | 'Registration Drive' | 'System Maintenance' | 'Fee Update' | 'Operational Notice'
  title: string
  summary: string
  date: string
  urgent?: boolean
  image?: string
}

export interface Resource {
  id: string
  title: string
  category: 'Application Forms' | 'Requirements' | 'Fees' | 'Acts & Regulations' | 'Gazette Notices' | 'Public Notices' | 'FAQs' | 'Guides'
  fileType: 'PDF' | 'DOCX'
  date: string
}

export interface ApiResponse<T> {
  data: T
  success: true
}

export interface ApiError {
  success: false
  message: string
  code?: string
}
