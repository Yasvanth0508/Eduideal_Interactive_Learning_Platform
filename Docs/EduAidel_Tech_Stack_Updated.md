# EduAidel — Technology Stack (v2)

Product: Learnova by EDUiDEAL Academy. Launch scope: CBSE Class 12 (Physics, Chemistry, Mathematics) across three branches (Perambur, Kodungaiyur, Agaram).

## Core Architecture

| Purpose | Technology |
|---|---|
| Full-stack framework | Next.js 16 (App Router, source in `src/`) |
| Language | TypeScript 5 |
| Frontend | React 19 |
| Backend/API | Next.js Server Actions + Route Handlers |
| Request interception | `src/proxy.ts` (Next.js 16 replacement for `middleware.ts`) |
| Deployment | Vercel |

## Database / Backend Services

| Purpose | Technology |
|---|---|
| Relational database | Supabase PostgreSQL |
| ORM / type-safe DB access | Drizzle ORM (schema: `src/lib/db/schema.ts`) |
| Database driver | `postgres` (postgres-js) |
| Authentication | Supabase Auth (email + password) via `@supabase/ssr` cookie sessions |
| Authorization | PostgreSQL Row Level Security (RLS) + server-side branch and role checks |
| Object/file storage | Supabase Storage (private bucket, signed URLs) |
| Realtime | Supabase Realtime — only when required |

## Frontend UI

| Purpose | Technology |
|---|---|
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`, theme tokens in `src/app/globals.css`) |
| Class composition | `clsx`, `tailwind-merge`, `class-variance-authority` (`cn()` in `src/lib/utils.ts`) |
| Icons | `lucide-react` |
| UI animation | Motion |
| Server data fetching / caching | TanStack Query (provider configured, not used yet) |
| Client-side state | Zustand (installed, not used yet) |
| Validation | Zod |
| UI component library | None at present. shadcn/ui is not installed; add it only if the team decides to |

## Interactive Learning / Visualization

| Purpose | Technology |
|---|---|
| 3D rendering | Three.js (vanilla) through the reusable `ThreeDCanvas` wrapper |
| React integration for 3D | Custom wrapper (`three-d-canvas.tsx`). React Three Fiber is not used |
| 3D rendering backend | WebGL via Three.js |
| Interactive scientific graphs | Apache ECharts (`echarts`, `echarts-for-react`) |
| Highly custom visualizations | D3.js — only when ECharts is insufficient (not installed) |
| Mathematical equation rendering | KaTeX |
| 3D model format | GLB / glTF (current scenes are built procedurally in code) |
| 3D asset optimization | Draco / Meshopt — when GLB models are introduced |

## Educational Content

| Purpose | Technology |
|---|---|
| Theory content | Structured JSON in `content_blocks.content` |
| Equations | KaTeX |
| Dynamic formulas / calculators | TypeScript formula engine |
| Interactive graphs | ECharts |
| 3D simulations | Three.js via `ThreeDCanvas` |
| 3D assets | GLB / glTF |
| Images | Supabase Storage |
| Videos | Supabase Storage initially |
| Adaptive video streaming | HLS later if required |
| Questions | PostgreSQL |

## Content Architecture

Use a reusable content-block architecture.

```text
Board
  ↓
Class
  ↓
Subject
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock[]
```

Content is global: every branch sees the same content. Branches only decide which students an admin can manage.

Supported content block types:

```text
THEORY
IMAGE
GRAPH
FORMULA
THREE_D
VIDEO
QUESTIONS
```

Frontend renderer architecture:

```text
ContentBlock
 ├── TheoryRenderer
 ├── ImageRenderer
 ├── GraphRenderer
 ├── FormulaRenderer
 ├── ThreeDRenderer
 ├── VideoRenderer
 └── QuestionRenderer
