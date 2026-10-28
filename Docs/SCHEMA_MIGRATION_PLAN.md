# EduAidel — Database Schema Migration Plan

**Document Version:** 1.0  
**Target Architecture:** Planned EduAidel Static Curriculum / Dynamic Student State Boundary  
**Associated SQL Migration Script:** `docs/proposed-migrations/0002_planned_schema_transition.sql`  
**Execution Authorization Status:** Planned / Ready for Operator Review (**Not Applied to Live DB**)

---

## 1. Overview & Objective

This document outlines the operational migration procedure to transition the PostgreSQL database from the legacy hybrid schema to the planned production schema.

### Core Architectural Separation
- **Static Educational Content in Code:**
  Curriculum structure (`subjects`, `chapters`, `topics`) and lesson content (`THEORY`, `IMAGE`, `FORMULA`, `GRAPH`, `THREE_D`, `VIDEO`, `QUESTIONS`) are authored directly in code modules and resolved via `ContentRegistry`.
- **Dynamic Application Data in PostgreSQL (Supabase):**
  Only user accounts, multi-branch structures, subject enrollments/access control, private student notes, and student bookmarks are stored dynamically in the database.

---

## 2. Pre-Migration Verification Checklist

Before applying any migration to staging or production environments, operators must verify:

- [ ] **Full Database Snapshot / Backup:** Complete database dump executed via `pg_dump` or Supabase Management Console.
- [ ] **Application Code Deployed First or Concurrently:** Ensure the application running against the database has updated Drizzle models that no longer query `chapters`, `topics`, or `content_blocks`.
- [ ] **Verify Live `student_notes` Topic IDs:** If existing student notes reference UUIDs from the legacy `topics` table, determine if a data backfill script is needed to map old topic UUIDs to new string topic IDs (e.g., `phy-c01-t01`). If the database has no user-generated notes, `ALTER TABLE ... ALTER COLUMN topic_id TYPE text` proceeds directly.
- [ ] **Zero Live Migration Lock Conflicts:** Run migration during scheduled maintenance or low-traffic window to avoid deadlocks on table alters.

---

## 3. Step-by-Step Migration Sequence

The forward migration script (`docs/proposed-migrations/0002_planned_schema_transition.sql`) executes within a single atomic database transaction (`BEGIN ... COMMIT`):

### Step A: Backup Recommendation
Execute a logical backup before initiating DDL:
```bash
pg_dump -h <db_host> -U postgres -d postgres --format=custom -f eduaidel_pre_migration_backup.dump
```

### Step B: Drop Inbound Foreign Key Constraints
Drop foreign keys linking dynamic tables to static curriculum tables:
1. Drop `student_notes_topic_id_topics_id_fk` from `student_notes`.
2. Drop foreign key constraints on `student_progress` before table dropping.

### Step C: Alter `student_notes` to `topic_notes`
1. Rename table `student_notes` to `topic_notes` (if not already renamed).
2. Alter column `topic_id` from `uuid` to `text`.
3. Drop obsolete index `student_notes_student_topic_idx`.
4. Add unique constraint `topic_notes_student_topic_unique` on `(student_id, topic_id)` ensuring one note per student per topic.
5. Create lookup indexes:
   - `topic_notes_student_idx` on `(student_id)`
   - `topic_notes_topic_idx` on `(topic_id)`

### Step D: Create `topic_bookmarks` Table
Create the new student bookmark table:
- Columns: `student_id` (UUID FK to `users.id` ON DELETE CASCADE), `topic_id` (TEXT NOT NULL), `created_at` (TIMESTAMPTZ DEFAULT now()).
- Composite Primary Key: `(student_id, topic_id)`.
- Indexes: `topic_bookmarks_student_idx`, `topic_bookmarks_topic_idx`.

### Step E: Drop Obsolete Lesson Content & Progress Tables
Drop obsolete tables in reverse topological order (leaves and dependents first):
1. `question_options`
2. `questions`
3. `formula_variables`
4. `formula_configs`
5. `graph_configs`
6. `video_assets`
7. `three_d_assets`
8. `media_assets`
9. `student_progress`
10. `content_blocks`
11. `topics`
12. `chapters`

### Step F: Drop Obsolete PostgreSQL Enums
With no columns depending on them, safely drop:
1. `content_block_type`
2. `question_type`
3. `difficulty_level`
4. `progress_status`

---

## 4. Data Preservation Risks & Mitigation

| Entity / Data | Risk Level | Mitigation Strategy |
|---|---|---|
| `users` (Admins & Students) | **Zero Risk** | `users` is untouched. User IDs matching `auth.users`, emails, names, roles, and branch links remain 100% intact. |
| `branches`, `boards`, `classes` | **Zero Risk** | Entire multi-tenant institutional hierarchy remains intact. |
| `subjects` (Course Catalog) | **Zero Risk** | Table is retained as the course catalog and access reference. Existing records remain intact. |
| `student_subjects` (Enrollments) | **Zero Risk** | Composite key and assigned student access records are preserved without modification. |
| `student_notes` -> `topic_notes` | **Low Risk** | Data preserved in-place. If previous notes contained legacy UUIDs, run a pre-migration mapping script to update `topic_id` values to code-defined string IDs (`phy-c01-t01`). |
| `student_progress` | **Accepted Data Loss** | Progress tracking is explicitly excluded from the product specification. Dropping table drops legacy completion records by design. |

---

## 5. Rollback Strategy

If an unexpected error occurs during migration execution:
1. The transaction automatically rolls back (`ROLLBACK`), leaving existing database tables untouched.
2. If post-migration issues arise in production, restore the point-in-time snapshot or dump:
```bash
pg_restore -h <db_host> -U postgres -d postgres --clean --if-exists eduaidel_pre_migration_backup.dump
```
3. Alternatively, reverse DDL can recreate `chapters`, `topics`, and `content_blocks` using the historical migration `supabase/migrations/0000_right_captain_marvel.sql`.

---

## 6. Execution Instructions for System Administrator

When the team decides to apply the planned schema to Supabase:
1. Place the database in maintenance mode.
2. Connect to the Supabase PostgreSQL database using psql or the Supabase SQL editor:
   ```bash
   psql "$DATABASE_URL" -f docs/proposed-migrations/0002_planned_schema_transition.sql
   ```
3. Verify that the retained tables are accessible and that obsolete tables have been removed:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```
   *Expected active tables:* `branches`, `boards`, `classes`, `users`, `subjects`, `student_subjects`, `topic_notes`, `topic_bookmarks`.
