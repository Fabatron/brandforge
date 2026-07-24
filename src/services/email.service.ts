// Email service — magic link emails are sent via Resend from serve.ts.
// The buildMagicLinkEmail() function and Resend integration live in serve.ts
// because the Bun HTTP server handles API routes directly (no separate backend).
// When migrating to a separate API layer, extract the email logic here.
export {};

// Re-export note: email sending is handled server-side in serve.ts:
// - buildMagicLinkEmail(magicUrl, email) — generates branded HTML email
// - Rate limiting: 3 requests per email per 5 minutes
// - Resend client configured from RESEND_API_KEY env var
