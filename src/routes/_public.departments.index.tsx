import { createFileRoute } from '@tanstack/react-router'
import { DepartmentsPage } from '@/pages/DepartmentsPage'

export const Route = createFileRoute('/_public/departments/')({
  component: DepartmentsPage,
})
