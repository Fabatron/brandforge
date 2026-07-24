// BrandForge AI — Intelligence Layer
// Public API surface for the Brand Intelligence preprocessing pipeline.
// Model-agnostic: no AI provider imports anywhere in this layer.

export type {
  ValidationIssue,
  ValidationResult,
  EnrichedContext,
  CompetitorInfo,
  DerivedInsights,
  ResponseValidationResult,
} from "./types";

export { validate } from "./validator";
export { buildContext } from "./context";
export { buildSystemPrompt, buildUserPrompt } from "./prompt";
export { validateResponse } from "./response";
