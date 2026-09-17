# EduAidel — Database Design

## Database Stack

- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Authorization: PostgreSQL Row Level Security (RLS)
- File storage: Supabase Storage
- ORM: Drizzle ORM
- Primary key type: UUID
- Timestamps: `timestamptz`

---

# 1. Core Hierarchy

```text
Subject
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock[]
```

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

# 2. Tables

## users

Application-level user profile. Authentication is handled by Supabase Auth.

```text
users
────────────────────────────────
id              UUID PK FK auth.users(id)
email           TEXT UNIQUE NOT NULL
name            TEXT NOT NULL
role            user_role NOT NULL
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Enum:

```text
user_role:
ADMIN
STUDENT
```

Never store passwords in this table.

---

## subjects

```text
subjects
────────────────────────────────
id              UUID PK
name            TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
description     TEXT
thumbnail_url   TEXT
display_order   INTEGER DEFAULT 0
is_published    BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Relationship:

```text
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
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Constraint:

```text
UNIQUE(subject_id, slug)
```

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

# 3. Content System

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

# 4. Media System

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

Storage contains the actual files.

Example:

```text
eduaidel-assets/
├── images/
├── videos/
├── models/
└── thumbnails/
```

PostgreSQL stores only metadata and storage paths.

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
- Use Three.js + React Three Fiber + WebGL.

---

# 5. Formula System

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

Example:

```text
name:
Coulomb's Law

formula_expression:
k * q1 * q2 / (r * r)

result_unit:
N
```

---

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

Example:

```text
q1 → Charge 1 → C
q2 → Charge 2 → C
r  → Distance → m
```

Calculation is performed by the TypeScript formula engine.

---

# 6. Graph System

## graph_configs

Store graph configuration, not generated graph points.

```text
graph_configs
────────────────────────────────
id              UUID PK
content_block_id UUID UNIQUE FK → content_blocks.id
graph_type      TEXT NOT NULL
title           TEXT
x_axis_label    TEXT
y_axis_label    TEXT
config          JSONB NOT NULL
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

Example:

```json
{
  "xVariable": "distance",
  "yVariable": "electricField",
  "formula": "k * Q / (r * r)",
  "minX": 1,
  "maxX": 20,
  "step": 0.1
}
```

Frontend calculates graph points and renders them with ECharts.

Do NOT store thousands of generated graph points unless they are genuinely static data.

---

# 7. Questions System

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
question_type:
MCQ
TRUE_FALSE
NUMERICAL
SHORT_ANSWER
```

```text
difficulty_level:
EASY
MEDIUM
HARD
```

---

## question_options

Used primarily for MCQ / option-based questions.

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

# 8. Student Access

## student_subjects

Controls which subjects a student can access.

```text
student_subjects
────────────────────────────────
student_id      UUID FK → users.id
subject_id      UUID FK → subjects.id
assigned_at     TIMESTAMPTZ
expires_at      TIMESTAMPTZ NULL
is_active       BOOLEAN DEFAULT TRUE

PRIMARY KEY(student_id, subject_id)
```

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
├── Physics
└── Mathematics
```

No Chemistry assignment = no Chemistry access.

---

# 9. Student Progress

## student_progress

```text
student_progress
────────────────────────────────
id                  UUID PK
student_id          UUID FK → users.id
topic_id            UUID FK → topics.id
content_block_id    UUID FK → content_blocks.id NULL
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

Use this for:

```text
Topic progress
Content-block progress
Last accessed content
Completion tracking
```

---

# 10. Complete Relationship Model

```text
users
 │
 ├──────────────→ student_subjects
 │                       │
 │                       ↓
 │                    subjects
 │                       │
 │                       ↓
 │                    chapters
 │                       │
 │                       ↓
 │                     topics
 │                       │
 │                       ↓
 │                content_blocks
 │                       │
 │        ┌──────────────┼────────────────┐
 │        │              │                │
 │        ↓              ↓                ↓
 │   formula_configs graph_configs   video_assets
 │        │                               │
 │        ↓                               ↓
 │ formula_variables                 media_assets
 │
 │
 └──────────────→ student_progress
                         │
                         ↓
                  topics/content_blocks


content_blocks
 │
 ├── THREE_D → three_d_assets → media_assets
 │
 ├── VIDEO   → video_assets   → media_assets
 │
 ├── FORMULA → formula_configs → formula_variables
 │
 ├── GRAPH   → graph_configs
 │
 └── QUESTIONS → questions → question_options
```

---

# 11. PostgreSQL vs Supabase Storage

## PostgreSQL

Store:

```text
Users
Subjects
Chapters
Topics
Content blocks
Theory
Formula definitions
Formula variables
Graph configurations
3D metadata
Video metadata
Questions
Student access
Student progress
```

## Supabase Storage

Store:

```text
Videos
Images
Thumbnails
GLB/glTF models
Other large media files
```

Never store large video/model/image binaries directly in PostgreSQL.

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
chapters(subject_id)
topics(chapter_id)

content_blocks(topic_id)
content_blocks(topic_id, display_order)

student_subjects(student_id)
student_subjects(subject_id)

student_progress(student_id)
student_progress(topic_id)

questions(content_block_id)

question_options(question_id)

formula_variables(formula_id)
```

Unique constraints:

```text
subjects.slug

chapters(subject_id, slug)

topics(chapter_id, slug)

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
Create
  ↓
Draft
  ↓
Add content
  ↓
Add media
  ↓
Add formula/graph/3D/questions
  ↓
Review
  ↓
Publish
  ↓
Student access
```

Students should only receive published content.

---

# 15. Authorization Model

Roles:

```text
ADMIN
STUDENT
```

### ADMIN

```text
Create/update/delete
subjects
chapters
topics
content
questions
formulas
media metadata
student accounts
student subject assignments
```

### STUDENT

```text
Read published content
    +
Only assigned subjects

Update own progress
```

Enforce access using:

```text
Supabase Auth
        +
PostgreSQL RLS
```

Never rely only on frontend route hiding.

---

# 16. Example Lesson

```text
Physics
└── Electrostatics
    └── Electric Field
        │
        ├── THEORY
        │     └── Markdown/structured content
        │
        ├── FORMULA
        │     └── formula_configs
        │           └── formula_variables
        │
        ├── GRAPH
        │     └── graph_configs
        │
        ├── THREE_D
        │     └── three_d_assets
        │           └── media_assets
        │                 └── Supabase Storage
        │
        ├── VIDEO
        │     └── video_assets
        │           └── media_assets
        │                 └── Supabase Storage
        │
        └── QUESTIONS
              └── questions
                    └── question_options
```

---

# 17. Final Table List

```text
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
└── student_progress
```

## Final Design Principle

```text
Subject
   ↓
Chapter
   ↓
Topic
   ↓
ContentBlock
   ↓
Specialized Content
   ↓
Media / Configuration
```

The schema must support adding new lessons and new combinations of content **without changing the database schema**.
