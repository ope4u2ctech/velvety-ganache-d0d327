import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Archive, CheckCircle2, Copy, Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/AdminShell'
import { Badge, Button, Card, ConfirmDialog, Drawer, PreviewBanner, cn, formatDate, inputClass } from '@/components/ui'
import { questions as seedQuestions, similarity, subjects, topics } from '@/data/fixtures'
import type { Difficulty, Question, QuestionStatus } from '@/data/fixtures'

export const Route = createFileRoute('/admin/questions')({
  component: QuestionBank,
})

const DUPLICATE_THRESHOLD = 0.6
const statusLabel: Record<QuestionStatus, string> = { published: 'Published', pending_review: 'Needs review', archived: 'Archived' }
const statusTone = { published: 'positive', pending_review: 'warning', archived: 'neutral' } as const
const difficultyTone = { easy: 'positive', medium: 'purple', hard: 'danger' } as const

type Tab = 'all' | 'review' | 'duplicates'

function blankQuestion(): Question {
  return {
    id: '',
    subject: subjects[0],
    topic: topics[subjects[0]][0],
    difficulty: 'medium',
    status: 'published',
    source: 'manual',
    stem: '',
    options: ['', '', '', ''],
    answerIndex: 0,
    explanation: '',
    timesAnswered: 0,
    correctRate: 0,
    updatedAt: new Date().toISOString(),
  }
}

