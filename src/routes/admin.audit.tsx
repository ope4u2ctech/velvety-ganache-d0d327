import { createFileRoute } from '@tanstack/react-router'
import { RoadmapSection } from '@/components/RoadmapSection'

export const Route = createFileRoute('/admin/audit')({
  component: () => (
    <RoadmapSection
      title="Audit logs"
      description="A tamper-resistant record of administrative actions and application errors."
      milestone="Milestone 3"
      requires="Logging starts with the first live admin action. Entries are written only by server functions and can't be edited or deleted from the console."
      features={[
        'Every suspension, reactivation and role change',
        'Question creation, edits, approvals, archives and deletions, with before/after values',
        'Settings and announcement changes',
        'Timestamp and responsible administrator on every entry',
        'Application and AI errors surfaced alongside admin actions',
        'Filter by administrator, action type and date range',
        'Visible to administrators only, never to students or moderators',
      ]}
    />
  ),
})
