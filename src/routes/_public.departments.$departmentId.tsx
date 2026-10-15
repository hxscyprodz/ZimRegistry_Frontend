import { createFileRoute } from '@tanstack/react-router'
import { DepartmentDetailPage } from '@/pages/DepartmentDetailPage'

function DepartmentDetailRouteComponent() {
  const { departmentId } = Route.useParams()
  return <DepartmentDetailPage departmentId={departmentId} />
}

export const Route = createFileRoute('/_public/departments/$departmentId')({
  component: DepartmentDetailRouteComponent,
})
