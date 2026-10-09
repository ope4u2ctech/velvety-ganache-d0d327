import { createFileRoute } from '@tanstack/react-router'
import { RoadmapSection } from '@/components/RoadmapSection'
import { HBars } from '@/components/charts'
import { Card, CardHeader, PreviewBanner } from '@/components/ui'
import { topicAccuracy } from '@/data/fixtures'

export const Route = createFileRoute('/admin/analytics')({
  component: () => (
    <RoadmapSection
      title="Analytics"
      description="How students practise and where they struggle."
      milestone="Milestone 6"
      requires="It needs read access to the platform's quiz attempts and answers. Every chart will be computed from those records, never estimated."
      features={[
        'Quiz participation and completion rates',
        'Average performance by subject and topic',
        'Most frequently missed questions',
        'Most popular study topics',
        'Daily and weekly active-user trends',
        'AI usage trends alongside study activity',
        'Date-range and subject filters on every chart',
        'Table view and CSV export for each chart',
      ]}
    >
      <PreviewBanner />
      <Card>
        <CardHeader title="Average accuracy by topic" subtitle="Share of answers correct" />
        <HBars label="Accuracy" suffix="%" labels={topicAccuracy.map((t) => t.topic)} values={topicAccuracy.map((t) => t.accuracy)} />
      </Card>
    </RoadmapSection>
  ),
})
