// Prompt Builder — assembles model-agnostic system and user prompts
// from enriched context. Does NOT import or depend on any AI provider.
// The caller is responsible for sending these prompts to whatever model is configured.

import type { EnrichedContext } from "./types";

export function buildSystemPrompt(): string {
  return `You are BrandForge AI, a world-class Brand Strategist with decades of experience at top branding agencies (Interbrand, Wolff Olins, Pentagram). You never produce generic or clichéd branding. You think deeply about what makes each business unique before you suggest anything.

CRITICAL RULES:
- NEVER use industry clichés (no coffee cups for coffee shops, no hexagons for tech, no scales for law firms, no dumbbells for fitness, no bar charts for finance, no crosses for healthcare, no leaves for eco brands, no swooshes for sports)
- Every recommendation must be justified by the company's specific strategy, positioning, and personality
- Be original. Be specific. Be memorable. Be provocative when the brand calls for it.
- Output must feel like it came from a $50,000 branding engagement, not a template.
- Think like a strategist first. Visuals come from strategy, not the other way around.
- Write with authority and sophistication. Use precise language. Avoid filler.

FORBIDDEN WORDS & COLORS:
- The client has provided a list of "anti-keywords" — words that must NEVER appear in your output. Treat these as absolute prohibitions, not suggestions. If the word appears in the client's own company description or industry label, find alternative vocabulary.
- The client has also listed "colors to avoid." Never recommend or praise these colors in the creative direction — even if they appear in the client's preferred palette. Reinterpret those hues through the brand strategy lens (e.g., if a dark navy is listed as preferred but "blue" is to be avoided, describe it as "deep midnight" or "near-black with indigo undertones" — never "blue").

DNA SCORE RULES:
- Use the FULL 1–10 range. A score of 10 means world-class, iconic, nearly impossible to improve. Reserve 9–10 for truly exceptional cases.
- Most early-stage brands should have at least one score of 5–6 and at least one score of 8–9. If every score is 7–9, you are not thinking critically.
- The Overall Score must be the mathematical average rounded to one decimal, not a separate subjective rating.

ARCHETYPE RULES:
- Do NOT default to Sage for every business. Sage is appropriate for knowledge-driven, truth-seeking brands — not for brands whose primary value is emotional, aesthetic, or experiential.
- Before selecting the primary archetype, identify at least 2 archetypes it is NOT and explain to yourself why. The user prompt will ask for this.
- The archetype must connect to specific details from the client's inputs, not generic industry associations.

BANNED LAZY WORDS — Never use these in any section:
- "game-changer," "revolutionize," "revolutionary," "disruptive"
- "seamless," "seamlessly"
- "cutting-edge," "best-in-class," "world-class" (except in direct quotes)
- "symphony" (unless literally about music), "sanctuary," "haven," "beacon"
- "elevate," "unlock," "supercharge," "turbocharge," "level up"
- "next-level," "best-of-breed," "industry-leading"`;
}

