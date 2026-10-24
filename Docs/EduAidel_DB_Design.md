# EduAidel — Database Design (v2)

Product: Learnova by EDUiDEAL Academy. Launch scope: CBSE Class 12 (Physics, Chemistry, Mathematics) across three branches.

## Database Stack

- Database: Supabase PostgreSQL
- Authentication: Supabase Auth (email + password)
- Authorization: PostgreSQL Row Level Security (RLS) + server-side checks
- File storage: Supabase Storage
- ORM: Drizzle ORM (schema file: `src/lib/db/schema.ts`)
- Primary key type: UUID
- Timestamps: `timestamptz`

---

# 1. Core Hierarchy

Learning content:

```text
Board (e.g. CBSE)
  ↓
Class (e.g. 12)
  ↓
Subject (Physics / Chemistry / Mathematics)
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock[]
```

Organisation (who manages whom):

```text
Branch (Perambur / Kodungaiyur / Agaram)
  ↓
Users
  ├── ADMIN   (one or more per branch)
  └── STUDENT (belongs to exactly one branch)
```

Key rule: **content is global.** Every branch sees the same boards, classes, subjects, chapters and topics. A branch only decides which students an admin can manage.

A topic can contain any combination of:

```text
THEORY
IMAGE
FORMULA
GRAPH
THREE_D
VIDEO
QUESTIONS
```

Do NOT create a separate hard-coded lesson table for every content type.

---

# 2. Organisation Tables

## branches

```text
branches
────────────────────────────────
id              UUID PK
name            TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Rules:

- Branches are never deleted. Deactivate with `is_active = false`.
- Initial data: Perambur, Kodungaiyur, Agaram.

---

## boards

```text
boards
────────────────────────────────
id              UUID PK
name            TEXT NOT NULL      (e.g. CBSE, TN State Board)
slug            TEXT UNIQUE NOT NULL
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMPTZ
```

---

## classes

```text
classes
────────────────────────────────
id              UUID PK
board_id        UUID FK → boards.id NOT NULL
name            TEXT NOT NULL      (e.g. 12)
slug            TEXT NOT NULL
display_order   INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMPTZ
```

Constraint:

```text
UNIQUE(board_id, slug)
```

Relationship:

```text
Board 1 ─── N Classes
```

---

# 3. Core Tables

## users

Application-level user profile. Authentication is handled by Supabase Auth.

```text
users
────────────────────────────────
id                UUID PK FK auth.users(id)
email             TEXT UNIQUE NOT NULL
name              TEXT NOT NULL
role              user_role NOT NULL DEFAULT 'STUDENT'
branch_id         UUID FK → branches.id NOT NULL
register_number   TEXT UNIQUE NULL
class_id          UUID FK → classes.id NULL
is_active         BOOLEAN DEFAULT TRUE
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

Enum:

```text
user_role:
ADMIN
STUDENT
```

Rules:

- Never store passwords in this table.
- Every user (admin or student) belongs to exactly one branch.
- `email` is mandatory and unique across all branches (one email per student; siblings need separate emails).
- `register_number` is unique across all branches. It is set for students and NULL for admins.
- `class_id` is set for students and NULL for admins.
- A student can only be assigned subjects that belong to the student's class.
- The `id` column matches `auth.users.id`. A foreign key to `auth.users(id) ON DELETE CASCADE` is added in the custom SQL migration, because Drizzle cannot reference the `auth` schema directly.

Index: `users(branch_id)`, `users(class_id)`.

---

## subjects

```text
subjects
────────────────────────────────
id              UUID PK
class_id        UUID FK → classes.id NOT NULL
name            TEXT NOT NULL
slug            TEXT NOT NULL
description     TEXT
thumbnail_url   TEXT
display_order   INTEGER DEFAULT 0
is_published    BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Constraint:

```text
UNIQUE(class_id, slug)
```

`slug` is unique per class, not globally, so Physics for Class 11 and Class 12 can both exist.

Relationship:

```text
Class 1 ─── N Subjects
Subject 1 ─── N Chapters
```

---

## chapters

```text
chapters
────────────────────────────────
id              UUID PK
subject_id      UUID FK → subjects.id
name            TEXT NOT NULL
slug            TEXT NOT NULL
description     TEXT
display_order   INTEGER DEFAULT 0
is_published    BOOLEAN DEFAULT FALSE
is_demo         BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Constraints:

