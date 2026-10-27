# EduAidel — Database Schema

## Purpose

PostgreSQL stores dynamic application data only:

- User accounts and roles
- Student active/deactivated status
- Subject assignments
- Student notes
- Student bookmarks

Static subjects, chapters, topics, content blocks, and asset paths remain in the codebase and are resolved through `ContentRegistry`.

## Entity relationship

```text
users
  ├── student_subjects ── subjects
  ├── topic_notes
  └── topic_bookmarks

student_subjects:
  one student can be assigned multiple subjects
  one subject can be assigned to multiple students

topic_notes:
  one note per student per topic

topic_bookmarks:
  one bookmark per student per topic
```

## Tables

| Table | Purpose | Important constraints |
|---|---|---|
| `users` | Admin and student accounts | Case-insensitive unique email; role; active status; password hash only |
| `subjects` | Subject catalogue | Stable IDs: `physics`, `chemistry`, `mathematics` |
| `student_subjects` | Subject access assignments | Composite primary key `(student_id, subject_id)` |
| `topic_notes` | Notes saved by students | Unique `(student_id, topic_id)` |
| `topic_bookmarks` | Bookmarked topics | Composite primary key `(student_id, topic_id)` |

## Relationship to static content

`topic_id` is a stable string ID owned by the application content registry, for example `phy-c01-t01`. It is deliberately not a foreign key because topic definitions are version-controlled files, not database rows.

Before accepting a note or bookmark, the server must verify that the topic ID exists in `ContentRegistry`. The server must also verify that the authenticated student is authorized for the topic's subject, unless it is an allowed public-preview topic and the operation is otherwise permitted.

## Authorization rules

1. Only an authenticated admin can create or deactivate accounts or change subject assignments.
2. A deactivated user cannot access protected content or APIs.
3. Every protected topic request checks the student's current subject assignment on the server.
4. Notes and bookmarks are always scoped to the authenticated user's ID; never trust a client-supplied student ID.
5. Removing a subject assignment blocks future protected access to that subject.
6. Public preview access is controlled by a server-side allowlist, not by a client-provided flag.
7. Store password hashes, never plaintext passwords. Admins reset passwords rather than viewing existing ones.

## SQL migration

Use `EduAidel_Database_Schema.sql` as the initial PostgreSQL migration. Apply it through your migration workflow, not manually on production without version control.

The schema includes `updated_at` triggers for users and notes. If using a database provider with restricted extension/function permissions, verify `gen_random_uuid()` and trigger support during setup.

## Intentionally excluded

- Static chapter/topic/content block tables
- Learning progress and completion status
- Teacher lesson editing
- Student password-change functionality
- Notes autosave state
