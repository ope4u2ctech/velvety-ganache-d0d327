import { createFileRoute } from '@tanstack/react-router'
import { RoadmapSection } from '@/components/RoadmapSection'
import { TrendLine } from '@/components/charts'
import { Card, CardHeader, PreviewBanner } from '@/components/ui'
import { aiRequestsByDay } from '@/data/fixtures'

export const Route = createFileRoute('/admin/ai')({
  component: () => (
    <RoadmapSection
      title="AI management"
      description="Usage, cost, failures and limits for AI question generation and the AI tutor."
      milestone="Milestone 5"
      requires="It needs the platform's existing AI service to log each request (model, tokens, status) on the server, so figures come from real provider usage."
      features={[
        'Requests and questions generated per day, by feature',
        'Estimated cost from token usage and published provider pricing',
        'Failed and timed-out requests with error details',
        'Daily and monthly generation limits, per user and platform-wide',
        'Budget alerts at configurable thresholds',
        'Feature switches to pause AI generation or the AI tutor',
        'Cached results for repeated prompts to avoid paying twice',
        'Automatic validation of generated questions before they reach review',
      ]}
    >
      <PreviewBanner />
      <Card>
        <CardHeader title="AI requests per day" subtitle="Last 14 days" />
        <TrendLine
          label="Requests"
          labels={aiRequestsByDay.map((d) => new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }))}
          values={aiRequestsByDay.map((d) => d.requests)}
        />
      </Card>
    </RoadmapSection>
  ),
})
