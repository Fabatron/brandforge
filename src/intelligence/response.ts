// Response Validator — runs AFTER generation.
// Validates the raw LLM output for forbidden words, forbidden colors,
// section presence, and quality concerns.
// Model-agnostic: purely text/pattern analysis.

import type { EnrichedContext, ResponseValidationResult, ValidationIssue } from "./types";

// Lazy words that indicate low-quality output regardless of context
const LAZY_WORDS = [
  "game-changer",
  "revolutionize",
  "revolutionary",
  "disruptive",
  "seamless",
  "seamlessly",
  "cutting-edge",
  "best-in-class",
  "world-class",
  "symphony", // unless literally about music
  "sanctuary",
  "haven",
  "beacon",
  "elevate",
  "unlock",
  "supercharge",
  "turbocharge",
  "level up",
  "next-level",
  "best-of-breed",
  "industry-leading",
  "transformative",
  "preeminent",
  "esteemed",
  "captivating",
  "immersive",
  "unparalleled",
];

// Sections we expect to find in the output
const EXPECTED_SECTIONS = [
  "EXECUTIVE SUMMARY",
  "BRAND POSITIONING",
  "BRAND DNA SCORE",
  "BRAND ARCHETYPE",
  "BRAND PERSONALITY",
  "MESSAGING FRAMEWORK",
  "CUSTOMER PERSONAS",
  "COMPETITIVE ANALYSIS",
  "CREATIVE DIRECTION",
];

// Simple in-memory LRU of recent archetypes for diversity tracking
const recentArchetypes: string[] = [];
const MAX_ARCHETYPE_HISTORY = 5;

export function validateResponse(
  rawText: string,
  context: EnrichedContext
): ResponseValidationResult {
  const violations: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // --- 1. Forbidden words check ---
  checkForbiddenWords(rawText, context, violations);

  // --- 2. Forbidden colors check ---
  checkForbiddenColors(rawText, context, violations);

  // --- 3. Section presence check ---
  checkSectionPresence(rawText, warnings);

  // --- 4. Lazy words check (warnings) ---
  checkLazyWords(rawText, warnings);

  // --- 5. Archetype diversity (stub — warning only) ---
  checkArchetypeDiversity(rawText, warnings);

  // --- 6. DNA score inflation check (warning) ---
  checkDNAScoreInflation(rawText, warnings);

  return {
    valid: violations.length === 0,
    violations,
    warnings,
  };
}

function checkForbiddenWords(
  rawText: string,
  context: EnrichedContext,
  violations: ValidationIssue[]
): void {
  const neverKeywords = context.personality.neverKeywords ?? [];
  if (neverKeywords.length === 0) return;

  const lowerText = rawText.toLowerCase();

  for (const word of neverKeywords) {
    if (!word || word.length < 3) continue; // skip very short words
    const regex = new RegExp(`\\b${escapeRegex(word.toLowerCase())}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      violations.push({
        field: "strategy",
        message: `Forbidden word "${word}" found ${matches.length} time(s) in output: "${getContextAround(lowerText, word.toLowerCase())}"`,
        severity: "error",
      });
    }
  }
}

function checkForbiddenColors(
  rawText: string,
  context: EnrichedContext,
  violations: ValidationIssue[]
): void {
  const avoidColors = context.visual.avoidColors ?? [];
  if (avoidColors.length === 0) return;

  const lowerText = rawText.toLowerCase();

  for (const color of avoidColors) {
    if (!color || color.length < 3) continue;
    const regex = new RegExp(`\\b${escapeRegex(color.toLowerCase())}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      // Only flag if it appears in the creative direction section
      const creativeIdx = lowerText.indexOf("creative direction");
      if (creativeIdx === -1) {
        // No creative direction section? Flag it anyway but as warning
        violations.push({
          field: "strategy.creativeDirection",
          message: `Forbidden color "${color}" found ${matches.length} time(s) in output.`,
          severity: "warning",
        });
        continue;
      }

      // Check if any match is in the creative direction section
      const creativeSection = lowerText.slice(creativeIdx);
      const creativeMatches = creativeSection.match(regex);
      if (creativeMatches && creativeMatches.length > 0) {
        violations.push({
          field: "strategy.creativeDirection",
          message: `Forbidden color "${color}" recommended ${creativeMatches.length} time(s) in Creative Direction section.`,
          severity: "error",
        });
      }
    }
  }
}

