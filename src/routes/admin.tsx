import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminShell } from '@/components/AdminShell'

// NOTE: server-side admin authorisation is added in the next milestone (see
// PLAN.md). Until then this route only renders preview fixtures, never live data.
export const Route = createFileRoute('/admin')({
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
})
