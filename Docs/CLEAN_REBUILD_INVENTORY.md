# EduAidel — Clean Rebuild Inventory & Codebase Audit

**Date of Audit:** October 27, 2026  
**Auditor:** Antigravity AI Pair Programmer  
**Target Repository:** `Eduideal` (`eduaidel`)  
**Scope:** Forensic analysis of all architecture documents, specifications, source code, database schemas, migrations, seed data, renderers, routes, and testing assets prior to clean refactoring.

---

## 1. Executive Summary

This audit assesses the state of the **EduAidel** repository before executing any refactoring or rebuilding. The application is a digitalized learning platform designed for CBSE Class 12 students (currently featuring the **Chemistry Chapter 1: Solutions** curriculum), with institutional branding for **EDUiDEAL Academy** (branded in parts of the UI as **Learnova**).

### Key Architectural Discovery: The Architecture Divergence
The repository contains a fundamental architectural divergence between two distinct development phases:
1. **Phase 1 (Legacy Implementation — Current Codebase & Migrations):**
   Built according to `EduAidel_Tech_Stack_Updated.md` and `EduAidel_DB_Design.md`. In this phase, educational content was treated as dynamic database records. 13 tables were created in Supabase PostgreSQL (via Drizzle ORM) to hold subjects, chapters, topics, content blocks, formulas, formula variables, graph configs, media assets, 3D assets, questions, question options, and student progress. All 20 topics of the Solutions chapter were seeded directly into these database tables.
2. **Phase 2 (Target Architecture — Approved Rules & Specs):**
   Formulated in `EduAidel_Requirements.md`, `EduAidel_System_Architecture (1).md`, `EduAidel_Database_Schema.md`, and `EduAidel_AI_Agent_Codebase_Rules.md` (dated Oct 26, 2026). This architecture establishes a strict **Separation of Concerns**:
   - **Static Educational Content:** Version-controlled in the codebase under `src/content/class-12/<subject>/<chapter>/topics/<topic>/` with stable IDs (e.g. `chem-c01-t01`), resolved in-memory via `ContentRegistry`.
   - **Dynamic PostgreSQL Data:** Confined strictly to 5 tables: `users`, `subjects`, `student_subjects`, `topic_notes`, and `topic_bookmarks`.
   - **Explicitly Excluded:** Database-driven content blocks, chapter/topic database tables, learning progress tracking (`student_progress`), teacher editing, topic search, and notes autosave.

This inventory provides the definitive blueprint for migrating from the Phase 1 implementation to the Phase 2 target architecture safely, without data loss or unintended side effects on the live Supabase instance.

---

## 2. Architecture & Design Documents Matrix

| Document | Location | Status | Core Tenets & Architectural Directives |
|---|---|---|---|
| **AGENTS.md** | `/AGENTS.md` | Active | Warns about modern Next.js conventions; requires reading docs in `node_modules/next/dist/docs/`. |
| **Codebase Rules** | `Docs/EduAidel_AI_Agent_Codebase_Rules.md` | Active (Oct 26, 2026) | Static content in `src/content/...`; stable IDs; lazy-load renderers (Three.js, ECharts); strict server-side auth/RLS; explicit notes save; no learning progress tracking. |
| **Database Schema** | `Docs/EduAidel_Database_Schema.md` | Active (Oct 26, 2026) | PostgreSQL stores dynamic data only (`users`, `subjects`, `student_subjects`, `topic_notes`, `topic_bookmarks`). `topic_id` is a stable string ID, not a foreign key. |
| **Requirements** | `Docs/EduAidel_Requirements.md` | Active (Oct 26, 2026) | FR-01 to FR-09: Public preview (1 complete chapter per subject); Admin-created student credentials; server-side subject authorization; notes & bookmarks persistence. NFR-01 to NFR-09: Performance, security, reliability. |
| **System Architecture** | `Docs/EduAidel_System_Architecture (1).md` | Active (Oct 26, 2026) | Layered architecture: Services (`AuthService`, `ContentService`, `NotesService`, etc.), Repositories (`UserRepository`, `NotesRepository`, etc.), `ContentRegistry`, Renderers. |
| **Tech Stack** | `Docs/EduAidel_Tech_Stack_Updated.md` | Transitional (Sep 17, 2026) | Next.js 16, React 19, Tailwind v4, Drizzle ORM, Supabase Auth/PostgreSQL, Three.js, ECharts, KaTeX. (Contains older DB-driven content model). |
| **Legacy DB Design** | *Staged for deletion in Git* (`Docs/EduAidel_DB_Design.md`) | Deprecated | 13-table schema including `content_blocks`, `questions`, `student_progress`, `three_d_assets`, `formula_configs`. Currently reflected in `schema.ts`. |
| **Legacy Agent Rules** | *Staged for deletion in Git* (`Docs/EduAidel_Coding_Agent_Rules_Short.md`) | Deprecated | Predecessor to `EduAidel_AI_Agent_Codebase_Rules.md`. |

---

## 3. Complete Source Tree Inventory

### 3.1 Root Configuration & Infrastructure Files

