# BrandForge — Creative Intelligence Blueprint

**Version:** 1.0
**Status:** Design proposal — Creative Direction architecture
**Author:** Engineering (agent-engineer)
**Date:** 2026-07-24

---

## 1. Purpose

### What is the Creative Intelligence Layer?

The Creative Intelligence Layer is the bridge between *what a brand is* and *how it looks, moves, and feels*. It transforms the unstructured, narrative output of the Brand Strategy document into a **structured, dimensional framework of creative decisions** that every downstream visual module can consume programmatically.

If the Brand Intelligence Layer answers *"Who is this brand, and why does it matter?"*, the Creative Intelligence Layer answers *"How should this brand express itself through every sensory channel — sight, motion, texture, space?"*

### Why Does It Exist?

The current system has a critical gap. After the Brand Strategy is generated, the "Creative Direction" section is a single prose block — the LLM's unstructured narrative about colors, type, and mood. This is fine for a human to read, but it is **unconsumable by software**. A logo engine cannot parse narrative prose to determine shape language. A brandbook engine cannot extract typography philosophy from a paragraph of text.

The Creative Intelligence Layer exists to solve this: **take the strategic narrative, enrich it with deterministic rules, and produce a machine-readable Creative Direction object that is precise enough for code to act on and rich enough for designers to engage with.**

### How It Transforms Strategic Thinking Into Creative Direction

The transformation follows a strict chain of custody:

```
Brand Strategy (narrative)
  → Creative Intelligence Pipeline
    → Extract strategic signals (archetype, personality, emotions, etc.)
    → Map signals to creative dimensions via deterministic rules
    → Fill gaps with LLM-powered creative reasoning
    → Validate coherence (every choice must trace back to strategy)
  → Creative Direction Object (structured, dimensional)
```

This is not prompt engineering. It is **strategy-to-visual translation with rules, heuristics, and creative logic** — what a senior Creative Director does instinctively after reading a strategy document, but codified into a pipeline.

### Relationship to the Brand Intelligence Layer

| Concern | Brand Intelligence Layer | Creative Intelligence Layer |
|---------|--------------------------|----------------------------|
| **Answers** | What the brand IS | How the brand EXPRESSES itself |
| **Input** | Raw wizard data (snake_case JSON) | Completed Brand Strategy + EnrichedContext |
| **Output** | EnrichedContext + validated strategy text | CreativeDirection (structured object) |
| **Deterministic** | Validation, forbidden words, field normalization | Creative rules engine, archetype → visual mappings, palette rules |
| **LLM role** | Generate the full strategy narrative | Fill creative gaps (specific color values, font recs, illustration concepts) |
| **Model dependency** | Model-agnostic (OpenAI in serve.ts only) | Same boundary — intelligence layer is model-agnostic |
| **Architecture** | `src/intelligence/` (4 components) | `src/intelligence/creative/` (future: 5–6 components) |

The Creative Intelligence Layer consumes the `EnrichedContext` directly (not the narrative text), plus extracts key signals from the generated strategy text. This dual-source approach ensures it has both the raw structured data and the LLM's interpretive framing.

### Why Not Just Ask the LLM for Creative Direction?

We DO use the LLM — but in a structured, guided role, not a free-form one. The difference:

- **Without Creative Intelligence:** LLM gets strategy text + "give me creative direction" → produces a paragraph. Every future module must parse that paragraph independently. Inconsistency is guaranteed.
- **With Creative Intelligence:** LLM receives a dimensional framework with specific creative dimensions to fill, each constrained by deterministic rules derived from the strategy. The output is structured JSON, not prose. Every module reads the same structured object.

The Creative Intelligence Layer owns the *framework*. The LLM fills the *specifics within constraints*. This is the same pattern as the Brand Intelligence Layer: deterministic envelope, creative interior.

---

## 2. Guiding Principles

These principles govern every creative decision the layer makes. They are the creative equivalent of the Brand Intelligence principles.

### 1. Strategy Drives Creativity — No Decoration Without Purpose

Every visual choice — every color, every curve, every pixel of whitespace — must have a strategic reason that can be articulated in one sentence. "It looks good" is not a reason. "The generous whitespace mirrors the brand's value of clarity and gives the customer's eye room to focus on what matters" is a reason.

This is the cardinal rule: **if a creative decision cannot be traced to a strategic input, it must be questioned until it can — or removed.**

### 2. Every Visual Recommendation Must Have Strategic Justification

The Strategic Justification Map (Section 5) is not documentation — it is the mechanism by which the system guarantees every creative decision earns its place. When the Creative Intelligence Layer outputs a shape language of "predominantly circular forms," it must also output the chain of reasoning: *"Archetype: Caregiver → Emotional Driver: Nurturing, Safety → Shape Expression: Circles (no sharp edges, embracing, protective)"*.

### 3. One Confident Direction Over Dozens of Generic Alternatives

BrandForge does not generate 50 color palettes and let the founder choose. It generates **one palette** with a strategic rationale so compelling that the founder thinks, "Of course — that's exactly right." The goal is not options. The goal is *conviction*.

This means the Creative Intelligence Layer must reduce the infinite space of possible creative expressions to a single, defensible direction — and it must do so with enough rigor that the confidence is earned, not assumed.

### 4. Creativity Emerges From Understanding, Not From Prompt Engineering

The most distinctive creative directions come from unexpected connections: a Sage archetype brand in the funeral industry expressing wisdom through Bauhaus austerity rather than Victorian ornamentation. These connections cannot be engineered through prompt tricks. They emerge when the system deeply understands the brand's contradictions, tensions, and unique combination of inputs.

The Creative Intelligence Layer must therefore be designed to **surface productive tensions** — the spaces between what the brand is and what its industry expects — and let creative originality emerge from there.

### 5. Deterministic Where Possible, Creative Where Necessary

If a rule can produce the right answer, use the rule. If not, delegate to the LLM — but give it constraints tight enough that it cannot be wrong, only more or less inspired. Every dimension in the Creative Direction Framework must be tagged as **deterministic** (BrandForge-owned logic) or **creative** (LLM-filled within constraints). The goal is to shrink the creative surface area over time as more patterns are codified.

### 6. The System Is Model-Agnostic — The Taste Is Not

The Creative Intelligence Layer must work with any capable LLM (GPT-4o, Claude, Gemini, future models). But the *taste* — the creative standards, the anti-cliché rules, the quality bar — is BrandForge's proprietary asset. It lives in the deterministic rules engine, the archetype-to-visual mappings, the validation patterns. The LLM provides execution, not judgment.

### 7. Every Dimension Must Have a Consumer

No creative dimension should be defined unless at least one future module (Logo Engine, Visual Asset Engine, Brandbook, Website, Marketing Assets, Rebranding) consumes it. Dimensions without consumers are speculative overhead. Dimensions with multiple consumers are the highest-value investments — they create leverage.

### 8. The Creative Direction Must Be Self-Documenting

When a brandbook presents a color palette, it should not just show swatches — it should show the strategic reasoning: *"Deep Forest Green was chosen because it evokes the grounded wisdom of the Sage archetype while differentiating from the industry's default of clinical white."* The Creative Intelligence Layer must preserve the traceability from strategy to visual output so future modules can present it.

---

## 3. Creative Pipeline

The Creative Intelligence Layer is one stage in an end-to-end pipeline from strategy to final asset. Here is the full journey:

```
BRAND STRATEGY (narrative text + EnrichedContext)
        │
        ▼
CREATIVE INTELLIGENCE LAYER  ←── THIS BLUEPRINT
        │
        ├── Deterministic Rules Engine (archetype → visual mappings, palette rules, typography rules)
        ├── Creative LLM Pipeline (fills dimensions within constraints)
        ├── Coherence Validator (every choice traces to strategy)
        │
        ▼
CREATIVE DIRECTION (structured CreativeDirection object)
        │
        ├──────────────────────────────────────────────────────┐
        ▼                                                      ▼
VISUAL ASSET ENGINE                                    LOGO ENGINE
(Color palettes, type systems,                         (Logo concepts, lockups,
 iconography, design tokens)                           mark generation)
        │                                                      │
        └────────────┬─────────────────────────────────────────┘
                     ▼
                 BRANDBOOK ENGINE
         (Interactive brand guidelines with
          strategic justifications)
                     │
                     ├──────────────────────┐
                     ▼                      ▼
              WEBSITE ENGINE         MARKETING ASSETS
           (Premium websites         (Business cards, social
            from brand DNA)          templates, presentations)
```

### Stage-by-Stage Detail

---

#### Stage 1: Brand Strategy → Creative Intelligence

**Consumes:**
- `EnrichedContext` (structured, from the Brand Intelligence Layer)
- Raw strategy narrative text (from LLM generation)
- Key extracted signals: archetype, personality traits, tone of voice, emotions, keywords, never_keywords, brand inspirations, competitive analysis, customer personas

**Produces:**
- `CreativeDirection` — a structured object with ~25 creative dimensions across 5 layers (Emotional, Philosophical, System, Component, Atmospheric)
- `StrategicJustificationMap` — traceability from every creative dimension back to strategic inputs
- `CreativeCoherenceReport` — validation that all dimensions work together, no internal contradictions

**Decisions it makes (autonomously):**
- Which design philosophy maps to which archetype + personality combination
- Shape language from archetype (deterministic rules)
- Palette size, structure, and role rules (deterministic: primary + secondary + accent + neutral)
- Typography pairing architecture (deterministic: serif/sans pairings from archetype)
- White space philosophy from personality traits
- Brand energy level from emotions + archetype
- Accessibility minimums (contrast ratios)

**Decisions it makes (with LLM guidance):**
- Specific creative tension to emphasize (from contradictions detected)
- Materiality references that fit the brand world
- Photography direction nuance (subject, lighting, composition)
- Illustration style character within defined constraints
- Motion style energy and easing personality
- Specific color values within palette strategy
- Exact font recommendations within typography philosophy

**Connection to Brand Strategy:**
The Creative Intelligence Layer reads the strategy output not as a blob of text but as a set of extracted signals. It parses the archetype, personality traits, emotions, and competitive positioning from the strategy, cross-references them against the `EnrichedContext`, and uses both to drive dimensional decisions.

---

#### Stage 2: Creative Direction → Logo Engine

**Consumes:**
- Shape language (geometric/organic/typographic)
- Graphic language (visual vocabulary)
- Brand energy (intensity level)
- Design philosophy (Modernist, etc.)
- Logo sensibility (from discovery Q5.5)
- Logo references (from discovery Q5.6)
- Emotional positioning (the single feeling)
- Typography philosophy (for wordmarks)
- Color psychology strategy (for mark color)

**Produces:**
- Logo concepts (one confident direction with strategic rationale)
- Mark variations (primary, secondary, icon, favicon)
- Wordmark treatment
- Logo usage rules (clear space, minimum sizes, color variants)

**Decisions it makes:**
- Mark style (abstract, literal, typographic) — from logo sensibility + shape language
- Complexity level — from brand energy + design philosophy
- Line weight and detail — from white space philosophy + visual personality
- Color application — from color psychology strategy

**Connection to Creative Direction:**
The Logo Engine never needs to understand the full brand strategy. It receives a structured creative brief — specific dimensions like "shape language: predominantly circular, low complexity, generous negative space" — and generates within those guardrails. The creative decisions are pre-made; the Logo Engine executes.

---

#### Stage 3: Creative Direction → Visual Asset Engine

