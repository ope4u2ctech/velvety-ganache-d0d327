import type { ReactNode } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import { PageHeader } from './AdminShell'
import { Card, CardHeader } from './ui'

/** Placeholder for console sections whose live functionality ships in a later milestone. */
export function RoadmapSection({
  title,
  description,
  milestone,
  features,
  requires,
  children,
}: {
  title: string
  description: string
  milestone: string
  features: string[]
  requires: string
  children?: ReactNode
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border bg-soft-purple px-4 py-3 text-sm">
        <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
        <p>
          <strong className="font-semibold">Planned for {milestone}.</strong> {requires}
        </p>
      </div>
      {children}
      <Card className={children ? 'mt-4' : ''}>
        <CardHeader title="What this section will include" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
