// Input Validator — runs BEFORE generation.
// Checks required fields, detects contradictions, flags missing data.
import type { ValidationResult, ValidationIssue } from "./types";

// ---- Contradiction detection pairs ----
// Each pair: if both words appear across personality traits + keywords,
// they may be contradictory.
const CONTRADICTING_PAIRS: [string, string][] = [
  ["bold", "gentle"],
  ["bold", "subtle"],
  ["playful", "serious"],
  ["playful", "formal"],
  ["modern", "traditional"],
  ["modern", "classic"],
  ["minimal", "maximal"],
  ["minimal", "ornate"],
  ["loud", "quiet"],
  ["loud", "subtle"],
  ["aggressive", "gentle"],
  ["aggressive", "soft"],
  ["premium", "budget"],
  ["premium", "affordable"],
  ["luxury", "budget"],
  ["luxury", "accessible"],
  ["edgy", "safe"],
  ["edgy", "conservative"],
  ["innovative", "traditional"],
  ["disruptive", "conservative"],
];

// Premium-associated colors whose presence in avoid_colors
// may conflict with a "Premium" or "Luxury" personality.
const PREMIUM_COLORS = ["gold", "black", "silver", "white", "cream", "ivory"];

export function validate(data: Record<string, any>): ValidationResult {
  const issues: ValidationIssue[] = [];

  // --- Required fields (hard errors) ---
  checkRequired(data, issues);

  // --- Contradictions (warnings) ---
  checkContradictions(data, issues);

  // --- Premium tone vs avoid-color conflicts ---
  checkPremiumColorConflict(data, issues);

  // --- Missing important fields (info) ---
  checkMissingFields(data, issues);

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    valid: !hasErrors,
    issues,
  };
}

function checkRequired(data: Record<string, any>, issues: ValidationIssue[]): void {
  const company = data.company ?? {};

  if (!company.name || String(company.name).trim().length === 0) {
    issues.push({
      field: "company.name",
      message: "Company name is required to generate a brand strategy.",
      severity: "error",
    });
  }

  if (!company.description || String(company.description).trim().length < 10) {
    issues.push({
      field: "company.description",
      message: "A detailed company description (at least 10 characters) is required.",
      severity: "error",
    });
  }

  if (!company.industry || String(company.industry).trim().length === 0) {
    issues.push({
      field: "company.industry",
      message: "Industry is required for competitive context.",
      severity: "warning",
    });
  }
}

function checkContradictions(data: Record<string, any>, issues: ValidationIssue[]): void {
  const personality = data.personality ?? {};
  const traits: string[] = (personality.brand_personality ?? []).map((t: string) => t.toLowerCase());
  const keywords: string[] = (personality.keywords ?? []).map((k: string) => k.toLowerCase());
  const allWords = [...traits, ...keywords];

  for (const [a, b] of CONTRADICTING_PAIRS) {
    if (allWords.includes(a) && allWords.includes(b)) {
      issues.push({
        field: "personality.brand_personality",
        message: `Contradictory traits detected: "${a}" and "${b}" may pull the brand in opposite directions. Consider clarifying which is dominant.`,
        severity: "warning",
      });
    }
  }
}

function checkPremiumColorConflict(data: Record<string, any>, issues: ValidationIssue[]): void {
  const personality = data.personality ?? {};
  const visual = data.visual ?? {};

  const traits: string[] = (personality.brand_personality ?? []).map((t: string) => t.toLowerCase());
  const toneOfVoice: string[] = (personality.tone_of_voice ?? []).map((t: string) => t.toLowerCase());
  const allToneWords = [...traits, ...toneOfVoice];

  const isPremium = allToneWords.some((w) =>
    ["premium", "luxury", "luxurious", "high-end", "elegant", "refined", "sophisticated"].includes(w)
  );

  if (!isPremium) return;

  const avoidColors: string[] = (visual.avoid_colors ?? []).map((c: string) => c.toLowerCase());

  const conflictingColors = PREMIUM_COLORS.filter((pc) =>
    avoidColors.some((ac) => ac.includes(pc))
  );

  if (conflictingColors.length > 0) {
    issues.push({
      field: "visual.avoid_colors",
      message: `Premium/luxury positioning but avoiding ${conflictingColors.join(", ")} — these are classic premium palette colors. This may constrain the creative direction.`,
      severity: "info",
    });
  }
}

function checkMissingFields(data: Record<string, any>, issues: ValidationIssue[]): void {
  const audience = data.audience ?? {};
  const vision = data.vision ?? {};

  if (!audience.target_audience || String(audience.target_audience).trim().length === 0) {
    issues.push({
      field: "audience.target_audience",
      message: "Target audience not specified — strategy will be less precise.",
      severity: "info",
    });
  }

  if (!audience.usp || String(audience.usp).trim().length === 0) {
    issues.push({
      field: "audience.usp",
      message: "USP not specified — positioning may be weaker without it.",
      severity: "info",
    });
  }

  if (!audience.competitors || String(audience.competitors).trim().length === 0) {
    issues.push({
      field: "audience.competitors",
      message: "No competitors listed — competitive analysis will be generic.",
      severity: "info",
    });
  }

  if (!vision.mission || String(vision.mission).trim().length === 0) {
    issues.push({
      field: "vision.mission",
      message: "Mission statement missing — brand purpose may feel underdeveloped.",
      severity: "info",
    });
  }
}
