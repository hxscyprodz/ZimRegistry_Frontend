import { createFileRoute } from '@tanstack/react-router'
import { DepartmentDetailPage } from '@/pages/DepartmentDetailPage'

export const Route = createFileRoute('/_public/departments/$departmentId')({
  component: () => {
    const { departmentId } = Route.useParams()
    return <DepartmentDetailPage departmentId={departmentId} />
  },
})
