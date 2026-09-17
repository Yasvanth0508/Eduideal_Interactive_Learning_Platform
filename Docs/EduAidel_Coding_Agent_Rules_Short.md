# EduAidel — Coding Agent Rules

## 1. Goal
Keep the codebase **clean, modular, type-safe, secure, performant, and simple**.

## 2. Stack
- Next.js + TypeScript + React
- Supabase PostgreSQL + Auth + Storage
- Drizzle ORM
- Tailwind + shadcn/ui
- TanStack Query + Zustand
- Three.js + React Three Fiber
- ECharts
- KaTeX
- Zod
- Vitest + Playwright

Do not add new libraries unless clearly necessary.

## 3. Structure
```text
src/
├── app/          # routes/pages
├── components/   # reusable UI
├── features/     # domain logic
├── lib/          # shared infrastructure
├── hooks/        # reusable hooks
├── types/        # shared types
└── constants/

supabase/
├── migrations/
└── seed/

tests/
├── unit/
├── integration/
└── e2e/
```

Keep business logic out of page/UI components.

## 4. TypeScript
- Use `strict: true`
- Avoid `any`
- Use proper types and Zod validation
- Validate both client and server input

## 5. Database & Security
- Use Supabase + Drizzle
- Use Auth + PostgreSQL RLS
- Never trust client-provided IDs, roles, or permissions
- Never expose service-role keys or secrets
- Store large media in Supabase Storage, not PostgreSQL

## 6. Content Architecture
Use reusable content blocks:

```text
Subject → Chapter → Topic → ContentBlock[]
```

Supported blocks:
`THEORY | IMAGE | GRAPH | FORMULA | THREE_D | VIDEO | QUESTIONS`

Do not create separate hard-coded pages for every lesson.

## 7. Performance
- Server Components by default
- Client Components only when interaction is required
- Lazy-load 3D/graphs/video
- Do not update React state every animation frame
- Keep simulations bounded
- Optimize GLB assets
- Do not use Web Workers or WebGPU initially

## 8. Naming
- Files: `kebab-case`
- Components/types: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- DB tables/columns: `snake_case`
- Booleans: `isX`, `hasX`, `canX`

## 9. Bug Fixing
```text
Reproduce
→ Find root cause
→ Inspect related code
→ Make smallest correct fix
→ Test
→ Check regressions
→ Remove debug code
```

Do not change unrelated functionality or architecture.

## 10. Components & Abstraction
- One clear responsibility per component
- Reuse existing code before creating new code
- Avoid premature abstraction
- Keep business logic in feature/service layers

## 11. Errors
Every data-driven UI should handle:
`Loading | Success | Empty | Error`

Never silently swallow errors.

## 12. Testing
Use:
- **Vitest:** logic, formulas, validation, services
- **Playwright:** login, access control, lessons, admin workflows

Bug fixes should include a regression test when practical.

## 13. Git
Use focused commits:

```text
feat: add formula block
fix: prevent unauthorized access
refactor: extract lesson renderer
perf: lazy load 3d viewer
```

Never commit secrets, `.env`, credentials, or generated files.

## 14. Definition of Done
- TypeScript passes
- Lint passes
- Relevant tests pass
- No debug/dead code
- No unnecessary dependencies
- No security regression
- No unrelated changes
