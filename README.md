# Abdulsobbur Anatomy — Admin Console

The admin console for the [Abdulsobbur Anatomy](https://learningplatform2.netlify.app)
learning platform. Administrators use it to manage students, the MCQ question
bank, AI question generation, academic data, site settings and audit logs.

> **Status:** Milestone 1. The console UI is complete and runs on sample data in
> `src/data/fixtures.ts`. It isn't connected to the live platform yet. See
> [PLAN.md](./PLAN.md) for the roadmap.

## Tech

- TanStack Start (React 19, TanStack Router, file-based routes)
- Tailwind CSS 4, with design tokens matching the student site
- Chart.js via react-chartjs-2
- Netlify (`@netlify/vite-plugin-tanstack-start`)

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Screens

| Route | Screen |
| --- | --- |
| `/` | Console landing page |
| `/admin` | Overview |
| `/admin/users` | User management |
| `/admin/questions` | Question bank |
| `/admin/ai` | AI management (preview) |
| `/admin/analytics` | Analytics (preview) |
| `/admin/academic`, `/admin/settings`, `/admin/audit` | Planned sections |

## Roadmap

Next up: connect to the live platform's backend, then admin sign-in with
server-side role checks and an audit log. After that come live users and
questions, AI usage tracking and limits, analytics, academic data and site
settings. Details are in [PLAN.md](./PLAN.md).