export function buildUserPrompt(ctx: EnrichedContext): string {
  const companyName = ctx.company.name || "This business";

  const competitorList =
    ctx.audience.competitors.length > 0
      ? ctx.audience.competitors.map((c) => c.name).join(", ")
      : ctx.audience.competitors.length === 0 && (ctx as any)._rawCompetitors
        ? (ctx as any)._rawCompetitors
        : "Not provided";

  // Build derived insights hints
  const derivedHints = buildDerivedHints(ctx);

  return `You are conducting a complete brand strategy engagement for a client. Below is everything you need to know from their Brand Discovery process. Produce a comprehensive, original brand strategy with every section below.

---

# CLIENT PROFILE

## Company
- Name: ${ctx.company.name || "Not provided"}
- Description: ${ctx.company.description || "Not provided"}
- Industry: ${ctx.company.industry || "Not provided"}
- Products/Services: ${ctx.company.productsServices || "Not provided"}
- Country: ${ctx.company.country || "Not provided"}

## Vision & Mission
- Mission: ${ctx.vision.mission || "Not provided"}
- Vision: ${ctx.vision.vision || "Not provided"}
- Core Values: ${ctx.vision.coreValues || "Not provided"}
- Business Goals: ${ctx.vision.businessGoals || "Not provided"}
- Brand Goals: ${ctx.vision.brandGoals || "Not provided"}

## Target Audience
- Target Audience: ${ctx.audience.targetAudience || "Not provided"}
- Pain Points: ${ctx.audience.painPoints || "Not provided"}
- Desires: ${ctx.audience.desires || "Not provided"}
- Known Competitors: ${competitorList}
- USP: ${ctx.audience.usp || "Not provided"}
- Competitive Advantages: ${ctx.audience.competitiveAdvantages || "Not provided"}

## Brand Personality & Voice
- Personality Traits: ${ctx.personality.brandPersonality?.join(", ") || "Not specified"}
- Tone of Voice: ${ctx.personality.toneOfVoice?.join(", ") || "Not specified"}
- Keywords (what the brand IS): ${ctx.personality.keywords?.join(", ") || "Not specified"}
- Anti-Keywords (what the brand is NOT): ${ctx.personality.neverKeywords?.join(", ") || "Not specified"}

## Inspirations
- Admired Brands: ${ctx.inspirations.brands?.map((b) => `${b.name}${b.admire.length ? ` (admired for: ${b.admire.join(", ")})` : ""}`).join("; ") || "None provided"}
- Brands They're Confused With: ${ctx.inspirations.confusedWith || "Not provided"}
- Desired Emotions: ${ctx.inspirations.emotions?.join(", ") || "Not specified"}

## Visual Direction
- Preferred Colors: ${ctx.visual.preferredColors?.join(", ") || "Not specified"}
- Colors to Avoid: ${ctx.visual.avoidColors?.join(", ") || "Not specified"}
- Typography Direction: ${ctx.visual.typography?.join(", ") || "Not specified"}
- Existing Assets: ${ctx.visual.existingAssets || "None"}
- Logo References/Ideas: ${ctx.visual.logoReferences || "None"}

## Goals
- Website Goals: ${ctx.goals.websiteGoals || "Not provided"}
- Marketing Goals: ${ctx.goals.marketingGoals || "Not provided"}
- Existing URL: ${ctx.goals.existingUrl || "None"}
- Social Networks: ${ctx.goals.socialNetworks || "None"}

${derivedHints}
---

# YOUR TASK

Produce a complete, premium brand strategy for ${companyName}. Write as if this is a $50,000 brand strategy engagement delivered by a senior strategist. Each section must be thorough (2-4 paragraphs where appropriate), original, and grounded in the specific inputs above. Never use generic or clichéd branding advice.

## ⛔ FORBIDDEN WORDS — DO NOT USE ANY OF THESE:
${ctx.personality.neverKeywords?.length ? ctx.personality.neverKeywords.map((w) => `- "${w}"`).join("\n") : "- (none specified)"}

These are ABSOLUTE prohibitions. If any of these words appear in the company description or industry label, use alternative vocabulary. Check your entire output against this list before finalizing.

## ⛔ COLORS TO AVOID:
${ctx.visual.avoidColors?.length ? ctx.visual.avoidColors.map((c) => `- ${c}`).join("\n") : "- (none specified)"}

Do not recommend or praise these colors in the Creative Direction section. If a preferred color could be interpreted as one of these (e.g., a dark navy vs "blue"), describe it without using the forbidden color name.

## DNA SCORE INSTRUCTIONS:
- Use the full 1–10 range. Scores of 5–6 are normal and healthy for early-stage brands.
- The Overall Score must equal the mathematical average of the 9 dimension scores (rounded to one decimal).
- At least one dimension should score 5–6; at least one should score 8–9. Not all 7–9.

## ARCHETYPE INSTRUCTIONS:
- Before choosing the primary archetype, identify 2 archetypes this brand is definitely NOT and briefly note why.
- Then choose the best-fit archetype and explain why it connects to the client's specific inputs.
- Do NOT default to Sage. Only choose Sage if the brand's primary value is knowledge and truth (e.g., research, education, data analysis).

Output EXACTLY in this format — use these section headers verbatim:

## EXECUTIVE SUMMARY
(2-3 powerful paragraphs capturing the brand's essence, market opportunity, and strategic direction. Make it compelling and specific.)

## BRAND POSITIONING
(Where this brand sits in the competitive landscape. What space it owns. Include an "only [brand] that [differentiator] for [audience]" positioning statement. 2-3 paragraphs.)

## BRAND DNA SCORE
Rate each dimension 1-10 with a one-line explanation:
- Positioning: [score]/10 — [explanation]
- Differentiation: [score]/10 — [explanation]
- Consistency: [score]/10 — [explanation]
- Memorability: [score]/10 — [explanation]
- Emotional Appeal: [score]/10 — [explanation]
- Trust: [score]/10 — [explanation]
- Premium Perception: [score]/10 — [explanation]
- Innovation: [score]/10 — [explanation]
- Market Fit: [score]/10 — [explanation]
- Overall Score: [score]/10 — [summary]

## BRAND ARCHETYPE
(Identify the primary archetype — Sage, Creator, Hero, Outlaw, Explorer, Magician, Ruler, Lover, Caregiver, Jester, Innocent, or Regular Guy/Girl. Explain WHY this archetype fits. Note any secondary archetype. Explain how this archetype should express itself in the brand's behavior, communication, and presence. 2-3 paragraphs.)

## BRAND PERSONALITY & VOICE
(Define the brand's character. How it speaks, how it behaves, what it never does. Include specific tone of voice guidelines with concrete examples — show a "do this, not that" example. 2-3 paragraphs.)

## MESSAGING FRAMEWORK
(Core brand message. 3-5 tagline options. Key messages for different audience segments. A concise elevator pitch. 2-4 paragraphs.)

## CUSTOMER PERSONAS
(2-3 detailed personas based on the target audience data. For each: Name, Role/Identity, Demographics summary, Goals, Frustrations, and how this brand fits their life. Be specific and avoid stereotypes. 3-5 paragraphs.)

## COMPETITIVE ANALYSIS
(For each named competitor, explain how ${companyName} differentiates. What the competitor does, what ${companyName} does differently, and the strategic advantage. If no competitors were named, analyze the competitive category generally. 2-4 paragraphs.)

## CREATIVE DIRECTION
(Visual concept summary. Color psychology rationale tied to the brand strategy. Typography direction. Shapes/symbolism and mood. Overall aesthetic. Use this exact phrase at least once: "The visual identity is inspired by..." Do NOT design a specific logo — this is the creative strategy that would inform design. 3-4 paragraphs.)`;
}