```text
UNIQUE(subject_id, slug)
UNIQUE(subject_id) WHERE is_demo = true     -- one demo chapter per subject
```

`is_demo = true` marks the chapter shown in the public demo (no login). The client chooses which chapter is the demo chapter for each subject.

Relationship:

```text
Subject 1 ─── N Chapters
```

---

## topics

```text
topics
────────────────────────────────
id              UUID PK
chapter_id      UUID FK → chapters.id
name            TEXT NOT NULL
slug            TEXT NOT NULL
description     TEXT
display_order   INTEGER DEFAULT 0
is_published    BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Constraint:

```text
UNIQUE(chapter_id, slug)
```

Relationship:

```text
Chapter 1 ─── N Topics
```

---

# 4. Content System

## content_blocks

Central table for all lesson content.

```text
content_blocks
────────────────────────────────
id              UUID PK
topic_id        UUID FK → topics.id
type            content_block_type NOT NULL
title           TEXT
description     TEXT
content         JSONB
display_order   INTEGER DEFAULT 0
is_published    BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Enum:

```text
content_block_type:
THEORY
IMAGE
FORMULA
GRAPH
THREE_D
VIDEO
QUESTIONS
```

Rules:

- `display_order` determines lesson order.
- `content` stores lightweight block-specific content/configuration.
- Specialized content uses dedicated tables.
- Do not store large binary files in `content`.
- A topic can have unlimited content blocks.

Example:

```text
Electric Field
│
├── 1 THEORY
├── 2 FORMULA
├── 3 GRAPH
├── 4 THREE_D
├── 5 VIDEO
└── 6 QUESTIONS
```

---

# 5. Media System

## media_assets

Metadata for files stored in Supabase Storage.

```text
media_assets
────────────────────────────────
id              UUID PK
bucket          TEXT NOT NULL
storage_path    TEXT NOT NULL
file_name       TEXT NOT NULL
mime_type       TEXT
file_size       BIGINT
width           INTEGER
height          INTEGER
duration_sec    INTEGER
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Storage contains the actual files. PostgreSQL stores only metadata and storage paths.

---

## video_assets

```text
video_assets
────────────────────────────────
id                  UUID PK
content_block_id    UUID UNIQUE FK → content_blocks.id
media_asset_id      UUID FK → media_assets.id
title               TEXT
thumbnail_asset_id  UUID FK → media_assets.id
duration_sec        INTEGER
captions_path       TEXT
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

Relationship:

```text
ContentBlock(VIDEO)
        ↓
VideoAsset
        ↓
MediaAsset
        ↓
Supabase Storage
```

---

## three_d_assets

Stores 3D model metadata and simulation configuration.

```text
three_d_assets
────────────────────────────────
id                  UUID PK
content_block_id    UUID UNIQUE FK → content_blocks.id
media_asset_id      UUID FK → media_assets.id
model_name          TEXT NOT NULL
format              TEXT DEFAULT 'GLB'
thumbnail_asset_id  UUID FK → media_assets.id
simulation_config   JSONB
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

Example `simulation_config`:

```json
{
  "simulationType": "electric_field",
  "maxParticles": 500,
  "defaultSpeed": 1,
  "allowSpeedControl": true,
  "allowChargeControl": true
}
```

Initial simulation constraints:

- Keep particle/object counts bounded.
- Keep simulation duration bounded where required.
- Do not use Web Workers initially.
- Do not use WebGPU initially.
- Use Three.js + WebGL.

---

# 6. Formula System

## formula_configs

```text
formula_configs
────────────────────────────────
id                  UUID PK
content_block_id    UUID UNIQUE FK → content_blocks.id
name                TEXT NOT NULL
formula_expression  TEXT NOT NULL
result_unit         TEXT
description         TEXT
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

## formula_variables