| File Path | Lines | Size | Purpose & Role | Rebuild Classification |
|---|---|---|---|---|
| `package.json` | 50 | 1,290 B | Project dependencies and npm scripts (`dev`, `build`, `lint`, `db:generate`, `db:migrate`, `db:push`, `db:studio`). | **Reusable Infrastructure** (Needs Vitest/Playwright dependencies added) |
| `package-lock.json` | 6,346 | 301,731 B | Locked dependency graph. | **Reusable Infrastructure** |
| `tsconfig.json` | 31 | 670 B | TypeScript configuration (`strict: true`, path alias `@/* -> ./src/*`). | **Reusable Infrastructure** |
| `drizzle.config.ts` | 14 | 357 B | Drizzle Kit configuration pointing to `./src/lib/db/schema.ts` and `./supabase/migrations`. | **Reusable Infrastructure** (Points to DB schema) |
| `next.config.ts` | 7 | 133 B | Next.js configuration (empty configuration object). | **Reusable Infrastructure** |
| `eslint.config.mjs` | 15 | 465 B | ESLint flat configuration extending `next/core-web-vitals` and `next/typescript`. | **Reusable Infrastructure** |
| `postcss.config.mjs` | 6 | 94 B | PostCSS configuration for `@tailwindcss/postcss`. | **Reusable Infrastructure** |
| `.env.example` | 19 | 851 B | Environment variable template (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`). | **Reusable Infrastructure** |
| `.env.local` | ~20 | 978 B | Local secrets (not committed to VCS; contains live Supabase credentials and DB URL). | **Sensitive Configuration** (Do not alter) |
| `.gitignore` | 37 | 456 B | Standard Next.js/Node gitignore. | **Reusable Infrastructure** |
| `AGENTS.md` | 9 | 678 B | Next.js agent rule definitions. | **Documentation / Rules** |
| `CLAUDE.md` | 1 | 11 B | Redirect file pointing to `@AGENTS.md`. | **Documentation / Rules** |
| `README.md` | 36 | 1,450 B | Boilerplate Create Next App documentation. | **Documentation** |

---

### 3.2 Application Routes & Layouts (`src/app/`)

| File Path | Lines | Size | Purpose & Implementation Details | Rebuild Classification |
|---|---|---|---|---|
| `src/app/layout.tsx` | 44 | 1,202 B | Root Layout. Configures fonts (`Inter`, `JetBrains Mono`), imports `globals.css` and `katex.min.css`, wraps children in `Providers`. | **Reusable Infrastructure / UI** |
| `src/app/providers.tsx` | 29 | 601 B | Client Component wrapper for `@tanstack/react-query` `QueryClientProvider`. | **Reusable Infrastructure** |
| `src/app/globals.css` | 55 | 1,572 B | Tailwind CSS v4 styling rules, brand CSS variables (`--brand: #C0222E`, `--brand-hover: #A01B25`, `--brand-tint: rgba(192, 34, 46, 0.08)`). | **Reusable Infrastructure / UI** |
| `src/app/favicon.ico` | - | 25,931 B | Site favicon. | **Reusable Infrastructure / Asset** |
| `src/app/page.tsx` | 702 | 27,449 B | Public landing page ("Learnova — The Digitalized Learning World"). Contains hero, subject cards (Chemistry active, Physics/Math locked), academy branch addresses (Perambur, Kodungaiyur, Agaram Jn). | **Reusable UI Shell** (Needs restructuring to route to public preview `/preview/...`) |
| `src/app/login/page.tsx` | 164 | 6,882 B | Login page. **Critical finding:** Contains purely client-side mock authentication with hardcoded credentials (`212224040265` / `htna2006`). Does NOT integrate with Supabase Auth. | **Candidate for Replacement** (Must rebuild to use Supabase Auth and server-side session handling) |
| `src/app/chemistry/page.tsx` | 605 | 23,984 B | Chemistry Subject overview listing 10 CBSE Class 12 chapters (Solutions active, 9 locked). Client component with hardcoded cards and status pills. | **Lesson-Specific / Subject Hub** (Needs replacement with generic subject/chapter navigation driven by `ContentRegistry`) |
| `src/app/chemistry/solutions/page.tsx` | 262 | 11,666 B | Solutions Chapter topic index page. Fetches published topics via `getChapterWithTopics("chemistry", "solutions")`. | **Lesson-Specific Route** (Should transition to `/learn/[topicId]` or `/preview/[topicId]`) |
| `src/app/chemistry/solutions/[topicSlug]/page.tsx` | 327 | 14,287 B | Dynamic Topic Detail Page. Fetches topic by slug, queries content blocks via `getTopicContentBlocks(topic.id)`, and renders blocks using `ContentBlockRenderer`. | **Lesson-Specific Route** (Should transition to generic `/learn/[topicId]` and `/preview/[topicId]`) |

---

### 3.3 Core Shared Infrastructure (`src/lib/`)

| File Path | Lines | Size | Purpose & Implementation Details | Rebuild Classification |
|---|---|---|---|---|
| `src/proxy.ts` | 19 | 595 B | Next.js Edge Middleware. Executes `updateSession(request)` on non-static routes. | **Reusable Infrastructure / Auth** |
| `src/lib/utils.ts` | 6 | 177 B | Standard `cn()` class merge utility wrapping `clsx` and `twMerge`. | **Reusable Infrastructure** |
| `src/lib/db/index.ts` | 34 | 936 B | Drizzle ORM client setup using `postgres.js`. Configures `prepare: false` for Supabase transaction pooler (port 6543) and implements global HMR singleton. | **Reusable Infrastructure / DB** |
| `src/lib/db/schema.ts` | 430 | 14,636 B | Drizzle schema definition. Contains 5 enums (`userRoleEnum`, `contentBlockTypeEnum`, etc.) and 13 tables. | **Transitional DB Schema** (Must be refined to the 5 target dynamic tables) |
| `src/lib/supabase/client.ts` | 17 | 528 B | Browser client for Client Components via `@supabase/ssr` `createBrowserClient`. | **Reusable Infrastructure / Auth** |
| `src/lib/supabase/server.ts` | 36 | 1,078 B | Server client for Server Components, Route Handlers, and Actions via `@supabase/ssr` `createServerClient`. | **Reusable Infrastructure / Auth** |
| `src/lib/supabase/middleware.ts` | 39 | 1,050 B | Edge session management via `@supabase/ssr`. Refreshes auth tokens via `supabase.auth.getUser()`. | **Reusable Infrastructure / Auth** |
| `src/lib/supabase/admin.ts` | 23 | 730 B | Server-only admin client via `@supabase/supabase-js` using `SUPABASE_SERVICE_ROLE_KEY`. | **Reusable Infrastructure / Auth** |
| `src/types/index.ts` | 88 | 3,058 B | TypeScript types inferred from Drizzle schema (`User`, `Subject`, `Chapter`, `Topic`, `ContentBlock`, etc.). | **Transitional Types** |

---

### 3.4 Shared Lesson Renderers (`src/features/content/components/`)

| File Path | Lines | Size | Purpose & Implementation Details | Rebuild Classification |
|---|---|---|---|---|
| `content-block-renderer.tsx` | 31 | 1,078 B | Master content block dispatcher. Switches between `THEORY`, `QUESTIONS`, `FORMULA`, and `GRAPH`. | **Shared Lesson Rendering** (Reusable, but missing `IMAGE`, `VIDEO`, `THREE_D` cases) |
| `theory-block-renderer.tsx` | 283 | 11,870 B | Renders theory introductions, sections, headings, paragraphs, bullet points, key terms, callouts. **Critical finding:** Contains static switch statement importing all 22 interactive widgets and 5 3D models. | **Shared Lesson Rendering** (Core text/callout renderer is reusable; widget dispatching must be decoupled/lazy-loaded) |
| `formula-block-renderer.tsx` | 255 | 9,555 B | Interactive formula calculator. Supports dynamic variables, inputs, sliders, live calculation, and step-by-step substitution display. | **Shared Lesson Rendering** (High-value reusable component) |
| `graph-block-renderer.tsx` | 181 | 6,261 B | Dynamic scientific graph renderer using Apache ECharts (`echarts-for-react`) loaded dynamically (`ssr: false`). Supports reactive parameter sliders. | **Shared Lesson Rendering** (High-value reusable component) |
| `questions-block-renderer.tsx` | 252 | 10,494 B | Self-assessment practice component. Supports MCQs, options selection, instant feedback, explanation toggle, score pills, and reset. | **Shared Lesson Rendering** (High-value reusable component) |
| `three-d/three-d-canvas.tsx` | 231 | 7,518 B | Shared WebGL Three.js canvas container. Configures scene, perspective camera, renderer with shadows, OrbitControls, animation loop, play/pause, auto-rotation, camera reset. | **Shared Lesson Rendering** (High-value reusable infrastructure for 3D) |
| `three-d/index.ts` | 8 | 477 B | Barrel export for `ThreeDCanvas` and model components. | **Shared Lesson Rendering** |

---

### 3.5 Lesson-Specific Interactive Widgets (`src/features/content/components/interactive/`)

All 22 components in this directory are **100% specific to Chemistry Chapter 1 (Solutions)**:

| Widget File Path | Lines | Size | Educational Concept / Purpose |
|---|---|---|---|
| `particle-solution-simulator.tsx` | 321 | 13,782 B | HTML5 canvas particle simulation of solute dissolving in solvent (< 1 nm particles, no Tyndall effect). |
| `solute-solvent-explorer.tsx` | 234 | 9,523 B | Interactive card explorer for determining solute vs. solvent based on physical state and relative quantity. |
| `types-of-solutions-matrix.tsx` | 298 | 14,754 B | 9 physical types of solutions (Solid/Liquid/Gas solute × Solid/Liquid/Gas solvent) with examples. |
| `solution-colloid-suspension-comparison.tsx` | 187 | 8,065 B | Comparative matrix and visual filter for True Solution vs. Colloid vs. Suspension. |
| `group-a/concentration-calculator.tsx` | 370 | 15,487 B | Multi-unit concentration calculator: Molarity ($M$), Molality ($m$), Mole Fraction ($x$), Mass %, ppm. |
| `group-a/henrys-law-graph.tsx` | 129 | 4,795 B | Interactive Henry's Law graph ($p = K_H \cdot x$) with gas selector ($O_2, N_2, CO_2, He$). |
| `group-a/vapour-pressure-sim.tsx` | 224 | 9,185 B | Dynamic equilibrium simulation: evaporation rate vs. condensation rate under changing temperature. |
| `group-b/azeotrope-phase-diagram.tsx` | 134 | 5,034 B | Boiling point vs. composition phase diagram for minimum and maximum boiling azeotropes. |
| `group-b/deviation-curves-graph.tsx` | 131 | 4,954 B | Raoult's law vapor pressure curves showing positive ($\Delta H > 0, \Delta V > 0$) and negative ($\Delta H < 0, \Delta V < 0$) deviations. |
| `group-b/ideal-vs-non-ideal-comparator.tsx` | 165 | 6,714 B | Thermodynamic criteria comparator ($A-B$ vs. $A-A$ and $B-B$ interactions). |
| `group-b/raoults-law-graph.tsx` | 125 | 4,593 B | Raoult's Law linear graph ($p_A = p_A^0 x_A$, $p_B = p_B^0 x_B$, $P_{total} = p_A + p_B$). |
| `group-c/boiling-elevation-calculator.tsx` | 164 | 7,248 B | Elevation of boiling point calculator: $\Delta T_b = K_b \cdot m$, molar mass determination of non-volatile solute. |
| `group-c/colligative-properties-hub.tsx` | 162 | 7,149 B | Summary selector and visual explorer for the 4 colligative properties. |
| `group-c/freezing-depression-calculator.tsx` | 164 | 7,244 B | Depression of freezing point calculator: $\Delta T_f = K_f \cdot m$, cryoscopic constant calculations. |
| `group-c/rlvp-calculator.tsx` | 162 | 6,684 B | Relative Lowering of Vapour Pressure calculator: $(p_1^0 - p_1)/p_1^0 = x_2$. |
| `group-d/osmosis-simulation.tsx` | 212 | 8,364 B | U-tube dynamic osmosis simulation with semipermeable membrane and hydrostatic pressure head. |
| `group-d/osmotic-pressure-calculator.tsx` | 185 | 8,074 B | Osmotic pressure calculator: $\Pi = C R T = (w_2 R T)/(M_2 V)$ for polymers and biomolecules. |
| `group-d/reverse-osmosis-simulator.tsx` | 289 | 12,437 B | Reverse osmosis desalination simulation showing solvent flow reversal when $P_{applied} > \Pi$. |
| `group-e/association-dissociation-visualizer.tsx` | 291 | 11,818 B | Particle visualizer comparing theoretical vs. observed particle counts in electrolyte solutions. |
| `group-e/colligative-applications-showcase.tsx` | 204 | 9,503 B | Real-world applications: saline injections, ethylene glycol antifreeze, salting icy roads, reverse osmosis desalinators. |
| `group-e/numerical-practice-workbench.tsx` | 268 | 13,349 B | Step-by-step problem solver for 4 standard CBSE board numerical problems. |
| `group-e/vant-hoff-calculator.tsx` | 239 | 10,553 B | Van 't Hoff factor ($i$) calculator: degree of dissociation ($\alpha = (i-1)/(n-1)$) and association ($\alpha = (1-i)/(1 - 1/n)$). |

---

### 3.6 Lesson-Specific 3D Models (`src/features/content/components/three-d/models/`)

Procedural Three.js 3D models created specifically for Solutions topics 1–5:

| Model File Path | Lines | Size | Model Subject & Technical Details |
|---|---|---|---|
| `hydration-shell-3d.tsx` | 179 | 7,275 B | Topic 1: Hydration shell around $Na^+$ and $Cl^-$ ions with rotating water dipoles ($H_2O$). |
| `brass-lattice-3d.tsx` | 178 | 7,275 B | Topic 2: FCC substitutional alloy crystal lattice of Brass ($70\%$ Copper, $30\%$ Zinc atoms). |
| `volumetric-solution-3d.tsx` | 175 | 7,580 B | Topic 3: 1.000 L volumetric flask with dynamic fluid level and solute dispersion. |
| `henrys-law-chamber-3d.tsx` | 209 | 9,591 B | Topic 4: High-pressure gas dissolution chamber with interactive piston showing Henry's law. |
| `evaporation-equilibrium-3d.tsx` | 225 | 9,903 B | Topic 5: Closed vessel vapour pressure equilibrium showing surface molecules evaporating and condensing. |

---

### 3.7 Content Fixtures & Hardcoded Data (`src/features/content/data/` & `src/features/subjects/`)

| File Path | Lines | Size | Purpose & Content | Rebuild Classification |
|---|---|---|---|---|
| `src/features/subjects/data.ts` | 260 | 7,824 B | Canonical fallback data for `CHEMISTRY_SUBJECT`, `SOLUTIONS_CHAPTER`, and all 20 `SOLUTIONS_TOPICS`. | **Lesson-Specific Data** (Should migrate into `src/content/class-12/chemistry/chapter-01/`) |
| `src/features/subjects/queries.ts` | 105 | 2,987 B | DB queries (`getChapterWithTopics`, `getTopicBySlug`) with fallback to `data.ts`. | **Candidate for Replacement** (Replaced by `ContentRegistry` and `ContentService`) |
| `src/features/subjects/types.ts` | 44 | 905 B | Type interfaces for Subject, Chapter, Topic queries. | **Transitional Types** |
| `src/features/content/data/index.ts` | 102 | 2,736 B | Aggregates all topic content blocks into `ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID` and `ALL_SOLUTIONS_CONTENT_BLOCKS`. | **Lesson-Specific Data** |
| `src/features/content/data/topic-01-data.ts` | 268 | 17,633 B | Complete JSON content blocks, theory, callouts, and 4 questions for Topic 1. | **Lesson-Specific Data** |
| `src/features/content/data/topics-02-to-05.ts` | 412 | 23,295 B | Content blocks and questions for Topics 2 to 5. | **Lesson-Specific Data** |
| `src/features/content/data/topics-06-to-09.ts` | 338 | 18,887 B | Content blocks and questions for Topics 6 to 9. | **Lesson-Specific Data** |
| `src/features/content/data/topics-10-to-13.ts` | 296 | 16,643 B | Content blocks and questions for Topics 10 to 13. | **Lesson-Specific Data** |
| `src/features/content/data/topics-14-to-16.ts` | 237 | 13,179 B | Content blocks and questions for Topics 14 to 16. | **Lesson-Specific Data** |
| `src/features/content/data/topics-17-to-20.ts` | 309 | 17,713 B | Content blocks and questions for Topics 17 to 20. | **Lesson-Specific Data** |
| `src/features/content/data/formulas-data.ts` | 277 | 13,911 B | Formula configs & variable definitions for all Solutions formulas. | **Lesson-Specific Data** |
| `src/features/content/queries.ts` | 189 | 5,741 B | `getTopicContentBlocks(topicId)` querying DB with fallback to `src/features/content/data`. | **Candidate for Replacement** (Replaced by `ContentService`) |
| `src/features/content/types.ts` | 119 | 2,740 B | Type interfaces for content blocks, sections, questions, and interactive widgets. | **Reusable / Transitional Types** |

---

### 3.8 Database Migrations & Seeds (`supabase/`)

| File Path | Lines | Size | Purpose & Content |
|---|---|---|---|
| `supabase/migrations/0000_right_captain_marvel.sql` | 219 | 12,778 B | Baseline migration: Creates 5 enums (`user_role`, `content_block_type`, etc.) and 13 tables with constraints and indexes. |
| `supabase/migrations/0001_solutions_topics.sql` | 331 | 8,155 B | Enables RLS on `subjects`, `chapters`, `topics`; defines public read policies; seeds Chemistry subject, Solutions chapter, and 20 topics. |
| `supabase/migrations/0002_topic_01_content.sql` | 275 | 13,932 B | Seeds Topic 1 content blocks, sections, and 4 assessment questions with options. |
| `supabase/migrations/meta/0000_snapshot.json` | 927 | 42,376 B | Drizzle Kit snapshot of the 13-table schema. |
| `supabase/migrations/meta/_journal.json` | 19 | 214 B | Drizzle Kit migration journal tracking migrations `0000` to `0002`. |
| `supabase/seed/seed.ts` | 307 | 9,182 B | Comprehensive seed script: connects via Drizzle and seeds Chemistry, Solutions, all 20 topics, all content blocks from `src/features/content/data`, formula configs, and 3D assets into Supabase. |
| `supabase/seed/verify-app-queries.ts` | 28 | 1,081 B | Database verification script running `getChapterWithTopics`, `getTopicBySlug`, and `getTopicContentBlocks`. |

---

### 3.9 Static Assets (`public/`)

| File Path | Size | Description & Usage | Classification |
|---|---|---|---|
| `public/logo.png` | 258 KB | EDUiDEAL Academy circular brand logo. | Reusable Brand Asset |
| `public/assets/eduideal-logo-BUtjWTvV.png` | 50 KB | Horizontal EDUiDEAL Academy banner logo used in headers. | Reusable Brand Asset |
| `public/assets/logo-u_79P6uf.png` | 258 KB | Alternative EDUiDEAL logo variant. | Reusable Brand Asset |
| `public/assets/hero-students-BSlBorLM.png` | 1.05 MB | High-resolution hero image used on landing page. | Reusable Brand Asset |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | ~3 KB | Default Next.js template SVGs. | Unused Template Artifacts |

---

### 3.10 Tests (`tests/`)

| Directory | Content Status | Findings |
|---|---|---|
| `tests/unit/` | Empty (0 files) | No unit tests exist. |
| `tests/integration/` | Empty (0 files) | No integration tests exist. |
| `tests/e2e/` | Empty (0 files) | No end-to-end tests exist. |

*Note: While `Vitest` and `Playwright` are specified in `EduAidel_Tech_Stack_Updated.md`, neither framework is currently installed in `package.json`.*

---

## 4. Separation of Code: Lesson-Specific vs. Reusable Infrastructure

### 4.1 Authentication & Session Management
- **Existing Reusable Infrastructure:**
  - `src/lib/supabase/client.ts` — Client-side browser Supabase factory.
  - `src/lib/supabase/server.ts` — Server-side cookie-based Supabase factory.
  - `src/lib/supabase/middleware.ts` — Token refresher for edge middleware.
  - `src/lib/supabase/admin.ts` — Service-role admin client.
  - `src/proxy.ts` — Edge middleware configuration.
- **Deficiencies & Gaps in Current Code:**
  - `src/app/login/page.tsx` is completely fake (client-side mock checking `212224040265` / `htna2006`).
  - Missing real `AuthService` to handle credentials, session cookies, and login actions.
  - Missing server-side role check guards (`ADMIN` vs. `STUDENT`).
  - Missing active account status verification (`users.is_active`).

### 4.2 Admin & Student Management
- **Existing Reusable Infrastructure:**
  - `users` table definition in `schema.ts`.
  - `studentSubjects` table definition in `schema.ts`.
- **Deficiencies & Gaps in Current Code:**
  - Zero admin pages exist (`src/app/admin/page.tsx` and `src/app/admin/students/page.tsx` from the architecture spec are completely missing).
  - No `StudentService` or `SubjectAccessService`.
  - No `UserRepository` or `SubjectAccessRepository`.
  - No student dashboard route (`src/app/(student)/dashboard/page.tsx`).
  - No admin API endpoints (`src/app/api/admin/students/route.ts`).

### 4.3 Database Client & Schema
- **Existing Reusable Infrastructure:**
  - `src/lib/db/index.ts` — Robust postgres-js client with connection pooling and HMR singleton.
  - `drizzle.config.ts` — Proper Drizzle Kit migration configuration.
  - Reusable tables in `schema.ts`: `users`, `subjects`, `student_subjects`.
- **Legacy Objects to be Retired/Refactored:**
  - Content tables currently in `schema.ts`: `chapters`, `topics`, `content_blocks`, `formula_configs`, `formula_variables`, `graph_configs`, `media_assets`, `video_assets`, `three_d_assets`, `questions`, `question_options`, `student_progress`.
- **Missing Objects Required by Target Architecture:**
  - `topic_notes` table (student notes with explicit save).
  - `topic_bookmarks` table (student bookmarks).

### 4.4 UI Components & Styling
- **Existing Reusable Infrastructure:**
  - `src/app/globals.css` — Tailwind v4 configuration and color definitions.
  - `src/app/layout.tsx` — Typography, font variables, KaTeX stylesheet.
  - `src/app/providers.tsx` — React Query provider.
  - `src/lib/utils.ts` — `cn` class merger.
  - Landing page UI shell in `src/app/page.tsx`.
- **Deficiencies & Gaps in Current Code:**
  - No shadcn/ui base library installed in `src/components/ui/`.
  - No collapsible topic navigation sidebar component (`src/components/navigation/CollapsibleTopicSidebar.tsx`).
  - No chapter list navigation component (`src/components/navigation/ChapterList.tsx`).

### 4.5 Shared Lesson Rendering
- **Existing Reusable Infrastructure:**
  - `FormulaBlockRenderer` — Dynamic mathematical calculation engine with slider inputs and live evaluation.
  - `GraphBlockRenderer` — Apache ECharts dynamic graphing engine with parameter sliders.
  - `QuestionsBlockRenderer` — Multi-type self-assessment assessment engine.
  - `ThreeDCanvas` — Three.js container with OrbitControls, animation loops, and camera controls.
- **Deficiencies & Gaps in Current Code:**
  - `TheoryBlockRenderer` is tightly coupled to Solutions widgets via hardcoded static imports.
  - Missing `ImageBlockRenderer` and `VideoBlockRenderer`.
  - Missing lazy-loading for heavy libraries (Three.js and ECharts are bundled directly).
  - Missing KaTeX LaTeX equation rendering component (equations are currently rendered as raw text/custom HTML).

### 4.6 Existing Lesson Data & Lesson-Specific Widgets
- **Lesson-Specific Code & Data (Must be migrated/quarantined):**
  - **Routes:** `src/app/chemistry/page.tsx`, `src/app/chemistry/solutions/page.tsx`, `src/app/chemistry/solutions/[topicSlug]/page.tsx`.
  - **Data Fixtures:** `src/features/subjects/data.ts`, `src/features/content/data/formulas-data.ts`, `topic-01-data.ts`, `topics-02-to-05.ts`, `topics-06-to-09.ts`, `topics-10-to-13.ts`, `topics-14-to-16.ts`, `topics-17-to-20.ts`.
  - **22 Interactive Widgets:** `src/features/content/components/interactive/*` (all 22 widgets are specific to Solutions concepts: Raoult's law, Henry's law, Colligative properties, Osmosis, etc.).
  - **5 3D Models:** `src/features/content/components/three-d/models/*` (Hydration shell, Brass lattice, Volumetric flask, Henry's law chamber, Evaporation equilibrium).
  - **Seed Scripts:** `supabase/seed/seed.ts`, `supabase/migrations/0001_solutions_topics.sql`, `supabase/migrations/0002_topic_01_content.sql`.

---

## 5. Detailed Database Audit

### 5.1 Existing Database Objects (PostgreSQL / Drizzle Schema)

#### Enums (5)
1. `user_role`: `['ADMIN', 'STUDENT']`
2. `content_block_type`: `['THEORY', 'IMAGE', 'FORMULA', 'GRAPH', 'THREE_D', 'VIDEO', 'QUESTIONS']`
3. `question_type`: `['MCQ', 'TRUE_FALSE', 'NUMERICAL', 'SHORT_ANSWER']`
4. `difficulty_level`: `['EASY', 'MEDIUM', 'HARD']`
5. `progress_status`: `['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']`

#### Tables (13)

```text
Database Table Structure (Phase 1 Implementation):

users (id UUID PK, email TEXT UNIQUE, name TEXT, role user_role, is_active BOOL)
  │
  ├── student_subjects (student_id UUID FK -> users, subject_id UUID FK -> subjects) [PK: student_id, subject_id]
  └── student_progress (student_id UUID FK -> users, topic_id UUID FK -> topics, content_block_id UUID FK)
        │
subjects (id UUID PK, name TEXT, slug TEXT UNIQUE, display_order INT, is_published BOOL)
  └── chapters (id UUID PK, subject_id UUID FK, name TEXT, slug TEXT, display_order INT)
        └── topics (id UUID PK, chapter_id UUID FK, name TEXT, slug TEXT, display_order INT)
              └── content_blocks (id UUID PK, topic_id UUID FK, type content_block_type, content JSONB)
                    ├── video_assets (content_block_id UUID FK UNIQUE, media_asset_id UUID FK)
                    ├── three_d_assets (content_block_id UUID FK UNIQUE, simulation_config JSONB)
                    ├── formula_configs (content_block_id UUID FK UNIQUE, formula_expression TEXT)
                    │     └── formula_variables (formula_id UUID FK, symbol TEXT, default_value NUMERIC)
                    ├── graph_configs (content_block_id UUID FK UNIQUE, graph_type TEXT, config JSONB)
                    └── questions (content_block_id UUID FK, question_text TEXT, question_type question_type)
                          └── question_options (question_id UUID FK, option_text TEXT, is_correct BOOL)

media_assets (id UUID PK, bucket TEXT, storage_path TEXT, file_name TEXT, mime_type TEXT)
```

### 5.2 Row Level Security (RLS) Status
An audit of `supabase/migrations/` reveals:
- **Enabled RLS Tables:**
  - `subjects`: RLS enabled in `0001_solutions_topics.sql`. Policy: `"Public subjects read"` (`FOR SELECT USING (is_published = true)`).
  - `chapters`: RLS enabled in `0001_solutions_topics.sql`. Policy: `"Public chapters read"` (`FOR SELECT USING (is_published = true AND EXISTS (SELECT 1 FROM subjects WHERE ...))` ).
  - `topics`: RLS enabled in `0001_solutions_topics.sql`. Policy: `"Public topics read"` (`FOR SELECT USING (is_published = true AND EXISTS (SELECT 1 FROM chapters JOIN subjects ...))` ).
- **Tables Without RLS (Vulnerabilities in Phase 1 Implementation):**
  - `users`: **NO RLS ENABLED**. Anyone with the anonymous Supabase key could query user emails/names.
  - `content_blocks`: **NO RLS ENABLED**.
  - `questions`, `question_options`: **NO RLS ENABLED**.
  - `formula_configs`, `formula_variables`: **NO RLS ENABLED**.
  - `graph_configs`: **NO RLS ENABLED**.
  - `three_d_assets`, `video_assets`, `media_assets`: **NO RLS ENABLED**.
  - `student_subjects`: **NO RLS ENABLED**.
  - `student_progress`: **NO RLS ENABLED**.

### 5.3 Live Database Data & Seed Dependencies
The repository includes seed scripts and migrations that have likely been applied to the live database (`.env.local` contains active credentials):
1. **Migration `0000_right_captain_marvel.sql`:** Creates all 13 tables, enums, and foreign keys.
2. **Migration `0001_solutions_topics.sql`:** Inserts:
   - Subject: `Chemistry` (`e1000000-0000-0000-0000-000000000001`)
   - Chapter: `Solutions` (`e1000000-0000-0000-0000-000000000010`)
   - 20 Topics: IDs `e1000000-0000-0000-0000-000000000101` through `e1000000-0000-0000-0000-000000000120`.
3. **Migration `0002_topic_01_content.sql`:** Inserts content blocks `cb100000-0000-0000-0000-000000000101` to `...105` and questions `q1000000-0000-0000-0000-000000000101` to `...104`.
4. **Seed Script `supabase/seed/seed.ts`:**
   When executed via `npm run db:push` or manual seed execution, this script upserts all 20 topics, all content blocks from `src/features/content/data/index.ts`, all formula configs from `formulas-data.ts`, and 5 procedural 3D asset metadata rows (`3d000000-0000-0000-0000-000000000101` to `...105`).

> [!IMPORTANT]
> **Live Database Assumption Rule:**  
> The live database MUST NOT be assumed empty. Any subsequent database migration must not perform a destructive `DROP SCHEMA public CASCADE` or drop tables without an intentional, version-controlled migration strategy that safely transitions to the 5 target tables (`users`, `subjects`, `student_subjects`, `topic_notes`, `topic_bookmarks`).

---

## 6. Gap Analysis & Clean Rebuild Recommendations

### 6.1 Discrepancy Matrix: Current State vs. Target Specification

| Feature / Architectural Area | Current State in Repository | Target Architecture Requirement | Action Required in Clean Rebuild |
|---|---|---|---|
| **Content Storage** | Stored in PostgreSQL `content_blocks` and queried via Drizzle ORM. | Stored in version-controlled TypeScript files under `src/content/class-12/...`. | Migrate topic definitions from `src/features/content/data/` to `src/content/class-12/chemistry/chapter-01/topics/`. |
| **Content Resolution** | Dynamic SQL queries in `queries.ts` with error-swallowing fallbacks. | `ContentRegistry` mapping stable IDs (e.g. `chem-c01-t01`) in-memory. | Create `src/lib/content-registry.ts` and `src/server/services/content-service.ts`. |
| **Database Schema** | 13 tables in `schema.ts`, including content and progress tables. | 5 tables only: `users`, `subjects`, `student_subjects`, `topic_notes`, `topic_bookmarks`. | Author clean migration creating `topic_notes` and `topic_bookmarks`; phase out content tables. |
| **Authentication** | Mock login in `src/app/login/page.tsx` with hardcoded credentials. | Real Supabase Auth; admin-issued credentials; secure cookies. | Rebuild `login/page.tsx` using `AuthService` and Supabase Auth. |
| **Authorization** | None. All chemistry pages are publicly accessible directly via URL. | Server-side subject access checks on every protected request. | Implement `AuthorizationService` and enforce role & subject checks in Server Components/Actions. |
| **Public Preview** | Ad-hoc routes `/chemistry` and `/chemistry/solutions`. | Designated preview chapter per subject (`/preview/[contentId]`). | Implement `src/app/(public)/preview/[contentId]/page.tsx` with server allowlist check. |
| **Notes & Bookmarks** | Completely unbuilt. No tables, no UI, no APIs. | Student notes (explicit save) and bookmarks scoped to student UUID. | Implement `topic_notes`, `topic_bookmarks` tables, repositories, services, and UI widgets. |
| **Admin Dashboard** | Completely missing. | Admin can view/find students, create accounts, assign subjects, deactivate. | Implement `src/app/admin/students/page.tsx` and server actions. |
| **Sidebar Navigation** | Incomplete/static breadcrumbs; no collapsible topic sidebar. | Collapsible topic sidebar listing current chapter's topics. | Implement `src/components/navigation/CollapsibleTopicSidebar.tsx`. |
| **Testing** | Empty test directories; no test runners in `package.json`. | Vitest (unit/integration) and Playwright (E2E) suites. | Install Vitest and Playwright; configure test scripts. |

---

## 7. Inventory Verification Checklist

- [x] Read `AGENTS.md` and all 5 architecture/requirements/stack/rules documents in `Docs/`.
- [x] Inspected entire source tree (`src/`, `supabase/`, `tests/`, `public/`, config files).
- [x] Cataloged all 22 interactive chemistry widgets and 5 procedural 3D models.
- [x] Cataloged all content data files and formula fixtures.
- [x] Audited Drizzle schema (13 tables, 5 enums, 11 relations) and Supabase migrations (`0000`, `0001`, `0002`).
- [x] Documented RLS policies and identified RLS omissions.
- [x] Documented seed scripts, seed fixtures, and query verification scripts.
- [x] Segregated reusable infrastructure from lesson-specific code.
- [x] Identified all gaps between current implementation and target specifications.
- [x] Adhered to zero-mutation constraint: No existing files were edited or deleted; Supabase was not modified.

---

## 8. Post-Pull Upstream Delta Analysis (Commits `4c84738` to `e5a5ecf`)

Following the initial audit, the latest changes from `origin/main` (52 files changed, +7,946 lines, -1,662 lines across 10 commits) were fast-forward pulled and analyzed. The pulled commits implement major architectural features that directly close several gaps identified in Section 6.

### 8.1 Summary of Pulled Commits

| Commit | Author | Description | Impact on Clean Rebuild |
|---|---|---|---|
| `4c84738` | `kishore-3101` | `feat: add dynamic topics sidebar` | Implemented dynamic routes `/[subjectSlug]`, `/[chapterSlug]`, `/[topicSlug]` and collapsible `TopicSidebar`. |
| `f2f002e` | `kishore-3101` | `style: replace original logo` | Replaced image assets in `public/assets/`. |
| `7fa08df` | `kishore-3101` | `fix: corrected sidebar and navbar alignment` | Refined alignment and padding in topic layout and sidebar. |
| `201839e` | `kishore-3101` | `docs: update database design and technology stack` | Updated `Docs/EduAidel_DB_Design.md` to v2 (adding multi-branch and board/class hierarchy). |
| `8ee8497` | `kishore-3101` | `feat(db): add branches, board/class hierarchy, notes and access audit columns` | Updated Drizzle schema and added migration `0001_nasty_vertigo.sql`. |
| `e3122cf` | `kishore-3101` | `feat(auth): implement Supabase login with register number, sessions and route protection` | Full Supabase Auth with register number lookup, sessions, and route guards. |
| `25bc013` | `kishore-3101` | `chore: update tsconfig for Next.js 16` | Adjusted TypeScript compiler options. |
| `8acab0e` | `kishore-3101` | `feat(admin): implement branch admin portal` | Multi-tenant admin portal for managing students, credentials, and subject assignments. |
| `75e7e55` | `kishore-3101` | `style: redesigned login page.` | Polished login page UI. |
| `e5a5ecf` | `Yasvanth0508` | `Merge pull request #3 from kishore-3101/main` | Merged upstream feature branch into `main`. |

---

### 8.2 Detailed Analysis of Newly Added Systems

#### A. Real Authentication & Session Management (`src/lib/auth/session.ts`, `src/features/auth/`)
* **Register Number + Email Login:** `loginAction` validates via Zod (`loginSchema`). If the identifier does not contain `@`, it performs a database lookup on `users.register_number` to find the associated email, then invokes `supabase.auth.signInWithPassword`.
* **Account Deactivation Guard:** Verifies `users.is_active` and `branches.is_active`. If inactive, automatically terminates the Supabase Auth session and denies login.
* **Server Session Utilities:** `getCurrentUser()`, `requireUser()`, and `requireRole("ADMIN" | "STUDENT")` provide server-side identity verification.
* **Middleware Route Protection:** `src/lib/supabase/middleware.ts` intercepts `/dashboard` and `/admin` requests, redirecting unauthenticated traffic to `/login?next=...` while maintaining refreshed session cookies.

#### B. Multi-Tenant Branch Admin Portal (`src/features/admin/`, `src/app/admin/`)
* **Branch Scoping:** Admins manage students exclusively within their assigned branch (`branchId`).
* **Student Lifecycle Management:**
  * **Creation:** `createStudentAction` creates a Supabase Auth user via the service-role client (`createAdminClient()`), inserts the profile into `users`, and creates initial `student_subjects` assignments.
  * **Password Reset:** `resetStudentPasswordAction` generates secure passwords via `generatePassword()` and updates credentials via `supabase.auth.admin.updateUserById()`.
  * **Status Toggle:** `toggleStudentStatusAction` activates/deactivates accounts in real time.
  * **Subject Assignment Audit:** `toggleStudentSubjectAction` tracks `assigned_by`, `revoked_by`, and `revoked_at`.
  * **Deletion:** `deleteStudentAction` purges the user from Supabase Auth and cascades deletion in the database.
* **Admin UI:** Full admin interface implemented across `src/app/admin/page.tsx`, `src/app/admin/students/new/page.tsx`, and `src/app/admin/students/[id]/page.tsx`.

#### C. Student Dashboard (`src/app/dashboard/page.tsx`)
* Dedicated student landing area guarded by `requireRole("STUDENT")`.
* Displays branch badge, student name, and active subject enrollment cards querying `student_subjects` and `subjects`.

#### D. Dynamic Curriculum Routing & Collapsible Sidebar
* **Generic Route Handlers:**
  * `src/app/[subjectSlug]/page.tsx` -> renders `<SubjectView>`
  * `src/app/[subjectSlug]/[chapterSlug]/page.tsx` -> renders `<ChapterDetailView>`
  * `src/app/[subjectSlug]/[chapterSlug]/[topicSlug]/page.tsx` -> renders `<TopicDetailView>`
* **Legacy Compatibility:** `src/app/chemistry/...` routes were refactored into clean wrappers delegating to these generic views.
* **Topic Navigation Sidebar (`src/features/subjects/components/topic-sidebar.tsx`):**
  * Desktop collapsible drawer (80rem expanded / 16rem collapsed).
  * Mobile slide-out drawer with backdrop.
  * Live search filter for topic names.
  * Progress percentage calculator.

#### E. Database Schema Expansion (`0001_nasty_vertigo.sql`)
The migration adds:
1. `branches` table (`Perambur`, `Kodungaiyur`, `Agaram`).
2. `boards` table (`CBSE`, etc.).
3. `classes` table (Class 12).
4. `student_notes` table (`id`, `student_id`, `topic_id`, `content`, `created_at`, `updated_at`).
5. Unique partial index: `chapters_one_demo_per_subject_idx` where `is_demo = true` (enforces exactly one demo chapter per subject, satisfying FR-01).
6. Foreign keys on `users` (`branch_id`, `class_id`, `register_number`).

---

### 8.3 TypeScript & Build Health Post-Pull
A full static type check (`npx tsc --noEmit`) was executed on the updated codebase:
* **Result:** Exited with code `0` (Zero compiler errors across all 52 updated/added files).

---
*End of Clean Rebuild Inventory Report.*
