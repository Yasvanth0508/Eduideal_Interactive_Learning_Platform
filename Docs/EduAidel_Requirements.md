# EduAidel — Functional and Non-Functional Requirements

> Source of truth for AI agents and developers working on EduAidel. Follow these requirements when designing, implementing, or modifying the application. Do not introduce conflicting features without approval.

## 1. Product Overview

EduAidel converts physical educational material into an interactive digital learning platform.

Roles:
- **Admin:** Creates and manages student accounts and subject access.
- **Student:** Views authorized lessons, saves topic notes, and bookmarks topics.

Lesson content is mostly static. Accounts, permissions, notes, and bookmarks are dynamic data.

## 2. Functional Requirements

### FR-01 — Public Preview
- Visitors can use the site without logging in.
- Visitors can access one designated, complete preview chapter in each subject: Physics, Chemistry, and Mathematics.
- Preview chapters include all content and interactive features available in those chapters.
- Other chapters require authentication and authorization for the relevant subject.

### FR-02 — Authentication and Credentials
- Only admins can create student accounts.
- Admins issue student login credentials.
- Students use their assigned credentials until an admin changes them.
- Only admins can change student passwords. Students cannot change their own passwords.
- Admin credentials are configured by the project owner/developer and must not be exposed in client-side code or committed secrets.
- Deactivated students cannot access protected content.
- Admin and student routes/actions must be protected by role checks.
- **Security constraint:** Never store passwords in plaintext or provide a way to retrieve existing passwords. Admins should reset a password and securely issue the replacement credential rather than view an existing password.

### FR-03 — Admin Dashboard
Admins can:
- Create student accounts.
- View and find student accounts.
- Assign one or more subjects to each student.
- Change subject assignments.
- Deactivate or remove student accounts.
- View account status.

Only authorized admins can access admin functionality.

### FR-04 — Subject Authorization
- Students can access only subjects assigned to their accounts.
- Enforce authorization on the server for every protected request; hiding links in the UI is insufficient.
- Direct URL access must not bypass subject permissions.
- Public preview chapters remain accessible without login.
- Removing a subject assignment blocks future access to that subject's restricted content.
- Students must not access another student's notes or bookmarks.

### FR-05 — Content Hierarchy and Rendering
Content follows this hierarchy:

`Subject → Chapter → Topic → Content Blocks`

A topic may contain:
- Text and examples
- Images
- Videos
- Graphs
- Formulas
- Interactive formula calculators
- 3D models

Requirements:
- Not every topic needs every content type.
- Reuse common renderers across subjects and topics.
- Students view educational content; in-site lesson editing is out of scope.
- Keep lesson content separate from UI/rendering and business logic.

### FR-06 — Chapter and Topic Navigation
- Show chapter names when a student opens a subject.
- Show topic names when a student opens a chapter.
- On a topic page, provide a collapsible sidebar listing topics in the current chapter.
- Students can close and reopen the sidebar.
- Do not add a topic search field.
- On smaller screens, use an appropriate drawer/overlay.
- Load selected topic content as needed; do not load the entire syllabus into the browser unnecessarily.

### FR-07 — Student Notes
- Students can create and edit notes associated with a topic.
- Notes are saved only when the student explicitly selects **Save**; do not implement autosave.
- Clearly distinguish saved content from unsaved edits.
- Report save failures clearly and do not falsely indicate that changes were saved.
- Notes persist across sessions and are private to the owning student.
- Students can retrieve their notes when revisiting a topic.

### FR-08 — Bookmarks
- Students can bookmark and unbookmark topics.
- Students can view their bookmarked topics.
- Selecting a bookmark opens the corresponding topic if the student still has access.
- Bookmarks persist across sessions and are private to the owning student.

### FR-09 — Learning Progress
- Learning progress tracking is **out of scope**.
- Do not implement visited-topic tracking, completed-topic tracking, or chapter/syllabus completion percentages unless requirements change.

## 3. Non-Functional Requirements

### NFR-01 — Performance
- Prioritize fast initial rendering and low perceived delay when navigating chapters and topics.
- Do not download the entire syllabus on initial page load.
- Load topic content when needed.
- Keep text and formulas usable while videos and 3D models load.
- Load heavy interactive components and 3D models on demand.
- Optimize image, video, and 3D asset sizes.
- Cache static content/assets where appropriate and safe.
- Keep notes and bookmark operations responsive.
- Suggested initial targets (validate through testing, not guarantees):
  - LCP ≤ 2.5 seconds at the 75th percentile.
  - Text-heavy topic navigation ≤ 500 ms perceived delay on a typical supported connection.
  - Notes/bookmark API response ≤ 300 ms under normal load, excluding external network latency.
- For complex 3D content, show loading states and avoid blocking the whole page.

