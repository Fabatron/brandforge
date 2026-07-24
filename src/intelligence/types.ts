// BrandForge AI — Intelligence Layer Types
// Model-agnostic domain types. Nothing OpenAI-specific belongs here.

// ---- Input Validation ----

export interface ValidationIssue {
  /** Field path (e.g., "company.name", "personality.brand_personality") */
  field: string;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// ---- Enriched Context ----

export interface CompetitorInfo {
  name: string;
  /** Any details the user provided about this competitor */
  notes: string;
}

export interface DerivedInsights {
  /** True if industry + tone suggests developer-friendly comms */
  developerFriendly: boolean;
  /** True if positioning/goals suggest premium positioning */
  premiumBrand: boolean;
  /** Personality traits that may conflict with each other */
  contradictions: string[];
  /** Important fields that are empty */
  missingCriticalFields: string[];
  /** Words that were stripped from company name / industry before prompting */
  strippedWords: string[];
}

/** Normalized, cleaned version of WizardData — ready for prompt construction */
export interface EnrichedContext {
  company: {
    name: string;
    description: string;
    industry: string;
    productsServices: string;
    country: string;
  };
  vision: {
    mission: string;
    vision: string;
    coreValues: string;
    businessGoals: string;
    brandGoals: string;
  };
  audience: {
    targetAudience: string;
    painPoints: string;
    desires: string;
    competitors: CompetitorInfo[];
    usp: string;
    competitiveAdvantages: string;
  };
  personality: {
    brandPersonality: string[];
    toneOfVoice: string[];
    keywords: string[];
    neverKeywords: string[];
  };
  inspirations: {
    brands: { name: string; admire: string[] }[];
    confusedWith: string;
    emotions: string[];
  };
  visual: {
    preferredColors: string[];
    avoidColors: string[];
    typography: string[];
    existingAssets: string;
    logoReferences: string;
  };
  goals: {
    websiteGoals: string;
    marketingGoals: string;
    existingUrl: string;
    socialNetworks: string;
  };
  derived: DerivedInsights;
}

// ---- Response Validation ----

export interface ResponseValidationResult {
  valid: boolean;
  /** Hard violations — forbidden words, forbidden colors, missing sections */
  violations: ValidationIssue[];
  /** Soft issues — lazy words, archetype diversity, DNA score concerns */
  warnings: ValidationIssue[];
}
