import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Ban, RotateCcw, Search } from 'lucide-react'
import { PageHeader } from '@/components/AdminShell'
import { Badge, Button, Card, ConfirmDialog, Drawer, PreviewBanner, formatDate, inputClass, timeAgo } from '@/components/ui'
import { universities, users as seedUsers } from '@/data/fixtures'
import type { AdminUser } from '@/data/fixtures'

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
})

const levels = ['100L', '200L', '300L', '400L']

function UsersPage() {
  const [users, setUsers] = useState(seedUsers)
  const [query, setQuery] = useState('')
  const [university, setUniversity] = useState('')
  const [level, setLevel] = useState('')
  const [status, setStatus] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pendingToggle, setPendingToggle] = useState<AdminUser | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.programme.toLowerCase().includes(q)) &&
        (!university || u.university === university) &&
        (!level || u.level === level) &&
        (!status || u.status === status),
    )
  }, [users, query, university, level, status])

  const selected = users.find((u) => u.id === selectedId) ?? null

  function confirmToggle() {
    if (!pendingToggle) return
    const id = pendingToggle.id
    setUsers((list) => list.map<AdminUser>((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)))
    setPendingToggle(null)
  }

  return (
    <>
      <PageHeader title="Users" description="Search registered students and manage account access." />
      <PreviewBanner />

      <Card className="p-0">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_220px_130px_150px]">
          <label className="relative">
            <span className="sr-only">Search users</span>
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input className={`${inputClass} pl-9`} placeholder="Search name, email or programme" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <select aria-label="University" className={inputClass} value={university} onChange={(e) => setUniversity(e.target.value)}>
            <option value="">All universities</option>
            {universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <select aria-label="Level" className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All levels</option>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select aria-label="Status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <p className="px-4 pt-3 text-xs text-muted-foreground">
          {filtered.length} of {users.length} users
        </p>

        {/* Table on larger screens */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">University</th>
                <th className="px-4 py-3 font-semibold">Programme</th>
                <th className="px-4 py-3 font-semibold">Quizzes</th>
                <th className="px-4 py-3 font-semibold">Accuracy</th>
                <th className="px-4 py-3 font-semibold">Last active</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedId(u.id)}>
                  <td className="px-4 py-3">
                    <button className="text-left" onClick={() => setSelectedId(u.id)}>
                      <span className="block font-semibold">{u.name}</span>
                      <span className="block text-xs text-muted-foreground">{u.email}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">{u.university}</td>
                  <td className="px-4 py-3">
                    {u.programme} <span className="text-muted-foreground">· {u.level}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{u.quizzesTaken}</td>
                  <td className="px-4 py-3 tabular-nums">{u.accuracy}%</td>
                  <td className="px-4 py-3 text-muted-foreground">{timeAgo(u.lastActiveAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadges user={u} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards on mobile */}
        <ul className="divide-y divide-border md:hidden">
          {filtered.map((u) => (
            <li key={u.id}>
              <button className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left" onClick={() => setSelectedId(u.id)}>
                <span className="min-w-0">
                  <span className="block font-semibold">{u.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {u.university} · {u.programme} {u.level}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {u.quizzesTaken} quizzes · {u.accuracy}% accuracy
                  </span>
                </span>
                <StatusBadges user={u} />
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No users match these filters.</p>}
      </Card>

      <Drawer open={!!selected} title={selected?.name ?? ''} onClose={() => setSelectedId(null)}>
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <StatusBadges user={selected} />
              <Badge tone="neutral">Joined {formatDate(selected.joinedAt)}</Badge>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              {(
                [
                  ['Email', selected.email],
                  ['University', selected.university],
                  ['Department', selected.department],
                  ['Programme', selected.programme],
                  ['Level', selected.level],
                  ['Last active', timeAgo(selected.lastActiveAt)],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="truncate font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ['Quizzes', selected.quizzesTaken],
                  ['Answered', selected.questionsAnswered.toLocaleString()],
                  ['Accuracy', `${selected.accuracy}%`],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-heading text-lg font-extrabold">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold">Recent quizzes</h3>
              <ul className="divide-y divide-border rounded-xl border border-border text-sm">
                {selected.recentQuizzes.map((q, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2.5">
                    <span>
                      <span className="font-medium">{q.topic}</span>
                      <span className="block text-xs text-muted-foreground">{formatDate(q.date)}</span>
                    </span>
                    <span className="tabular-nums font-semibold">
                      {q.score}/{q.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-bold">Account access</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.status === 'active'
                  ? 'Suspending blocks sign-in. Quiz history and progress are kept.'
                  : 'Reactivating restores sign-in with all previous progress intact.'}
              </p>
              <Button
                className="mt-3"
                variant={selected.status === 'active' ? 'danger' : 'primary'}
                disabled={selected.role === 'admin'}
                onClick={() => setPendingToggle(selected)}
              >
                {selected.status === 'active' ? <Ban size={16} /> : <RotateCcw size={16} />}
                {selected.status === 'active' ? 'Suspend account' : 'Reactivate account'}
              </Button>
              {selected.role === 'admin' && <p className="mt-2 text-xs text-muted-foreground">Administrator accounts can't be suspended from here.</p>}
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!pendingToggle}
        tone={pendingToggle?.status === 'active' ? 'danger' : 'primary'}
        title={pendingToggle?.status === 'active' ? `Suspend ${pendingToggle?.name}?` : `Reactivate ${pendingToggle?.name}?`}
        body="This action is recorded in the audit log with your name and the time."
        confirmLabel={pendingToggle?.status === 'active' ? 'Suspend' : 'Reactivate'}
        onConfirm={confirmToggle}
        onCancel={() => setPendingToggle(null)}
      />
    </>
  )
}

function StatusBadges({ user }: { user: AdminUser }) {
  return (
    <span className="flex flex-wrap gap-1">
      {user.status === 'active' ? <Badge tone="positive">Active</Badge> : <Badge tone="danger">Suspended</Badge>}
      {user.role !== 'student' && <Badge tone="purple">{user.role === 'admin' ? 'Admin' : 'Moderator'}</Badge>}
    </span>
  )
}