```

Do not create a separate hard-coded React page for every lesson.

### Content source of truth

- Lesson content is loaded from the database.
- Static content files (`src/features/subjects/data.ts`, `src/features/content/data/*`) are used only by the seed script (`supabase/seed/seed.ts`). The application must not silently fall back to them once the database is populated, because a fallback hides missing or broken data.

## Organisation and Access Model

```text
Branch (Perambur / Kodungaiyur / Agaram)
  ↓
Users
  ├── ADMIN   (scoped to one branch)
  └── STUDENT (belongs to one branch and one class)
```

Subject access:

```text
Student
  ↓
student_subjects (active row)
  ↓
Subject
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock
```

Subject access must be enforced by backend authorization and PostgreSQL RLS.

## Database Model

Organisation:

```text
branches
boards
classes
```

Core tables:

```text
users
subjects
chapters
topics
```

Content tables:

```text
content_blocks
formula_configs
formula_variables
graph_configs
questions
question_options
```

Media tables:

```text
media_assets
video_assets
three_d_assets
```

Student tables:

```text
student_subjects
student_progress
student_notes
```

See `EduAidel_DB_Design.md` for full column definitions, constraints and policies.

## Authentication Architecture

- Supabase Auth with email + password. Public sign-up is disabled.
- Admins sign in with email. Students sign in with register number.
- Supabase Auth only understands email, so a server action looks up the student's email from `users.register_number` and then calls `signInWithPassword`. The student never needs to see the email.
- Sessions are stored in cookies using `@supabase/ssr`. `src/proxy.ts` refreshes the session on every request and redirects logged-out users away from protected routes.
- Always use `supabase.auth.getUser()` on the server to identify the user. Never trust `getSession()` for authorization.
- Login, logout and other mutations are Server Actions. Admin operations (creating students, granting and revoking subjects) are Server Actions or Route Handlers.
- Account creation:
  - Admin accounts are created in the Supabase dashboard and linked by inserting a `users` row.
  - Student accounts are created only by a branch admin through a server-only route using the service-role (secret) key. The route forces `branch_id` to the admin's own branch and removes the auth user again if the `users` insert fails.
- A user can use the app only if `users.is_active = true` and their branch is active.
- Passwords are never stored in application tables, never hardcoded, and never logged.

## Authorization Architecture

Three layers must all agree:

```text
1. Proxy          → logged-out users cannot reach protected routes
2. Server code    → role check, branch check, subject-access check on every page, action and route
3. PostgreSQL RLS → the database refuses data the user may not see, even if a bug exists above
```

Important rules:

- Server code using Drizzle connects as the `postgres` role and **bypasses RLS**. Every server query that touches student data must filter by the caller's branch and role itself.
- RLS protects requests made through the Supabase client with the publishable (anon) key.
- Branch admin: can only read and manage students of their own branch, and can never change a student's `branch_id` or `role`.
- Student: only published content of subjects with an active `student_subjects` row.
- Anonymous demo: only published chapters with `is_demo = true`.
- A `SUPER_ADMIN` role (all branches) is not built yet. It can be added later as a new enum value.

## 3D Simulation Architecture

Current architecture:

```text
React (UI, controls, configuration)
  ↓
ThreeDCanvas wrapper (scene lifecycle, camera controls, cleanup)
  ↓
Three.js
  ↓
WebGL
  ↓
GPU
  ↓
Screen
```

Each 3D scene is a model component under `src/features/content/components/three-d/models/` that provides an `initScene` function to `ThreeDCanvas`.

React Three Fiber is not used. It may be adopted later only if the team decides the declarative approach is worth migrating the existing scenes.

Simulation controls:

```text
Start
Pause
Reset
Speed
Parameters
```

React handles UI controls and configuration.

Three.js handles:

```text
3D objects
positions
rotations
animations
particles
rendering
```

Simulation constraints:

- Keep simulations within controlled limits.
- Limit particle/object counts where necessary.
- Limit simulation duration where necessary.
- Avoid unnecessarily complex physics calculations.
- Optimize 3D models before production use.
- Profile real browser performance before introducing advanced optimization.

### Explicitly excluded for the initial version

```text
Web Workers — NOT used initially
WebGPU — NOT used initially
```

If future simulations become too computationally expensive, these can be introduced later based on measured performance requirements.

## Formula Architecture

```text
Formula
  ↓
Formula Definition (formula_configs)
  ↓
Input Variables (formula_variables)
  ↓
TypeScript Calculation Engine
  ↓
Result
```

Do not hard-code formula calculations inside random React components.

## Graph Architecture

Use ECharts for standard interactive graphs.

Examples:

```text
x/y parameter changes
real-time graph updates
zoom
tooltips
multiple curves
parameter sliders
```

Use D3.js only when ECharts cannot provide the required custom visualization.

## Video Architecture

Initial:

```text
Video
  ↓
Supabase Storage (private bucket, signed URLs)
  ↓
CDN
  ↓
Student
```

Do not proxy large video files through Next.js API routes.

Later, if the video library or traffic requires it:

```text
Video
  ↓
Encoding
  ↓
HLS
  ↓
CDN
  ↓
Student
```

## Project Structure Conventions

```text
src/
├── app/                  Routes, layouts, server actions tied to a route
├── features/
│   ├── auth/             Login/logout actions, schemas, auth components
│   ├── content/          Content block renderers, interactive widgets, 3D, queries
│   └── subjects/         Subject, chapter and topic views and queries
├── lib/
│   ├── auth/             Server-only session helpers (getCurrentUser, requireRole)
│   ├── db/               Drizzle client and schema
│   └── supabase/         Browser, server, admin and proxy helpers
├── proxy.ts              Session refresh and route protection
└── types/

supabase/
├── migrations/           Drizzle-generated SQL plus custom SQL (RLS, functions)
└── seed/                 Seed scripts
```

Rules:

- `src/lib/supabase/admin.ts` (service-role/secret key) is imported only from server-only code, never from client components and never from files that start with `"use client"`.
- Server Components by default. Client Components only for interactive UI.

## Database Migrations

- Schema is defined in `src/lib/db/schema.ts`.
- Workflow: `npx drizzle-kit generate`, read the generated SQL, then `npx drizzle-kit migrate`.
- RLS policies, helper functions (`current_branch()`, `is_admin()`, `can_access_topic()`) and the foreign key from `users.id` to `auth.users(id)` are written as custom SQL migrations (`npx drizzle-kit generate --custom --name=<name>`).
- Migrations use the direct connection or the Supabase session pooler. Do not run migrations through the transaction pooler (port 6543). At runtime the transaction pooler can be used (`prepare: false` is already set).
- Never edit or delete the migrations folder on a database that already has data.

## Environment Variables

Stored in `.env.local` (never committed). `.env.example` lists names only.

| Variable | Exposed to browser | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Secret (service-role) key, server-only |
| `DATABASE_URL` | **No** | Postgres connection string for Drizzle |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |

Production values are set in Vercel Environment Variables.

## Performance Strategy

- Use Next.js Server Components by default.
- Use Client Components only for interactive UI.
- Lazy-load 3D, graph, and video components.
- Keep simulation calculations lightweight and bounded.
- Limit particle/object counts for browser simulations.
- Avoid React state updates on every animation frame.
- Keep animation/render loops inside Three.js.
- Optimize GLB assets with Draco/Meshopt.
- Serve large media directly from Supabase Storage/CDN.
- Cache frequently accessed server data where useful.
- Avoid unnecessary React re-renders.
- Profile performance before adding architectural complexity.

## Security

| Requirement | Technology / Rule |
|---|---|
| Authentication | Supabase Auth, public sign-up disabled |
| Authorization | Proxy + server-side checks + PostgreSQL RLS |
| API validation | Zod on every Server Action and Route Handler input |
| Secrets | `.env.local` locally, Vercel Environment Variables in production |
| Roles | ADMIN (branch-scoped) / STUDENT |
| Error messages | Generic messages for login failures; never return raw database or Supabase errors to the browser |
| Credentials in source | None. No hardcoded passwords, keys or test logins in code |
| Service-role key | Server-only, used only for admin operations such as creating student auth users |

Never rely only on frontend visibility for access control.

## Testing

| Purpose | Technology | Status |
|---|---|---|
| Unit testing | Vitest | Planned, not installed |
| Integration testing | Vitest | Planned, not installed |
| End-to-end testing | Playwright | Planned, not installed |

Priority tests once installed: login (student and admin), branch isolation between admins, subject grant and revoke, and RLS checks using real logins with the publishable key.

## Monitoring

| Purpose | Technology | Status |
|---|---|---|
| Error monitoring | Sentry | Planned, not installed |
| Database/platform monitoring | Supabase Monitoring | Available |
| Deployment/runtime logs | Vercel Logs | Available |

## Development Principles

- Prefer simple architecture over premature optimization.
- Use Next.js as the primary application layer.
- Use Supabase for PostgreSQL, authentication, and storage.
- Use reusable content blocks instead of hard-coded lesson pages.
- Use Three.js (through `ThreeDCanvas`) for 3D.
- Use ECharts for standard interactive graphs.
- Content is global; branches only scope user management.
- Check access on the server and in RLS. Do not rely on the UI.
- Keep browser simulations bounded by practical constraints.
- Add advanced performance technologies only after profiling demonstrates a real need.

## Initial Stack Summary

```text
Next.js 16
TypeScript
React 19
Tailwind CSS v4
Motion
TanStack Query (configured)
Zustand (installed, not used yet)
Zod

Supabase
├── PostgreSQL
├── Auth (@supabase/ssr)
├── Storage
└── Realtime (when required)

Drizzle ORM

Three.js (ThreeDCanvas wrapper)
WebGL
ECharts
D3.js (when required)
KaTeX

GLB / glTF
Draco / Meshopt

Vercel

Planned: Vitest, Playwright, Sentry
```

## Explicitly Not in Initial Stack

```text
Spring Boot
Express
Fastify
Separate Node.js backend
Microservices
Web Workers
WebGPU
Kafka
Kubernetes
Elasticsearch
Separate authentication service
Separate file server
Multiple databases
React Three Fiber (not used at present)
shadcn/ui (not used at present)
```

## Changes from v1

| Area | Change |
|---|---|
| Versions | Added Next.js 16, React 19, Tailwind v4, `proxy.ts` |
| 3D | React Three Fiber removed; documented the `ThreeDCanvas` wrapper that the code uses |
| UI components | shadcn/ui removed from the stack (not installed) |
| Status labels | Zustand, TanStack Query marked "not used yet"; Vitest, Playwright, Sentry marked "planned" |
| Content architecture | Hierarchy now starts with Board and Class; content source of truth is the database |
| Database model | Added `branches`, `boards`, `classes`, `student_notes`; corrected formula table names |
| Authentication | New section: register-number login for students, email for admins, cookie sessions, no public sign-up |
| Authorization | New section: three layers, branch-scoped admins, server code bypasses RLS |
| Security | Added no-hardcoded-credentials rule, generic login errors, service-role key rules |
| New sections | Project structure, database migrations, environment variables |