**Consumes:**
- Color psychology (palette strategy, not hex codes)
- Typography philosophy (type personality, not specific fonts)
- White space philosophy
- Visual personality
- Iconography style
- Materiality references
- Texture direction

**Produces:**
- Complete color palette system (primary, secondary, accent, neutral, semantic)
- Typography system (heading, body, UI, display pairings)
- Icon set direction and style guide
- Design tokens (spacing, radius, shadow, elevation)
- Illustration style guide
- Photography direction guide

**Decisions it makes:**
- Exact hex values — within palette strategy constraints
- Specific font selections — within typography philosophy
- Spacing scale — from white space philosophy
- Elevation/shadow system — from materiality + light direction

**Connection to Creative Direction:**
The Visual Asset Engine is the most direct consumer of Creative Direction. Almost every creative dimension feeds into at least one asset type. The engine's job is to take dimensional specifications and materialize them as usable design tokens and asset files.

---

#### Stage 4: Creative Direction → Brandbook Engine

**Consumes:**
- EVERY creative dimension (the brandbook is the comprehensive documentation)
- Strategic justification map (to show "why" alongside "what")
- All generated assets (logos, palettes, type systems)

**Produces:**
- Interactive brand guidelines website/app
- Print-ready brandbook PDF
- Do's and don'ts with visual examples
- Application examples (stationery, signage, digital)
- Brand story narrative (strategy-to-visual narrative arc)

**Decisions it makes:**
- Layout and presentation of guidelines (but brand-influenced: e.g., bold brand → bold brandbook layout)
- Which rules to emphasize based on brand priorities
- How to present strategic justifications alongside visual rules

**Connection to Creative Direction:**
The Brandbook is the primary consumer of the **Strategic Justification Map**. It doesn't just show what the brand looks like — it shows why. The Creative Intelligence Layer's traceability infrastructure is what makes this possible.

---

#### Stage 5: Creative Direction → Website Engine

**Consumes:**
- Visual personality
- White space philosophy
- Brand energy
- Composition principles
- Visual hierarchy
- Color psychology
- Typography philosophy
- Motion style
- Photography/illustration direction

**Produces:**
- Complete website design (layout, interactions, content hierarchy)
- Component library styled to brand
- Page templates (home, about, product, blog, etc.)
- Responsive behavior rules
- Micro-interaction patterns

**Decisions it makes:**
- Layout structure — from composition principles + visual hierarchy
- Content density — from white space philosophy
- Interaction energy — from brand energy + motion style
- Navigation architecture — from brand personality + website goals
- Hero treatment — from emotional positioning + visual personality

**Connection to Creative Direction:**
The Website Engine needs to know *how* the brand behaves spatially and interactively. The Creative Intelligence Layer defines the spatial and motion dimensions specifically to feed website and digital product design. Without it, every website template would either be generic or require manual creative direction.

---

#### Stage 6: Creative Direction → Marketing Assets

**Consumes:**
- Color psychology
- Typography philosophy
- Visual personality
- Composition principles
- Photography/illustration direction
- Brand energy (for campaign intensity)
- Materiality (for print assets)

**Produces:**
- Business card designs
- Presentation templates
- Social media templates
- Email templates
- Stationery system
- Campaign creative direction

**Decisions it makes:**
- Template layouts — from composition principles
- Asset-specific color application — from palette strategy
- Photography treatments — from photography direction
- Print finishes — from materiality references

**Connection to Creative Direction:**
Marketing assets must feel like the same brand across every touchpoint. The Creative Direction object is the single source of truth — every asset module reads from it, ensuring consistency without duplication of creative logic.

---

#### Stage 7: Creative Direction → Rebranding (Future)

**Consumes:**
- All creative dimensions (the target direction)
- Existing brand asset analysis
- Brand equity assessment
- Migration strategy inputs

**Produces:**
- Gap analysis: current vs. target creative direction
- Migration roadmap: which dimensions change, in what order
- Preservation rules: what stays, what evolves, what's replaced
- Communication narrative: how to tell the rebrand story

**Decisions it makes:**
- Evolution vs. revolution per dimension
- Migration sequencing (color first? logo first?)
- Stakeholder communication strategy

**Connection to Creative Direction:**
Rebranding requires a BEFORE and AFTER Creative Direction object. The gap between them determines the migration strategy. The Creative Intelligence Layer must support "creative direction diffing" — comparing two directions dimension by dimension to quantify the scope of change.

---

## 4. Creative Direction Framework

The Creative Direction object defines ~25 dimensions organized into 5 layers. Each dimension has a clear definition, strategic inputs that influence it, an example output, its decision type (deterministic vs. creative), and its consumer modules.

---

### Layer 0: THE ORGANIZING IDEA

Before any creative dimension is defined, the brand needs a center. This layer contains the single idea around which all creative expression organizes itself — the Brand Metaphor.

---

#### D0 — Brand Metaphor

**Definition:** The central organizing idea — a single word or short phrase that anchors every creative decision. The metaphor is not a tagline or a design philosophy. It is the idea that makes the philosophy coherent, the feeling that the visual language must serve, the thread that runs through every dimension.

**Strategic inputs:**
- Founder story (Q1.8, primary — the origin moment often contains the metaphor)
- Brand archetype (Q3.1, primary)
- Emotional positioning (D1, secondary — derived downstream but reinforces the metaphor)
- Brand promise (Q2.8, secondary)
- Core values (Q1.10, secondary)

**Example output:**
> "Brand Metaphor: 'The steady hand.' Every creative choice should feel steady, controlled, reassuring. Nothing rushed. Nothing uncertain. The brand is the calm presence in a chaotic industry — the hand that doesn't shake."

> "Brand Metaphor: 'The spark.' Every creative choice should feel energetic, catalytic, transformative. The brand doesn't just inform — it ignites. Small moments of brightness against an otherwise restrained visual world."

**Why this dimension exists:**
World-class brand identities are organized around a central metaphor. Apple's brand is organized around "simplicity" — it governs product design, packaging, and the Genius Bar experience. Nike's brand is organized around "movement" — the swoosh, the "Just Do It" ethic, the athlete photography. Without a central organizing idea, the 10+ creative dimensions are individually justified but collectively uncentered. The brand's creative direction becomes a list of good decisions rather than a single coherent vision.

**Decision type:** **Creative** — The LLM synthesizes the metaphor from the full strategic context, guided by: "must be a single word or short phrase, must connect to the founder's origin story, must be specific enough to guide creative decisions, must not be generic ('excellence,' 'innovation,' 'quality')."

**Consumer modules:** ALL modules. Every dimension consumes the Brand Metaphor as a coherence check: "Does this shape language serve the metaphor? Does this color palette express it? Does this typography feel like it?"

---

### Layer 1: EMOTIONAL LAYER

The Emotional Layer defines how the brand *feels* to encounter. These are the most upstream creative decisions — they influence everything below them.

---

#### D1 — Emotional Positioning

**Definition:** The single, dominant feeling the brand should evoke in a customer's first encounter. This is the emotional North Star — all other creative dimensions serve it.

**Strategic inputs:**
- Desired emotions (Q4.3, primary — selected by founder)
- Brand archetype (Q3.1, secondary — archetypes have innate emotional signatures)
- Brand promise (Q2.8, secondary — what the brand commits to deliver)
- Customer desires (Q2.3, secondary — what the customer secretly wants)

**Example output:**
> "Calm competence. The customer should feel they are in the hands of someone who knows exactly what they're doing — and can therefore relax."

**Decision type:** **Creative** — The LLM synthesizes the inputs into a single emotional sentence, guided by: "must name a single emotion, must connect to a specific customer desire, must be concrete enough that a designer could design to it."

**Consumer modules:** Logo Engine, Website Engine, Marketing Assets, Brandbook

---

#### D2 — Brand Energy

**Definition:** The intensity and character of the brand's presence — is it a whisper or a shout? A steady hum or a percussive beat? This governs animation energy, layout density, color saturation, and typographic weight.

**Strategic inputs:**
- Personality traits (Q3.2, primary — bold/calm/energetic/relaxed directly map to energy)
- Design sensibility sliders (Q5.1, primary — loud↔quiet, bold↔subtle)
- Tone of voice (Q3.3, secondary — witty/energetic tones amplify energy)
- Brand archetype (Q3.1, secondary — Jester and Outlaw have higher native energy; Caregiver and Innocent have lower)

**Deterministic mapping:**

| Archetype | Base Energy | Energy Character |
|-----------|------------|------------------|
| Hero | High | Propulsive, driving forward |
| Sage | Low–Medium | Steady, patient, deliberate |
| Creator | Medium–High | Generative, evolving |
| Innocent | Low | Gentle, soft, warm |
| Explorer | Medium–High | Adventurous, kinetic |
| Outlaw | High | Disruptive, aggressive, loud |
| Magician | Medium | Transformative, surprising |
| Ruler | Low–Medium | Controlled, commanding |
| Lover | Medium | Sensual, intimate, flowing |
| Jester | High | Playful, unpredictable, bouncy |
| Everyman | Medium | Steady, approachable, grounded |
| Caregiver | Low–Medium | Nurturing, warm, protective |

**Example output:**
> "Energy Level: 3/5. Character: Steady, deliberate, patient. The brand does not rush. It moves with the quiet confidence of someone who has nothing to prove. Transitions are smooth, not snappy. Animations ease in-out with generous duration. Nothing jars."

**Decision type:** **Deterministic** — Base energy is mapped from archetype, then modulated by personality traits (+1 for bold/energetic, -1 for calm/relaxed). The character description is LLM-generated within the numeric constraint.

**Consumer modules:** Logo Engine, Website Engine, Marketing Assets, Brandbook

---

#### D3 — Creative Tension

**Definition:** The productive contradiction that makes the brand interesting — the "but" that saves it from being one-dimensional. "Bold but warm." "Premium but approachable." "Technical but playful." Great brands live in this tension.

**Strategic inputs:**
- Detected contradictions (validator, primary — e.g., "bold" + "gentle")
- Personality traits (Q3.2, primary)
- Never keywords vs. keywords (Q3.7/Q3.8, secondary — e.g., "premium" keyword + "exclusive" never_keyword = premium-but-accessible tension)
- Inspiration brands aesthetic analysis (Q4.1, secondary)
- "You vs. your inspirations" gap (Section 5.6 of discovery blueprint, secondary)

**Example output:**
> "The brand exists in the tension between technical precision and human warmth. It is a Sage archetype that refuses to be cold — knowledge delivered with genuine care. Visually, this means geometric precision (grids, structure, order) softened by organic color transitions and warm, human photography."

**Decision type:** **Creative** — The LLM identifies and names the tension from contradiction signals. But the system provides guardrails: "If no contradictions were detected, the tension must still be defined — no brand should be one-dimensional. Find the tension in the gap between the brand's archetype and its industry's conventions."

**Consumer modules:** Logo Engine, Website Engine, Brandbook (the tension becomes a key narrative thread)

---

### D3a — Visual Rejection

**Definition:** What the brand must NEVER become visually — the explicit anti-patterns, forbidden aesthetics, and visual clichés that would undermine the brand's strategic position. Visual Rejection is the negative space of creative direction: defining what the brand is NOT is as important as defining what it IS.

