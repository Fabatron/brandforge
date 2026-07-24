// BrandForge AI — Production server.
// Serves the Vite-built SPA from dist/ with API routes for auth + DB.
// Run `bun run build` before starting. Restart with `bun run publish`.
import { Database } from "bun:sqlite";
import { randomBytes, createHash } from "node:crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const PORT = 3000;
const HOST = "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist`;

// --- Database setup ---
const DB_PATH = `${import.meta.dir}/.run/brandforge.db`;
let db: Database;

function getDb(): Database {
  if (!db) {
    db = new Database(DB_PATH, { create: true });
    db.run("PRAGMA journal_mode=WAL");
    db.run("PRAGMA foreign_keys=ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  const d = getDb();
  d.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT
    )
  `);

  // Check existing projects schema and migrate if needed
  const existingSchema = d.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='projects'").get() as { sql: string } | null;
  const needsMigration = existingSchema && !existingSchema.sql.includes("'error'");

  if (needsMigration) {
    // Save existing data
    d.run("ALTER TABLE projects RENAME TO projects_old");
    d.run(`
      CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name TEXT NOT NULL DEFAULT 'Untitled Brand',
        status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','generating','strategy_generated','error')),
        data TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    d.run("INSERT INTO projects (id, user_id, name, status, data, created_at, updated_at) SELECT id, user_id, name, status, data, created_at, updated_at FROM projects_old");
    d.run("DROP TABLE projects_old");
  } else if (!existingSchema) {
    d.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name TEXT NOT NULL DEFAULT 'Untitled Brand',
        status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','generating','strategy_generated','error')),
        data TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }

  d.run(`
    CREATE TABLE IF NOT EXISTS magic_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

// --- Session tokens ---
const sessions = new Map<string, { email: string; userId: number; createdAt: number }>();

function createSession(email: string, userId: number): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { email, userId, createdAt: Date.now() });
  return token;
}

function getSession(token: string) {
  const s = sessions.get(token);
  if (!s) return null;
  // 7 day expiry
  if (Date.now() - s.createdAt > 7 * 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return null;
  }
  return s;
}

// --- Rate limiter ---
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 3;

  // Purge expired entries
  const timestamps = rateLimitMap.get(email)?.filter((t) => now - t < windowMs) ?? [];

  if (timestamps.length >= maxRequests) return false;

  timestamps.push(now);
  rateLimitMap.set(email, timestamps);
  return true;
}

// Periodic cleanup of stale rate limit entries (every 10 minutes)
setInterval(() => {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [email, timestamps] of rateLimitMap) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) rateLimitMap.delete(email);
    else rateLimitMap.set(email, fresh);
  }
}, 10 * 60 * 1000);

// --- Email builder ---
function buildMagicLinkEmail(magicUrl: string, email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to BrandForge AI</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <!-- Logo / Wordmark -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:700;color:#e2e8f0;letter-spacing:-0.5px;">BrandForge <span style="color:#6366f1;">AI</span></span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:rgba(30,41,59,0.7);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#e2e8f0;font-size:20px;font-weight:600;padding-bottom:16px;text-align:center;">
                    Sign in to BrandForge AI
                  </td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:15px;line-height:1.6;padding-bottom:32px;text-align:center;">
                    Click the button below to sign in to your BrandForge AI account. This link expires in 15 minutes and can only be used once.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${magicUrl}" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;white-space:nowrap;">Sign in to BrandForge AI</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#64748b;font-size:12px;line-height:1.6;padding-bottom:8px;text-align:center;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.08);border-radius:6px;">
                      <tr>
                        <td style="padding:12px 16px;color:#6366f1;font-size:12px;font-family:'SF Mono',Monaco,'Cascadia Code',monospace;word-break:break-all;">
                          ${magicUrl}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0 0 8px 0;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="color:#334155;font-size:11px;margin:0;">
                &copy; 2026 BrandForge AI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// --- Cookie helpers ---
function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

// --- OpenAI Strategy Generation ---

interface WizardData {
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

function buildSystemPrompt(): string {
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

function buildUserPrompt(data: WizardData): string {
  const companyName = data.company.name || "This business";

  return `You are conducting a complete brand strategy engagement for a client. Below is everything you need to know from their Brand Discovery process. Produce a comprehensive, original brand strategy with every section below.

---

# CLIENT PROFILE

## Company
- Name: ${data.company.name || "Not provided"}
- Description: ${data.company.description || "Not provided"}
- Industry: ${data.company.industry || "Not provided"}
- Products/Services: ${data.company.products_services || "Not provided"}
- Country: ${data.company.country || "Not provided"}

## Vision & Mission
- Mission: ${data.vision.mission || "Not provided"}
- Vision: ${data.vision.vision || "Not provided"}
- Core Values: ${data.vision.core_values || "Not provided"}
- Business Goals: ${data.vision.business_goals || "Not provided"}
- Brand Goals: ${data.vision.brand_goals || "Not provided"}

## Target Audience
- Target Audience: ${data.audience.target_audience || "Not provided"}
- Pain Points: ${data.audience.pain_points || "Not provided"}
- Desires: ${data.audience.desires || "Not provided"}
- Known Competitors: ${data.audience.competitors || "Not provided"}
- USP: ${data.audience.usp || "Not provided"}
- Competitive Advantages: ${data.audience.competitive_advantages || "Not provided"}

## Brand Personality & Voice
- Personality Traits: ${data.personality.brand_personality?.join(", ") || "Not specified"}
- Tone of Voice: ${data.personality.tone_of_voice?.join(", ") || "Not specified"}
- Keywords (what the brand IS): ${data.personality.keywords?.join(", ") || "Not specified"}
- Anti-Keywords (what the brand is NOT): ${data.personality.never_keywords?.join(", ") || "Not specified"}

## Inspirations
- Admired Brands: ${data.inspirations.brands?.map(b => `${b.name}${b.admire.length ? ` (admired for: ${b.admire.join(", ")})` : ""}`).join("; ") || "None provided"}
- Brands They're Confused With: ${data.inspirations.confused_with || "Not provided"}
- Desired Emotions: ${data.inspirations.emotions?.join(", ") || "Not specified"}

## Visual Direction
- Preferred Colors: ${data.visual.preferred_colors?.join(", ") || "Not specified"}
- Colors to Avoid: ${data.visual.avoid_colors?.join(", ") || "Not specified"}
- Typography Direction: ${data.visual.typography?.join(", ") || "Not specified"}
- Existing Assets: ${data.visual.existing_assets || "None"}
- Logo References/Ideas: ${data.visual.logo_references || "None"}

## Goals
- Website Goals: ${data.goals.website_goals || "Not provided"}
- Marketing Goals: ${data.goals.marketing_goals || "Not provided"}
- Existing URL: ${data.goals.existing_url || "None"}
- Social Networks: ${data.goals.social_networks || "None"}

---

# YOUR TASK

Produce a complete, premium brand strategy for ${companyName}. Write as if this is a $50,000 brand strategy engagement delivered by a senior strategist. Each section must be thorough (2-4 paragraphs where appropriate), original, and grounded in the specific inputs above. Never use generic or clichéd branding advice.

## ⛔ FORBIDDEN WORDS — DO NOT USE ANY OF THESE:
${data.personality.never_keywords?.length ? data.personality.never_keywords.map(w => `- "${w}"`).join("\n") : "- (none specified)"}

These are ABSOLUTE prohibitions. If any of these words appear in the company description or industry label, use alternative vocabulary. Check your entire output against this list before finalizing.

## ⛔ COLORS TO AVOID:
${data.visual.avoid_colors?.length ? data.visual.avoid_colors.map(c => `- ${c}`).join("\n") : "- (none specified)"}

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

function parseStrategyResponse(text: string): Record<string, any> {
  const sections: Record<string, any> = {};

  // Extract sections by headers
  const sectionPatterns: { key: string; header: string }[] = [
    { key: "executiveSummary", header: "EXECUTIVE SUMMARY" },
    { key: "brandPositioning", header: "BRAND POSITIONING" },
    { key: "brandDnaScore", header: "BRAND DNA SCORE" },
    { key: "brandArchetype", header: "BRAND ARCHETYPE" },
    { key: "brandPersonalityVoice", header: "BRAND PERSONALITY & VOICE" },
    { key: "messagingFramework", header: "MESSAGING FRAMEWORK" },
    { key: "customerPersonas", header: "CUSTOMER PERSONAS" },
    { key: "competitiveAnalysis", header: "COMPETITIVE ANALYSIS" },
    { key: "creativeDirection", header: "CREATIVE DIRECTION" },
  ];

  for (let i = 0; i < sectionPatterns.length; i++) {
    const { key, header } = sectionPatterns[i];
    const startIdx = text.indexOf(`## ${header}`) !== -1
      ? text.indexOf(`## ${header}`)
      : text.indexOf(`# ${header}`) !== -1
        ? text.indexOf(`# ${header}`)
        : text.toLowerCase().indexOf(header.toLowerCase());

    if (startIdx === -1) {
      sections[key] = "";
      continue;
    }

    // Find the start of content (after the header line)
    const headerEnd = text.indexOf("\n", startIdx);
    if (headerEnd === -1) { sections[key] = ""; continue; }

    let contentStart = headerEnd + 1;
    // Skip blank lines after header
    while (contentStart < text.length && text[contentStart] === "\n") contentStart++;

    // Find the next section header
    let contentEnd = text.length;
    for (let j = i + 1; j < sectionPatterns.length; j++) {
      const nextHeader = sectionPatterns[j].header;
      const nextIdx = text.indexOf(`## ${nextHeader}`, contentStart) !== -1
        ? text.indexOf(`## ${nextHeader}`, contentStart)
        : text.indexOf(`# ${nextHeader}`, contentStart) !== -1
          ? text.indexOf(`# ${nextHeader}`, contentStart)
          : text.toLowerCase().indexOf(nextHeader.toLowerCase(), contentStart);

      if (nextIdx !== -1 && nextIdx < contentEnd) {
        contentEnd = nextIdx;
        break;
      }
    }

    sections[key] = text.slice(contentStart, contentEnd).trim();
  }

  // Parse Brand DNA Score into structured object
  if (sections.brandDnaScore) {
    const dnaScores: Record<string, { score: number; explanation: string }> = {};
    const dnaLines = sections.brandDnaScore.split("\n");
    const scoreRegex = /(?:^[-*•]\s*)?(\w[\w\s]+?):\s*(\d{1,2})\s*\/?\s*10\s*[-–—]?\s*(.+)/i;

    for (const line of dnaLines) {
      const match = line.match(scoreRegex);
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
        const score = parseInt(match[2], 10);
        const explanation = match[3].trim();
        if (score >= 1 && score <= 10) {
          dnaScores[key] = { score, explanation };
        }
      }
    }
    sections.brandDnaScore = dnaScores;
  }

  return sections;
}

async function generateStrategy(projectId: number, userId: number): Promise<void> {
  const d = getDb();
  const project = d.query(
    "SELECT * FROM projects WHERE id = ? AND user_id = ?"
  ).get(projectId, userId) as any;

  if (!project) {
    console.error(`[BrandForge] Project ${projectId} not found for user ${userId}`);
    return;
  }

  // Parse data
  let wizardData: WizardData;
  try {
    wizardData = JSON.parse(project.data);
  } catch {
    console.error(`[BrandForge] Failed to parse project data for ${projectId}`);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[BrandForge] OPENAI_API_KEY not set — skipping generation");
    d.run("UPDATE projects SET status = 'error', data = ?, updated_at = datetime('now') WHERE id = ?", [
      JSON.stringify({
        ...JSON.parse(project.data),
        strategy: { error: "AI_API_KEY_MISSING", message: "OpenAI API key not configured. Please set OPENAI_API_KEY and try again." }
      }),
      projectId
    ]);
    return;
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(wizardData);

  // Try up to 2 times
  let responseText = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`[BrandForge] Generating strategy for project ${projectId} (attempt ${attempt + 1})...`);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[BrandForge] OpenAI API error (${response.status}): ${errBody.slice(0, 300)}`);
        if (attempt === 1) {
          // Final attempt failed
          d.run("UPDATE projects SET status = 'error', data = ?, updated_at = datetime('now') WHERE id = ?", [
            JSON.stringify({
              ...JSON.parse(project.data),
              strategy: {
                error: "AI_GENERATION_FAILED",
                message: `OpenAI API returned ${response.status}: ${errBody.slice(0, 200)}`
              }
            }),
            projectId
          ]);
          return;
        }
        // Wait then retry
        await Bun.sleep(2000);
        continue;
      }

      const json = await response.json() as any;
      responseText = json.choices?.[0]?.message?.content || "";

      if (!responseText) {
        console.error("[BrandForge] Empty response from OpenAI");
        if (attempt === 1) {
          d.run("UPDATE projects SET status = 'error', data = ?, updated_at = datetime('now') WHERE id = ?", [
            JSON.stringify({
              ...JSON.parse(project.data),
              strategy: { error: "EMPTY_RESPONSE", message: "AI returned an empty response after 2 attempts." }
            }),
            projectId
          ]);
          return;
        }
        await Bun.sleep(2000);
        continue;
      }

      // Success!
      break;
    } catch (err: any) {
      console.error(`[BrandForge] OpenAI call failed: ${err.message}`);
      if (attempt === 1) {
        d.run("UPDATE projects SET status = 'error', data = ?, updated_at = datetime('now') WHERE id = ?", [
          JSON.stringify({
            ...JSON.parse(project.data),
            strategy: { error: "AI_CALL_EXCEPTION", message: err.message || "Unknown error calling AI API" }
          }),
          projectId
        ]);
        return;
      }
      await Bun.sleep(2000);
    }
  }

  // Parse and save
  const strategy = parseStrategyResponse(responseText);
  const existingData = JSON.parse(project.data);

  const updatedData = {
    ...existingData,
    strategy: {
      ...strategy,
      generatedAt: new Date().toISOString(),
      rawResponse: responseText,
    },
  };

  d.run(
    "UPDATE projects SET status = 'strategy_generated', data = ?, updated_at = datetime('now') WHERE id = ?",
    [JSON.stringify(updatedData), projectId]
  );

  console.log(`[BrandForge] Strategy generated for project ${projectId} — ${responseText.length} chars`);
}

// --- API router ---
async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const cookies = parseCookies(req.headers.get("cookie"));

  // POST /api/auth/send-magic-link
  if (path === "/api/auth/send-magic-link" && req.method === "POST") {
    let body: { email?: string };
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return json({ error: "Valid email required" }, 400);
    }

    // Rate limit: max 3 per 5 minutes per email
    if (!checkRateLimit(email)) {
      return json({ error: "Too many requests. Please wait a few minutes." }, 429);
    }

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const d = getDb();
    // Upsert user
    const existing = d.query("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | null;
    let userId: number;
    if (existing) {
      userId = existing.id;
    } else {
      const r = d.run("INSERT INTO users (email) VALUES (?)", [email]);
      userId = Number(r.lastInsertRowId);
    }
    d.run("INSERT INTO magic_tokens (email, token, expires_at) VALUES (?, ?, ?)", [email, token, expiresAt]);

    // Build magic URL using the actual request host
    const host = req.headers.get("host") || `localhost:${PORT}`;
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const magicUrl = `${protocol}://${host}/api/auth/verify?token=${token}`;

    // Always log for debugging
    console.log(`[BrandForge] Magic link for ${email}: ${magicUrl}`);

    // Send real email via Resend
    if (!resend) {
      console.warn("[BrandForge] RESEND_API_KEY not set — email not sent. Magic link logged above.");
      return json({ error: "Email service not configured" }, 500);
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "BrandForge AI <onboarding@resend.dev>",
        to: [email],
        subject: "Sign in to BrandForge AI",
        html: buildMagicLinkEmail(magicUrl, email),
      });

      if (error) {
        console.error("[BrandForge] Resend error:", error);
        return json({ error: "Failed to send email. Please try again." }, 500);
      }

      console.log(`[BrandForge] Email sent to ${email} — Resend ID: ${data?.id}`);
      return json({ ok: true, message: "Check your email for a magic link." });
    } catch (err) {
      console.error("[BrandForge] Resend exception:", err);
      return json({ error: "Failed to send email. Please try again." }, 500);
    }
  }

  // GET /api/auth/verify?token=xxx
  if (path === "/api/auth/verify" && req.method === "GET") {
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "Missing token" }, 400);

    const d = getDb();
    const row = d.query(
      "SELECT id, email, expires_at, used FROM magic_tokens WHERE token = ?"
    ).get(token) as { id: number; email: string; expires_at: string; used: number } | null;

    if (!row || row.used || new Date(row.expires_at) < new Date()) {
      return new Response("Invalid or expired link.", { status: 400 });
    }
    d.run("UPDATE magic_tokens SET used = 1 WHERE id = ?", [row.id]);

    // Get or create user
    const user = d.query("SELECT id FROM users WHERE email = ?").get(row.email) as { id: number };
    d.run("UPDATE users SET last_login = datetime('now') WHERE id = ?", [user.id]);

    const sessionToken = createSession(row.email, user.id);
    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      `brandforge_session=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );
    // Redirect to wizard
    headers.set("Location", "/wizard");
    return new Response(null, { status: 302, headers });
  }

  // GET /api/auth/session
  if (path === "/api/auth/session" && req.method === "GET") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ user: null });
    const s = getSession(sessionToken);
    if (!s) return json({ user: null });
    return json({ user: { email: s.email, id: s.userId } });
  }

  // POST /api/auth/logout
  if (path === "/api/auth/logout" && req.method === "POST") {
    const sessionToken = cookies["brandforge_session"];
    if (sessionToken) sessions.delete(sessionToken);
    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      "brandforge_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );
    return json({ ok: true }, 200, headers);
  }

  // POST /api/waitlist
  if (path === "/api/waitlist" && req.method === "POST") {
    let body: { email?: string };
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return json({ error: "Valid email required" }, 400);
    }
    const d = getDb();
    d.run(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    try {
      d.run("INSERT INTO waitlist (email) VALUES (?)", [email]);
    } catch {
      // Already on waitlist — still ok
    }
    return json({ ok: true, message: "You're on the list!" });
  }

  // --- Project routes (auth-required) ---
  const projectMatch = path.match(/^\/api\/projects\/(\d+)$/);
  const projectGenerateMatch = path.match(/^\/api\/projects\/(\d+)\/generate$/);
  const projectStatusMatch = path.match(/^\/api\/projects\/(\d+)\/status$/);

  // GET /api/projects
  if (path === "/api/projects" && req.method === "GET") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const d = getDb();
    const rows = d.query(
      "SELECT id, user_id, name, status, data, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC"
    ).all(s.userId);
    return json({ projects: rows });
  }

  // POST /api/projects
  if (path === "/api/projects" && req.method === "POST") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    let body: { name?: string; status?: string; data?: unknown };
    try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

    const d = getDb();
    const name = body.name || "Untitled Brand";
    const status = body.status || "draft";
    const data = body.data ? JSON.stringify(body.data) : "{}";

    const r = d.run(
      "INSERT INTO projects (user_id, name, status, data) VALUES (?, ?, ?, ?)",
      [s.userId, name, status, data]
    );
    const project = d.query(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC LIMIT 1"
    ).get(s.userId);
    return json({ project }, 201);
  }

  // POST /api/projects/:id/generate — kick off async strategy generation
  if (projectGenerateMatch && req.method === "POST") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const projectId = Number(projectGenerateMatch[1]);
    const d = getDb();
    const existing = d.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?"
    ).get(projectId, s.userId);

    if (!existing) return json({ error: "Not found" }, 404);

    // Check if already generated
    const projectStatus = (existing as any).status;
    if (projectStatus === "strategy_generated") {
      return json({
        generating: false,
        message: "Strategy already generated",
        project: existing,
      });
    }

    // Set to generating
    d.run("UPDATE projects SET status = 'generating', updated_at = datetime('now') WHERE id = ?", [projectId]);

    // Fire async generation (don't await)
    generateStrategy(projectId, s.userId).catch((err) => {
      console.error(`[BrandForge] Async generation failed for ${projectId}:`, err);
    });

    return json({ generating: true, message: "Strategy generation started" });
  }

  // GET /api/projects/:id/status — lightweight polling endpoint
  if (projectStatusMatch && req.method === "GET") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const projectId = Number(projectStatusMatch[1]);
    const d = getDb();
    const project = d.query(
      "SELECT status, data FROM projects WHERE id = ? AND user_id = ?"
    ).get(projectId, s.userId) as any;

    if (!project) return json({ error: "Not found" }, 404);

    let strategyError: string | null = null;
    if (project.status === "error") {
      try {
        const d = JSON.parse(project.data);
        strategyError = d.strategy?.message || d.strategy?.error || "Unknown error";
      } catch { strategyError = "Unknown error"; }
    }

    return json({
      status: project.status,
      strategyReady: project.status === "strategy_generated",
      error: strategyError,
    });
  }

  // GET /api/projects/:id
  if (projectMatch && req.method === "GET") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const d = getDb();
    const project = d.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?"
    ).get(Number(projectMatch[1]), s.userId);
    if (!project) return json({ error: "Not found" }, 404);
    return json({ project });
  }

  // DELETE /api/projects/:id
  if (projectMatch && req.method === "DELETE") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const d = getDb();
    const existing = d.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?"
    ).get(Number(projectMatch[1]), s.userId);
    if (!existing) return json({ error: "Not found" }, 404);

    d.run("DELETE FROM projects WHERE id = ? AND user_id = ?", [Number(projectMatch[1]), s.userId]);
    return json({ ok: true });
  }

  // PUT /api/projects/:id
  if (projectMatch && req.method === "PUT") {
    const sessionToken = cookies["brandforge_session"];
    if (!sessionToken) return json({ error: "Unauthorized" }, 401);
    const s = getSession(sessionToken);
    if (!s) return json({ error: "Unauthorized" }, 401);

    const d = getDb();
    const existing = d.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?"
    ).get(Number(projectMatch[1]), s.userId);
    if (!existing) return json({ error: "Not found" }, 404);

    let body: { name?: string; status?: string; data?: unknown };
    try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

    const updates: string[] = [];
    const params: unknown[] = [];
    if (body.name !== undefined) { updates.push("name = ?"); params.push(body.name); }
    if (body.status !== undefined) { updates.push("status = ?"); params.push(body.status); }
    if (body.data !== undefined) { updates.push("data = ?"); params.push(JSON.stringify(body.data)); }
    updates.push("updated_at = datetime('now')");

    if (updates.length > 1) {
      params.push(Number(projectMatch[1]));
      d.run(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const updated = d.query("SELECT * FROM projects WHERE id = ?").get(Number(projectMatch[1]));
    return json({ project: updated });
  }

  return json({ error: "Not found" }, 404);
}

function json(data: unknown, status = 200, extraHeaders?: Headers) {
  const headers = extraHeaders ?? new Headers();
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

// --- Port management ---
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

// --- Main server ---
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const { pathname } = new URL(req.url);
        // API routes
        if (pathname.startsWith("/api/")) {
          return handleApi(req);
        }
        // Static files
        if (pathname !== "/") {
          const file = Bun.file(CLIENT_DIR + pathname);
          if (await file.exists()) return new Response(file);
        }
        // SPA fallback — serve index.html
        const indexFile = Bun.file(`${CLIENT_DIR}/index.html`);
        if (await indexFile.exists()) return new Response(indexFile);
        return new Response("Not found", { status: 404 });
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

// Warm up the DB on start
getDb();
console.log(`BrandForge AI serving on http://${HOST}:${String(PORT)}`);
