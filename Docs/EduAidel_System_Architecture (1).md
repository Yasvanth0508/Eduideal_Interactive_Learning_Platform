# EduAidel — System Architecture

## 1. Architecture Overview

EduAidel is a Next.js application deployed on Vercel.

- **Frontend:** Next.js, React, TypeScript.
- **Backend:** Next.js server-side route handlers and server-only services.
- **Database:** PostgreSQL for student accounts, subject assignments, notes, and bookmarks.
- **Lesson content:** Version-controlled TypeScript/JSON files in the codebase.
- **Lesson assets:** Stored inside each topic's own folder.
- **Authorization:** Enforced on the server for every protected topic and data request.

Lesson content is mostly static. Student-specific information is dynamic, so lesson definitions remain in the repository while notes and bookmarks are stored in PostgreSQL.

## 2. Components and Responsibilities

| Component | Single responsibility |
|---|---|
| `AuthService` | Authenticate users and establish sessions. |
| `AuthorizationService` | Check role-based permissions for server requests. |
| `StudentService` | Create, update, deactivate, and inspect student accounts. |
| `SubjectAccessService` | Check and update each student's subject assignments. |
| `ContentRegistry` | Map stable content IDs to known chapter and topic definitions. |
| `ContentService` | Retrieve content only after checking preview access or student authorization. |
| `ContentBlockRenderer` | Select the renderer matching each content block's type. |
| `TheoryBlockRenderer` | Render explanatory text and examples. |
| `ImageBlockRenderer` | Render lesson images and diagrams. |
| `VideoBlockRenderer` | Render lesson videos. |
| `FormulaBlockRenderer` | Render formulas and interactive formula calculators. |
| `GraphBlockRenderer` | Render graphs. |
| `ThreeDBlockRenderer` | Load and display 3D models on demand. |
| `NotesService` | Validate and save a student's notes for a topic. |
| `BookmarksService` | Add, remove, and list a student's bookmarked topics. |
| `UserRepository` | Read and write user records in PostgreSQL. |
| `SubjectAccessRepository` | Read and write subject assignments. |
| `NotesRepository` | Read and write notes. |
| `BookmarksRepository` | Read and write bookmarks. |

**Layering rule:** UI components must not query the database directly. API route handlers validate requests and call services. Services enforce business rules and use repositories for database access.

## 3. Folder Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── preview/[contentId]/page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (student)/
│   │   ├── dashboard/page.tsx
│   │   └── learn/[contentId]/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── students/page.tsx
│   └── api/
│       ├── notes/route.ts
│       ├── bookmarks/route.ts
│       └── admin/
│           └── students/route.ts
├── content/
│   └── class-12/
│       ├── physics/
│       │   └── chapter-01/
│       │       ├── chapter.ts
│       │       └── topics/
│       │           └── introduction/
│       │               ├── topic.ts
│       │               └── assets/
│       │                   ├── diagram.webp
│       │                   ├── explanation.mp4
│       │                   └── model.glb
│       ├── chemistry/
│       │   └── chapter-01/
│       │       └── ...
│       └── mathematics/
│           └── chapter-01/
│               └── ...
├── components/
│   ├── navigation/
│   │   ├── ChapterList.tsx
│   │   └── CollapsibleTopicSidebar.tsx
│   └── lesson/
│       ├── ContentBlockRenderer.tsx
│       ├── TheoryBlockRenderer.tsx
│       ├── ImageBlockRenderer.tsx
│       ├── VideoBlockRenderer.tsx
│       ├── FormulaBlockRenderer.tsx
│       ├── GraphBlockRenderer.tsx
│       └── ThreeDBlockRenderer.tsx
├── server/
│   ├── auth/
│   ├── services/
│   └── repositories/
├── lib/
│   ├── db/
│   ├── validation/
│   └── content-registry.ts
└── types/
```

### Folder rules

- Keep each topic's images, videos, diagrams, and 3D models inside that topic's `assets/` folder.
- Do not create global `images/`, `videos/`, or `models/` folders.
- Public preview assets may be publicly served.
- **Never put restricted topic definitions or restricted assets in Next.js `public/`.** Files in `public/` can be accessed directly without application authorization.
- Serve protected content through an authorization-checked server path. If large protected models or videos exceed practical deployment limits, use private object storage and issue access only after authorization.

## 4. How Content Connects to the Application

### Stable IDs

Give every subject, chapter, and topic a stable ID that does not depend on its title or file path.

Example topic ID: `phy-c01-t01`

A topic definition can look like this:

```ts
import diagramUrl from "./assets/diagram.webp";

