import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(12, 'Password must be at most 12 characters.'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

// Matches ZimReg_Backend's `RegisterUserSchema` exactly
// (src/validators/validators.ts in the backend repo). No middleNames field
// — the Users table has no column for it, only firstName/surname (which
// must match an existing birth certificate record).
export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Please enter the applicant's first name.").max(100),
    surname: z.string().min(2, "Please enter the applicant's surname.").max(100),
    nationalIdNumber: z.string().length(14, 'National ID number must be exactly 14 characters.'),
    email: z.string().min(1, 'Please enter your email address.').email('Please enter a valid email address.'),
    phone: z
      .string()
      .regex(/^\+[1-9]\d{6,14}$/, 'Please enter a valid phone number in international format, e.g. +263771234567.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(12, 'Password must be at most 12 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email('Please enter a valid email address.'),
})
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
