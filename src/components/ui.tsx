import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(39,37,55,0.04)]', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint?: string
  icon: ReactNode
}) {
  return (
    <Card className="flex items-start gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft-purple text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-heading text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  )
}

const badgeTones = {
  neutral: 'bg-muted text-muted-foreground',
  purple: 'bg-soft-purple text-primary',
  positive: 'bg-[#e8f5f0] text-positive',
  warning: 'bg-[#fbf3e4] text-warning',
  danger: 'bg-[#fbeceb] text-danger',
}

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap', badgeTones[tone])}>
      {children}
    </span>
  )
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:bg-[#6a45b3]',
    secondary: 'border border-border bg-card text-foreground hover:bg-muted',
    danger: 'bg-danger text-white hover:bg-[#a83631]',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  }
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        styles[variant],
        className,
      )}
    />
  )
}

export const inputClass =
  'w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

/** Confirmation dialog for sensitive actions (suspend, delete, publish, settings). */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  tone = 'primary',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel: string
  tone?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      className="m-auto w-[min(92vw,440px)] rounded-2xl border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-[#17151f]/40"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', tone === 'danger' ? 'bg-[#fbeceb] text-danger' : 'bg-soft-purple text-primary')}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold">{title}</h3>
            <div className="mt-1.5 text-sm text-muted-foreground">{body}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

/** Right-hand slide-over panel used for detail views and editors. */
export function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button aria-label="Close panel" className="absolute inset-0 bg-[#17151f]/30" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <Button variant="ghost" className="px-2" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  )
}

export function PreviewBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#eadcc0] bg-[#fdf8ee] px-4 py-3 text-sm text-[#7a5414]">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p>
        <strong className="font-semibold">Preview data.</strong> The figures on this page are sample data. The console isn't
        connected to the live platform's users, questions or quiz results yet. That connection comes next in the roadmap, and
        changes made here aren't saved.
      </p>
    </div>
  )
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function timeAgo(iso: string, now = new Date('2026-10-09T12:00:00Z')) {
  const mins = Math.round((now.getTime() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}