function buildDerivedHints(ctx: EnrichedContext): string {
  const hints: string[] = [];

  if (ctx.derived.developerFriendly) {
    hints.push(
      "- This brand operates in a developer-adjacent space. Communication should be technically credible, avoid marketing fluff, and respect the audience's intelligence. Developer-friendly humor and directness are valued."
    );
  }

  if (ctx.derived.premiumBrand) {
    hints.push(
      "- This brand positions as premium/luxury. Every recommendation should reflect elevated quality, exclusivity, and refined taste. Avoid mass-market language."
    );
  }

  if (ctx.derived.contradictions.length > 0) {
    hints.push(
      `- Note: the brand's inputs contain potential tensions: ${ctx.derived.contradictions.join("; ")}. Acknowledge these tensions in the strategy — great brands often live in productive tension between apparent opposites.`
    );
  }

  if (ctx.derived.missingCriticalFields.length > 0) {
    hints.push(
      `- The client did not provide: ${ctx.derived.missingCriticalFields.join(", ")}. Make reasonable strategic inferences where needed, but note any significant assumptions.`
    );
  }

  if (ctx.derived.strippedWords.length > 0) {
    hints.push(
      `- The following forbidden words were detected in the client's own company name or industry and have been removed from the profile above: ${ctx.derived.strippedWords.join(", ")}. Do NOT reintroduce them.`
    );
  }

  if (hints.length === 0) return "";

  return `## STRATEGIC CONTEXT (derived insights)\n${hints.join("\n")}\n`;
}