```text
formula_variables
────────────────────────────────
id              UUID PK
formula_id      UUID FK → formula_configs.id
symbol          TEXT NOT NULL
label           TEXT NOT NULL
unit            TEXT
data_type       TEXT DEFAULT 'number'
default_value   NUMERIC
min_value       NUMERIC
max_value       NUMERIC
display_order   INTEGER DEFAULT 0
```

Calculation is performed by the TypeScript formula engine.

---

# 7. Graph System

## graph_configs

Store graph configuration, not generated graph points.

```text
graph_configs
────────────────────────────────
id                UUID PK
content_block_id  UUID UNIQUE FK → content_blocks.id
graph_type        TEXT NOT NULL
title             TEXT
x_axis_label      TEXT
y_axis_label      TEXT
config            JSONB NOT NULL
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

Frontend calculates graph points and renders them with ECharts. Do NOT store thousands of generated graph points unless they are genuinely static data.

---

# 8. Questions System

## questions

```text
questions
────────────────────────────────
id                  UUID PK
content_block_id    UUID FK → content_blocks.id
question_text       TEXT NOT NULL
question_type       question_type NOT NULL
difficulty          difficulty_level
marks               INTEGER DEFAULT 1
explanation         TEXT
display_order       INTEGER DEFAULT 0
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

Enums:

```text
question_type:      MCQ | TRUE_FALSE | NUMERICAL | SHORT_ANSWER
difficulty_level:   EASY | MEDIUM | HARD
```

## question_options

```text
question_options
────────────────────────────────
id              UUID PK
question_id     UUID FK → questions.id
option_text     TEXT NOT NULL
is_correct      BOOLEAN DEFAULT FALSE
display_order   INTEGER DEFAULT 0
```

---

# 9. Student Access, Progress and Notes

## student_subjects

Controls which subjects a student can access. Admins grant and revoke subject-wise.

```text
student_subjects
────────────────────────────────
student_id      UUID FK → users.id ON DELETE CASCADE
subject_id      UUID FK → subjects.id ON DELETE CASCADE
assigned_at     TIMESTAMPTZ
assigned_by     UUID FK → users.id NULL (ON DELETE SET NULL)
revoked_at      TIMESTAMPTZ NULL
revoked_by      UUID FK → users.id NULL (ON DELETE SET NULL)
is_active       BOOLEAN DEFAULT TRUE

PRIMARY KEY(student_id, subject_id)
```

Rules:

- A student has access to a subject only if a row exists with `is_active = true`.
- **Grant:** insert the row, or if it exists, set `is_active = true`, clear `revoked_at` / `revoked_by`, and set `assigned_by`.
- **Revoke:** set `is_active = false`, `revoked_at = now()`, `revoked_by = <admin id>`. Do not delete the row, so there is a record of who changed access and when.
- There is no expiry. Access lasts until an admin revokes it or the student is deleted at the end of the academic year.
- The subject must belong to the student's class (checked in the server route).
- An admin can only grant or revoke for students in their own branch.

Do NOT use:

```text
student.physics = true
student.chemistry = false
student.math = true
```

Use relational subject assignments.

Example:

```text
Student A
├── Physics        (active)
├── Mathematics    (active)
└── Chemistry      (no row = no access)
```

---

## student_progress

```text
student_progress
────────────────────────────────
id                  UUID PK
student_id          UUID FK → users.id ON DELETE CASCADE
topic_id            UUID FK → topics.id ON DELETE CASCADE
content_block_id    UUID FK → content_blocks.id NULL (ON DELETE SET NULL)
status              progress_status NOT NULL
progress_percent    INTEGER DEFAULT 0
last_accessed_at    TIMESTAMPTZ
completed_at        TIMESTAMPTZ NULL
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

Enum:

```text
progress_status:
NOT_STARTED
IN_PROGRESS
COMPLETED
```

---

## student_notes

Personal notes a student writes against a topic. Each topic page has a notes button that shows the student's saved notes.

```text
student_notes
────────────────────────────────
id              UUID PK
student_id      UUID FK → users.id ON DELETE CASCADE
topic_id        UUID FK → topics.id ON DELETE CASCADE
content         TEXT NOT NULL
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Rules:

- Notes are tied to topics only.
- Several notes per topic are allowed. To limit to one note per topic, change the `(student_id, topic_id)` index to unique.
- A student can only read and write their own notes.

---

# 10. Complete Relationship Model

```text
boards ──→ classes ──→ subjects ──→ chapters ──→ topics ──→ content_blocks
                           ↑
                           │
branches ──→ users ──→ student_subjects
               │
               ├──→ student_progress ──→ topics / content_blocks
               └──→ student_notes    ──→ topics

users.class_id ──→ classes

content_blocks
 │
 ├── THREE_D   → three_d_assets  → media_assets
 ├── VIDEO     → video_assets    → media_assets
 ├── FORMULA   → formula_configs → formula_variables
 ├── GRAPH     → graph_configs
 └── QUESTIONS → questions       → question_options
```

---

# 11. PostgreSQL vs Supabase Storage

## PostgreSQL

Store: branches, boards, classes, users, subjects, chapters, topics, content blocks, theory, formula definitions and variables, graph configurations, 3D metadata, video metadata, questions, student access, student progress, student notes.

## Supabase Storage

Store: videos, images, thumbnails, GLB/glTF models, other large media files.

Never store large video/model/image binaries directly in PostgreSQL. Keep the bucket private and serve media through signed URLs, so only students with access can open it.

---

# 12. Storage Structure

```text
eduaidel-assets/
│
├── images/
│   ├── physics/
│   ├── chemistry/
│   └── mathematics/
│
├── videos/
│   ├── physics/
│   ├── chemistry/
│   └── mathematics/
│
├── models/
│   ├── physics/
│   ├── chemistry/
│   └── mathematics/
│
└── thumbnails/
```

Example:

```text
models/physics/electrostatics/electric-field.glb
videos/physics/electrostatics/electric-field.mp4
images/physics/electrostatics/electric-field.png
```

---

# 13. Indexes

Create indexes on:

```text
classes(board_id)
subjects(class_id)
chapters(subject_id)
topics(chapter_id)

users(branch_id)
users(class_id)

content_blocks(topic_id)
content_blocks(topic_id, display_order)

student_subjects(student_id)
student_subjects(subject_id)

student_progress(student_id)
student_progress(topic_id)

student_notes(student_id, topic_id)

questions(content_block_id)
question_options(question_id)
formula_variables(formula_id)
```

Unique constraints:

```text
branches.slug
boards.slug
classes(board_id, slug)
subjects(class_id, slug)
chapters(subject_id, slug)
chapters(subject_id) WHERE is_demo = true
topics(chapter_id, slug)

users.email
users.register_number

student_subjects(student_id, subject_id)

video_assets.content_block_id
three_d_assets.content_block_id
formula_configs.content_block_id
graph_configs.content_block_id
```

---

# 14. Publishing Model

Core educational entities support draft/published state:

```text
subjects
chapters
topics
content_blocks
```

Workflow:

```text
Create → Draft → Add content → Add media → Add formula/graph/3D/questions → Review → Publish → Student access
```

Students and the public demo only receive published content.

---

# 15. Authentication

- Supabase Auth with email + password. Public sign-up is disabled.
- **Admins** sign in with their email and password.
- **Students** sign in with their **register number** and password. Supabase Auth only understands email, so the server looks up the student's email from `users.register_number` and then signs in with that email. The student never needs to see or use the email.
- Admin accounts are created in the Supabase dashboard, then linked by inserting a `users` row (role `ADMIN`, with `branch_id`).
- Student accounts are created only by a branch admin through a server route using the service-role key. The route forces `branch_id` to the admin's own branch and removes the auth user again if the `users` insert fails.
- A user can only use the app if `users.is_active = true` and their branch is active.

---

# 16. Authorization Model

Roles:

```text
ADMIN      (scoped to one branch)
STUDENT
```

A `SUPER_ADMIN` role (all branches) is not built yet. It can be added later as a new enum value with policies that skip the branch check.

