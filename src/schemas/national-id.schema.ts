import { z } from 'zod'

// Matches ZimReg_Backend's `CreateIdApplication` validator exactly
// (src/validators/validators.ts in the backend repo):
//   station: z.uuid()
//   nationalIdNumber: z.string().length(14)
//   birthCertificateImageUrl: z.url()
// Note: no `contactNumber` field on this backend — dropped entirely.
export const nationalIdApplicationSchema = z.object({
  nationalIdNumber: z
    .string()
    .length(14, 'National ID number must be exactly 14 characters.'),
  station: z.string().uuid('Please select a station.'),
  birthCertificateImageUrl: z
    .string()
    .url('Please provide a valid image URL.'),
})
export type NationalIdApplicationFormValues = z.infer<typeof nationalIdApplicationSchema>

// Editing a rejected application: PUT /api/v1/applications/id/:id takes
// `CreateIdApplication.partial()`, so every field is optional server-side.
// The form always shows the current National ID number, so here it's
// required to be a well-formed 14-character value; the birth certificate
// photo is handled separately (only sent when a new one is uploaded) and the
// collection station can't be changed — the backend ignores it on update.
export const editNationalIdApplicationSchema = z.object({
  nationalIdNumber: z.string().length(14, 'National ID number must be exactly 14 characters.'),
})
export type EditNationalIdApplicationFormValues = z.infer<typeof editNationalIdApplicationSchema>
