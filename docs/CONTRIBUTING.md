# Contributing

## Branch Strategy

- `main` — production-ready code
- Feature branches: `feature/<name>` branched from `main`
- Bug fixes: `fix/<name>` branched from `main`

## Commit Conventions

We follow conventional commits:

```
feat: add Stripe payment integration
fix: resolve wizard auto-save race condition
refactor: extract shared Button component
docs: update architecture documentation
chore: update dependencies
```

## Code Style

### TypeScript
- Strict mode enabled (`strict: true`)
- `verbatimModuleSyntax` — use `import type` for type-only imports
- No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
- Prefer explicit return types on exported functions

### Tailwind CSS
- Use utility classes over custom CSS wherever possible
- Glassmorphism via `glass` and `glass-strong` utility classes
- Custom brand colors via `brand-*` and `gold-*` tokens
- Dark/light mode via `html.light` and `html.dark` class selectors

### Component Patterns
- Each feature module is self-contained
- Pages live in `src/modules/<feature>/`
- Shared UI primitives live in `src/components/ui/`
- API calls go through `src/services/` — pages never call `fetch()` directly
- Shared hooks live in `src/hooks/`
- Types live in `src/types/`

## How to Add a New Module

1. Create `src/modules/<name>/` directory
2. Add page component(s) with the `Page` suffix (e.g., `SettingsPage.tsx`)
3. If it needs API calls, add a service file in `src/services/`
4. If it needs shared types, add them to `src/types/`
5. Register the route in `src/app/routes.tsx`

## Before Submitting

- [ ] `bun run build` succeeds
- [ ] `bun run publish` serves correctly on port 3000
- [ ] All existing routes return 200
- [ ] No TypeScript errors
- [ ] No unused imports or variables