export const introductionTopic = {
  id: "phy-c01-t01",
  subjectId: "physics",
  chapterId: "phy-c01",
  title: "Introduction",
  blocks: [
    {
      type: "theory",
      text: "Lesson explanation goes here."
    },
    {
      type: "image",
      src: diagramUrl,
      alt: "Diagram illustrating the concept"
    }
  ]
} as const;
```

The example illustrates the data shape; the exact asset-import and delivery approach should be verified against the chosen Next.js build and hosting setup, especially for protected assets.

### Chapter definition

A chapter definition stores the chapter ID, title, subject ID, and topic IDs in display order.

```ts
export const physicsChapter01 = {
  id: "phy-c01",
  subjectId: "physics",
  title: "Electric Charges and Fields",
  topicIds: [
    "phy-c01-t01",
    "phy-c01-t02",
    "phy-c01-t03"
  ]
} as const;
```

### Content lookup flow

1. The student opens `/learn/phy-c01-t01`.
2. The server reads `phy-c01-t01` and looks it up in `ContentRegistry`.
3. `ContentService` checks whether the topic is public preview content or requires a signed-in student with access to its subject.
4. If access is denied, the server does not return the topic definition or protected asset URLs.
5. If access is allowed, the server returns the topic data.
6. `ContentBlockRenderer` reads each block's `type` and calls the matching renderer.
7. The renderer displays text, formulas, images, videos, graphs, or 3D models.

`ContentRegistry` should use an explicit map of known IDs to known topic definitions. Do not build arbitrary filesystem paths from a URL parameter.

### Why stable IDs matter

Notes and bookmarks store the topic ID, not the topic title or file path. Titles and folder names can change without breaking those relationships, as long as IDs remain stable.

## 5. PostgreSQL Data

Keep static lesson content out of PostgreSQL unless a future requirement makes it dynamic.

| Table | Purpose |
|---|---|
| `users` | Student and admin accounts, password hashes, status, and role. |
| `subjects` | Subject records used for access assignment. |
| `student_subjects` | Maps students to the subjects they may access. |
| `topic_notes` | A student's saved note for a topic. |
| `topic_bookmarks` | A student's bookmarked topics. |

Notes and bookmarks should reference stable topic IDs from the content registry. Enforce ownership in server-side queries so one student cannot read or modify another student's data.

## 6. Core Request Flows

### Open a topic

1. Route receives the content ID.
2. `ContentService` resolves the ID through `ContentRegistry`.
3. Server checks preview eligibility or the user's session and subject assignment.
4. Authorized topic data is returned.
5. The UI renders its content blocks.

### Save a note

1. Client submits the note and topic ID to the notes API.
2. API validates the request and authenticates the user.
3. `NotesService` verifies topic validity and ownership context.
4. `NotesRepository` saves the note for the authenticated user.
5. API returns success or a clear error. The UI must not pretend a failed save succeeded.

### Add or remove a bookmark

1. Client submits the topic ID and desired operation.
2. API authenticates the user and validates the topic ID.
3. `BookmarksService` applies the operation for the authenticated user.
4. `BookmarksRepository` persists the change.

### Assign subjects to a student

1. Admin submits a subject-assignment change.
2. API verifies the admin session and validates the request.
3. `StudentService` and `SubjectAccessService` apply the change.
4. The updated assignment is saved to PostgreSQL.
5. Future protected requests use the updated assignment.

## 7. Essential Rules

- Enforce role and subject access on the server for every protected request.
- Keep the preview chapter allowlist on the server; do not trust a client-provided preview flag.
- Do not expose restricted lesson data through public files or unauthenticated asset URLs.
- Store password hashes, never plaintext passwords. Admins reset passwords rather than viewing existing passwords.
- Load large videos and 3D models only when needed.
- Use explicit Save for notes; no autosave.
- Do not implement learning progress tracking or a topic-search feature in the current scope.
- Use database migrations and environment variables for schema changes and secrets.
- Verify Vercel function, build-output, and asset-size limits before choosing how to deliver large protected media.

## 8. Out of Scope

- Teacher-facing lesson editing.
- Student password changes.
- Learning progress tracking.
- Topic search.
- Notes autosave.
- Storing static lesson definitions in PostgreSQL.
