import { createFileRoute } from '@tanstack/react-router'
import { LeadershipPage } from '@/pages/LeadershipPage'

export const Route = createFileRoute('/_public/leadership')({
  component: LeadershipPage,
})