**Strategic inputs:**
- Never keywords (Q3.8, primary — "corporate," "clinical," "aggressive")
- Color anti-palette (Q5.3, primary — colors explicitly avoided)
- "Don't Sound Like" test (Q3.6, secondary — voice anti-patterns often have visual equivalents)
- Industry context (Q1.4, secondary — what visual conventions dominate this industry?)
- Competitor analysis (Q2.4/Q2.5, secondary — what visual territory do competitors occupy?)
- Brand inspirations "what NOT to copy" field (Q4.1, secondary)

**Why this dimension exists:**
The discovery process captures what the brand rejects verbally (never_keywords) and chromatically (color anti-palette), but the Creative Intelligence Layer has no structured mechanism for visual rejection at the creative direction level. Without Visual Rejection, the system knows what to aim for but not what to avoid. A brand that explicitly rejects "corporate blue," "geometric sans typography," "smiling-at-computer photography," and "gradient-heavy UI" produces fundamentally different creative output than one without those constraints.

**Example output:**
> "Visual Rejection: This brand explicitly avoids:
> - **Colors:** Corporate blues (#0066CC range), clinical whites, neon anything
> - **Typography:** Geometric sans-serif (Futura, Montserrat — too cold), display serifs (too traditional)
> - **Photography:** Stock-style corporate imagery (handshakes, smiling-at-laptop, diverse-team-in-conference-room)
> - **UI patterns:** Heavy drop shadows, gradient buttons, glassmorphism
> - **Industry clichés:** Hexagons, circuit boards, abstract 'tech' geometric patterns
> - **Overall aesthetic:** 'Enterprise SaaS' — blue, white, geometric, impersonal"

**Decision type:** **Creative** — Synthesized by the LLM from never_keywords, color anti-palette, industry context, and competitive analysis. The constraint: "Every rejection must reference a specific strategic input. No rejection without a reason."

**Consumer modules:** ALL modules. Visual Rejection is a constraint object that every downstream module reads alongside the positive creative dimensions. The Logo Engine avoids rejected shapes. The Visual Asset Engine avoids rejected colors. The Website Engine avoids rejected UI patterns.

---

### Layer 2: PHILOSOPHICAL LAYER

The Philosophical Layer defines the school of thought and visual posture — the "ism" that governs how the brand presents itself.

---

#### D4 — Design Philosophy

**Definition:** The overarching school of thought that governs all visual decisions — the creative equivalent of the brand archetype. This is NOT a style; it's a philosophy with principles, rules, and a point of view.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Personality traits (Q3.2, primary)
- Design sensibility sliders (Q5.1, primary)
- Industry context (Q1.4, secondary)
- Brand inspirations (Q4.1, secondary)
- Competitive positioning (Q2.4–Q2.6, secondary)

**Deterministic mapping (archetype → philosophy):**

| Archetype | Primary Design Philosophy | Alternative |
|-----------|--------------------------|-------------|
| Hero | Modernist (bold, structural, purposeful) | Constructivist |
| Sage | Modernist (clarity, grid, rationality) | Swiss/International Style |
| Creator | Postmodern (expressive, rule-breaking) | Organic Modernism |
| Innocent | Organic (soft, natural, unforced) | Wabi-Sabi |
| Explorer | Brutalist/Raw (honest, unpolished) | Organic |
| Outlaw | Postmodern/Punk (confrontational) | Deconstructivist |
| Magician | Surrealist (unexpected, transformative) | Kinetic/Interactive |
| Ruler | Classical (proportional, timeless, authoritative) | Minimalist-Luxury |
| Lover | Sensualist (tactile, intimate, rich) | Art Nouveau |
| Jester | Pop/Playful (bright, irreverent) | Memphis |
| Everyman | Democratic Modernism (accessible, clear) | Scandinavian |
| Caregiver | Humanist (warm, approachable, kind) | Organic |

**Example output:**
> "Design Philosophy: Swiss/International Style with warmth. The brand adheres to a rigorous grid system, asymmetrical balance, and typographic clarity — but softens the austerity with warm color temperatures and generous photographic human presence. The philosophy is: 'Clarity is kindness. But clarity without warmth is coldness.'"

**Decision type:** **Deterministic** — The base philosophy is mapped from archetype. The nuance (the "but" that prevents cliché) is derived from personality traits and creative tension. The LLM writes the philosophical statement.

**Consumer modules:** ALL modules — this is the most foundational creative dimension.

---

#### D5 — Visual Personality

**Definition:** How the brand behaves visually — its mannerisms, its posture, its visual "voice." If Design Philosophy is the school of thought, Visual Personality is the attitude within that school.

**Strategic inputs:**
- Personality traits (Q3.2, primary)
- Tone of voice (Q3.3, primary)
- Brand archetype (Q3.1, secondary)
- Design sensibility sliders (Q5.1, secondary)

**Example output:**
> "Visual Personality: Quietly confident. The brand does not shout or demand attention. It stands still while others fidget. Typography is set with generous tracking — unhurried. Images have breathing room. Nothing competes. Every element knows its place and stays there. When the brand does make a bold move (a single accent color, a dramatic scale shift), it lands with impact precisely because of the surrounding restraint."

**Decision type:** **Creative** — The LLM synthesizes personality traits into a visual behavioral description. Guardrails: "Must describe HOW the brand behaves visually, not just what it looks like. Use behavioral verbs: dominates, recedes, whispers, gestures, stands, invites."

**Consumer modules:** Logo Engine, Website Engine, Marketing Assets, Brandbook

---

#### D6 — White Space Philosophy *(Folded into D4 — Design Philosophy)*

*White space philosophy is now a sub-field of Design Philosophy (D4). A brand's spatial posture — generous or tight, airy or dense — is a direct expression of its design philosophy. The deterministic rules (margin minimums, spacing ratios) are preserved within D4. See D4 for the integrated specification.*

**Definition:** The brand's relationship with empty space — how much breathing room, how dense or airy, what silence communicates. White space is not the absence of content; it's an active design element.

**Strategic inputs:**
- Design sensibility sliders (Q5.1, primary — airy↔dense, minimal↔maximal)
- Personality traits (Q3.2, secondary — "calm" and "minimal" increase white space; "bold" and "energetic" may decrease it)
- Brand archetype (Q3.1, secondary — Sage and Ruler favor generous space; Jester and Outlaw may fill it)
- Tone of voice (Q3.3, secondary — "minimal" tone → generous space)

**Deterministic mapping:**

| Archetype | White Space Default | Philosophy |
|-----------|-------------------|------------|
| Sage | Generous | Space to think |
| Ruler | Generous | Space commands respect |
| Creator | Variable | Space as canvas |
| Lover | Moderate–Generous | Space for intimacy |
| Innocent | Moderate | Breathable, not empty |
| Caregiver | Moderate | Welcoming, not overwhelming |
| Everyman | Moderate | Practical, not precious |
| Explorer | Variable | Space for discovery |
| Hero | Moderate–Tight | Space for action |
| Magician | Tight–Variable | Space for surprise |
| Jester | Tight | Space for energy |
| Outlaw | Tight–Variable | Space is a rule to break |

**Example output:**
> "White Space Philosophy: Generous. The brand uses space to signal confidence — it does not need to fill every inch. 60%+ negative space in layouts. Wide margins (minimum 80px at desktop). Generous paragraph spacing (1.75× line height). Content is framed, not crowded. The rule: if it can breathe, let it."

**Decision type:** **Deterministic** — Archetype gives the default. Sliders modulate it (airy +2 = increase default by one level; dense -2 = decrease by one level). The philosophy narrative is LLM-generated.

**Consumer modules:** Website Engine (layout grids), Marketing Assets (template designs), Brandbook (guideline examples), Logo Engine (clear space rules)

---

### Layer 3: SYSTEM LAYER

The System Layer defines the visual vocabulary and structural rules — the grammar of the brand's visual language.

---

#### D7+D8 — Visual Language (Graphic + Shape)

**Note:** Graphic Language and Shape Language have been merged into a single "Visual Language" dimension with two sub-fields: vocabulary (graphic devices, marks, patterns — the brand's visual accent) and grammar (shapes, forms, corner treatments — the brand's visual structure). This merge eliminates structural overlap while preserving creative richness. The original separate archetype mappings for both Graphic Language and Shape Language are preserved as sub-field defaults within the merged dimension.

---

**Definition (Vocabulary — Graphic):** The visual vocabulary the brand uses to communicate — what kinds of marks, shapes, patterns, and graphic devices are native to this brand. This is the "accent" of the visual identity.

**Definition (Grammar — Shape):** The predominant forms in the visual identity — circles, squares, triangles, curves, angles, organic forms. Shapes carry psychological meaning (circles = unity, protection; angles = precision, aggression; curves = flow, sensuality).

**Definition:** The visual vocabulary the brand uses to communicate — what kinds of marks, shapes, patterns, and graphic devices are native to this brand. This is the "accent" of the visual identity.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Personality traits (Q3.2, primary)
- Design sensibility — organic↔geometric slider (Q5.1, primary)
- Industry context (Q1.4, secondary — what graphic languages dominate this industry, so we can differentiate)

**Deterministic mapping:**

| Archetype | Graphic Language |
|-----------|-----------------|
| Hero | Bold geometric, structural, directional marks |
| Sage | Typographic, gridded, diagrammatic |
| Creator | Expressive, mixed-media, experimental |
| Innocent | Soft, rounded, illustration-forward |
| Explorer | Raw, photographic, textural, map-like |
| Outlaw | Disruptive, collaged, handwritten, graffiti |
| Magician | Ethereal, light-based, transformative, gradient |
| Ruler | Heraldic, symmetrical, linear, classical |
| Lover | Sensual, flowing, ornamental, decorative |
| Jester | Cartoonish, exaggerated, colorful, pattern-heavy |
| Everyman | Honest, straightforward, icon-forward |
| Caregiver | Gentle, organic, botanical, soft-edged |

**Example output:**
> "Graphic Language: Typographic-geometric hybrid. The primary vocabulary is precise typography treated as graphic element — oversized numerals, letterform fragments, text as texture. Secondary vocabulary: thin geometric linework (rules, borders, dividers) used sparingly. Photography is the emotional layer; typography is the structural layer. No illustrations. No icons beyond functional UI. The language is: words made visual."

**Decision type:** **Deterministic** — Archetype maps to language category. The organic↔geometric slider determines the balance. The LLM provides specific description within the category.

**Consumer modules:** Logo Engine, Visual Asset Engine, Brandbook, Website Engine, Marketing Assets

---

#### D8 — Shape Language *(Merged into D7+D8 — Visual Language)*

*This dimension has been merged with D7 (Graphic Language) into a single "Visual Language" dimension. See D7+D8 above. The shape language content below is preserved for reference within the merged dimension.* — circles, squares, triangles, curves, angles, organic forms. Shapes carry psychological meaning (circles = unity, protection; angles = precision, aggression; curves = flow, sensuality).

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Emotional positioning (D1, primary)
- Personality traits (Q3.2, secondary)
- Design sensibility — organic↔geometric slider (Q5.1, secondary)

**Deterministic mapping:**

| Archetype | Primary Shape | Secondary | Why |
|-----------|--------------|-----------|-----|
| Hero | Triangles, diagonals | Rectangles | Direction, upward movement, strength |
| Sage | Rectangles, squares | Circles (for balance) | Order, stability, reason |
| Creator | Organic, asymmetrical | All — mixed | Creativity resists a single shape |
| Innocent | Circles, rounded rects | Soft curves | Wholeness, safety, gentleness |
| Explorer | Organic, irregular | Lines/paths | Natural forms, journey |
| Outlaw | Sharp angles, irregular | Jagged, broken | Aggression, disruption |
| Magician | Spirals, radiating | Gradients, light | Transformation, revelation |
| Ruler | Symmetrical, centered | Rectangles, shields | Authority, permanence |
| Lover | Curves, figure-8 | Organic flowing | Sensuality, intimacy |
| Jester | Exaggerated circles | Irregular playful | Fun, unpredictability |
| Everyman | Rounded rectangles | Simple circles | Familiarity, honesty |
| Caregiver | Circles, soft curves | Organic | Nurturing, protection |

**Example output:**
> "Shape Language: Predominantly circular and rounded forms. Primary: perfect circles and pill shapes. Secondary: soft, generous corner radii on all rectangular elements (minimum 12px). Avoid: sharp corners below 8px radius, triangles, aggressive diagonals. The circle language communicates: unity, protection, completeness — directly reflecting the Caregiver archetype's nurturing posture."

**Decision type:** **Deterministic** — Archetype maps to primary shape. The LLM provides the rationale and specific application guidance.

**Consumer modules:** Logo Engine (primary consumer — mark shapes), Visual Asset Engine (iconography, UI shapes), Website Engine (button styles, card radii, decorative elements), Marketing Assets

---

#### D9 — Composition Principles

**Definition:** How visual elements relate to each other — the rules of arrangement. Symmetry or asymmetry? Layering or flatness? Centered or off-balance? This governs layout across every touchpoint.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Personality traits (Q3.2, primary)
- Design sensibility sliders (Q5.1, secondary)
- White space philosophy (D6, secondary)

**Deterministic mapping:**

| Archetype | Composition Default |
|-----------|-------------------|
| Hero | Asymmetrical dynamic (action-oriented, forward-leaning) |
| Sage | Asymmetrical balanced (grid-based, rational) |
| Creator | Asymmetrical expressive (unexpected, rule-breaking) |
| Innocent | Symmetrical or gently asymmetrical (balanced, peaceful) |
| Explorer | Asymmetrical organic (natural, unforced) |
| Outlaw | Asymmetrical aggressive (off-balance, confrontational) |
| Magician | Asymmetrical surprise (focal point manipulation) |
| Ruler | Symmetrical authoritative (centered, commanding) |
| Lover | Symmetrical or balanced asymmetrical (harmonious) |
| Jester | Asymmetrical playful (unpredictable, bouncing) |
| Everyman | Balanced asymmetrical (approachable, not formal) |
| Caregiver | Symmetrical gentle (comforting, predictable) |

**Example output:**
> "Composition Principles: Asymmetrical balanced. The brand uses a 12-column grid with elements weighted 7:5 or 5:7 — never centered, never 50:50. The heavier side carries the hero message; the lighter side carries supporting imagery or negative space. This creates a sense of confident forward motion — the brand is going somewhere, and the composition leads the eye there. No symmetrical lockups. No centered headlines."

**Decision type:** **Deterministic** — Archetype maps to composition category. Personality traits modulate (e.g., "bold" pushes toward more extreme asymmetry). The LLM writes the specific application guidance.

**Consumer modules:** Website Engine (layout system), Marketing Assets (template layouts), Brandbook (layout rules)

---

#### D10 — Visual Hierarchy *(Delegated to Website Engine)*

*Visual Hierarchy has been removed from the Creative Direction framework. Hierarchy is layout-specific, not brand-level — every page has different hierarchy needs. The Website Engine derives hierarchy from Visual Personality (D5) + Brand Energy (D2) + page-specific goals, not from a static Creative Direction field. The original specification below is preserved for reference.*

**Definition:** What dominates and what recedes — the rules for directing the viewer's attention. This is not just about size; it's about what the brand wants you to see first, second, and last.

**Strategic inputs:**
- Brand archetype (Q3.1, secondary)
- Personality traits (Q3.2, primary — "bold" brands push one dominant element; "minimal" brands have shallow hierarchy)
- Website goals (Q5.8, primary — lead-gen prioritizes CTAs; credibility prioritizes testimonials)
- Tone of voice (Q3.3, secondary)

**Example output:**
> "Visual Hierarchy: Single dominant element, then dramatic falloff. The primary message or image occupies 60-70% of visual weight. Secondary elements are deliberately subordinated — smaller, lighter, less saturated. This creates a clear 'read this first, then this, then this' path. The brand never makes the viewer hunt for what matters. The rule: every layout has exactly one hero, and everything else serves it."

**Decision type:** **Creative** — Synthesized from multiple inputs by the LLM. No single deterministic rule produces the hierarchy strategy; it emerges from the combination of personality, goals, and archetype.

**Consumer modules:** Website Engine (primary), Marketing Assets (template hierarchy), Brandbook

---

### Layer 4: COMPONENT LAYER

The Component Layer defines the individual building blocks of the visual identity. These are the most concrete dimensions — the ones that directly produce hex codes, font names, and asset specifications.

---

#### D11 — Color Psychology Strategy

**Definition:** The palette strategy, emotional associations, and color role assignments — NOT specific hex codes. This defines WHY colors are chosen, how many, and what job each color performs.

**Strategic inputs:**
- Preferred colors + reasons (Q5.2, primary)
- Avoid colors (Q5.3, primary)
- Brand archetype (Q3.1, primary)
- Emotional positioning (D1, primary)
- Desired emotions (Q4.3, secondary)
- Industry context (Q1.4, secondary — what colors dominate the industry?)
- Competitive colors (Q2.4/Q2.5, secondary — what colors do competitors use?)

**Deterministic rules:**

1. **Palette structure:** Always exactly: 1 Primary + 1–2 Secondary + 1 Accent + 2–4 Neutrals (light, medium, dark, warm/cool variant)
2. **Primary color:** Must come from founder's preferred colors. If none are suitable → flag for LLM to resolve.
3. **Accent color:** Must be the highest-contrast color relative to Primary — the "surprise" color.
4. **Industry differentiation:** If 3+ competitors in the same industry use the founder's preferred color range → recommend differentiation (shift hue, saturation, or value).
5. **Accessibility:** All text-on-background pairings must target WCAG AA minimum (4.5:1 for body text). This constraint is mathematically enforced, not creatively suggested.

**Example output:**
> "Color Psychology Strategy:
> - **Primary:** Deep forest green (#1B4332 range) — conveys grounded wisdom, growth, and natural authority. Directly reflects the Sage archetype's connection to deep knowledge.
> - **Secondary:** Warm stone (#D4C5B9 range) — softens the green's seriousness with approachable warmth, reflecting the 'warm Sage' personality.
> - **Accent:** Burnished copper (#C87D4B range) — unexpected warmth that signals craftsmanship and human touch. Only 5-10% of surface area. Used for CTAs and key highlights.
> - **Neutrals:** Warm off-white (#FAF7F2), charcoal (#2D2A26), warm gray (#8C8882), cool gray (#B8B4AE).
> - **Industry context:** Competitors overwhelmingly use blue (trust) and white (clinical). Forest green differentiates while still signaling credibility — nature's authority, not institutional authority.
> - **Accessibility:** Primary on off-white: ~8.2:1 (AAA). Charcoal on off-white: ~12:1 (AAA). Copper on charcoal: ~4.6:1 (AA — only for large text/CTAs)."

**Decision type:** **Mixed.** Palette structure and accessibility are **deterministic** (rules engine). Specific color selection and emotional rationale are **creative** (LLM within constraints). The LLM selects hex codes within the hue/value/saturation ranges determined by the rules engine.

**Consumer modules:** Visual Asset Engine (design tokens), Logo Engine (mark color), Website Engine (CSS custom properties), Marketing Assets, Brandbook

---

#### D12 — Typography Philosophy

**Definition:** The type personality, pairing architecture, and usage principles — NOT specific font names. This defines the character of the type system before any font is chosen.

**Strategic inputs:**
- Typography personality selection (Q5.4, primary — the type categories the founder chose)
- Brand archetype (Q3.1, primary)
- Personality traits (Q3.2, secondary)
- Tone of voice (Q3.3, secondary)
- Design philosophy (D4, secondary)

**Deterministic rules:**

1. **Pairing architecture:**
   - Serif heading + Sans body → brands with "traditional," "elegant," "sophisticated," "intellectual" traits
   - Sans heading + Serif body → brands with "modern," "clean," "minimal" traits (this is more common in digital)
   - Sans + Sans (contrasting styles) → brands with "contemporary," "precise," "neutral" traits
   - Single typeface → brands with "minimal," "unified," "confident" traits

2. **Weight range:** Driven by brand energy (D2):
   - High energy → wide weight range (Thin through Black)
   - Medium energy → medium range (Regular through Bold)
   - Low energy → narrow range (Light through Medium, or a single weight)

3. **Type scale:** Driven by white space philosophy (D6):
   - Generous space → larger type, bigger scale jumps (1.333 or 1.5 ratio)
   - Moderate space → standard scale (1.25 ratio)
   - Tight space → compact scale (1.125 or 1.2 ratio)

**Example output:**
> "Typography Philosophy:
> - **Pairing:** Humanist Sans (headings) + Grotesque Sans (body). Clean modernism tempered by human warmth.
> - **Heading character:** Generous tracking (50-100), sentence case, never all-caps. The type breathes.
> - **Body character:** Comfortable line height (1.6), maximum 75 characters per line. Generous paragraph spacing.
> - **Weight range:** Regular through Bold (4 weights). No light weights — the brand is confident, not delicate. No black weights — the brand doesn't shout.
> - **Type scale:** 1.25 ratio (Major Third). 6 steps: 12, 16, 20, 25, 31, 39px base. No display sizes — the brand values clarity over spectacle.
> - **Personality:** 'The type speaks clearly, warmly, and never rushes.'"

**Decision type:** **Mixed.** Pairing architecture, weight range, and type scale are **deterministic**. The character description and nuanced rationale are **creative** (LLM-synthesized). Font recommendations are delegated to the Visual Asset Engine.

**Consumer modules:** Visual Asset Engine (font selection), Logo Engine (wordmark), Website Engine (CSS typography), Marketing Assets, Brandbook

---

#### D13 — Iconography Style

**Definition:** The visual character of icons — line weight, complexity, fill behavior, corner treatment, and conceptual approach. Icons are the brand's smallest visual ambassadors.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Shape language (D8, primary)
- Graphic language (D7, primary)
- Personality traits (Q3.2, secondary)
- Design philosophy (D4, secondary)

**Deterministic mapping:**

| Archetype | Line Weight | Style | Complexity |
|-----------|------------|-------|------------|
| Hero | Bold (2-3px) | Filled or bold outline | Low–Medium |
| Sage | Regular (1.5-2px) | Outline, precise | Medium |
| Creator | Variable | Mixed, expressive | Medium–High |
| Innocent | Medium (2px) | Outline, rounded | Low |
| Explorer | Irregular | Hand-drawn, organic | Variable |
| Outlaw | Bold to irregular | Disruptive, mixed | Variable |
| Magician | Thin to bold | Gradient, glowing | Medium–High |
| Ruler | Regular (1.5-2px) | Outline or filled, proportional | Low–Medium |
| Lover | Thin to medium | Flowing, decorative | Medium |
| Jester | Bold, variable | Playful, exaggerated | Low–Medium |
| Everyman | Medium (2px) | Outline, straightforward | Low |
| Caregiver | Medium (2px) | Outline, soft, rounded | Low–Medium |

**Example output:**
> "Iconography Style: Regular weight (1.5px stroke), outline style, rounded caps and joins. Corner radius: 2px (slightly rounded, not pill-shaped). Complexity: low — every icon should be recognizable at 16px. No fill variants except for the accent color in selected states. Icons follow the shape language: predominantly circular forms, no sharp angles. Conceptual approach: literal-representational (a book looks like a book), not abstract — the brand values clarity over cleverness."

**Decision type:** **Deterministic** — Archetype maps to style parameters. The LLM provides the application guidance.

**Consumer modules:** Visual Asset Engine (icon generation), Website Engine (UI icons), Marketing Assets, Brandbook

---

#### D14 — Photography Direction

**Definition:** The visual character of photography — subject matter, lighting style, composition approach, color treatment, and emotional register. Photography carries the brand's human and emotional dimension.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Emotional positioning (D1, primary)
- Brand energy (D2, primary)
- Visual personality (D5, primary)
- Customer personas (from strategy, secondary — who is in the photos?)
- Industry context (Q1.4, secondary — what photography styles dominate?)

**Example output:**
> "Photography Direction:
> - **Subject matter:** People in moments of focused calm — working, thinking, creating. Never posed or looking at camera. Candid, observational, documentary-style.
> - **Lighting:** Natural, directional light (window light, golden hour). High-key but with shadow depth. No studio lighting, no flat commercial brightness.
> - **Composition:** Asymmetrical, negative-space-forward. Subject often placed in the left or right third with 60%+ breathing room. Shallow depth of field — the subject is in focus, the world is soft.
> - **Color treatment:** Warm-leaning but not sepia. Slightly desaturated (15-20%), lifted blacks. Consistent with the warm-stone secondary palette.
> - **Emotional register:** Calm competence. The people in these photos look capable but not intimidating. They're in flow, not performing.
> - **Industry differentiation:** Competitors use sterile stock photography (smiling-at-computer, handshake-in-lobby). This brand uses human, editorial, almost filmic photography — it feels like a magazine, not a SaaS homepage."

**Decision type:** **Creative** — Synthesized from multiple strategic dimensions by the LLM. No deterministic rule produces photography direction; the combination of inputs is too nuanced.

**Consumer modules:** Visual Asset Engine (photo selection guidance), Website Engine (hero/treatment imagery), Marketing Assets (campaign photography), Brandbook

---

#### D15 — Illustration Style

**Definition:** The visual character of illustrations — technique, complexity, role in the system, and conceptual approach. Illustrations fill the gap photography cannot (abstract concepts, product explanations, brand metaphor).

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Graphic language (D7, primary)
- Shape language (D8, secondary)
- Design philosophy (D4, secondary)
- Industry context (Q1.4, secondary)

**Example output:**
> "Illustration Style: Line-drawing with selective color. Technique: single-weight monoline (1.5px), continuous line where possible, with the accent color used to fill one key element per illustration. Complexity: medium — enough detail to be interesting, simple enough to read at small sizes. Conceptual approach: metaphorical, not literal. An illustration about 'growth' would show a root system spreading, not a bar chart going up. The illustrations should feel like they were drawn by a thoughtful human, not generated by a computer — slight imperfections are intentional. Consistent with the brand's 'warm Sage' positioning."

**Decision type:** **Creative** — LLM-synthesized. However, the style must not contradict the shape language or graphic language — these are constraints, not suggestions.

**Consumer modules:** Visual Asset Engine (illustration generation), Website Engine (hero/feature illustrations), Marketing Assets, Brandbook

---

#### D16 — Motion Style

**Definition:** How the brand moves — animation principles, transition character, easing personality, and energy level. Motion is the brand's body language.

**Strategic inputs:**
- Brand energy (D2, primary)
- Brand archetype (Q3.1, primary)
- Visual personality (D5, secondary)
- White space philosophy (D6, tertiary)

**Deterministic mapping:**

| Brand Energy | Easing | Duration | Character |
|-------------|--------|----------|-----------|
| High (4-5) | Ease-out, snappy | Fast (150-300ms) | Decisive, energetic |
| Medium (3) | Ease-in-out | Moderate (250-400ms) | Smooth, deliberate |
| Low (1-2) | Ease-in-out, gentle | Slow (400-800ms) | Patient, graceful |

| Archetype | Motion Character |
|-----------|-----------------|
| Hero | Forward momentum, upward trajectories |
| Sage | Reveal, deliberate unfolding |
| Creator | Morphing, transforming |
| Explorer | Panning, discovering, parallax |
| Outlaw | Glitch, disruption, unexpected |
| Magician | Dissolve, fade, magic-reveal |
| Ruler | Scale, authoritative presence |
| Lover | Float, drift, gentle sway |
| Jester | Bounce, spring, overshoot |
| Everyman | Slide, practical, straightforward |
| Caregiver | Fade, soft transitions |

**Example output:**
> "Motion Style:
> - **Easing:** Custom ease-in-out cubic-bezier (0.4, 0, 0.2, 1) — the standard material curve, but slightly slower.
> - **Duration:** 300ms for micro-interactions (hover, focus), 500ms for page transitions, 800ms for hero animations.
> - **Character:** Reveal-based. Elements don't 'pop in' — they are revealed, as if a curtain is being drawn. Opacity + slight Y-translate (20px) on entrance. Nothing bounces. Nothing overshoots. The motion says: 'We took our time on this, and you can tell.'
> - **Scroll behavior:** Parallax with restraint — 1.1× speed differential, not the dramatic 2×. Subtle. Sophisticated.
> - **Page transitions:** Cross-fade (400ms) with content stagger (80ms per child). The new page arrives with quiet confidence."

**Decision type:** **Mixed.** Easing, duration, and base character are **deterministic** from energy + archetype. The nuanced description and specific values are **creative** (LLM within the deterministic envelope).

**Consumer modules:** Website Engine (primary), Marketing Assets (animated templates), Brandbook (motion guidelines)

---

### Layer 5: ATMOSPHERIC LAYER

The Atmospheric Layer defines the sensory and tactile qualities — the "texture" of the brand experience that makes it feel real, not digital.

---

#### D17+D18 — Materiality & Texture

**Note:** Materiality and Texture have been merged. Materiality defines the physical references (paper, metal, wood); Texture defines the surface quality (matte/gloss, grain/smooth) — a sub-field of Materiality rather than an independent dimension.

---

**Definition (Materiality):** The physical references that ground the brand in tactile reality — what would this brand feel like if you could touch it? Paper? Metal? Glass? Fabric? Wood? Even digital-only brands need material references.

**Definition (Texture — sub-field):** The grain, depth, and tactile quality of surfaces — is it smooth or rough? Glossy or matte? Crisp or soft-edged?

**Definition:** The physical references that ground the brand in tactile reality — what would this brand feel like if you could touch it? Paper? Metal? Glass? Fabric? Wood? Even digital-only brands need material references.

**Strategic inputs:**
- Brand archetype (Q3.1, primary)
- Design philosophy (D4, primary)
- Personality traits (Q3.2, secondary)
- Industry context (Q1.4, secondary)
- Design sensibility sliders (Q5.1, secondary — analog/tactile vs. digital-native)

**Deterministic mapping:**

| Archetype | Primary Material | Secondary Material |
|-----------|-----------------|-------------------|
| Hero | Steel, carbon fiber | Leather |
| Sage | Paper (heavy stock), ink | Glass |
| Creator | Clay, wood, raw materials | Metal |
| Innocent | Cotton, linen, paper (light) | Wool |
| Explorer | Leather, canvas, wood (weathered) | Stone |
| Outlaw | Concrete, distressed metal | Spray paint |
| Magician | Glass, crystal, light | Velvet |
| Ruler | Marble, gold, dark wood | Silk |
| Lover | Silk, velvet, rose gold | Satin |
| Jester | Plastic, neon, rubber | Glitter |
| Everyman | Denim, cotton, wood (plain) | Paper (kraft) |
| Caregiver | Wool, ceramic, linen | Wood (warm) |

**Example output:**
> "Materiality: Heavy uncoated paper stock (the kind that absorbs ink slightly, not glossy), warm-toned wood (walnut, not oak), brushed brass (not polished — the brand is refined but not shiny), and linen texture. The material palette says: substance over shine. Quality you can feel, not just see. For digital touchpoints: paper-like textures as subtle backgrounds, matte (never glossy) finish, subtle grain overlays at 3-5% opacity."

**Decision type:** **Deterministic** — Archetype maps to materials. The LLM writes the application guidance for digital translation.

**Consumer modules:** Logo Engine (mark texture treatments), Website Engine (background textures), Marketing Assets (print specifications), Brandbook

---

#### D18 — Texture *(Merged into D17+D18 — Materiality & Texture)*

*This dimension has been merged with D17 (Materiality). Texture is now a sub-field of the merged Materiality & Texture dimension. See D17+D18 above.*

**Strategic inputs:**
- Materiality (D17, primary)
- Brand archetype (Q3.1, secondary)
- Design sensibility sliders (Q5.1, secondary — analog/tactile vs. digital-native)
- Design philosophy (D4, secondary)

**Example output:**
> "Texture: Matte, with subtle grain. Nothing is perfectly smooth or perfectly flat. Digital backgrounds carry a barely-perceptible noise layer (2-4% opacity). Print materials are specified on uncoated stock — the slight ink absorption creates natural texture. Photography has light film grain in the lifted blacks. The texture says: 'This is real. You can feel it.' The brand rejects the hyper-smooth, glassy aesthetic of contemporary SaaS — it chooses warmth over polish."

**Decision type:** **Creative** — Synthesized from materiality and archetype by the LLM. No deterministic mapping for texture nuance.

**Consumer modules:** Visual Asset Engine (texture assets), Website Engine (CSS textures/backgrounds), Marketing Assets (print finishes), Brandbook

---

#### D19 — Light

**Definition:** How the brand uses light — is it high-key and bright, or low-key and dramatic? Natural or artificial? Diffuse or directional? Light is the invisible hand that shapes everything the customer sees.

**Strategic inputs:**
- Brand energy (D2, primary)
- Emotional positioning (D1, primary)
- Brand archetype (Q3.1, secondary)
- Photography direction (D14, secondary)
- Color psychology (D11, tertiary)

**Deterministic mapping:**

| Brand Energy | Light Quality |
|-------------|--------------|
| High (4-5) | High-key, bright, energetic light. Strong contrast. |
| Medium (3) | Natural, directional. Window light. Moderate contrast. |
| Low (1-2) | Low-key, warm, intimate. Soft shadows. |

| Archetype | Light Character |
|-----------|----------------|
| Sage | Clear, even, knowledge-illuminating |
| Creator | Dramatic, studio, sculptural |
| Innocent | Morning light, golden, hopeful |
| Explorer | Natural, varied, atmospheric |
| Outlaw | Harsh, neon, underground |
| Magician | Spotlight, theatrical, transformative |
| Ruler | Dramatic, authoritative, chiaroscuro |
| Lover | Candlelight, intimate, warm |
| Jester | Bright, colorful, party |
| Everyman | Daylight, honest, unpretentious |
| Caregiver | Soft, warm, fireplace, comforting |

**Example output:**
> "Light: Natural, directional — the kind of light that falls through a window at 4pm. Warm color temperature (~3500K). Moderate contrast — shadows exist but don't dominate. Highlights are soft, not blown. The light says: 'Come in. Stay awhile.' For digital: warm white backgrounds (never pure #FFF — always slightly warm), subtle radial gradients that mimic natural light fall-off, shadow colors that are warm (not gray/black)."

**Decision type:** **Deterministic** — Energy level maps to light quality; archetype maps to light character. The LLM writes the application guidance.

**Consumer modules:** Website Engine (lighting effects, gradients, shadows), Marketing Assets (photography direction), Brandbook

---

## 5. Strategic Justification Map

Every creative dimension must trace back to strategic inputs. This matrix shows which inputs drive which dimensions — and how strongly.

### Legend
- **P** = Primary driver (the dimension would be fundamentally different without this input)
- **S** = Secondary driver (modulates or nuances the dimension)
- **—** = No direct influence

### Part 1: Discovery Inputs → Creative Dimensions

| Creative Dimension ↓ | Archetype (Q3.1) | Personality (Q3.2) | Tone of Voice (Q3.3) | Emotions (Q4.3) | Keywords (Q3.7) | Design Sensibility (Q5.1) | Preferred Colors (Q5.2) | Typography (Q5.4) | Logo Sensibility (Q5.5) | USP (Q2.6) | Audience (Q2.1) | Competitors (Q2.4) | Industry (Q1.4) | Brand Inspirations (Q4.1) | Never Keywords (Q3.8) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **D0 — Brand Metaphor** | **P** | S | — | S | — | — | — | — | — | — | — | — | — | S | — |
| **D1 — Emotional Positioning** | S | S | — | **P** | — | — | — | — | — | — | S | — | — | — | — |
| **D2 — Brand Energy** | **P** | **P** | S | — | — | **P** | — | — | — | — | — | — | — | — | — |
| **D3 — Creative Tension** | S | **P** | S | — | S | — | — | — | — | — | — | — | — | S | S |
| **D3a — Visual Rejection** | — | — | — | — | S | — | S | — | — | — | — | **P** | S | S | **P** |
| **D4 — Design Philosophy** | **P** | **P** | — | — | — | **P** | — | — | — | — | — | S | S | S | — |
| **D5 — Visual Personality** | S | **P** | **P** | — | — | S | — | — | — | — | — | — | — | — | — |
| **D6 — White Space Philosophy** | **P** | S | S | — | — | **P** | — | — | — | — | — | — | — | — | — |
| **D7 — Graphic Language** | **P** | **P** | — | — | — | **P** | — | — | — | — | — | S | S | — | — |
| **D8 — Shape Language** | **P** | S | — | S | — | S | — | — | — | — | — | — | — | — | — |
| **D9 — Composition Principles** | **P** | **P** | — | — | — | S | — | — | — | — | — | — | — | — | — |
| **D10 — Visual Hierarchy** | S | **P** | S | — | — | — | — | — | — | — | — | — | — | — | — |
| **D11 — Color Psychology** | **P** | S | — | **P** | S | S | **P** | — | — | — | — | S | S | — | S |
| **D12 — Typography Philosophy** | **P** | S | **P** | — | — | S | — | **P** | — | — | — | — | — | — | — |
| **D13 — Iconography Style** | **P** | S | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **D14 — Photography Direction** | S | S | — | **P** | — | — | — | — | — | — | S | S | S | S | — |
| **D15 — Illustration Style** | **P** | — | — | — | — | — | — | — | — | — | — | — | S | — | — |
| **D16 — Motion Style** | **P** | S | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **D17 — Materiality** | **P** | — | — | — | — | S | — | — | — | — | — | — | S | — | — |
| **D18 — Texture** | S | — | — | — | — | S | — | — | — | — | — | — | — | — | — |
| **D19 — Light** | S | — | — | S | — | — | — | — | — | — | — | — | — | — | — |

### Part 2: The Logic Chain — Why Each Mapping Exists

This is the "why" — the reasoning that connects strategy to each creative dimension. For each primary driver, here is the logic chain:

#### Archetype → Design Philosophy (Primary)
**Chain:** Archetypes are patterns of human motivation. Design philosophies are patterns of visual communication. The Sage seeks truth through knowledge → Swiss/International Style seeks clarity through structure. The Outlaw breaks rules → Postmodern/Punk breaks visual conventions. **The logic is psychological congruence — the visual philosophy must reflect the motivational pattern.**

#### Archetype → Shape Language (Primary)
**Chain:** Shapes carry innate psychological meaning (research from Gestalt psychology, Bauhaus theory, and modern neuroscience). Circles = unity, inclusion, protection (Caregiver, Innocent). Angles = direction, aggression, precision (Hero, Outlaw). **The logic is evolutionary psychology — humans instinctively read shape language. The brand's shapes must evoke the right instinctive response.**

#### Archetype → White Space Philosophy (Primary)
**Chain:** White space is a dominance signal. Generous space = confidence, authority, resources (Ruler, Sage). Tight space = energy, urgency, accessibility (Jester, Outlaw). **The logic is sociological — in nature and culture, those with resources take up more space. The brand's spatial posture signals its social position.**

#### Archetype → Graphic Language (Primary)
**Chain:** Different archetypes "speak" through different visual vocabularies. The Creator speaks in expressive marks and mixed media. The Ruler speaks in heraldic symmetry and classical forms. **The logic is semiotic — each archetype has a natural visual dialect. The graphic language is the brand's accent within its design philosophy.**

#### Archetype → Composition Principles (Primary)
**Chain:** Composition is the brand's body language in space. Symmetry signals stability, authority, tradition (Ruler). Asymmetry signals dynamism, modernity, action (Hero, Explorer). **The logic is kinesthetic — we read composition with our bodies. Centered = balanced, at rest. Off-balance = in motion, alive.**

#### Personality Traits → Visual Personality (Primary)
**Chain:** This is the most direct mapping. Personality traits ARE visual personality, translated from verbal to visual behavior. "Bold" → the brand takes up space, uses contrast aggressively, makes declarative visual statements. "Calm" → the brand recedes, whispers, uses soft transitions. **The logic is behavioral translation — every personality adjective has a visual behavioral equivalent.**

#### Personality Traits → Brand Energy (Primary)
**Chain:** Energy is personality in motion. Bold + Energetic = high energy, percussive, fast. Calm + Relaxed = low energy, smooth, slow. **The logic is physics — personality traits describe the intensity and speed of the brand's movements through visual space.**

#### Archetype → Color Psychology (Primary)
**Chain:** Each archetype has natural color affinities drawn from human psychology and cultural association. The Sage resonates with deep greens and blues (wisdom, depth, nature). The Lover resonates with reds, roses, warm tones (passion, sensuality). The Ruler resonates with gold, black, purple (authority, luxury). **The logic is cultural semiotics + color psychology — archetypes have color signatures that are culturally legible across markets.**

#### Archetype → Typography Philosophy (Primary)
**Chain:** Typefaces are the visual equivalent of tone of voice. A geometric sans (Futura) speaks like a modernist manifesto. A humanist serif (Garamond) speaks like a literary tradition. **The logic is historical congruence — typefaces emerged from specific philosophical and cultural movements. The brand's type philosophy should emerge from the movement that aligns with its archetype.**

#### Archetype → Motion Style (Primary)
**Chain:** Motion is archetype expressed through time. The Hero lunges forward. The Caregiver moves gently. The Jester bounces. **The logic is character animation — the same principles that make an animated character feel heroic or nurturing apply to brand motion.**

#### Emotional Positioning → Emotional Layer (Primary)
**Chain:** This is definitional. The emotional positioning IS the target. Every dimension in the Emotional Layer exists to deliver this single feeling. **The logic is teleological — start with the desired end-state (the feeling) and work backward to the means (the creative dimensions).**

#### Design Sensibility Sliders → Visual Calibration (Primary)
**Chain:** The sliders are the founder's explicit creative taste signal, expressed along 12 continuums. They directly calibrate: organic↔geometric (shape language, graphic language), minimal↔maximal (white space, complexity), warm↔cool (color temperature, material warmth), etc. **The logic is direct translation — each slider has a one-to-one or one-to-few mapping to specific creative dimensions.**

---

## 6. Deterministic vs. Creative Decisions

A critical architectural distinction: which creative decisions does BrandForge **own** (deterministic rules, no LLM needed) versus which are **delegated** (LLM fills within constraints)?

### Decisions BrandForge OWNS (Deterministic Rules Engine)

These are codified in the Creative Intelligence Layer as pure logic — no LLM call required. They produce consistent, defensible results every time.

#### Palette Architecture

| Rule | Logic |
|------|-------|
| Palette structure | Always: 1 Primary + 1–2 Secondary + 1 Accent + 2–4 Neutrals |
| Primary color domain | Must come from founder's preferred colors list |
| Accent color selection | Highest contrast color relative to Primary (color wheel distance ≥ 120°) |
| Neutral count | 4 if brand energy ≥ 4, 3 if moderate, 2 if low energy |
| Accessibility enforcement | All text-on-background combos must meet WCAG AA (4.5:1 body, 3:1 large text) |
| Industry differentiation check | If 3+ competitors use same hue family as Primary → flag and shift hue by ≥ 30° |

#### Typography Architecture

| Rule | Logic |
|------|-------|
| Pairing architecture | Serif heading + Sans body when personality traits include "traditional," "elegant," "sophisticated," or "intellectual." Sans heading + Sans body (contrasting) for "modern," "clean," "minimal." Single typeface for "minimal" + "confident" |
| Weight range | Energy ≥ 4 → Thin–Black (full range). Energy 2–3 → Regular–Bold. Energy ≤ 1 → Light–Medium |
| Type scale ratio | White space = generous → 1.333 (Perfect Fourth). White space = moderate → 1.25 (Major Third). White space = tight → 1.125 |
| Body line height | White space = generous → 1.75. Moderate → 1.6. Tight → 1.5 |
| Maximum line length | Always: 65–75 characters for body text |

#### Shape Language

| Rule | Logic |
|------|-------|
| Primary shape | Archetype → shape mapping (see D8 deterministic table) |
| Corner radius minimum | Circular shape language → 12px minimum. Angular → 0–2px. Mixed → 4–8px |
| Sharp angle avoidance | Caregiver, Innocent, Lover, Everyman → no angles below 90° permitted |

#### Iconography

| Rule | Logic |
|------|-------|
| Stroke weight | Archetype → weight mapping (see D13 deterministic table) |
| Fill behavior | Energy ≥ 4 → filled acceptable. Energy ≤ 3 → outline only |
| Minimum legibility size | All icons must be recognizable at 16×16px |

#### Motion

| Rule | Logic |
|------|-------|
| Base duration | Energy 4–5 → 200ms. Energy 3 → 350ms. Energy 1–2 → 500ms |
| Easing baseline | Energy 4–5 → ease-out. Energy 3 → ease-in-out. Energy 1–2 → ease-in-out (gentle) |
| Entrance animation | Always: opacity + Y-translate (not scale, not rotate — those are LLM domain) |

#### White Space

| Rule | Logic |
|------|-------|
| Minimum margin (desktop) | Generous → 80px. Moderate → 48px. Tight → 24px |
| Section spacing ratio | Generous → 2× margin. Moderate → 1.5×. Tight → 1× |
| Content max width | Always: 1200px (generous space), 1400px (moderate), 1600px (tight) |

#### Anti-Cliché Rules

| Rule | Logic |
|------|-------|
| Industry visual clichés | Coffee shops → no coffee beans/cups in creative direction. Law firms → no scales/gavels. Tech → no hexagons/circuit boards. Healthcare → no crosses/heartbeats. Fitness → no dumbbells/barbells. Finance → no bar charts/dollar signs. Eco → no leaves/recycling arrows. |
| Forbidden color clichés | Sage brand → not automatically blue. Ruler brand → not automatically black+gold. Eco brand → not automatically green. |
| Archetype visual clichés | See anti-cliché mappings in Section 9 (Risks) |

### Decisions DELEGATED to the LLM (Within Constraints)

These require creative synthesis that rules alone cannot produce. The LLM fills them, but always within a deterministic envelope.

| Dimension | What the LLM Chooses | Constraints |
|-----------|---------------------|-------------|
| **Color Psychology** | Specific hex values within hue ranges | Must satisfy accessibility. Must come from founder's preferred color list (primary). Hue range determined by archetype affinity + industry differentiation check. |
| **Typography Philosophy** | Specific font family recommendations | Must fit the type category (Humanist Sans, Geometric Sans, etc). Must be available via Google Fonts or common system fonts. Pairing must follow deterministic architecture. |
| **Photography Direction** | Subject matter nuance, lighting style, emotional register | Must not contradict brand energy or emotional positioning. Must differentiate from competitive landscape. |
| **Illustration Style** | Technique specifics, conceptual approach | Must not contradict shape language or graphic language. Must be producible by target generation engine. |
| **Materiality — Digital Translation** | How physical materials translate to digital (e.g., "paper texture" → CSS grain overlay) | Must be technically feasible in web environment. No heavy assets. |
| **Texture Nuance** | Specific grain type, opacity, application rules | Must align with materiality references. Must be subtle enough not to distract. |
| **Creative Tension Articulation** | Naming the tension, describing how it manifests visually | Must be grounded in a detected contradiction or strategic gap. Cannot invent false tensions. |
| **Design Philosophy Narrative** | The philosophical statement and application rules | Must fit the deterministic philosophy mapping. Cannot claim a philosophy that contradicts the archetype. |
| **Emotional Positioning Statement** | The exact wording of the feeling | Must name a single, concrete emotion. Must connect to a specific customer desire. |
| **Visual Hierarchy Strategy** | Which elements dominate, their relative weights | Hierarchy must be internally consistent. Must consider website goals. |
| **Visual Personality Description** | The behavioral description | Must reflect ALL personality traits, not just the dominant one. Must use behavioral verbs. |

### The Boundary Principle

The deterministic rules engine runs first, producing **strong defaults with override conditions** — not immutable mappings. These defaults encode what typically works for each archetype, personality, and strategic position. But creative originality lives in the space where defaults are intentionally transcended.

The boundary operates on three principles:

1. **Defaults, not laws.** Every deterministic mapping produces a starting point, not a final answer. The mapping says "Caregiver archetypes typically express through circular, soft forms" — not "Caregiver brands MUST use circles." The default is the safe, justified choice. The override is where distinctiveness lives.

2. **Override requires justification.** The LLM can override any deterministic default, but must provide strategic reasoning. "Shape language: predominantly rectangular forms (overriding the Caregiver default of circles). Justification: The brand metaphor is 'the steady table' — a sturdy, gathering surface. Rectangles express this more authentically than circles, while still embodying the Caregiver's nurturing posture through warm proportions and soft corners."

3. **Creative Tension (D3) is the primary override mechanism.** When D3 identifies a productive contradiction (e.g., "nurturing but sharp-witted"), it signals which deterministic defaults should be reconsidered. A Caregiver brand with "sharp-witted" tension might keep circular forms at large scale but introduce angular moments at small scale — creating a visual signature that is both nurturing AND clever.

This means:
- The LLM receives the default AND the override signal: "Default: circular forms (Caregiver). Override consideration: Creative Tension (D3) suggests sharp-witted intelligence — consider angular accents."
- The LLM can override any default with strategic justification.
- The Coherence Validator checks that overrides are justified, not that they match defaults.
- Over time, override patterns that produce consistently strong brands are promoted to alternative defaults.

The goal is not rules that prevent mistakes. It is defaults that accelerate the obvious — so creative energy is spent on the distinctive.

---

## 7. Future Compatibility

How the Creative Intelligence Layer supports every future module without duplicating logic.

### Logo Engine

**What a logo needs from Creative Direction:**
- Shape language (D8) — what forms feel native?
- Graphic language (D7) — what visual vocabulary?
- Brand energy (D2) — how bold or restrained?
- Typography philosophy (D12) — wordmark character
- Color psychology (D11) — mark color strategy
- Logo sensibility (from discovery Q5.5) — mark type preference
- Logo references (from discovery Q5.6) — taste calibration
- Emotional positioning (D1) — what should the mark evoke?

**How Creative Intelligence enables on-brand logos without the Logo Engine needing the full strategy:**
The CreativeDirection object is the logo brief. A Logo Engine reading `shapeLanguage: { primary: "circles", avoidAngles: true }` and `brandEnergy: { level: 2, character: "patient, deliberate" }` can generate marks that are soft, round, and restrained — without ever reading the strategy document. The creative decisions are pre-made; the engine executes.

### Visual Asset Engine

**What asset generation needs from Creative Direction:**
- Color psychology (D11) → design tokens → CSS custom properties
- Typography philosophy (D12) → font selections → type scale CSS
- Iconography style (D13) → icon generation parameters
- Shape language (D8) → corner radii, border styles
- White space philosophy (D6) → spacing scale, max-widths
- Materiality (D17) → shadow styles, texture assets
- Motion style (D16) → animation tokens

**Integration pattern:** The Visual Asset Engine reads the CreativeDirection and produces a `DesignTokenSet` — a platform-agnostic design token file (CSS, JSON, Tailwind config) that every other module imports. The CreativeDirection → DesignToken pipeline happens once per brand, not once per module.

### Brandbook Engine

**How the brandbook presents creative decisions with strategic justifications:**
The Brandbook Engine consumes two things from Creative Intelligence:
1. The `CreativeDirection` object (what the brand looks like)
2. The `StrategicJustificationMap` (why every choice was made)

For every creative dimension, the brandbook renders: Dimension Name → Creative Choice → Strategic Reason → Visual Example. This is only possible because the Creative Intelligence Layer preserves traceability. Without it, the brandbook would be a style guide (what) without a brand story (why).

### Website Engine

**How layout, interaction, and content hierarchy flow from Creative Direction:**

| Website Concern | Creative Dimension |
|-----------------|-------------------|
| Layout grid & spacing | White space philosophy (D6), Composition principles (D9) |
| Typography system | Typography philosophy (D12) |
| Color system | Color psychology (D11) |
| Animation & transitions | Motion style (D16) |
| Hero section treatment | Visual hierarchy (D10), Emotional positioning (D1) |
| Photography/illustration | Photography direction (D14), Illustration style (D15) |
| Button & input styles | Shape language (D8), Brand energy (D2) |
| Navigation personality | Visual personality (D5) |
| Overall spatial feel | Design philosophy (D4), Materiality (D17), Light (D19) |

The Website Engine doesn't make creative decisions — it reads them from Creative Direction and applies them to web-specific concerns (responsive breakpoints, accessibility, performance).

### Marketing Assets

**How business cards, social templates, and presentations stay consistent:**
The Marketing Asset Engine is a parameterized template system. Each template has slots for creative dimensions — color goes here, type goes there, shape drives this corner style. The engine reads the `CreativeDirection` and populates the templates. Change the Creative Direction, and all marketing assets update consistently.

**Print-specific:** The Marketing Asset Engine also reads Materiality (D17) and Texture (D18) for print specification — paper stock recommendations, finish suggestions, embossing/debossing guidance.

### Rebranding

**What changes when re-expressing an existing brand:**
Rebranding introduces a BEFORE CreativeDirection and an AFTER CreativeDirection. The Creative Intelligence Layer must support:

1. **Creative Direction Differ:** Compare two CreativeDirection objects dimension-by-dimension. Quantify: "Shape language changes from angular (Outlaw) to circular (Caregiver) — this is a high-impact change affecting logo, icons, and UI."
2. **Equity Preservation:** Some dimensions are flagged as "high equity" — changing them risks alienating existing customers. The Creative Intelligence Layer must accept equity-preservation constraints: "Retain primary color hue; evolve saturation only."
3. **Migration Sequencing:** Based on the dimension diff, recommend a migration sequence: "Phase 1: Typography (low risk, high impact). Phase 2: Color palette (moderate risk). Phase 3: Logo (high risk — requires communication campaign)."

For new brands, the BEFORE object is empty, and the diff is the full creative direction. No migration needed.

---

## 8. Version Planning

### Version 1 (Next Sprint — Creative Intelligence v1)

**Ship the core framework with the highest-leverage dimensions:**

**Dimensions to ship in V1:**
- **Emotional Layer:** D0 (Brand Metaphor), D1 (Emotional Positioning), D2 (Brand Energy), D3 (Creative Tension)
- **Philosophical Layer:** D4 (Design Philosophy, incorporating White Space), D5 (Visual Personality)
- **System Layer:** D8+D7 merged (Visual Language — Shape + Graphic), D9 (Composition Principles)
- **Component Layer:** D11 (Color Psychology), D12 (Typography Philosophy), D16 (Motion — baseline only)
- **Atmospheric Layer:** None (V2)

**Total: 10 dimensions** — Creative Tension is load-bearing architecture, not a polish feature. It ships in V1 as the mechanism that prevents deterministic rules from producing convergent output. Brand Metaphor (D0) anchors all dimensions in a single organizing idea.

**Deterministic rules engine (V1):**
- Palette structure rules
- Typography pairing architecture
- Shape language → archetype mapping
- Design philosophy → archetype mapping
- White space defaults → archetype mapping
- Animation baseline (duration + easing from energy)
- Anti-cliché rules

**LLM pipeline (V1):**
- Accept CreativeDirection template with 10 dimensions
- Fill creative dimensions within deterministic constraints
- Output structured JSON + human-readable narrative

**Integration with existing strategy results page:**
The V1 Creative Direction replaces the current single "Creative Direction" text block with a structured panel showing:
1. The emotional core (positioning + energy)
2. The design philosophy (in a sidebar or card)
3. The creative dimensions as a visual summary (shape, space, composition)
4. The color psychology strategy (emotions + palette roles)
5. The typography philosophy (pairing + character)

This enriches the current results page without requiring new UI — it upgrades what's already there.

**What V1 does NOT do:**
- Design tokens / hex codes (that's Visual Asset Engine)
- Font selection (that's Visual Asset Engine)
- Full Motion specifications beyond baseline (duration + easing)
- Materiality, texture, light (Atmospheric Layer → V2)
- Photography/illustration direction (V2)
- Iconography style (V2)
- Visual Hierarchy as a standalone dimension (delegated to Website Engine)
- All Atmospheric Layer dimensions (V2)

### Version 2

**Add depth and nuance:**

**New dimensions and enhancements:**
- **System Layer:** D10 (Visual Hierarchy — only if Website Engine proves need)
- **Component Layer:** D13 (Iconography Style), D14 (Photography Direction), D15 (Illustration Style), D16 (Motion Style — full specification)
- **Atmospheric Layer:** D17+D18 merged (Materiality & Texture), D19 (Light)
- **Enhanced:** Full archetype → motion character mapping for D16

**New deterministic rules:**
- Iconography style → archetype mapping
- Motion style → archetype + energy mapping
- Materiality → archetype mapping
- Light → energy + archetype mapping

**Enhanced LLM pipeline:**
- Cross-dimensional coherence check (LLM validates interdependencies)
- "What would break" analysis — if one dimension changes, what else must change?
- Creative tension articulation (D3) — now with full dimensional context

### Version 3 — Full Creative Intelligence Layer

**Complete remaining dimensions and advanced capabilities:**
- Full Atmospheric Layer polish
- Advanced coherence scoring and anti-cliché detection
- Creative Direction Differ (for rebranding)
- Competitive Creative Landscape mapping

**Advanced capabilities:**
- **Dimension Diff Engine:** Compare two Creative Direction objects (for rebranding)
- **Coherence Scoring:** Each Creative Direction gets a coherence score (0–10) measuring internal consistency
- **Anti-Cliché Detection:** Before finalizing, the system checks if any combination of dimensions produces a known cliché pattern (e.g., "Sage + blue + geometric sans + generous white space" = "every SaaS brand ever")
- **Competitive Creative Landscape:** Map the brand's Creative Direction against competitors' visual identities (when data is available) to verify differentiation
- **Creative Direction Versioning:** When a brand evolves, maintain a version history of Creative Direction objects

**End state:**
The Creative Intelligence Layer is a self-contained subsystem within the Brand Intelligence Layer ecosystem. It produces Creative Direction objects that:
1. Are fully deterministic in structure (the framework)
2. Are creative in content (the specifics)
3. Carry complete traceability (every choice → strategic justification)
4. Are consumable by every downstream module
5. Support both creation and evolution (rebranding)

---

## 9. Risks

### 1. Generic Output Risk — The "Bold = Geometric Sans" Problem

**Risk:** The deterministic mappings could create predictable, templated creative directions. Every Hero brand gets bold geometric sans. Every Caregiver gets circles and warm colors. The system becomes a sophisticated Mad Libs.

**Severity:** HIGH. This is the #1 risk. If the creative directions feel formulaic, BrandForge loses its premium positioning.

**Mitigation:**
1. **Creative tension (D3) as the antidote.** The tension is unique to each brand. A Hero brand with "bold but gentle" tension gets different creative output than a Hero brand with "bold but playful" tension.
2. **Industry context as a differentiator.** A Hero brand in healthcare gets different treatment than a Hero brand in sports equipment.
3. **Founder taste signals.** Preferred colors, brand inspirations, and design sensibility sliders all modulate the archetype defaults. Two Sage brands with different inspirations (one admires Stripe, one admires Kinfolk) get different typography and color treatments.
4. **Competitive escape velocity.** The system checks the competitive landscape and pushes the creative direction away from competitor patterns.
5. **Anti-cliché rules.** Explicit prohibitions against industry clichés (coffee cups for coffee shops, etc.) prevent the most egregious templating.

### 2. Creative Limitation Risk — Deterministic Rules Making All Brands Look the Same

**Risk:** If the deterministic rules engine is too rigid, creative originality is impossible. Every brand from the same archetype converges on the same visual expression.

**Severity:** MEDIUM. The deterministic rules are binary (is/is not), but creative expression lives in the space between binary positions.

**Mitigation:**
1. **Rules define the floor, not the ceiling.** The rules say "not sharp angles" for Caregiver — but they don't say what TO do beyond "circles, soft curves." The LLM has freedom within the non-sharp-angles space.
2. **Creative dimensions outnumber deterministic rules.** 19 dimensions with ~12 deterministic rules means ~7 dimensions are almost entirely LLM-driven, and the creative dimensions interact combinatorially.
3. **Founder inputs provide uniqueness.** Two Caregiver brands with different preferred colors, inspirations, and audience contexts get meaningfully different creative directions even with the same deterministic base.
4. **The LLM's job is to find the surprising-yet-inevitable choice within the constraints.** This is where model quality matters. A strong LLM finds the distinctive path through the constraint space.

### 3. Overengineering Risk — Dimensions Without Clear Consumers

**Risk:** Designing creative dimensions that sound sophisticated but have no clear consumer module or practical application.

**Severity:** LOW–MEDIUM. The 19 dimensions were designed with explicit consumer mapping (see Section 4). But some are more speculative than others.

**Most at-risk dimensions:**
- D18 (Texture) — primarily aesthetic, harder to quantify
- D19 (Light) — atmospheric, may be too abstract for some modules
- D17 (Materiality) — powerful for print, harder to translate digitally

**Mitigation:**
1. **Defer atmospheric dimensions to V2/V3.** They're valuable but not critical for V1.
2. **Every dimension must have at least 2 consumer modules with clear consumption patterns** before moving from design to implementation.
3. **Dimension pruning review at each version boundary.** If a dimension still has no practical consumer at V2, it's cut.

### 4. Architectural Risk — Tight Coupling Between Modules

**Risk:** The Creative Intelligence Layer becomes tightly coupled to specific module implementations, making changes expensive and brittle.

**Severity:** MEDIUM. Tight coupling is the natural default for systems that share creative logic.

**Mitigation:**
1. **CreativeDirection as the API contract.** Modules consume the CreativeDirection object, not internal Creative Intelligence APIs. The object format is stable; the internals can change.
2. **Model-agnostic boundary (same as Brand Intelligence Layer).** No module code imports OpenAI or any specific LLM SDK. The Creative Intelligence Layer exposes a clean interface.
3. **Dimension versioning.** The CreativeDirection schema is versioned. Modules declare which schema version they consume. New dimensions can be added without breaking existing consumers.
4. **Single source of truth.** All modules read from the same CreativeDirection object stored with the project. No module makes its own creative decisions independently.

### 5. Scalability Risk — What Breaks at 10,000 Brands?

**Risk:** As the number of generated brands grows, patterns emerge that weren't visible at small scale.

**Severity:** MEDIUM. At scale, quality problems become systemic rather than anecdotal.

**What could break:**
1. **Archetype distribution skew.** If 60% of brands map to Sage and Creator, the creative outputs converge. This is already tracked in the Brand Intelligence Layer's archetype diversity warning.
2. **Color palette convergence.** Even with constraints, the combinatorial space of "good palettes given archetype X + constraints Y" may be smaller than expected.
3. **Deterministic rule blind spots.** Rules that work for 100 brands may fail for edge cases at 10,000.

**Mitigation:**
1. **Creative Direction diversity metrics.** Track at scale: archetype distribution, palette uniqueness scores, typography pairing diversity, shape language distribution. Alert on convergence.
2. **A/B creative directions.** At scale, generate 2–3 Creative Direction objects for the same brand using different LLM temperatures/seeds and compare. The most distinctive wins.
3. **Continuous rule refinement.** The deterministic rules engine is not static. As patterns emerge at scale, rules are adjusted to maintain diversity.
4. **Creative "escape hatches."** When the system detects that a brand's creative direction is within 5% similarity of an existing brand's, it triggers a "differentiation pass" — an additional LLM call specifically tasked with finding a distinctive creative angle.

---

## 10. Recommendations

Concrete, actionable guidance for the next implementation sprint.

### What to Build First (V1 Scope)

1. **`src/intelligence/creative/` directory** — mirror the Brand Intelligence Layer structure:
   - `types.ts` — CreativeDirection interface, dimension types, StrategicJustificationMap
   - `rules.ts` — Deterministic rules engine (archetype mappings, palette rules, typography rules)
   - `builder.ts` — Creative pipeline orchestrator (rules → LLM prompt → parse → validate)
   - `prompt.ts` — LLM prompt builder for creative dimension filling
   - `validator.ts` — Coherence validator (every choice traces to strategy, no internal contradictions)

2. **CreativeDirection Type Definition** — The single most important artifact. Define the TypeScript interface for the 10 V1 dimensions. This is the API contract every future module will consume.

3. **Deterministic Rules Engine (v1)** — Ship with:
   - Archetype → Design Philosophy mapping
   - Archetype → Shape Language mapping
   - Archetype → White Space defaults
   - Archetype → Brand Energy baseline
   - Palette structure rules
   - Typography pairing architecture rules
   - Anti-cliché rules (industry + archetype)

4. **LLM Prompt Builder** — Accept the 10-dimension template + EnrichedContext + extracted strategy signals. Build prompts that fill creative dimensions within deterministic constraints. Output structured JSON.

5. **Strategy Results Page Integration** — Replace the current single "Creative Direction" text block with a structured panel rendering the CreativeDirection object (or at minimum, enrich the existing section with extracted dimensions).

### What to Defer

- **Atmospheric Layer (D17–D19):** Valuable but not critical. Defer to V2.
- **Photography/Illustration Direction (D14, D15):** Requires image generation capabilities that don't exist yet. Defer to V2.
- **Motion Style full specification (D16):** Defer to V2 (V1 gets the baseline duration + easing only).
- **Design Tokens generation:** That's the Visual Asset Engine's job. Creative Intelligence provides the strategy; the Visual Asset Engine provides the tokens.
- **Creative Direction Diff (for rebranding):** V3 concern.

### How to Validate Creative Quality

1. **The "Would a Creative Director Approve?" Test:** After generating a Creative Direction, read it as if you're a Creative Director at Pentagram. Does it feel original? Would you present it to a client with confidence? If not, the deterministic rules are too rigid or the LLM prompts need refinement.

2. **The Traceability Test:** Pick any creative dimension. Can you trace it back to a specific strategic input in one sentence? If not, the justification is weak.

3. **The Differentiation Test:** Generate Creative Directions for 3 brands with different strategies but the same industry. Are they visually distinct? If they converge, the deterministic rules need more modulation from founder-specific inputs.

4. **The "Not Generic" Test:** For each archetype, generate 5 Creative Directions. Do they all feel like the same brand? If so, the creative tension dimension (D3) isn't doing its job.

5. **The Consumer Readiness Test:** Can you hand the CreativeDirection JSON to an engineer and have them build a logo, color palette, and brandbook without asking creative questions? If they need to ask "what shape language?" or "what's the energy level?", the object isn't complete enough.

### Integration Points with Existing Code

| Existing System | Integration Point |
|----------------|-------------------|
| **`src/intelligence/`** | `src/intelligence/creative/` is a sibling directory. The Creative Intelligence Layer imports `EnrichedContext` from `src/intelligence/types.ts`. |
| **`serve.ts`** | After strategy generation and validation, call the Creative Intelligence pipeline before storing the result. The CreativeDirection becomes `project.data.creativeDirection`. |
| **Strategy Results Page (`src/pages/ProjectDetail.tsx`)** | Read `project.data.creativeDirection` and render the structured panel instead of (or in addition to) the current `creative_direction` text section. |
| **Database schema** | Add `creative_direction TEXT` column to projects table (stores JSON string), or store in `project.data.creativeDirection` alongside existing strategy data. |
| **`src/intelligence/response.ts`** | Extend the response validator to also validate CreativeDirection output (check for forbidden colors in creative dimensions, etc.). |
| **`src/intelligence/context.ts`** | No changes needed — Creative Intelligence consumes the same EnrichedContext, plus extracts signals from the generated strategy text. |

### Sequencing Within the Sprint

1. **Day 1:** Define `CreativeDirection` TypeScript types + write the deterministic rules engine
2. **Day 2:** Build the LLM prompt builder + pipeline orchestrator
3. **Day 3:** Integrate into serve.ts (post-strategy generation) + wire to results page
4. **Day 4:** Testing — generate Creative Directions for 5+ diverse test brands, validate quality
5. **Day 5:** Polish, documentation, and PR

---

*End of Creative Intelligence Blueprint v1.0*
