# EduAidel — AI Agent Codebase Rules

## 1. Core Rules
- Follow `docs/REQUIREMENTS.md`, `docs/SYSTEM_ARCHITECTURE.md`, and `docs/TECH_STACK.md` before coding.
- Keep changes small, modular, typed, and consistent with existing patterns. Do not introduce dependencies or architecture layers without a clear need.
- Separate UI, business logic, database access, and lesson content. Keep database queries out of UI components.
- Validate external input with Zod; handle loading, empty, and error states explicitly.
- Never weaken authentication, authorization, RLS, or type checks to make a feature work.
- Do not add learning progress, teacher editing, topic search, autosave, Web Workers, or WebGPU unless requirements change.
- After changes, run lint, type-check, relevant tests, and a production build.

## 2. Turning Raw Documents into Lessons
When given a Word/PDF/text document:

1. Extract and preserve the source's meaning, definitions, examples, equations, units, diagrams, and topic order. Do not invent missing educational facts.
2. Split content into small, meaningful topics and reusable blocks. Avoid one enormous page/component or one giant JSON object.
3. Store content as typed TypeScript/JSON data under `src/content/class-12/<subject>/<chapter>/topics/<topic>/`.
4. Give each topic a permanent ID, e.g. `phy-c01-t01`. Keep IDs stable when titles or file paths change.
5. Keep chapter topic order in `chapter.ts`; reference topics by ID through `ContentRegistry`.
6. Use shared block types/renderers such as `theory`, `image`, `video`, `formula`, `graph`, and `model3d`. Do not create custom rendering code for every topic.
7. Preserve equations in a renderer-supported format (KaTeX-compatible LaTeX); check symbols, subscripts, superscripts, units, and equation meaning.
8. Keep source attribution or page references where useful for review. Flag illegible, ambiguous, or contradictory source content instead of guessing.
9. After conversion, compare the lesson against the original document and check every heading, formula, example, figure, and topic for omissions or accidental changes.

## 3. Memory-Efficient Content Code
- Keep lesson content declarative: data describes content; shared components render it.
- Split long lessons into topic-level modules and load only the selected topic.
- Avoid duplicating repeated explanations, UI markup, large inline data arrays, or embedded base64 media.
- Use stable asset paths/imports and validated content types; never build arbitrary file paths from user-provided IDs.
- Lazy-load expensive renderers and libraries: Plotly.js only for graph blocks; Three.js only for 3D blocks.
- Avoid importing all topics and all heavy assets into the initial page bundle. Inspect the build output for accidental eager imports.
- Use responsive images (appropriate dimensions, modern formats such as WebP/AVIF) and provide width/height or aspect ratio to reduce layout shifts.
- Use compressed video and model assets; do not load video/model data until needed.
- Prefer simple data structures and derived values over duplicated stored state. Avoid unnecessary client components and repeated re-renders.
- Do not cache full syllabus or user-specific data globally. Cache only where authorization and invalidation are understood.

## 4. 3D Model Rules
- Prefer optimized glTF/GLB assets; remove invisible/internal geometry, unused materials, and unnecessary animation tracks.
- Reduce polygon count and draw calls; merge meshes only when appropriate, instance repeated objects, and use level of detail when justified.
- Compress geometry and textures where supported by the model pipeline; resize textures to the actual visual requirement.
- Reuse materials and textures where possible. Avoid large uncompressed textures and excessive transparency.
- Load a model only when its topic/block is opened or becomes visible; show a lightweight placeholder while loading.
- Dispose of geometries, materials, textures, renderers, and event listeners when the viewer unmounts. Prevent duplicate WebGL contexts.
- Provide loading, failure, and fallback states. If 3D fails, keep the text explanation and other lesson content usable.
- Do not adopt WebGPU or Web Workers in the initial version.

## 5. Video and Image Rules
- Use appropriately sized WebP/AVIF images and avoid serving original high-resolution images when not needed.
- Use video compression and sensible resolutions/bitrates; add poster images and metadata preload rather than downloading full videos on page load.
- Load media on demand. Avoid autoplay unless a clear learning requirement calls for it.
- All assets stay in their topic folder, not global image/video/model folders.
- A nested file is not private just because of its folder. Never expose restricted assets through a public URL. Use an authorization-checked delivery path for protected content and verify deployment size limits.

## 6. Security and Student Data
- Use Supabase Auth as the sole identity/password system. Do not store password hashes in application tables.
- Keep Supabase service-role/secret keys server-only.
- Enforce role, active-account, subject-assignment, and preview-allowlist checks on every protected server request.
- Scope notes and bookmarks to the authenticated user's ID; never trust a client-supplied student ID.
- Do not expose restricted lesson definitions or assets before authorization succeeds.
- Admins reset passwords; they never view existing passwords.

## 7. Maintaining the Repository
- Prefer extending an existing component or block type over creating a duplicate.
- Update types, validation, renderers, tests, and documentation when adding a block type or changing a data contract.
- Keep dependencies minimal and remove unused code/assets.
- Never overwrite unrelated user work. Inspect the current implementation before editing.
- Do not claim a feature is complete unless tests/build checks pass; report known gaps clearly.
- For each content conversion, record the source filename and review status if the project workflow supports it.