### ADMIN (branch admin)

```text
Read / create / update students of OWN branch only
Grant and revoke subject access for students of OWN branch only
Create/update/delete content: subjects, chapters, topics, content blocks,
questions, formulas, media metadata (content is global)
```

An admin can never read or change students of another branch, and can never change a student's `branch_id` or `role`.

### STUDENT

```text
Read published content of subjects with an active student_subjects row
Read own student_subjects rows
Read and update own progress
Read and write own notes
```

### Public (no login, demo)

```text
Read published chapters where is_demo = true, and their topics and content
```

### Policy summary

| Table | ADMIN | STUDENT | Anonymous |
|---|---|---|---|
| users | Select/insert/update where `branch_id` = own branch. Cannot change `branch_id` or `role` | Read own row | None |
| student_subjects | All operations where the student is in own branch | Read own rows | None |
| subjects, chapters, topics, content_blocks and child tables | Full access | Read published rows of assigned subjects (`can_access_topic`) | Read published demo chapters only |
| student_progress | Read for own-branch students | Read/write own rows | None |
| student_notes | None | Read/write own rows | None |
| branches, boards, classes | Read | Read | None |

Helper functions used by the policies (SECURITY DEFINER, to avoid recursion):

```text
current_branch()          → branch_id of the logged-in user
is_admin()                → true if logged-in user is an active ADMIN
can_access_topic(topic)   → published topic in a subject with an active student_subjects row
```

Enforce access using:

```text
Supabase Auth
      +
PostgreSQL RLS
      +
Server-side branch checks (server code using Drizzle connects as the postgres role and bypasses RLS)
```

Never rely only on frontend route hiding.

---

# 17. Account Lifecycle

- At the end of each academic year, an admin deletes the students. Delete the auth user through the admin API; the `auth.users` foreign key cascade removes the `users` row, and cascades remove `student_subjects`, `student_progress` and `student_notes`.
- Branches, boards, classes, subjects and content are not affected.

---

# 18. Initial Seed Data

```text
branches : Perambur, Kodungaiyur, Agaram
boards   : CBSE
classes  : 12 (under CBSE)
subjects : Physics, Chemistry, Mathematics (under CBSE 12)
admins   : one per branch (created in Supabase Auth, then linked in users)
```

---

# 19. Example Lesson

```text
CBSE
└── Class 12
    └── Physics
        └── Electrostatics
            └── Electric Field
                │
                ├── THEORY      → structured content
                ├── FORMULA     → formula_configs → formula_variables
                ├── GRAPH       → graph_configs
                ├── THREE_D     → three_d_assets → media_assets → Supabase Storage
                ├── VIDEO       → video_assets   → media_assets → Supabase Storage
                └── QUESTIONS   → questions → question_options
```

---

# 20. Final Table List

```text
ORGANISATION
├── branches
├── boards
└── classes

CORE
├── users
├── subjects
├── chapters
└── topics

CONTENT
├── content_blocks
├── formula_configs
├── formula_variables
└── graph_configs

MEDIA
├── media_assets
├── video_assets
└── three_d_assets

ASSESSMENT
├── questions
└── question_options

STUDENT
├── student_subjects
├── student_progress
└── student_notes
```

## Final Design Principle

```text
Board → Class → Subject → Chapter → Topic → ContentBlock → Specialized Content → Media / Configuration
```

The schema must support adding new lessons and new combinations of content **without changing the database schema**. Branch management only controls which students an admin can manage; it never changes the content.

---

# 21. Changes from v1

| Area | Change |
|---|---|
| New tables | `branches`, `boards`, `classes`, `student_notes` |
| users | Added `branch_id` (required), `register_number` (unique), `class_id` |
| subjects | Added `class_id` (required); `slug` unique per class instead of globally |
| chapters | Added `is_demo`; one demo chapter per subject |
| student_subjects | Added `assigned_by`, `revoked_at`, `revoked_by`; removed `expires_at`; revoke is a soft revoke |
| Authorization | Admins are branch-scoped; demo access for anonymous users; policy summary added |
| Authentication | Students sign in with register number, admins with email |