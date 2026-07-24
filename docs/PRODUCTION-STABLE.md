# Production Stable Modules

The following modules have been fully implemented, validated in the deployed environment, and accepted as production-ready. They are **frozen by default** — no changes should be made unless:

- A production bug is discovered
- A security vulnerability is found
- An explicit business requirement demands the change

Any improvement, refactoring, or enhancement idea for a stable module must first be proposed as a **backlog item** for future prioritization. It must not be implemented as part of another sprint.

---

## ✅ Production Stable

### Authentication
| Component | Status | Frozen |
|---|---|---|
| Magic Link Authentication | ✅ | Yes |
| Email Delivery (Resend) | ✅ | Yes |
| Session Management | ✅ | Yes |
| Logout Flow | ✅ | Yes |
| Rate Limiting | ✅ | Yes |
| Authentication API (`/api/auth/*`) | ✅ | Yes |
| Authentication Emails (branded HTML) | ✅ | Yes |
| X-Forwarded-Host URL resolution | ✅ | Yes |

---

## Development Rules

### 1. Stable modules are frozen by default
No engineer should modify a Production Stable module while working on another feature. If a change touches a frozen module, it must be justified and approved separately.

### 2. Scope discipline
Every sprint should modify only the modules directly related to its objective. A sprint adding logo generation should not touch authentication code. A sprint improving the results page should not refactor the wizard.

### 3. Regression prevention
Before modifying any stable module, clearly document:
- Why the change is necessary
- What risks it introduces
- What the expected impact is on existing behavior

### 4. Backlog first
Ideas, improvements, and refactoring proposals should never be implemented immediately. They belong in the backlog for future prioritization. The impulse to "fix this while I'm here" is the most common source of regressions.

### 5. Small, isolated changes
Prefer many small, focused pull requests over large mixed changes. A PR that changes authentication, the wizard, and the dashboard simultaneously is a red flag — it should be three PRs.

---

## Future Stable Modules

These modules are under active development or planned. They will be moved to Production Stable as each sprint completes and passes validation.

- ⬜ Discovery v2
- ⬜ Brand Intelligence
- ⬜ Creative Intelligence
- ⬜ Strategy Engine
- ⬜ Dashboard
- ⬜ Results Page
- ⬜ Frontend Experience
- ⬜ Visual Asset Engine
- ⬜ Brandbook
- ⬜ Website Engine
- ⬜ Marketing Assets
- ⬜ Payments

---

## Future Recommendations

*Not implemented — proposed for backlog discussion.*

- Consider adding automated smoke tests that run against stable modules on every PR to catch regressions early.
- Consider a `STABLE.md` marker file in each frozen module directory so engineers can see at a glance what's frozen without consulting this document.
- Consider tagging stable modules in the git history (e.g., `git tag auth/v1-stable`) for easy diffing when a change is proposed.
