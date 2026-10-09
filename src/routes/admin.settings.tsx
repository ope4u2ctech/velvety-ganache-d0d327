import { createFileRoute } from '@tanstack/react-router'
import { RoadmapSection } from '@/components/RoadmapSection'

export const Route = createFileRoute('/admin/settings')({
  component: () => (
    <RoadmapSection
      title="Website settings"
      description="Branding, announcements and feature switches for the student site."
      milestone="Milestone 8"
      requires="The student site needs to read these settings from a shared, server-side settings store, so changes here take effect there."
      features={[
        'Permitted branding: site name, tagline, logo and accent colour',
        'Announcements with start and end dates and target audiences',
        'Turn individual features on or off: spotters, viva, AI tutor, leaderboard',
        'Quiz length choices students can pick from (for example 10, 20, 50 or custom)',
        'AI generation limits per student per day',
        'Open or close registration, with optional invite-only mode',
        'Confirmation step and audit entry for every change',
      ]}
    />
  ),
})