### NFR-02 — Hosting and Cost
- Target deployment: Vercel for the application, with PostgreSQL hosted separately.
- Prefer a simple, low-maintenance deployment.
- Avoid unnecessary microservices, Kubernetes, dedicated servers, or complex distributed architecture.
- The Vercel Free plan is a candidate, not a guaranteed capacity commitment. Verify current limits, eligibility, function limits, and expected usage before production deployment.
- Include database and media delivery costs when evaluating total operating cost.

### NFR-03 — Capacity
- Expected scale: approximately 100–5,000 active users; confirm whether this means daily active users or peak concurrent users before capacity testing.
- Avoid unnecessary database queries and repeated computation.
- Serve static content efficiently and keep it separate from dynamic student data.
- Load-test representative traffic before production release.

### NFR-04 — Maintainability and Code Organization
- Maintain a clean, modular, consistently typed codebase.
- Keep static educational content in dedicated subject/chapter/topic folders.
- Keep static assets (images, videos, 3D models) in a dedicated asset structure.
- Separate UI components, API routes, service/business logic, database access, and shared types/validation.
- Do not put database access or business rules directly into UI components.
- Reuse content renderers instead of implementing a unique page for each topic.
- Adding a topic should primarily require adding content and asset references, not duplicating application code.
- Use consistent naming, schema validation, and version-controlled database migrations.

### NFR-05 — Security
- Protect admin actions and routes with server-side role checks.
- Enforce subject access permissions server-side on every protected content request.
- Isolate each student's notes and bookmarks.
- Use secure authentication and password hashing, or a trusted authentication provider.
- Never expose credentials, database connection strings, or secrets in client-side bundles or source control.
- Store secrets in deployment environment variables.
- Public preview content may be public; restricted lesson files must not be placed in publicly accessible paths.
- Do not rely on UI hiding as an access-control mechanism.
- Use secure session handling and revoke access for deactivated accounts.

### NFR-06 — Reliability and Data Persistence
- Notes and bookmarks must persist across logins.
- Communicate save failures; never silently discard a failed save.
- Do not mask database errors by silently returning sample/fixture data.
- A missing or failed image, video, graph, or 3D model must not crash the entire lesson page.
- Manage schema changes with reviewed, version-controlled migrations.
- Account deactivation must prevent protected access.

### NFR-07 — Static Content and Asset Delivery
- Organize content by subject, chapter, and topic.
- Keep content data separate from rendering implementation.
- Avoid bundling the entire syllabus into every client page.
- Serve only necessary assets and load heavy assets on demand.
- Optimize images and 3D models; compress and minimize videos.
- Cache static assets where safe.
- Do not expose restricted lesson content through publicly accessible static URLs.

### NFR-08 — Browser and Device Compatibility
- Support current major desktop browsers and responsive layouts for tablet/mobile.
- Ensure the collapsible topic sidebar works on small screens.
- Basic lesson content must remain usable if 3D rendering is unsupported or fails.
- Avoid making high-performance graphics hardware mandatory for basic navigation.

### NFR-09 — Testing and Deployment Quality
- Test authentication, role restrictions, and subject authorization.
- Test that students cannot access each other's notes or bookmarks.
- Test notes save/load and bookmark persistence across sessions.
- Test public preview access and direct-URL restrictions.
- Test production builds before deployment.
- Test large 3D assets for load time and memory use.
- Review and test database migrations before production.
- Use separate development and production environment configuration.

## 4. Content and Data Separation

Use the following conceptual separation:
- **Static content:** Subjects, chapters, topics, lesson text, formulas, graph configuration, and 3D configuration.
- **Static assets:** Images, minimal videos, and 3D model files.
- **Persistent dynamic data:** Admin/student accounts, subject assignments, student notes, and bookmarks.

Static content may be stored in code-managed files, but restricted content must be delivered through an access-controlled mechanism. Files in a public static directory can be downloaded by anyone who knows the URL; do not put protected lesson content there.

Large 3D assets can increase deployment size and load time. Optimize them and measure actual performance. If website-bundled assets become too large, reassess media hosting without changing the content model unnecessarily.

## 5. Explicitly Out of Scope
- Learning progress tracking, including visited/completed states and completion percentages.
- Student editing of educational lesson content.
- Topic search.
- A complex distributed or microservices architecture unless future requirements justify it.

## 6. Implementation Rules for AI Agents
1. Read this document before making architectural or feature changes.
2. Preserve the functional requirements and security constraints.
3. Do not add out-of-scope features without approval.
4. Prefer the simplest design that meets the performance and access-control requirements.
5. Keep content, assets, UI, API routes, services, and database access separated.
6. Do not assume static files are private; verify how restricted content is served.
7. Do not claim performance or capacity targets are met without testing.
8. If a requirement conflicts with secure implementation, explain the conflict and propose the safer alternative before implementing.
9. Update this document only when requirements are explicitly changed.
