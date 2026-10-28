-- ==============================================================================
-- EduAidel Forward Migration: Planned Schema Transition
-- Purpose: Transition PostgreSQL from legacy schema to planned schema.
-- Separates dynamic application data (retained in Supabase) from static educational content (stored in code).
--
-- TARGET ARCHITECTURE:
-- Retained Dynamic Tables:
--   - branches
--   - boards
--   - classes
--   - users (Supabase Auth linked, no password hash)
--   - subjects (course catalogue / access entity)
--   - student_subjects (subject access assignments)
--   - topic_notes (student private notes referencing code-defined topic IDs)
--   - topic_bookmarks (student bookmarks referencing code-defined topic IDs)
--
-- Dropped Obsolete Lesson Tables:
--   - chapters, topics, content_blocks, media_assets, video_assets, three_d_assets,
--     formula_configs, formula_variables, graph_configs, questions, question_options,
--     student_progress
--
-- DO NOT EXECUTE DIRECTLY ON PRODUCTION WITHOUT BACKUP.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Detach Foreign Key Constraints from Existing Student Notes
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'student_notes_topic_id_topics_id_fk'
      AND table_name = 'student_notes'
  ) THEN
    ALTER TABLE "student_notes" DROP CONSTRAINT "student_notes_topic_id_topics_id_fk";
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Alter student_notes to topic_notes with text topic_id
-- ------------------------------------------------------------------------------
-- Rename table if it exists as student_notes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'student_notes'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'topic_notes'
  ) THEN
    ALTER TABLE "student_notes" RENAME TO "topic_notes";
  END IF;
END $$;

-- Ensure topic_notes exists and has topic_id as text
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'topic_notes') THEN
    -- Convert topic_id from uuid to text
    ALTER TABLE "topic_notes" ALTER COLUMN "topic_id" TYPE text USING "topic_id"::text;

    -- Drop outdated indexes
    DROP INDEX IF EXISTS "student_notes_student_topic_idx";

    -- Add unique constraint for (student_id, topic_id)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'topic_notes_student_topic_unique'
        AND table_name = 'topic_notes'
    ) THEN
      ALTER TABLE "topic_notes" ADD CONSTRAINT "topic_notes_student_topic_unique" UNIQUE ("student_id", "topic_id");
    END IF;

    -- Add performance indexes
    CREATE INDEX IF NOT EXISTS "topic_notes_student_idx" ON "topic_notes" ("student_id");
    CREATE INDEX IF NOT EXISTS "topic_notes_topic_idx" ON "topic_notes" ("topic_id");
  ELSE
    -- If neither existed, create topic_notes cleanly
    CREATE TABLE "topic_notes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "topic_id" text NOT NULL,
      "content" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "topic_notes_student_topic_unique" UNIQUE ("student_id", "topic_id")
    );
    CREATE INDEX "topic_notes_student_idx" ON "topic_notes" ("student_id");
    CREATE INDEX "topic_notes_topic_idx" ON "topic_notes" ("topic_id");
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Create topic_bookmarks Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "topic_bookmarks" (
  "student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "topic_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "topic_bookmarks_pkey" PRIMARY KEY ("student_id", "topic_id")
);

CREATE INDEX IF NOT EXISTS "topic_bookmarks_student_idx" ON "topic_bookmarks" ("student_id");
CREATE INDEX IF NOT EXISTS "topic_bookmarks_topic_idx" ON "topic_bookmarks" ("topic_id");

-- ------------------------------------------------------------------------------
-- 4. Drop Obsolete Lesson Content & Progress Tables in Topological Order
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS "question_options" CASCADE;
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "formula_variables" CASCADE;
DROP TABLE IF EXISTS "formula_configs" CASCADE;
DROP TABLE IF EXISTS "graph_configs" CASCADE;
DROP TABLE IF EXISTS "video_assets" CASCADE;
DROP TABLE IF EXISTS "three_d_assets" CASCADE;
DROP TABLE IF EXISTS "media_assets" CASCADE;
DROP TABLE IF EXISTS "student_progress" CASCADE;
DROP TABLE IF EXISTS "content_blocks" CASCADE;
DROP TABLE IF EXISTS "topics" CASCADE;
DROP TABLE IF EXISTS "chapters" CASCADE;

-- ------------------------------------------------------------------------------
-- 5. Drop Obsolete Enums
-- ------------------------------------------------------------------------------
DROP TYPE IF EXISTS "content_block_type";
DROP TYPE IF EXISTS "question_type";
DROP TYPE IF EXISTS "difficulty_level";
DROP TYPE IF EXISTS "progress_status";

COMMIT;
