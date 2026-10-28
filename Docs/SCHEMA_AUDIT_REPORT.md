# EduAidel — Database Schema Audit Report

**Date:** October 2026  
**Auditor:** Antigravity AI Coding Assistant  
**Repository:** `Eduideal_Interactive_Learning_Platform`  
**Target Architecture Specification:** `Docs/EduAidel_Database_Schema.md`

---

## 1. Executive Summary

EduAidel has been running on a **hybrid / legacy database schema** state:
- The **content rendering pipeline** was already successfully refactored in code to use `ContentRegistry` and `ContentService` (`src/content/registry.ts`, `src/types/content.ts`).
- However, the **Drizzle ORM schema definition** (`src/lib/db/schema.ts`) and **database migration history** (`supabase/migrations/`) still declared 12 obsolete lesson and content tables (`chapters`, `topics`, `content_blocks`, `media_assets`, `video_assets`, `three_d_assets`, `formula_configs`, `formula_variables`, `graph_configs`, `questions`, `question_options`, `student_progress`) and 4 obsolete enums.
- The **subjects query module** (`src/features/subjects/queries.ts`) still queried `chapters` and `topics` from PostgreSQL instead of resolving them through `ContentRegistry`.
- The **content service** (`src/server/services/content-service.ts`) retained an obsolete database fallback querying `contentBlocks`, `questions`, and `formulaConfigs` if not loaded in memory.
- `student_notes` possessed a foreign key constraint pointing to the database `topics.id` column (`uuid`), which is incompatible with code-defined topic identifiers (such as `phy-c01-t01`).
- `topic_bookmarks` was missing entirely from the Drizzle schema.
- Dynamic student and administrative access control infrastructure (`branches`, `boards`, `classes`, `users`, `subjects`, and `student_subjects`) is actively used and correctly aligned with the multi-tenant branch architecture.

This report establishes the exhaustive audit of all database entities and documents the actions required to migrate the codebase cleanly to the planned architecture.

---

## 2. Table-by-Table & Entity Audit

