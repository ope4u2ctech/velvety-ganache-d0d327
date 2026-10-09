import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import { adminNav, Logo } from '@/components/AdminShell'

export const Route = createFileRoute('/')({
  component: Landing,
})

const descriptions: Record<string, string> = {
  Overview: 'Users, questions, AI usage and system health at a glance.',
  Users: 'Search students, view academic details and quiz history, suspend or reactivate accounts.',
  'Question bank': 'Browse, edit, archive and approve questions, and catch duplicates.',
  'AI management': 'Request volume, failures, estimated cost, limits and alerts.',
  Academic: 'Universities, faculties, departments, programmes and levels.',
  Analytics: 'Participation, topic performance and frequently missed questions.',
  'Website settings': 'Branding, announcements, features and registration options.',
  'Audit logs': 'A record of every administrative action and who made it.',
}

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <a href="https://learningplatform2.netlify.app" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Student site →
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-10 pb-14 sm:pt-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-soft-purple px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck size={14} /> Administrators only
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Run Abdulsobbur Anatomy <span className="text-primary">from one place.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage your students, question bank, AI question generation and platform settings without touching the student
            experience.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#6a45b3]"
            >
              Open the console preview <ArrowRight size={16} />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock size={14} /> Administrator sign-in is the next milestone
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-soft-purple text-primary">
                <item.icon size={19} />
              </div>
              <h2 className="mt-4 text-[15px] font-bold">{item.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{descriptions[item.label]}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Abdulsobbur Anatomy · Admin console
      </footer>
    </div>
  )
}
