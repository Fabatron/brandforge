# BrandForge AI

AI-powered branding consultant that thinks like a strategist before it ever draws a pixel. Users walk through an intelligent brand discovery questionnaire, and the platform generates a complete brand strategy — positioning, personality, voice, archetype, competitive analysis, creative direction — before any visual asset exists.

## Quick Start

```bash
bun install
bun run dev       # Start dev server
bun run publish   # Build & serve on port 3000
bun run go-live   # Deploy to production (requires VERCEL_TOKEN)
```

## Tech Stack

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **Routing:** React Router v7
- **Backend:** Bun HTTP server with bun:sqlite
- **AI:** OpenAI GPT-4o
- **Deployment:** Vercel (via `bun run go-live`)

## Project Structure

```
src/
├── app/               # App shell (App, main, routes)
├── components/
│   ├── ui/            # Reusable primitives (Button, Card, Modal, Badge, etc.)
│   ├── layout/        # Layout components (Navbar, Footer, ThemeToggle)
│   └── shared/        # Shared non-ui components
├── modules/           # Feature modules — each self-contained
│   ├── auth/          # Signup, Login
│   ├── landing/       # Landing page
│   ├── dashboard/     # Project dashboard
│   ├── discovery/     # Brand discovery wizard
│   ├── strategy/      # Strategy generation & results
│   ├── brandbook/     # (future)
│   ├── logo/          # (future)
│   ├── website/       # (future)
│   ├── assets/        # (future)
│   └── exports/       # (future)
├── services/          # API & business logic
├── hooks/             # Shared React hooks
├── lib/               # Pure utilities
├── types/             # Centralized TypeScript types
├── styles/            # Global styles
└── assets/            # Static assets
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed architecture deep-dive.

## Live Preview

[brandforge-preview](https://873a6a5a1f4a73dfc17d8df34339809a.ctonew.app)
