# Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (React SPA)                    │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Landing │ │   Auth   │ │  Wizard  │ │   Strategy    │  │
│  │  Page   │ │  Pages   │ │   Page   │ │   Results     │  │
│  └─────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│                         │                                   │
│                    API Calls (fetch)                        │
└─────────────────────────┼──────────────────────────────────┘
                          │
┌─────────────────────────┼──────────────────────────────────┐
│              Bun HTTP Server (serve.ts)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Auth    │ │ Projects │ │ Waitlist │ │ Static Files │  │
│  │  Routes  │ │   CRUD   │ │          │ │   (dist/)    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                         │                                   │
│                    bun:sqlite                                │
│                         │                                   │
│                    OpenAI GPT-4o                             │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure Deep-Dive

### `src/app/`
App shell — main entry point, route configuration, and React root. This layer is thin by design; it only wires together the feature modules.

### `src/components/`
- **`ui/`** — Reusable design primitives: Button, Card, Modal, Badge, Input, Chip, Spinner. These are pure presentational components with no business logic.
- **`layout/`** — Navbar, Footer, ThemeToggle. Used across multiple pages.
- **`shared/`** — Placeholder for future shared non-UI components.

### `src/modules/`
Feature modules — each is a self-contained domain with its own pages.
- **`auth/`** — Signup and login pages, magic-link flow.
- **`landing/`** — Landing/marketing page + 404.
- **`dashboard/`** — Project list, status badges, delete flow.
- **`discovery/`** — 8-step brand discovery wizard with auto-save.
- **`strategy/`** — AI generation polling + strategy results with scroll-spy TOC.

### `src/services/`
API & business logic layer. All API calls live here, separated by domain. Pages never call `fetch()` directly — they go through services.

### `src/hooks/`
Shared React hooks:
- `useAuth` — session check, redirect on unauthenticated
- `useScrollSpy` — IntersectionObserver-based active section tracking
- `useLocalStorage` — typed localStorage with auto-save pattern

### `src/lib/`
Pure utility functions with no React dependencies:
- `cn` — className merge
- `format` — timeAgo, formatDate

### `src/types/`
Centralized TypeScript types organized by domain: auth, project, API.

## Key Design Decisions

### Why Vite + React (not Next.js)
Vite is lighter on sandbox memory. For an SPA with a separate Bun API server, Vite is the right abstraction — no SSR complexity, fast builds, excellent dev experience.

### Why bun:sqlite
Zero-config, zero-dependency database. Perfect for MVP. No Docker, no connection strings. The database file lives in `.run/brandforge.db` and is excluded from git.

### Why Magic-Link Auth
Passwordless auth removes friction. Users enter email, click a link, and are signed in. In development, the magic link URL is logged to the server console.

## Data Flow: Wizard → API → AI → Results

```
1. User fills out Brand Discovery Wizard (8 steps)
   ↓ (auto-saved to localStorage + backend every step)
2. User clicks "Generate My Brand Strategy"
   ↓ POST /api/projects/:id (status: "generating")
3. POST /api/projects/:id/generate
   ↓ Server builds prompt from wizard data → GPT-4o
4. Server writes strategy to project.data, sets status: "strategy_generated"
   ↓ Client polls GET /api/projects/:id/status every 2s
5. When strategyReady === true, client redirects to /project/:id/results
6. Results page renders 9-section strategy with scroll-spy TOC
```

## Component Hierarchy

```
App
├── LandingPage
│   ├── Navbar
│   │   └── ThemeToggle
│   ├── WaitlistForm
│   └── Footer
├── SignupPage / LoginPage
│   ├── Navbar
│   └── Footer
├── DashboardPage
│   ├── Navbar
│   ├── DeleteConfirmModal
│   │   ├── Modal
│   │   └── Button
│   └── Badge
├── WizardPage
│   ├── Navbar
│   ├── ChipsInput
│   ├── TagInput
│   ├── TextareaField
│   ├── TextField
│   ├── SelectField
│   └── ColorInput
├── ProjectGeneratingPage
│   └── Navbar
└── ProjectResultsPage
    ├── Navbar
    ├── ScoreRing
    ├── SectionCard
    └── StrategyContent
```

## API Route Map

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/send-magic-link` | Send magic link email |
| GET | `/api/auth/verify` | Verify magic link token |
| GET | `/api/auth/session` | Get current session |
| POST | `/api/auth/logout` | Clear session |
| POST | `/api/waitlist` | Join waitlist |
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/generate` | Trigger AI generation |
| GET | `/api/projects/:id/status` | Poll generation status |
