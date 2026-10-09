# AGENTS.md

Admin console for the Abdulsobbur Anatomy learning platform
(https://learningplatform2.netlify.app). The student platform's code is in a
**different** Netlify project. This repo holds only the admin console.

**Continue from [PLAN.md](./PLAN.md).** Milestone 1 (the UI surface) is done. The
next step is Milestone 2: inspect and connect the live platform's backend.

## Architecture

- TanStack Start + React 19, file-based routes in `src/routes/`.
  - `index.tsx`: landing page.
  - `admin.tsx`: layout route that wraps every `/admin/*` page in `AdminShell`.
  - `admin.index.tsx`, `admin.users.tsx`, `admin.questions.tsx`: working screens.
  - `admin.ai.tsx`, `admin.analytics.tsx`, `admin.academic.tsx`,
    `admin.settings.tsx`, `admin.audit.tsx`: roadmap pages built on
    `RoadmapSection`.
- `src/components/AdminShell.tsx`: sidebar/mobile drawer, `adminNav`, `PageHeader`.
- `src/components/ui.tsx`: Card, StatTile, Badge, Button, ConfirmDialog, Drawer,
  PreviewBanner, and date helpers.
- `src/components/charts.tsx`: single-series Chart.js wrappers in the brand purple.
- `src/data/fixtures.ts`: **all sample data**, plus the `similarity()` duplicate
  heuristic. Replace these exports with server functions that keep the same
  shapes, then remove `PreviewBanner` from each page once it shows live data.

## Conventions and decisions

- Design tokens in `src/styles.css` mirror the live site: primary `#7953c5`,
  Manrope headings, DM Sans body. Use the Tailwind tokens (`bg-primary`,
  `text-muted-foreground`, `bg-soft-purple`), not raw colours.
- Mutations on the current screens update local state only. Real writes must go
  through server functions that call `requireAdmin()` and write an audit entry.
- Never put secrets in client code. Never create a second auth system. Reuse the
  platform's provider (see PLAN.md, Milestone 3).
- Fixture dates are anchored to a fixed "now" so SSR and the client render the
  same markup.
- Use `@/` imports for `src/*`.
