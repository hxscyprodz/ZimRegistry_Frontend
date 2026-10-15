import type { ApplicationStatus, ApplicationTimelineEvent } from '@/types'

/**
 * ZimReg_Backend's `applications_status` Postgres enum (see
 * src/db/Columns.Helper.ts): ["PENDING_REVIEW", "APPROVED", "REJECTED", "COLLECTED"].
 * Four states now (the earlier backend only had three) — COLLECTED means
 * approved *and* the physical document has been collected by the citizen.
 * `RESUBMITTED` is set when a citizen corrects and resubmits a rejected
 * birth certificate application (PUT /api/v1/applications/birth/:id).
 */
export type BackendApplicationStatus = 'PENDING_REVIEW' | 'RESUBMITTED' | 'APPROVED' | 'REJECTED' | 'COLLECTED'

export function mapBackendStatus(status: string): ApplicationStatus {
  switch (status.toUpperCase()) {
    case 'PENDING_REVIEW':
    // A rejected application the citizen corrected and sent back in (birth
    // certificate updates set this) — it's in review again, so it shows as
    // "processing" like a fresh one.
    case 'RESUBMITTED':
      return 'processing'
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    case 'COLLECTED':
      return 'collected'
    default:
      return 'submitted'
  }
}

/**
 * The backend doesn't return a timeline (or timestamps for each stage) —
 * only the current status. This synthesizes a simple step-by-step timeline
 * from that single value so the existing ApplicationTimeline UI still has
 * something reasonable to show, without inventing dates or details the
 * backend never gave us.
 */
export function buildTimelineFromBackendStatus(status: string): ApplicationTimelineEvent[] {
  const normalized = status.toUpperCase()
  const isRejected = normalized === 'REJECTED'
  const isCollected = normalized === 'COLLECTED'

  const steps: { status: ApplicationStatus; label: string }[] = [
    { status: 'submitted', label: 'Application Received' },
    { status: 'processing', label: 'Processing' },
    { status: isRejected ? 'rejected' : 'approved', label: isRejected ? 'Rejected' : 'Approved' },
  ]
  if (!isRejected) {
    steps.push({ status: 'collected', label: 'Collected' })
  }

  let activeIndex = 1
  if (normalized === 'APPROVED') activeIndex = 2
  if (isCollected) activeIndex = 3
  if (isRejected) activeIndex = 2

  return steps.map((step, i) => ({
    id: `${step.status}-${i}`,
    status: step.status,
    label: step.label,
    completed: i <= activeIndex,
    timestamp: '',
  }))
}
