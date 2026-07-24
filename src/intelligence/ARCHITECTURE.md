# Brand Intelligence Layer — Architecture Decision

**Date:** 2026-07-24
**Decision:** 4 components (not 5)

## Proposal vs. Decision

The lead proposed 5 components: Input Validator, Context Builder, Prompt Builder, Response Validator, Quality Checker.

After evaluation, **Quality Checker is merged into Response Validator** for v1. Rationale:

1. **80/20 principle** — Both check post-generation output quality. Separating them adds indirection without meaningful benefit at this stage.
2. **Unified output interface** — The Response Validator returns two tiers: hard `violations` (forbidden words, forbidden colors, missing sections) and soft `warnings` (lazy words, DNA score inflation, archetype diversity). This is the full quality picture in one pass.
3. **Extensible** — When the Quality Checker needs more sophisticated scoring (cross-strategy comparison, benchmark metrics), it can be extracted as a standalone module without changing the Response Validator's API.

## Final Architecture (v1)

```
src/intelligence/
├── index.ts          — Public API re-exports
├── types.ts          — Shared domain types (model-agnostic)
├── validator.ts      — Input Validator (pre-generation)
├── context.ts        — Context Builder (normalize, clean, enrich)
├── prompt.ts         — Prompt Builder (model-agnostic prompt assembly)
└── response.ts       — Response Validator + Quality Checks (post-generation)
```

## Data Flow

```
wizard data (snake_case JSON)
  → validator.validate(data)           — blocks if required fields missing
  → context.build(data)                — normalize, strip forbidden words, derive insights
  → prompt.build(context)              — model-agnostic system + user prompts
  → OpenAI / any LLM                   — caller manages API interaction
  → response.validate(text, context)   — violations + warnings
  → parseStrategyResponse(text)        — parse into structured sections (in serve.ts)
  → store with validation metadata
```

## Model-Agnostic Boundary

- Everything in `src/intelligence/` is model-agnostic
- No OpenAI imports anywhere in the intelligence layer
- `serve.ts` is the only file that references OpenAI — it calls the prompts + sends them to the API
- Future models (Claude, Gemini, etc.) only require changes in `serve.ts`, not in the intelligence layer

## Key Design Decisions

1. **Field normalization:** Wizard uses snake_case (`products_services`, `brand_personality`). Context builder normalizes to camelCase internally. The EnrichedContext is the canonical model-agnostic representation.

2. **Forbidden word stripping:** Happens in context builder BEFORE the LLM sees the data. Company name, industry, and description are cleaned. If "Drift Wellness" has "wellness" as forbidden, the LLM sees "Drift" and "Health & Sleep Technology".

3. **Validation is non-blocking in v1:** Post-generation violations are logged and stored in metadata but don't block the strategy from being displayed. This is intentional — we don't have a UI for regeneration yet. When we do, violations can trigger auto-retry.

4. **Derived insights:** The context builder adds deterministic signals (developerFriendly, premiumBrand, contradictions) that the prompt builder includes as strategic context hints. This is model-agnostic enrichment.

5. **Archetype diversity:** Maintains an in-memory LRU of recent archetypes. When Sage appears 3+ times in the last 5 generations, a warning is emitted. This is a v1 stub — future versions can persist this and bias prompt construction.