function checkSectionPresence(
  rawText: string,
  warnings: ValidationIssue[]
): void {
  for (const section of EXPECTED_SECTIONS) {
    const hasSection =
      rawText.includes(`## ${section}`) ||
      rawText.includes(`# ${section}`) ||
      rawText.toLowerCase().includes(section.toLowerCase());

    if (!hasSection) {
      warnings.push({
        field: "strategy.sections",
        message: `Expected section "${section}" not found in output.`,
        severity: "warning",
      });
    }
  }
}

function checkLazyWords(
  rawText: string,
  warnings: ValidationIssue[]
): void {
  const lowerText = rawText.toLowerCase();
  const found: string[] = [];

  for (const word of LAZY_WORDS) {
    const regex = new RegExp(`\\b${escapeRegex(word.toLowerCase())}\\b`, "gi");
    if (regex.test(lowerText)) {
      found.push(word);
    }
  }

  if (found.length > 0) {
    warnings.push({
      field: "strategy.language",
      message: `Lazy/banned words found: ${found.join(", ")}. Consider regenerating for higher quality.`,
      severity: "warning",
    });
  }
}

function checkArchetypeDiversity(
  rawText: string,
  warnings: ValidationIssue[]
): void {
  // Extract archetype from text
  const archetypeMatch = rawText.match(
    /(?:primary|brand)\s+archetype\s*(?:is|:)?\s*(?:the\s+)?(\w+(?:\s+\w+)?)/i
  );
  const archetype = archetypeMatch?.[1]?.trim();

  if (!archetype) return;

  // Track in LRU
  recentArchetypes.push(archetype.toLowerCase());
  if (recentArchetypes.length > MAX_ARCHETYPE_HISTORY) {
    recentArchetypes.shift();
  }

  // Check for Sage default
  if (archetype.toLowerCase() === "sage") {
    const sageCount = recentArchetypes.filter((a) => a === "sage").length;
    if (sageCount >= 3) {
      warnings.push({
        field: "strategy.archetype",
        message: `Archetype "Sage" has been used ${sageCount} of the last ${recentArchetypes.length} generations. Consider reviewing for archetype diversity.`,
        severity: "warning",
      });
    }
  }
}

function checkDNAScoreInflation(
  rawText: string,
  warnings: ValidationIssue[]
): void {
  // Extract DNA scores using regex
  const scorePattern = /(\w[\w\s]+?):\s*(\d{1,2})\s*\/?\s*10/gi;
  const scores: { name: string; value: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = scorePattern.exec(rawText)) !== null) {
    const name = match[1].trim().toLowerCase();
    const value = parseInt(match[2], 10);
    if (value >= 1 && value <= 10 && name !== "overall score") {
      scores.push({ name, value });
    }
  }

  if (scores.length === 0) return;

  const allHigh = scores.every((s) => s.value >= 7);
  const hasPerfect = scores.some((s) => s.value === 10);

  if (allHigh) {
    warnings.push({
      field: "strategy.dnaScore",
      message: `All ${scores.length} DNA scores are 7+. The full 1–10 range should be used. Early-stage brands typically have at least one 5–6.`,
      severity: "warning",
    });
  }

  if (hasPerfect) {
    const perfectScores = scores.filter((s) => s.value === 10);
    if (perfectScores.length > 1) {
      warnings.push({
        field: "strategy.dnaScore",
        message: `${perfectScores.length} scores are 10/10. A score of 10 means world-class, iconic — nearly impossible to improve. Reserve this for truly exceptional cases.`,
        severity: "warning",
      });
    }
  }
}

function getContextAround(text: string, word: string): string {
  const idx = text.indexOf(word);
  if (idx === -1) return word;
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + word.length + 30);
  let excerpt = text.slice(start, end);
  if (start > 0) excerpt = "..." + excerpt;
  if (end < text.length) excerpt = excerpt + "...";
  return excerpt;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
