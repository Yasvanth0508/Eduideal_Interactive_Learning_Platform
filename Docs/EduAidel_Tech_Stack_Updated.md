# EduAidel — Technology Stack

## Core Architecture

| Purpose | Technology |
|---|---|
| Full-stack framework | Next.js |
| Language | TypeScript |
| Frontend | React |
| Backend/API | Next.js Route Handlers + Server Actions |
| Deployment | Vercel |

## Database / Backend Services

| Purpose | Technology |
|---|---|
| Relational database | Supabase PostgreSQL |
| ORM / type-safe DB access | Drizzle ORM |
| Authentication | Supabase Auth |
| Authorization | PostgreSQL Row Level Security (RLS) |
| Object/file storage | Supabase Storage |
| Realtime | Supabase Realtime — only when required |

## Frontend UI

| Purpose | Technology |
|---|---|
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| UI animation | Motion |
| Server data fetching / caching | TanStack Query |
| Client-side state | Zustand |
| Validation | Zod |

## Interactive Learning / Visualization

| Purpose | Technology |
|---|---|
| 3D rendering | Three.js |
| React integration for 3D | React Three Fiber |
| 3D rendering backend | WebGL via Three.js |
| Interactive scientific graphs | Apache ECharts |
| Highly custom visualizations | D3.js — only when ECharts is insufficient |
| Mathematical equation rendering | KaTeX |
| 3D model format | GLB / glTF |
| 3D asset optimization | Draco / Meshopt |

## Educational Content

| Purpose | Technology |
|---|---|
| Theory content | Markdown / structured database content |
| Equations | KaTeX |
| Dynamic formulas / calculators | TypeScript formula engine |
| Interactive graphs | ECharts |
| 3D simulations | Three.js + React Three Fiber |
| 3D assets | GLB / glTF |
| Images | Supabase Storage |
| Videos | Supabase Storage initially |
| Adaptive video streaming | HLS later if required |
| Questions | PostgreSQL |

## Content Architecture

Use a reusable content-block architecture.

```text
Subject
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock[]
```

Supported content block types:

```text
THEORY
IMAGE
GRAPH
FORMULA
THREE_D
VIDEO
QUESTIONS
```

Frontend renderer architecture:

```text
ContentBlock
 ├── TheoryRenderer
 ├── ImageRenderer
 ├── GraphRenderer
 ├── FormulaRenderer
 ├── ThreeDRenderer
 ├── VideoRenderer
 └── QuestionRenderer
```

Do not create a separate hard-coded React page for every lesson.

## Database Model

Core tables:

```text
users
subjects
chapters
topics
content_blocks
questions
formulas
student_subjects
student_progress
```

Optional specialized configuration tables:

```text
graph_config
formula_config
three_d_asset
video_asset
```

Access model:

```text
Student
  ↓
StudentSubject
  ↓
Subject
  ↓
Chapter
  ↓
Topic
  ↓
ContentBlock
```

Subject access must be enforced by backend authorization and PostgreSQL RLS.

## 3D Simulation Architecture

Default architecture:

```text
React
  ↓
React Three Fiber
  ↓
Three.js
  ↓
WebGL
  ↓
GPU
  ↓
Screen
```

Simulation controls:

```text
Start
Pause
Reset
Speed
Parameters
```

React handles UI controls and configuration.

Three.js handles:

```text
3D objects
positions
rotations
animations
particles
rendering
```

Simulation constraints:

- Keep simulations within controlled limits.
- Limit particle/object counts where necessary.
- Limit simulation duration where necessary.
- Avoid unnecessarily complex physics calculations.
- Optimize 3D models before production use.
- Profile real browser performance before introducing advanced optimization.

### Explicitly excluded for the initial version

```text
Web Workers — NOT used initially
WebGPU — NOT used initially
```

If future simulations become too computationally expensive, these can be introduced later based on measured performance requirements.

## Formula Architecture

```text
Formula
  ↓
Formula Definition
  ↓
Input Variables
  ↓
TypeScript Calculation Engine
  ↓
Result
```

Do not hard-code formula calculations inside random React components.

## Graph Architecture

Use ECharts for standard interactive graphs.

Examples:

```text
x/y parameter changes
real-time graph updates
zoom
tooltips
multiple curves
parameter sliders
```

Use D3.js only when ECharts cannot provide the required custom visualization.

## Video Architecture

Initial:

```text
Video
  ↓
Supabase Storage
  ↓
CDN
  ↓
Student
```

Do not proxy large video files through Next.js API routes.

Later, if the video library or traffic requires it:

```text
Video
  ↓
Encoding
  ↓
HLS
  ↓
CDN
  ↓
Student
```

## Performance Strategy

- Use Next.js Server Components by default.
- Use Client Components only for interactive UI.
- Lazy-load 3D, graph, and video components.
- Keep simulation calculations lightweight and bounded.
- Limit particle/object counts for browser simulations.
- Avoid React state updates on every animation frame.
- Keep animation/render loops inside Three.js.
- Optimize GLB assets with Draco/Meshopt.
- Serve large media directly from Supabase Storage/CDN.
- Cache frequently accessed server data where useful.
- Avoid unnecessary React re-renders.
- Profile performance before adding architectural complexity.

## Security

| Requirement | Technology |
|---|---|
| Authentication | Supabase Auth |
| Authorization | PostgreSQL RLS |
| API validation | Zod |
| Secrets | Vercel Environment Variables |
| Roles | ADMIN / STUDENT |

Never rely only on frontend visibility for access control.

## Testing

| Purpose | Technology |
|---|---|
| Unit testing | Vitest |
| Integration testing | Vitest |
| End-to-end testing | Playwright |

## Monitoring

| Purpose | Technology |
|---|---|
| Error monitoring | Sentry |
| Database/platform monitoring | Supabase Monitoring |
| Deployment/runtime logs | Vercel Logs |

## Development Principles

- Prefer simple architecture over premature optimization.
- Use Next.js as the primary application layer.
- Use Supabase for PostgreSQL, authentication, and storage.
- Use reusable content blocks instead of hard-coded lesson pages.
- Use Three.js + React Three Fiber for 3D.
- Use ECharts for standard interactive graphs.
- Keep browser simulations bounded by practical constraints.
- Add advanced performance technologies only after profiling demonstrates a real need.

## Initial Stack Summary

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
Motion
Zustand
TanStack Query
Zod

Supabase
├── PostgreSQL
├── Auth
├── Storage
└── Realtime (when required)

Drizzle ORM

Three.js
React Three Fiber
WebGL
ECharts
D3.js (when required)
KaTeX

GLB / glTF
Draco / Meshopt

Vitest
Playwright
Sentry
Vercel
```

## Explicitly Not in Initial Stack

```text
Spring Boot
Express
Fastify
Separate Node.js backend
Microservices
Web Workers
WebGPU
Kafka
Kubernetes
Elasticsearch
Separate authentication service
Separate file server
Multiple databases
```