function QuestionBank() {
  const [items, setItems] = useState(seedQuestions)
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [status, setStatus] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [editing, setEditing] = useState<Question | null>(null)
  const [confirm, setConfirm] = useState<{ kind: 'archive' | 'delete' | 'approve'; q: Question } | null>(null)

  const duplicates = useMemo(() => {
    const pairs: { a: Question; b: Question; score: number }[] = []
    for (let i = 0; i < items.length; i++)
      for (let j = i + 1; j < items.length; j++) {
        const score = similarity(items[i].stem, items[j].stem)
        if (score >= DUPLICATE_THRESHOLD) pairs.push({ a: items[i], b: items[j], score })
      }
    return pairs
  }, [items])
  const duplicateIds = new Set(duplicates.flatMap((d) => [d.a.id, d.b.id]))
  const pendingCount = items.filter((q) => q.status === 'pending_review').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (it) =>
        (tab !== 'review' || it.status === 'pending_review') &&
        (!q || it.stem.toLowerCase().includes(q) || it.id.includes(q)) &&
        (!subject || it.subject === subject) &&
        (!topic || it.topic === topic) &&
        (!difficulty || it.difficulty === difficulty) &&
        (!status || it.status === status),
    )
  }, [items, tab, query, subject, topic, difficulty, status])

  function save(q: Question) {
    setItems((list) => {
      if (q.id) return list.map((it) => (it.id === q.id ? { ...q, updatedAt: new Date().toISOString() } : it))
      // New questions get the next ID; existing IDs are never reassigned.
      const next = Math.max(...list.map((it) => Number(it.id.slice(2)))) + 1
      return [{ ...q, id: `q_${String(next).padStart(5, '0')}` }, ...list]
    })
    setEditing(null)
  }

  function runConfirm() {
    if (!confirm) return
    const { kind, q } = confirm
    if (kind === 'delete') setItems((l) => l.filter((it) => it.id !== q.id))
    else setItems((l) => l.map<Question>((it) => (it.id === q.id ? { ...it, status: kind === 'archive' ? 'archived' : 'published' } : it)))
    setConfirm(null)
  }

  return (
    <>
      <PageHeader
        title="Question bank"
        description="Browse, edit and review MCQs. Question IDs are preserved on every edit."
        actions={
          <Button onClick={() => setEditing(blankQuestion())}>
            <Plus size={16} /> Add question
          </Button>
        }
      />
      <PreviewBanner />

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-muted p-1 text-sm" role="tablist">
        {(
          [
            ['all', 'All questions', items.length],
            ['review', 'AI review queue', pendingCount],
            ['duplicates', 'Possible duplicates', duplicates.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 font-semibold transition-colors',
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            <span className="rounded-full bg-soft-purple px-1.5 text-xs text-primary">{count}</span>
          </button>
        ))}
      </div>

      {tab === 'duplicates' ? (
        <div className="space-y-3">
          {duplicates.length === 0 && <Card className="text-center text-sm text-muted-foreground">No likely duplicates found.</Card>}
          {duplicates.map((d) => (
            <Card key={d.a.id + d.b.id}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge tone="warning">
                  <Copy size={12} /> {Math.round(d.score * 100)}% similar
                </Badge>
                <span className="text-xs text-muted-foreground">{d.a.topic}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[d.a, d.b].map((q) => (
                  <div key={q.id} className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">
                      {q.id} · answered {q.timesAnswered.toLocaleString()} times
                    </p>
                    <p className="mt-1 text-sm font-medium">{q.stem}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setEditing(q)}>
                        <Pencil size={13} /> Edit
                      </Button>
                      {q.status !== 'archived' && (
                        <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setConfirm({ kind: 'archive', q })}>
                          <Archive size={13} /> Archive
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0">
          <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_170px_170px_130px_150px]">
            <label className="relative sm:col-span-2 lg:col-span-1">
              <span className="sr-only">Search questions</span>
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputClass} pl-9`} placeholder="Search question text or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <select
              aria-label="Subject"
              className={inputClass}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                setTopic('')
              }}
            >
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select aria-label="Topic" className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All topics</option>
              {(subject ? topics[subject] : Object.values(topics).flat()).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select aria-label="Difficulty" className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select aria-label="Status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)} disabled={tab === 'review'}>
              <option value="">Any status</option>
              <option value="published">Published</option>
              <option value="pending_review">Needs review</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <ul className="divide-y divide-border">
            {filtered.slice(0, pageSize).map((q) => (
              <li key={q.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">{q.id}</span>
                    <Badge tone={statusTone[q.status]}>{statusLabel[q.status]}</Badge>
                    <Badge tone={difficultyTone[q.difficulty]}>{q.difficulty}</Badge>
                    {q.source === 'ai' && (
                      <Badge tone="purple">
                        <Sparkles size={11} /> AI
                      </Badge>
                    )}
                    {duplicateIds.has(q.id) && (
                      <Badge tone="warning">
                        <Copy size={11} /> Possible duplicate
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{q.stem}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.subject} › {q.topic} · Answer: {String.fromCharCode(65 + q.answerIndex)}. {q.options[q.answerIndex]}
                    {q.timesAnswered > 0 && ` · ${q.correctRate}% correct over ${q.timesAnswered.toLocaleString()} attempts`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {q.status === 'pending_review' && (
                    <Button className="px-2.5 py-1.5 text-xs" onClick={() => setConfirm({ kind: 'approve', q })}>
                      <CheckCircle2 size={13} /> Approve
                    </Button>
                  )}
                  <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setEditing(q)} aria-label={`Edit ${q.id}`}>
                    <Pencil size={13} /> Edit
                  </Button>
                  {q.status !== 'archived' && (
                    <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setConfirm({ kind: 'archive', q })} aria-label={`Archive ${q.id}`}>
                      <Archive size={13} />
                    </Button>
                  )}
                  <Button variant="ghost" className="px-2.5 py-1.5 text-xs hover:!text-danger" onClick={() => setConfirm({ kind: 'delete', q })} aria-label={`Delete ${q.id}`}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No questions match these filters.</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {Math.min(pageSize, filtered.length)} of {filtered.length} questions. The bank has no size cap.
            </span>
            <label className="flex items-center gap-2">
              Per page
              <select className="rounded-lg border border-border bg-card px-2 py-1 text-xs" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {[10, 25, 50, 100].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        </Card>
      )}

      <Drawer open={!!editing} title={editing?.id ? `Edit ${editing.id}` : 'New question'} onClose={() => setEditing(null)}>
        {editing && <QuestionEditor key={editing.id || 'new'} initial={editing} existing={items} onSave={save} onCancel={() => setEditing(null)} />}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        tone={confirm?.kind === 'delete' ? 'danger' : 'primary'}
        title={
          confirm?.kind === 'delete' ? `Permanently delete ${confirm.q.id}?` : confirm?.kind === 'archive' ? `Archive ${confirm?.q.id}?` : `Publish ${confirm?.q.id}?`
        }
        body={
          confirm?.kind === 'delete'
            ? `This removes the question and can't be undone. Students' past results stay in their history. Archive it instead if you might need it again.`
            : confirm?.kind === 'archive'
              ? 'Archived questions stop appearing in quizzes but keep their ID, statistics and history. You can restore them later.'
              : 'Check the answer key and explanation first. Once published, students see this question in quizzes.'
        }
        confirmLabel={confirm?.kind === 'delete' ? 'Delete permanently' : confirm?.kind === 'archive' ? 'Archive' : 'Publish'}
        onConfirm={runConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}

function QuestionEditor({
  initial,
  existing,
  onSave,
  onCancel,
}: {
  initial: Question
  existing: Question[]
  onSave: (q: Question) => void
  onCancel: () => void
}) {
  const [q, setQ] = useState(initial)
  const set = <K extends keyof Question>(k: K, v: Question[K]) => setQ((prev) => ({ ...prev, [k]: v }))

  // Validation runs before anything is saved or published.
  const errors: string[] = []
  if (q.stem.trim().length < 10) errors.push('Question text needs at least 10 characters.')
  if (q.options.some((o) => !o.trim())) errors.push('Every option needs text.')
  if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length) errors.push('Options must be different from each other.')
  if (q.explanation.trim().length < 10) errors.push('Add an explanation so students learn from mistakes.')
  const similar = existing.filter((e) => e.id !== q.id && q.stem.length > 10 && similarity(e.stem, q.stem) >= DUPLICATE_THRESHOLD)

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (errors.length === 0) onSave(q)
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Subject</span>
          <select
            className={inputClass}
            value={q.subject}
            onChange={(e) => {
              set('subject', e.target.value)
              set('topic', topics[e.target.value][0])
            }}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Topic</span>
          <select className={inputClass} value={q.topic} onChange={(e) => set('topic', e.target.value)}>
            {topics[q.subject].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="text-sm">
        <legend className="mb-1 font-semibold">Difficulty</legend>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => set('difficulty', d)}
              className={cn('rounded-lg border px-3 py-1.5 capitalize', q.difficulty === d ? 'border-primary bg-soft-purple font-semibold text-primary' : 'border-border')}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="mb-1 block font-semibold">Question</span>
        <textarea className={`${inputClass} min-h-24`} value={q.stem} onChange={(e) => set('stem', e.target.value)} />
      </label>
      {similar.length > 0 && (
        <p className="rounded-xl bg-[#fbf3e4] p-3 text-xs text-warning">
          Looks similar to {similar.map((s) => s.id).join(', ')}. Check it isn't a duplicate.
        </p>
      )}

      <fieldset className="space-y-2 text-sm">
        <legend className="mb-1 font-semibold">Options. Select the correct answer.</legend>
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="answer"
              aria-label={`Option ${String.fromCharCode(65 + i)} is correct`}
              checked={q.answerIndex === i}
              onChange={() => set('answerIndex', i)}
              className="h-4 w-4 accent-[#7953c5]"
            />
            <span className="w-4 font-semibold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
            <input
              className={inputClass}
              value={opt}
              onChange={(e) => set('options', q.options.map((o, j) => (j === i ? e.target.value : o)))}
            />
          </div>
        ))}
      </fieldset>

      <label className="block text-sm">
        <span className="mb-1 block font-semibold">Explanation</span>
        <textarea className={`${inputClass} min-h-24`} value={q.explanation} onChange={(e) => set('explanation', e.target.value)} />
      </label>

      {errors.length > 0 && (
        <ul className="list-disc space-y-0.5 rounded-xl bg-muted p-3 pl-7 text-xs text-muted-foreground">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {q.id && <p className="text-xs text-muted-foreground">Last updated {formatDate(q.updatedAt)}. ID {q.id} stays the same after saving.</p>}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={errors.length > 0}>
          Save question
        </Button>
      </div>
    </form>
  )
}
