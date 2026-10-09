import { createFileRoute } from '@tanstack/react-router'
import { RoadmapSection } from '@/components/RoadmapSection'

export const Route = createFileRoute('/admin/academic')({
  component: () => (
    <RoadmapSection
      title="Academic management"
      description="The universities, faculties, departments, programmes and levels students choose from."
      milestone="Milestone 7"
      requires="It depends on how the live platform stores onboarding choices. If they're free text, a safe migration will add lookup tables without changing existing student records."
      features={[
        'Add, rename and retire universities',
        'Faculties and departments for each university',
        'Programmes (MBBS, BDS, B.Sc Anatomy and others) and their levels',
        'Merge duplicate entries such as "UNILORIN" and "University of Ilorin"',
        'Performance summaries by university and class, aggregated only',
        'Minimum group sizes so no individual student can be identified',
      ]}
    />
  ),
})
