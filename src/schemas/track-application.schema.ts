import { z } from 'zod'

export const trackApplicationSchema = z.object({
  reference: z.string().min(1, 'Please enter an application reference number.'),
})
export type TrackApplicationFormValues = z.infer<typeof trackApplicationSchema>