| Entity Name | Type | Current Schema Status | Planned Schema Status | Purpose Under Planned Architecture (or Reason for Removal) | Code References | Required Action |
|---|---|---|---|---|---|---|
| `user_role` | Enum | Present | **Retained** | Role-based authorization (`ADMIN`, `STUDENT`). | `src/lib/db/schema.ts`, `src/types/index.ts`, `src/features/auth/`, `src/features/students/` | Keep enum unchanged. |
| `content_block_type` | Enum | Present | **Obsolete / Remove** | Lesson content blocks are strictly stored in code. Block types (`THEORY`, `IMAGE`, `FORMULA`, `GRAPH`, `THREE_D`, `VIDEO`, `QUESTIONS`) are defined via TypeScript discriminated unions in `src/types/content.ts`. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop from Drizzle schema and database. |
| `question_type` | Enum | Present | **Obsolete / Remove** | Practice question types (`MCQ`, `NUMERICAL`, etc.) are defined in TypeScript unions in `src/types/content.ts`. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop from Drizzle schema and database. |
| `difficulty_level` | Enum | Present | **Obsolete / Remove** | Question difficulty levels are defined in `src/types/content.ts`. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop from Drizzle schema and database. |
| `progress_status` | Enum | Present | **Obsolete / Remove** | Student progress tracking is intentionally excluded from the planned architecture. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop from Drizzle schema and database. |
| `branches` | Table | Present | **Retained** | Multi-branch tenant management (e.g., Perambur, Kodungaiyur, Agaram). Admins manage students within their branch. | `src/lib/db/schema.ts`, `src/features/auth/actions.ts`, `src/server/authorization/session.ts` | Keep table unchanged. |
| `boards` | Table | Present | **Retained** | Educational board organization (e.g., CBSE). | `src/lib/db/schema.ts`, `src/features/students/queries.ts` | Keep table unchanged. |
| `classes` | Table | Present | **Retained** | Grade/class organization (e.g., Class 12) under a board. Scopes subjects and students. | `src/lib/db/schema.ts`, `src/features/students/actions.ts`, `src/features/students/queries.ts` | Keep table unchanged. |
| `users` | Table | Present | **Retained** | Dynamic user profiles for admins and students. References `auth.users(id)` with no password hashes. | `src/lib/db/schema.ts`, `src/features/auth/`, `src/features/students/`, `src/server/authorization/` | Keep table unchanged. |
| `subjects` | Table | Present | **Retained** | Subject catalog and access control reference (e.g., Physics, Chemistry, Mathematics). Linked to class. | `src/lib/db/schema.ts`, `src/features/subjects/queries.ts`, `src/app/(student)/dashboard/` | Keep table as dynamic catalog / access entity. |
| `chapters` | Table | Present | **Obsolete / Remove** | Static educational content. Chapters are defined in code modules and resolved via `ContentRegistry`. | `src/lib/db/schema.ts`, `src/features/subjects/queries.ts` | Drop table; rewrite queries to use `ContentRegistry`. |
| `topics` | Table | Present | **Obsolete / Remove** | Static educational content. Topics are defined in code modules and resolved via `ContentRegistry`. | `src/lib/db/schema.ts`, `src/features/subjects/queries.ts` | Drop table; rewrite queries to use `ContentRegistry`. |
| `content_blocks` | Table | Present | **Obsolete / Remove** | Static educational content. Block payloads reside in version-controlled topic TypeScript files. | `src/lib/db/schema.ts`, `src/server/services/content-service.ts` | Drop table; remove DB queries in `content-service.ts`. |
| `media_assets` | Table | Present | **Obsolete / Remove** | Asset metadata stored statically in code content block payloads or direct storage URLs. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop table. |
| `video_assets` | Table | Present | **Obsolete / Remove** | Video configurations stored directly in static `VIDEO` content blocks in code. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop table. |
| `three_d_assets` | Table | Present | **Obsolete / Remove** | 3D simulation configurations stored directly in static `THREE_D` content blocks in code. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop table. |
| `formula_configs` | Table | Present | **Obsolete / Remove** | Interactive formula configurations stored in static `FORMULA` content blocks in code. | `src/lib/db/schema.ts`, `src/server/services/content-service.ts` | Drop table; remove DB queries in `content-service.ts`. |
| `formula_variables` | Table | Present | **Obsolete / Remove** | Formula variables stored in static `FORMULA` content blocks in code. | `src/lib/db/schema.ts`, `src/server/services/content-service.ts` | Drop table; remove DB queries in `content-service.ts`. |
| `graph_configs` | Table | Present | **Obsolete / Remove** | Interactive graph math configurations stored in static `GRAPH` content blocks in code. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop table. |
| `questions` | Table | Present | **Obsolete / Remove** | Practice questions and explanations stored in static `QUESTIONS` content blocks in code. | `src/lib/db/schema.ts`, `src/server/services/content-service.ts` | Drop table; remove DB queries in `content-service.ts`. |
| `question_options` | Table | Present | **Obsolete / Remove** | Question options and answers stored in static `QUESTIONS` content blocks in code. | `src/lib/db/schema.ts`, `src/server/services/content-service.ts` | Drop table; remove DB queries in `content-service.ts`. |
| `student_subjects` | Table | Present | **Retained** | Dynamic subject enrollment / access control mapping between students and subjects. | `src/lib/db/schema.ts`, `src/app/(student)/dashboard/`, `src/features/students/` | Keep table unchanged. |
| `student_progress` | Table | Present | **Obsolete / Remove** | Progress tracking (percent, status, completion timestamps) is intentionally excluded. | `src/lib/db/schema.ts`, `src/types/index.ts` | Drop table. |
| `student_notes` | Table | Present (outdated) | **Modified / Altered** | Notes saved by students. Must reference code-defined string `topic_id` without DB foreign key. Rename to `topic_notes`. | `src/lib/db/schema.ts` | Alter table to `topic_notes`, change `topic_id` from UUID foreign key to `text`, unique on `(student_id, topic_id)`. |
| `topic_bookmarks` | Table | Absent | **Added / New** | Dynamic student bookmarks referencing code-defined string `topic_id` with composite primary key `(student_id, topic_id)`. | Planned in `Docs/EduAidel_Database_Schema.md` | Add table definition in Drizzle schema and proposed migration. |

---

## 3. Architectural Boundary Findings

### 3.1 Dynamic Application Data vs Static Educational Content
- **Static Content in Code:**
  - Curriculum hierarchy: All subject definitions, chapter lists, topic lists, and metadata are authored in code and registered in `ContentRegistry` (`src/content/registry.ts`).
  - Lesson content: Theory markdown, formula calculators, function graphs, 3D simulations, video streams, and interactive questions are authored as immutable TypeScript data structures validated by Zod (`src/lib/validation/content-schema.ts`).
  - **Verdict:** No PostgreSQL tables are required or permitted for lesson content, formulas, questions, media, chapters, or topics.

