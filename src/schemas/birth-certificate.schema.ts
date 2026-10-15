import { z } from 'zod'

// Matches ZimReg_Backend's `CreateBirthCertificateApplication` validator
// exactly (src/validators/validators.ts in the backend repo).
export const childDetailsSchema = z.object({
  firstName: z.string().min(2, "Please enter the child's first name.").max(100),
  middleNames: z.string().min(2).max(100).optional().or(z.literal('')),
  surname: z.string().min(2, "Please enter the child's surname.").max(100),
  sex: z.enum(['MALE', 'FEMALE'], { message: "Please select the child's sex." }),
  dateOfBirth: z.string().length(10, "Please enter the child's date of birth."),
  placeOfBirth: z.string().min(2, 'Please enter the place of birth.').max(100),
  villageOfOrigin: z.string().min(2, 'Please enter the village of origin.').max(100),
  districtOfOrigin: z.string().uuid('Please select a district of origin.'),
  address: z.string().min(10, 'Please enter the full home address.').max(255),
  hospital: z.string().uuid('Please select the hospital of birth.'),
  station: z.string().uuid('Please select a station for collection.'),
})
export type ChildDetailsFormValues = z.infer<typeof childDetailsSchema>

export const parentDetailsSchema = z.object({
  motherNationalId: z.string().length(14, "Mother's National ID number must be exactly 14 characters."),
  fatherNationalId: z
    .string()
    .length(14, "Father's National ID number must be exactly 14 characters.")
    .optional()
    .or(z.literal('')),
})
export type ParentDetailsFormValues = z.infer<typeof parentDetailsSchema>

export const documentsSchema = z.object({
  hospitalRecordImageUrl: z.string().url('Please provide a valid image URL for the hospital birth record.'),
  motherIdImageUrl: z.string().url("Please provide a valid image URL for the mother's National ID."),
  fatherIdImageUrl: z.string().url().optional().or(z.literal('')),
})
export type DocumentsFormValues = z.infer<typeof documentsSchema>

// Editing a rejected birth certificate application: PUT
// /api/v1/applications/birth/:id takes `CreateBirthCertificateApplication
// .partial()`, so everything is optional server-side. Locally the same
// per-field rules apply as at creation, except where the current value
// isn't available to prefill — the detail endpoint doesn't return the date
// of birth or district of origin — so those (and hospital, if it couldn't be
// loaded) may be left empty, meaning "keep what's on file". Station can't be
// changed on update and isn't part of this form.
export const editBirthApplicationSchema = z.object({
  firstName: z.string().min(2, "Please enter the child's first name.").max(100),
  middleNames: z.string().max(100).optional().or(z.literal('')),
  surname: z.string().min(2, "Please enter the child's surname.").max(100),
  sex: z.enum(['MALE', 'FEMALE'], { message: "Please select the child's sex." }),
  dateOfBirth: z.string().length(10, "Please enter a valid date of birth.").or(z.literal('')),
  placeOfBirth: z.string().min(2, 'Please enter the place of birth.').max(100),
  villageOfOrigin: z.string().min(2, 'Please enter the village of origin.').max(100),
  districtOfOrigin: z.string().uuid('Please select a district of origin.').or(z.literal('')),
  address: z.string().min(10, 'Please enter the full home address.').max(255),
  hospital: z.string().uuid('Please select the hospital of birth.').or(z.literal('')),
  motherNationalId: z.string().length(14, "Mother's National ID number must be exactly 14 characters."),
  fatherNationalId: z
    .string()
    .length(14, "Father's National ID number must be exactly 14 characters.")
    .or(z.literal('')),
})
export type EditBirthApplicationFormValues = z.infer<typeof editBirthApplicationSchema>
