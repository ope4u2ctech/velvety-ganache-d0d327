import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  BookOpenCheck,
  Building2,
  ExternalLink,
  LayoutDashboard,
  Menu,
  ScrollText,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { cn } from './ui'

export const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/questions', label: 'Question bank', icon: BookOpenCheck },
  { to: '/admin/ai', label: 'AI management', icon: Sparkles },
  { to: '/admin/academic', label: 'Academic', icon: Building2 },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Website settings', icon: Settings },
  { to: '/admin/audit', label: 'Audit logs', icon: ScrollText },
] as const

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-heading text-lg font-extrabold text-white">A</span>
      <span className="leading-tight">
        <span className="block font-heading text-[15px] font-extrabold text-foreground">Anatomy.</span>
        <span className="block text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">ADMIN CONSOLE</span>
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {adminNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: 'exact' in item }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeProps={{ className: '!bg-soft-purple !text-primary font-semibold' }}
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden border-r border-border bg-card lg:flex lg:flex-col lg:gap-8 lg:px-4 lg:py-6 lg:sticky lg:top-0 lg:h-screen">
        <div className="px-2">
          <Logo />
        </div>
        <NavLinks />
        <div className="mt-auto rounded-2xl bg-soft-purple p-4 text-sm">
          <p className="font-semibold text-foreground">Student site</p>
          <a
            href="https://learningplatform2.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
          >
            learningplatform2 <ExternalLink size={13} />
          </a>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 text-foreground hover:bg-muted"
        >
          <Menu size={22} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-[#17151f]/30" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 bg-card px-4 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo />
              <button aria-label="Close navigation" onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main id="main-content" className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  )
}

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between')}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
