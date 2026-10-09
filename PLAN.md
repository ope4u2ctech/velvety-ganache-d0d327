# Admin Console Roadmap — Abdulsobbur Anatomy

The admin console manages the live student platform at
https://learningplatform2.netlify.app. That platform's source code is in a
separate Netlify project, so the console was built here as its own app. It
connects to the platform's existing backend; it doesn't replace it.

Ground rules that apply to every milestone:

- Never create a second authentication system or a copy of student data. Reuse the
  platform's existing auth provider and database.
- All secrets (database service keys, AI provider keys) live only in Netlify
  environment variables and are used only inside server functions.
- Every admin read and write goes through a server function that checks the
  caller's administrator role on the server. Hiding a button doesn't count.
- No destructive schema changes. Inspect dependencies first, then add tables or
  columns with backwards-compatible migrations.
- Show only figures computed from real data. Remove fixtures section by section.

## Milestone 1: Console surface ✅

Branded landing page and responsive admin shell (sidebar on desktop, drawer on
mobile) in the live site's visual style. Working screens on preview data:
Overview, Users (search, filters, details, suspend/reactivate with confirmation)
and Question bank (filters, editor with answer key and explanation, validation,
AI review queue, duplicate detection, archive and delete safeguards, page size).
AI and Analytics show chart previews. Academic, Settings and Audit list their
planned scope. All sample data lives in `src/data/fixtures.ts`.

## Milestone 2: Inspect and connect the live platform

- Get access to the student platform's repository or backend console. Identify
  the framework, the auth provider (Supabase, Firebase, Netlify Identity or
  other), the database, and the tables for profiles, questions, quiz attempts
  and AI calls.
- Document the existing schema and every place that reads or writes it.
- Choose the integration path:
  - **Preferred:** move these screens into the platform's own repo as a
    `/admin` route, so it shares its auth, components and deploy.
  - **Otherwise:** keep this app and add a server-side data adapter
    (`src/server/platform.ts`) that talks to the platform's backend with a
    least-privilege credential stored in Netlify environment variables.
- Swap the Overview fixtures for live read-only counts.

## Milestone 3: Admin authentication, authorisation and audit log

- Admin sign-in through the platform's existing auth provider. No new accounts.
- A server-verified `admin` (and optional `moderator`) role, stored where the
  provider supports it (app metadata, custom claims or a roles table), and never
  writable by users themselves.
- A `requireAdmin()` guard in every server function, plus a route guard on
  `/admin`. Students get 403 from the API and a redirect in the UI.
- An append-only `admin_audit_log` table written only by server functions.
- Tests: student hits `/admin` → denied; forged or modified request → 403;
  edited local storage → no access.

## Milestone 4: Live user management and question bank

- Paginated, searchable users list from real profiles. Only safe fields
  (no passwords, tokens or provider secrets).
- Suspend and reactivate through the auth provider's admin API, with an audit
  entry for each.
- Question CRUD against the existing questions table. IDs and relationships are
  preserved. Archive is a soft delete via a backwards-compatible `status`
  column, and hard delete needs a typed confirmation.
- AI review queue backed by a `pending_review` status. Server-side validation:
  4 distinct options, exactly one answer, an explanation, and a duplicate check
  using text similarity (later, embeddings).
- No cap on question-bank size. Lists paginate on the server.

## Milestone 5: AI management

- Log every AI call in the platform's existing AI service: feature, model,
  input/output tokens, latency, status and error. Reuse the service; don't
  duplicate it.
- Estimated cost = tokens × the provider's published price, shown as an
  estimate.
- Configurable daily per-user and platform-wide generation limits, enforced on
  the server, with budget alerts at 50/80/100%.
- Feature switches for AI generation and the AI tutor.
- A cache of generated question sets by (topic, difficulty, prompt hash) to
  avoid paying twice for the same request.
- Generation is bounded by limits and budget. It is not unlimited.

## Milestone 6: Analytics

Participation, completion, average score by topic, most-missed questions,
popular topics, activity trends and AI usage trends, with date and subject
filters. All computed from quiz attempts, with a table view per chart.

## Milestone 7: Academic management

Lookup tables for universities, faculties, departments, programmes and levels,
plus a safe migration to map existing free-text onboarding values. Aggregate
class and university summaries with a minimum group size for privacy.

## Milestone 8: Website settings and announcements

A shared settings store the student site reads: branding, announcements,
feature flags, quiz-length options students can choose (10/20/50/custom), AI
limits, and registration and leaderboard switches. Confirmation and an audit
entry for every change.

## Milestone 9: Hardening and regression testing

Re-test student registration, login, onboarding, question banks, MCQ quizzes,
explanations, AI tutor and existing routes on the platform. Add rate limiting
on admin endpoints, error monitoring, and a mobile layout review.
