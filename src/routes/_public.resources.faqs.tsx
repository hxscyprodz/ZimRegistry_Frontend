import { createFileRoute } from '@tanstack/react-router'
import { FAQPage } from '@/pages/FAQPage'

export const Route = createFileRoute('/_public/resources/faqs')({
  component: FAQPage,
})