- **Dynamic Application Data in Supabase:**
  - PostgreSQL stores strictly: user authentication profiles, multi-branch organizational scopes, subject access assignments (`student_subjects`), private student notes (`topic_notes`), and student bookmarks (`topic_bookmarks`).
  - `subjects` in PostgreSQL serves as a course catalog and access control reference to enforce branch/student access restrictions before content is served.

### 3.2 Foreign-Key Integrity for Code-Defined Topic IDs
- In `Docs/EduAidel_Database_Schema.md`, topic identifiers (e.g. `phy-c01-t01`, `chem-c01-t01`) are stable string identifiers maintained in code.
- Because topics do not exist as rows in a `topics` database table, database-level foreign key constraints (`REFERENCES topics(id)`) cannot exist.
- **Integrity Rule:** `topic_notes.topic_id` and `topic_bookmarks.topic_id` are defined as `text("topic_id").notNull()`.
- Application-level integrity is enforced at the API/Server Action layer:
  1. The server validates that `topic_id` exists in `contentRegistry.hasTopic(topicId)`.
  2. The server verifies that the authenticated student has an active assignment in `student_subjects` for the subject containing that topic.

### 3.3 Credentials and Authentication Security
- **Finding:** The `users` table contains:
  `id` (UUID matching `auth.users`), `email`, `name`, `role`, `branchId`, `registerNumber`, `classId`, `isActive`, `createdAt`, `updatedAt`.
- **Zero Password Storage in Application DB:** The `users` table does not contain password hashes, salts, or plaintext credentials.
- All credential verification is handled via Supabase Auth (`supabase.auth.signInWithPassword`), ensuring industry-standard security and separation of concerns.

### 3.4 Student Progress Tracking Status
- **Finding:** The `student_progress` table and `progress_status` enum in `src/lib/db/schema.ts` were remnants from an early proof-of-concept.
- Per `Docs/EduAidel_Database_Schema.md` section "Intentionally excluded", progress tracking, completion percentages, and completion timestamps are explicitly excluded from the product architecture.
- **Action:** `student_progress` is obsolete and removed. No replacement progress table is created.

### 3.5 Multi-Tenant Branch, Board, and Class Architecture
- The multi-tenant organization structure (`branches`, `boards`, `classes`) is retained in full:
  - Branch administrators manage students strictly within their branch.
  - Students authenticate using unique register numbers within their branch.
  - Classes link to Boards, providing proper grade-level curriculum isolation.

---

## 4. Outdated Database Queries Identified in `src/`

1. **`src/features/subjects/queries.ts`**:
   - `getSubjectChapters(subjectSlug)`: Queried `chapters` table with `eq(chapters.subjectId, subject.id)`.
   - `getChapterWithTopics(subjectSlug, chapterSlug)`: Queried `chapters` table and `topics` table.
   - `getTopicBySlug(subjectSlug, chapterSlug, topicSlug)`: Indirectly queried `chapters` and `topics`.
   - *Fix:* Refactored to query `subjects` from DB (to verify catalog publication status), while resolving chapters and topics from `contentRegistry`.

2. **`src/server/services/content-service.ts`**:
   - `getTopicContentBlocks(topicId)`: Contained a 100-line database fallback querying `contentBlocks`, `questions`, `questionOptions`, `formulaConfigs`, and `formulaVariables`.
   - *Fix:* Refactored to resolve exclusively from `ContentService.resolveContentBlocks(topicId)` (which pulls from `ContentRegistry`). No database queries for static content.

3. **`src/types/index.ts`**:
   - Exported Drizzle-inferred model types for `Chapter`, `Topic`, `ContentBlock`, `MediaAsset`, `VideoAsset`, `ThreeDAsset`, `FormulaConfig`, `FormulaVariable`, `GraphConfig`, `Question`, `QuestionOption`, `StudentProgress`.
   - *Fix:* Removed obsolete database types. Cleaned up index to export dynamic database entity types and re-export static content types from `src/types/content.ts`.

---

## 5. Next Steps
1. Apply the updated Drizzle schema in `src/lib/db/schema.ts`.
2. Refactor `src/features/subjects/queries.ts`, `src/server/services/content-service.ts`, and `src/types/index.ts`.
3. Add typed repositories/actions for `topic_notes` and `topic_bookmarks`.
4. Draft the forward migration plan and SQL script in `docs/SCHEMA_MIGRATION_PLAN.md` and `docs/proposed-migrations/0002_planned_schema_transition.sql`.
5. Run the validation pipeline (`tsc`, `lint`, `test`, `build`).
