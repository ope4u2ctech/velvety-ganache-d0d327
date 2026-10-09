import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  CircleAlert,
  Info,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  XCircle,
  ClipboardCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/AdminShell'
import { Badge, Card, CardHeader, PreviewBanner, StatTile, timeAgo } from '@/components/ui'
import { TrendLine } from '@/components/charts'
import {
  aiRequestsByDay,
  aiSummary,
  alerts,
  questions,
  recentActivity,
  registrationsByWeek,
  systemStatus,
  users,
} from '@/data/fixtures'
import type { ActivityKind } from '@/data/fixtures'

export const Route = createFileRoute('/admin/')({
  component: Overview,
})

const NOW = new Date('2026-10-09T12:00:00Z').getTime()

const activityIcon: Record<ActivityKind, typeof Users> = {
  signup: UserPlus,
  quiz: ClipboardCheck,
  ai: Sparkles,
  admin: ShieldCheck,
  error: XCircle,
}

function Overview() {
  const active7d = users.filter((u) => NOW - new Date(u.lastActiveAt).getTime() < 7 * 86400000).length
  const published = questions.filter((q) => q.status === 'published').length
  const pending = questions.filter((q) => q.status === 'pending_review').length
  const newThisWeek = registrationsByWeek[registrationsByWeek.length - 1].count
  const budgetPct = Math.round((aiSummary.estimatedCost30dUsd / aiSummary.monthlyBudgetUsd) * 100)

  return (
    <>
      <PageHeader title="Overview" description="How the platform is doing today." />
      <PreviewBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Users size={19} />} label="Registered users" value={users.length.toLocaleString()} hint={`${newThisWeek} joined this week`} />
        <StatTile icon={<LogIn size={19} />} label="Active (last 7 days)" value={active7d.toLocaleString()} hint={`${Math.round((active7d / users.length) * 100)}% of all users`} />
        <StatTile icon={<BookOpenCheck size={19} />} label="Published questions" value={published.toLocaleString()} hint={`${pending} awaiting review`} />
        <StatTile
          icon={<Sparkles size={19} />}
          label="AI questions (30 days)"
          value={aiSummary.questionsGenerated30d.toLocaleString()}
          hint={`${Math.round(aiSummary.approvedRate * 100)}% approved · ~$${aiSummary.estimatedCost30dUsd.toFixed(2)}`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="New registrations" subtitle="Students per week, last 12 weeks" />
          <TrendLine
            label="Registrations"
            labels={registrationsByWeek.map((w) => new Date(w.weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }))}
            values={registrationsByWeek.map((w) => w.count)}
          />
        </Card>

        <Card>
          <CardHeader title="Alerts" subtitle="Things that need attention" />
          <ul className="space-y-3">
            {alerts.map((a) => {
              const Icon = a.level === 'critical' ? CircleAlert : a.level === 'warning' ? AlertTriangle : Info
              const color = a.level === 'critical' ? 'text-danger' : a.level === 'warning' ? 'text-warning' : 'text-primary'
              return (
                <li key={a.id} className="flex gap-3 rounded-xl bg-muted/60 p-3 text-sm">
                  <Icon size={17} className={`mt-0.5 shrink-0 ${color}`} />
                  <span>
                    <span className="sr-only">{a.level}: </span>
                    {a.text}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4">
            <p className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>AI budget used this month</span>
              <span className="font-semibold text-foreground">{budgetPct}%</span>
            </p>
            <div className="h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={budgetPct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-2 rounded-full bg-primary" style={{ width: `${budgetPct}%` }} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent activity"
            subtitle="Sign-ups, quizzes, AI jobs and admin actions"
            action={
              <Link to="/admin/audit" className="text-sm font-semibold text-primary hover:underline">
                Audit log
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.kind]
              return (
                <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${a.kind === 'error' ? 'bg-[#fbeceb] text-danger' : 'bg-soft-purple text-primary'}`}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">{a.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at)}</span>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="System status" />
          <ul className="space-y-3">
            {systemStatus.map((s) => (
              <li key={s.name} className="flex items-start gap-3 text-sm">
                {s.ok ? <CheckCircle2 size={17} className="mt-0.5 text-positive" /> : <XCircle size={17} className="mt-0.5 text-danger" />}
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">AI requests, last 14 days</p>
            <p className="mt-1 font-heading text-xl font-extrabold">
              {aiRequestsByDay.reduce((s, d) => s + d.requests, 0).toLocaleString()}
            </p>
            <div className="mt-1 flex gap-2">
              <Badge tone="danger">{aiRequestsByDay.reduce((s, d) => s + d.failed, 0)} failed</Badge>
              <Badge tone="purple">{Math.round(aiSummary.cacheHitRate * 100)}% served from cache</Badge>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
