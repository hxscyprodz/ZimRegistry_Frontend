import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email('Please enter a valid email address.'),
})
export type NewsletterFormValues = z.infer<typeof newsletterSchema>
