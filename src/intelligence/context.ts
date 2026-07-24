// Context Builder — normalizes, cleans, and enriches raw wizard data
// into a structured EnrichedContext ready for prompt construction.
// Model-agnostic: no AI/LLM imports here.

import type { EnrichedContext, CompetitorInfo, DerivedInsights } from "./types";

interface WizardDataRaw {
  company: {
    name: string;
    description: string;
    industry: string;
    products_services: string;
    country: string;
  };
  vision: {
    mission: string;
    vision: string;
    core_values: string;
    business_goals: string;
    brand_goals: string;
  };
  audience: {
    target_audience: string;
    pain_points: string;
    desires: string;
    competitors: string;
    usp: string;
    competitive_advantages: string;
  };
  personality: {
    brand_personality: string[];
    tone_of_voice: string[];
    keywords: string[];
    never_keywords: string[];
  };
  inspirations: {
    brands: { name: string; admire: string[] }[];
    confused_with: string;
    emotions: string[];
  };
  visual: {
    preferred_colors: string[];
    avoid_colors: string[];
    typography: string[];
    existing_assets: string;
    logo_references: string;
  };
  goals: {
    website_goals: string;
    marketing_goals: string;
    existing_url: string;
    social_networks: string;
  };
}

export function buildContext(data: WizardDataRaw): EnrichedContext {
  const neverKeywords: string[] = (data.personality?.never_keywords ?? []).map((k) => k.toLowerCase().trim());
  const strippedWords: string[] = [];

  // Strip forbidden words from company name, description, and industry
  const cleanName = stripForbiddenWords(data.company?.name ?? "", neverKeywords, strippedWords);
  const cleanDescription = stripForbiddenWords(data.company?.description ?? "", neverKeywords, strippedWords);
  const cleanIndustry = stripForbiddenWords(data.company?.industry ?? "", neverKeywords, strippedWords);

  // Parse competitors string into structured format
  const competitors = parseCompetitors(data.audience?.competitors ?? "");

  // Derive insights
  const derived = deriveInsights(data, cleanIndustry);

  // Add stripped words to derived
  derived.strippedWords = [...new Set(strippedWords)];

  return {
    company: {
      name: cleanName || (data.company?.name ?? ""),
      description: cleanDescription || (data.company?.description ?? ""),
      industry: cleanIndustry || (data.company?.industry ?? ""),
      productsServices: data.company?.products_services ?? "",
      country: data.company?.country ?? "",
    },
    vision: {
      mission: data.vision?.mission ?? "",
      vision: data.vision?.vision ?? "",
      coreValues: data.vision?.core_values ?? "",
      businessGoals: data.vision?.business_goals ?? "",
      brandGoals: data.vision?.brand_goals ?? "",
    },
    audience: {
      targetAudience: data.audience?.target_audience ?? "",
      painPoints: data.audience?.pain_points ?? "",
      desires: data.audience?.desires ?? "",
      competitors,
      usp: data.audience?.usp ?? "",
      competitiveAdvantages: data.audience?.competitive_advantages ?? "",
    },
    personality: {
      brandPersonality: data.personality?.brand_personality ?? [],
      toneOfVoice: data.personality?.tone_of_voice ?? [],
      keywords: data.personality?.keywords ?? [],
      neverKeywords: data.personality?.never_keywords ?? [],
    },
    inspirations: {
      brands: data.inspirations?.brands ?? [],
      confusedWith: data.inspirations?.confused_with ?? "",
      emotions: data.inspirations?.emotions ?? [],
    },
    visual: {
      preferredColors: data.visual?.preferred_colors ?? [],
      avoidColors: data.visual?.avoid_colors ?? [],
      typography: data.visual?.typography ?? [],
      existingAssets: data.visual?.existing_assets ?? "",
      logoReferences: data.visual?.logo_references ?? "",
    },
    goals: {
      websiteGoals: data.goals?.website_goals ?? "",
      marketingGoals: data.goals?.marketing_goals ?? "",
      existingUrl: data.goals?.existing_url ?? "",
      socialNetworks: data.goals?.social_networks ?? "",
    },
    derived,
  };
}

// ---- Internal helpers ----

function stripForbiddenWords(
  text: string,
  neverKeywords: string[],
  collected: string[]
): string {
  if (!text || neverKeywords.length === 0) return text;

  let result = text;

  for (const word of neverKeywords) {
    if (!word || word.length < 3) continue; // skip very short words to avoid false positives

    // Case-insensitive whole-word replacement
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
    if (regex.test(result)) {
      collected.push(word);
      result = result.replace(regex, "").trim();
    }
  }

  // Clean up double spaces and trailing punctuation
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/^[,;&\s]+/, "").replace(/[,;&\s]+$/, "");

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseCompetitors(raw: string): CompetitorInfo[] {
  if (!raw || raw.trim().length === 0) return [];

  // Split by common delimiters: commas, semicolons, or newlines
  const parts = raw
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return parts.map((name) => ({ name, notes: "" }));
}

function deriveInsights(data: WizardDataRaw, cleanIndustry: string): DerivedInsights {
  const personality = data.personality ?? {};
  const traits: string[] = (personality.brand_personality ?? []).map((t) => t.toLowerCase());
  const toneOfVoice: string[] = (personality.tone_of_voice ?? []).map((t) => t.toLowerCase());
  const allToneWords = [...traits, ...toneOfVoice];

  // Developer-friendly detection
  const devIndustries = [
    "developer tools", "devtools", "dev tools", "api", "saas",
    "cloud", "infrastructure", "platform", "open source",
  ];
  const devTones = ["witty", "direct", "casual", "informal", "irreverent", "technical"];
  const isDevIndustry = devIndustries.some((d) => cleanIndustry.toLowerCase().includes(d));
  const isDevTone = devTones.some((d) => allToneWords.includes(d));
  const developerFriendly = isDevIndustry || isDevTone;

  // Premium brand detection
  const premiumWords = ["premium", "luxury", "high-end", "elegant", "refined", "sophisticated", "exclusive"];
  const premiumTone = premiumWords.some((p) => allToneWords.includes(p));
  const goalsRaw = data.goals ?? {};
  const premiumGoals = [goalsRaw.website_goals, goalsRaw.marketing_goals]
    .filter(Boolean)
    .some((g) => premiumWords.some((p) => g.toLowerCase().includes(p)));
  const premiumBrand = premiumTone || premiumGoals;

  // Contradiction hints (lightweight — full check is in validator)
  const contradictions: string[] = [];
  if (traits.includes("bold") && traits.includes("gentle")) {
    contradictions.push('Traits "Bold" and "Gentle" may conflict');
  }
  if (traits.includes("playful") && traits.includes("serious")) {
    contradictions.push('Traits "Playful" and "Serious" may conflict');
  }

  // Missing critical fields
  const missingCriticalFields: string[] = [];
  const audience = data.audience ?? {};
  const vision = data.vision ?? {};
  if (!audience.target_audience || audience.target_audience.trim().length === 0) {
    missingCriticalFields.push("target_audience");
  }
  if (!audience.usp || audience.usp.trim().length === 0) {
    missingCriticalFields.push("usp");
  }
  if (!vision.mission || vision.mission.trim().length === 0) {
    missingCriticalFields.push("mission");
  }

  return {
    developerFriendly,
    premiumBrand,
    contradictions,
    missingCriticalFields,
    strippedWords: [], // populated by caller
  };
}
