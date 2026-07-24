# BrandForge — Discovery Blueprint

**Version:** 1.0  
**Status:** Design proposal for stakeholder review  
**Author:** Engineering (agent-engineer)  
**Date:** 2026-07-24

---

## 1. Guiding Principles

These principles govern every question in the blueprint. A question that violates any principle should be cut or rewritten.

### 1.1 Never Guess When We Can Ask
Every assumption the AI must make about a brand — its audience, voice, aspirations, fears — is a point of failure. If the LLM fills the gap, it defaults to generic answers. A single missing question cascades into a generic brand strategy. This is the cardinal rule: **information gaps in the discovery process become cliché in the output.**

### 1.2 Strategy Before Aesthetics
No visual question should appear until the strategic foundation is solid. Colors, fonts, and logo references are downstream of positioning, archetype, and emotional drivers. A founder who hasn't yet articulated their brand's reason for existing should not be asked to choose a color palette — they'll pick what they like, not what the brand needs.

### 1.3 Confidence, Not Quantity
The purpose of discovery is not to collect answers. It is to produce confidence — in the founder's understanding of their own brand, and in BrandForge's ability to express it. Every question must reduce uncertainty; every phase must build conviction. The discovery process is successful not when every field is filled, but when the founder thinks "they really understand my business." Options are what you offer when you are not confident. We do the work to be confident. One justified direction is worth more than fifty alternatives. This principle governs question selection, phase transitions, and the strategic validation gates — if something doesn't build confidence, it doesn't belong.

### 1.4 Guide, Don't Interrogate
Founders are not branding experts. They can describe their business, their customers, and what they admire — but they cannot articulate their brand archetype or tone-of-voice matrix. Questions must educate while collecting data. Every abstract concept (archetype, positioning, emotional driver) must be translated into concrete, relatable choices. Use examples. Use metaphors. Make the founder feel smart, not lost.

### 1.5 Each Question Earns Its Place
Every question must feed into at least one downstream module: Strategy Document, Creative Direction, Logo System, Brandbook, Website, or Marketing Assets. If a question produces data that no module consumes, cut it. Questions are expensive — each one risks abandonment. The discovery should be as short as possible while being as thorough as necessary.

### 1.6 Build a Relationship, Not a Database
The discovery is the founder's first deep interaction with BrandForge. It should feel like a conversation with a senior strategist who is genuinely fascinated by their business — not a DMV form. Use warm, human language. Celebrate insights when they emerge. The tone of the questions themselves is part of the brand experience.

### 1.7 Surface Tension, Don't Hide It
When a founder gives contradictory signals — premium positioning but budget colors, innovative but conservative inspirations — this is valuable data, not a problem to paper over. The system should notice the tension, surface it gracefully, and invite reflection. A brand that hasn't resolved its internal contradictions should not receive a confident strategy until those contradictions are addressed.

### 1.8 Strategy Is Discovered, Not Invented
BrandForge does not create a brand out of thin air. It excavates the brand that already exists inside the founder's vision. The best questions are the ones where the founder thinks, "I've always felt that but never put it into words." The discovery process is an act of articulation, not fabrication.

---

## 2. Discovery Flow Overview

The discovery is organized into **five phases** that build on each other. Each phase unlocks the next — the user cannot proceed until the current phase's strategic foundation is complete.

```
PHASE 1: FOUNDATION         PHASE 2: POSITIONING       PHASE 3: PERSONALITY
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Company Identity │    │ Audience & Pain  │    │ Brand Archetype  │
│ Industry Context │───▶│ Competitive Space│───▶│ Voice & Tone     │
│ Mission & Vision │    │ Differentiation  │    │ Emotional Drivers│
│ Success Metrics  │    │ Brand Promise    │    │ Keywords & Bans  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
PHASE 4: INSPIRATION      PHASE 5: CREATIVE FOUNDATION
┌─────────────────┐    ┌─────────────────┐
│ Admired Brands   │    │ Visual Direction │
│ Aesthetic DNA    │───▶│ Color Psychology  │
│ Brand Confusions │    │ Typography Mood   │
│ Emotional Space  │    │ Logo Sensibility  │
└─────────────────┘    └─────────────────┘
```

### Phase Dependency Logic

| Phase | Prerequisite | Rationale |
|-------|-------------|-----------|
| 1. Foundation | None | Entry point: who are you and what do you do? |
| 2. Positioning | Phase 1 | You can't differentiate until you know what the business is. |
| 3. Personality | Phase 2 | Voice and tone must align with audience expectations and competitive positioning. |
| 4. Inspiration | Phase 3 | Brand inspirations should be filtered through personality — you don't just admire Apple, you admire Apple *because of their commitment to simplicity*, which aligns with your own brand's personality. |
| 5. Creative Foundation | Phase 4 | Color, type, and logo direction are the synthesis of everything above. |

### Phase Timing Estimates

| Phase | Steps | Est. Time | Mental Load |
|-------|-------|-----------|-------------|
| 1. Foundation | 6–8 questions | 4–6 min | Low — factual, easy to answer |
| 2. Positioning | 7–9 questions | 6–9 min | Medium — requires strategic thinking |
| 3. Personality | 8–10 questions | 5–7 min | Low–Medium — fun, self-expressive |
| 4. Inspiration | 6–8 questions | 4–6 min | Low — sharing things you admire |
| 5. Creative Foundation | 6–8 questions | 5–7 min | Medium — visual preferences surfaced |
| **Total** | **33–43 questions** | **24–35 min** | |

### Progress Architecture

Each phase ends with a **Phase Reflection** — a brief summary of what BrandForge has learned so far, written in the strategist's voice. This serves three purposes:
1. **Validation:** The founder sees their inputs reflected back and can correct misunderstandings.
2. **Relationship building:** It feels like a conversation, not a form.
3. **Momentum:** It celebrates progress and makes the founder want to continue.

---

## 3. Phase-by-Phase Question Design

Each question below includes:
- **Q:** The question text as shown to the user
- **Why:** Strategic rationale for asking
- **Insight:** What data this provides
- **Consumed by:** Which modules use this answer (S=Strategy, CD=Creative Direction, L=Logo, BB=Brandbook, W=Website, M=Marketing)
- **Required:** Yes/No/Conditional
- **Format:** The UI control
- **Conditional:** Does this trigger follow-ups?

---

### PHASE 1: FOUNDATION

> *"Every brand starts with a clear answer to one question: what do you do, and why should anyone care? Let's start there."*

---

#### Q1.1 — Company Name
**Q:** What's the name of your company or brand?

**Why:** The primary identifier. Everything downstream — strategy voice, logo lockups, domain suggestions — references this name. It's also the first field the validator checks for forbidden-word conflicts (e.g., "Drift Wellness" with "wellness" as a forbidden word).

**Insight:** Establishes the literal identity. Triggers preprocessing: if the company name contains forbidden words (from Q3.8), the context builder strips them before LLM prompting.

**Consumed by:** S, CD, L, BB, W, M  
**Required:** Yes  
**Format:** Text input (single line, max 100 chars)  
**Conditional:** If name contains words on a known "generic business name" list (e.g., "Solutions", "Group", "Enterprises"), surface a gentle prompt: *"Many distinctive brands use shorter, more memorable names. Is [name] the final brand name, or are you still exploring?"*

---

#### Q1.2 — Tagline (One-Sentence Description)
**Q:** In one sentence, what does your company do? Think of this as your elevator pitch — how would you describe it to someone at a dinner party?

**Why:** Forces clarity. A founder who cannot describe their business in one sentence has not yet found their positioning. This answer becomes the anchoring reference for the positioning statement in the strategy.

**Insight:** The founder's own framing — what they lead with. Reveals whether they think in terms of features, benefits, or mission.

**Consumed by:** S (Executive Summary, Positioning), W (Hero messaging), M (Ad copy)  
**Required:** Yes  
**Format:** Text input (single line, max 200 chars)  
**Conditional:** No

---

#### Q1.3 — Detailed Description
**Q:** Now tell us the full story. What does your company do, how does it work, and what makes it different? Don't hold back — include details, context, and anything that makes your business special. (2–3 paragraphs is great.)

**Why:** This is the richest single source of strategic signal. The LLM extracts positioning, audience cues, competitive context, and voice tone from natural language — far more than it gets from structured fields.

**Insight:** The founder's unfiltered narrative. Depth, specificity, and passion level are all signals. A short, vague description indicates either a pre-revenue idea or a founder who hasn't thought deeply.

**Consumed by:** S (all sections), CD, L, BB, W, M  
**Required:** Yes  
**Format:** Textarea (min 50 chars, no max, placeholder: "Tell us everything...")  
**Conditional:** If under 100 chars, prompt: *"The more detail you share, the more distinctive your brand strategy will be. Can you tell us more about how your product works and who it's for?"*

---

#### Q1.4 — Industry
**Q:** What industry or category does your business belong to?

**Why:** Provides competitive and cultural context. Industry shapes the LLM's understanding of norms, competitors, visual conventions, and tone expectations. Also guides the forbidden-word preprocessor (e.g., "Health & Wellness Technology" → "Health & Sleep Technology" when "wellness" is forbidden).

**Insight:** The category box the founder places themselves in. This is often aspirational — a founder might say "luxury wellness" when they're actually a meditation app.

**Consumed by:** S (Competitive Analysis, Positioning, Archetype), CD (visual conventions to embrace/break), BB, W  
**Required:** Yes  
**Format:** Type-ahead search + free text (suggest from a curated list of 300+ industries, but allow custom entry)  
**Conditional:** Industry choice influences suggested competitors in Q2.5 and archetype defaults in Q3.1.

---

#### Q1.5 — Products & Services
**Q:** What specific products or services do you offer? If you have a product line, list them. If you're service-based, describe your offerings.

**Why:** Grounds the brand in tangible reality. A strategy for "a CRM" is different from one for "a CRM with AI-powered pipeline prediction, Slack-native interface, and SOC 2 compliance."

**Insight:** Tangibility level. Product companies need visual systems for physical/digital touchpoints; service companies need verbal identity more than visual.

**Consumed by:** S (Positioning), CD (touchpoint mapping), L (product-appropriate marks), W (IA/nav structure), M  
**Required:** Yes  
**Format:** Textarea (bullet-point friendly, max 500 chars)  
**Conditional:** No

---

#### Q1.6 — Country / Primary Market
**Q:** Where is your business based, and what geographic markets do you serve?

**Why:** Cultural context for voice, visual conventions, and competitive landscape. A brand targeting Berlin is different from one targeting Dallas. Also guides spelling conventions (color vs. colour).

**Insight:** Cultural and regulatory context. International brands need culturally adaptive voice guidelines.

**Consumed by:** S (Market context), CD (cultural color associations), W (localization needs), M (regional campaign strategy)  
**Required:** Yes  
**Format:** Country dropdown (primary) + multi-select chips for additional markets  
**Conditional:** If multiple markets selected, trigger Q1.6a.

---

#### Q1.6a — Market Adaptation (Conditional)
**Q:** You're serving multiple markets. Does your brand need to adapt its voice, visuals, or name for different regions, or will you maintain a consistent global identity?

**Why:** Multi-market brands face a strategic choice: adapt or standardize. This decision affects everything from color psychology to typography to voice guidelines.

**Insight:** The founder's international ambition and cultural awareness.

**Consumed by:** S (Voice section), CD (cultural color/type guidance), BB (multi-language guidelines), W  
**Required:** Conditional (triggered by Q1.6 multi-market)  
**Format:** Radio: "Consistent global identity" / "Adapt per market" / "Not sure yet"  
**Conditional:** No

---

#### Q1.7 — Stage & Scale
**Q:** Where are you in your journey? This helps us calibrate the right level of brand investment.

| Option | Description |
|--------|-------------|
| 🌱 Pre-launch | Still developing the idea. No customers yet. |
| 🚀 Early stage | Launched, some customers, finding product-market fit. |
| 📈 Growth | Established customer base, scaling up. |
| 🏢 Mature | Well-known in your market, looking to evolve or defend. |

**Why:** Calibrates strategic ambition. A pre-launch startup needs a launch-ready identity; a mature company needs evolution, not revolution. Also affects DNA score baselines (a pre-launch company should not get 10/10 Differentiation).

**Insight:** The founder's self-assessed maturity level. Cross-reference with description length and specificity.

**Consumed by:** S (DNA Score calibration, strategy depth), CD (launch vs. evolution approach), BB (guideline comprehensiveness)  
**Required:** Yes  
**Format:** Single-select cards (one per row, visual + label)  
**Conditional:** If "Mature" or "Growth" AND the founder is doing a rebrand → triggers Rebranding Branch (Section 4.2, deferred to V3).

---

#### Q1.8 — Founder Story
**Q:** Tell us your story. What led you to start this company? What problem did you see that no one else was solving — and why does solving it matter to you personally?

This isn't a pitch. It's the real story. What moment made you think "someone should fix this" — and why were you the person who actually did?

**Why:** Founder intent is a first-class strategic input. The founder's personal motivation, domain expertise, and origin story shape the brand's authenticity, credibility, and emotional resonance. A brand built by someone who lived the problem feels different from one built by someone who spotted a market opportunity. The LLM uses founder story to calibrate the strategy's emotional depth — a founder who lost a family member to the problem they're solving produces a different brand than one who saw a gap in the market.

**Insight:** The founder's genuine motivation. Reveals whether the founder's connection to the problem is personal (deep authenticity) or analytical (market opportunity). Also reveals the founding moment — the specific experience or observation that triggered action. This feeds the Executive Summary's narrative arc and the Brand Purpose section.

**Consumed by:** S (Executive Summary, Brand Purpose, Brand Promise), CD (emotional depth calibration), BB (brand story), W (About page, founder story section), M (origin-story marketing)  
**Required:** Yes  
**Format:** Textarea (min 50 chars, recommended 200–500 chars). Placeholder: "I started this company because..."  
**Conditional:** No

#### Q1.9 — Vision & Mission
**Q:** Let's think big.  
**Vision:** What change do you want to see in the world because your company exists? (5–10 years out)  
**Mission:** What do you do every day to make that vision real?

**Why:** Separates operational identity (what you do) from aspirational identity (why it matters). A strong vision differentiates more powerfully than any feature list. The mission grounds the vision in daily reality.

**Insight:** The founder's ambition ceiling. A small vision = a small brand. Also reveals whether the founder thinks in transactional or transformational terms.

**Consumed by:** S (Executive Summary, Brand Purpose), CD (visual metaphor), BB (brand story), W (About page), M (brand campaigns)  
**Required:** Vision: Yes, Mission: Yes  
**Format:** Two textareas side by side (Vision left, Mission right); placeholder examples for each  
**Conditional:** No

---

#### Q1.10 — Core Values
**Q:** What are the 3–5 values that guide every decision in your company? These aren't posters on a wall — they're the principles you'd defend even if they cost you money.

**Why:** Values differentiate authentically. A brand that values "radical transparency" makes different design, voice, and strategy choices than one that values "craftsmanship above speed." Values become the guardrails for every creative decision.

**Insight:** The founder's non-negotiable principles. Also serves as a contradiction check — if the founder values "simplicity" but their inspirations are ornate brands, that tension is valuable.

**Consumed by:** S (Brand DNA, Voice), CD (visual principles), BB (brand behavior guidelines), W, M  
**Required:** Yes (minimum 3)  
**Format:** Chip input — type a value, press Enter to add; suggest from a curated list but allow free entry. Minimum 3, maximum 5.  
**Conditional:** Values are cross-referenced against personality traits (Q3.2) and inspiration brands (Q4.1) for contradictions.

---

#### Q1.11 — Business Goals (12-Month Horizon)
**Q:** What specific business outcomes are you trying to achieve in the next 12 months? Check all that apply and, where possible, add a number.

| Goal | Your Target |
|------|-------------|
| ☐ Revenue growth | $____ / year |
| ☐ Customer acquisition | ____ new customers |
| ☐ Market expansion | Which markets? ______ |
| ☐ Fundraising | Raising $____ |
| ☐ Product launch | Launching: ______ |
| ☐ Brand awareness | Metric: ______ |
| ☐ Team growth | From __ to __ people |
| ☐ Profitability | Target margin: __% |
| ☐ Exit / acquisition | Timeframe: ______ |

**Why:** Aligns brand strategy with business outcomes. A brand built for fundraising (investor-facing) is visually and verbally different from a brand built for customer acquisition (consumer-facing). Concrete numbers also signal founder seriousness.

**Insight:** The real reason the founder is investing in branding right now. Reveals whether brand is seen as a growth lever or a cosmetic exercise.

**Consumed by:** S (Strategic recommendations, DNA Score alignment), CD (seriousness/formality calibration), W (conversion design), M (campaign strategy)  
**Required:** Yes (at least one goal checked)  
**Format:** Checklist with inline text inputs for targets  
**Conditional:** If "Fundraising" is checked → triggers Q1.11a.

---

#### Q1.11a — Investor Audience (Conditional)
**Q:** What type of investors are you targeting? What matters most to them — traction, team, vision, market size?

**Why:** Fundraising brands need a different visual vocabulary — credibility signals, data presentation polish, "big vision" framing. The brand must speak to investors AND customers, often with different emphasis.

**Insight:** Whether the brand needs dual-audience positioning.

**Consumed by:** S (Dual-audience positioning), CD (credibility aesthetics), W (Investor page, data storytelling), M (Pitch deck alignment)  
**Required:** Conditional (triggered by Q1.11 Fundraising)  
**Format:** Textarea (max 300 chars)  
**Conditional:** No

---

#### Q1.12 — Brand Goals (Why Branding Now?)
**Q:** What do you want your brand to do for your business? What problem are you hoping a strong brand will solve?

**Why:** Surfaces the founder's actual expectations. Some founders want "to look more professional," others want "to command premium pricing," others want "to attract better talent." The strategy must address the real need.

**Insight:** The gap between current and desired brand perception. Also reveals whether the founder understands branding as strategic or cosmetic.

**Consumed by:** S (Strategy framing), CD (direction priorities), BB (guideline emphasis), W, M  
**Required:** Yes  
**Format:** Textarea (max 400 chars)  
**Conditional:** No

---

#### Phase 1 Reflection
*"I'm starting to understand [Company Name] — not just what you do, but why you exist. You're a [Stage] [Industry] company that [One-Sentence Description]. Your story — [Founder Story excerpt] — tells me this is personal for you. Your vision is [Vision excerpt]. You value [Value 1], [Value 2], and [Value 3]. In the next 12 months, you're focused on [Primary Goal]. I'm getting a clear picture. Now let's look outward — at who you're building this for and who else is in the space."*

---

### PHASE 2: POSITIONING

> *"A brand doesn't exist in a vacuum. It exists in the minds of your customers, relative to every other option they have. Let's map that territory."*

---

#### Q2.1 — Primary Customer
**Q:** Who is your ideal customer? Describe them as a real person — not a demographic, but a human with a specific problem, context, and motivation.

*Example: "Sarah is a 34-year-old product manager at a Series B startup. She works 50-hour weeks, has tried three project management tools and hated all of them, and wants something that doesn't feel like enterprise software. She values design quality but her boss controls the budget."*

**Why:** Personas grounded in specific human detail produce strategies that feel bespoke. Demographics alone (age, income, location) produce generic output. Specificity is the antidote to cliché.

**Insight:** The founder's empathy and customer understanding. Detailed personas indicate product-market fit; vague personas indicate a founder who hasn't talked to enough customers.

**Consumed by:** S (Customer Personas section), CD (visual taste calibration), W (UX tone, IA), M (campaign targeting, ad creative)  
**Required:** Yes (minimum 1, encouraged 2–4)  
**Format:** Persona cards — structured fields: Name, Role/Context, Age (optional), Pain Point, Desire, Quote (what they'd say). Add Persona button for additional.  
**Conditional:** If only 1 persona with <50 chars of description → prompt: *"The most distinctive brands are built for specific people, not everyone. Can you describe your ideal customer in more detail — what frustrates them, what they secretly want, how they talk?"*

---

#### Q2.2 — Customer Pain Points
**Q:** What keeps your customers up at night? What problems, frustrations, or unmet needs drive them to look for a solution like yours?

**Why:** Pain is the strongest motivator. A brand that articulates pain better than the customer can becomes magnetic. The strategy uses pain points to frame the brand as the resolution.

**Insight:** The emotional and practical problems the brand solves. Depth of pain = strength of positioning.

**Consumed by:** S (Problem statement, Positioning, Voice), W (Hero copy, pain-driven headlines), M (Ad creative)  
**Required:** Yes  
**Format:** Textarea with bullet suggestions. Prompt: "List specific frustrations — the more concrete, the better."  
**Conditional:** No

---

#### Q2.3 — Customer Desires & Aspirations
**Q:** Beyond solving a problem, what does your customer secretly want? What outcome or transformation are they really after?

*Examples: Not just "better project management" — but "feeling in control at work for the first time." Not just "a meal delivery service" — but "feeling like a competent adult who has their life together."*

**Why:** Brands that understand aspiration create emotional loyalty. The strategy needs to speak to the transformation, not just the transaction.

**Insight:** The emotional payoff. This feeds the brand's emotional driver and archetype selection.

**Consumed by:** S (Emotional positioning, Archetype), CD (aspirational visual mood), W (transformation-focused copy), M (lifestyle marketing)  
**Required:** Yes  
**Format:** Textarea (max 300 chars)  
**Conditional:** No

---

#### Q2.4 — Competitive Awareness
**Q:** Let's talk competition — but let's be smart about it. Who else is solving the same problem for the same customers? Think in three layers:

| Layer | Question | Example |
|-------|----------|---------|
| **Direct competitors** | Companies solving the same problem the same way | Calm vs. Headspace |
| **Indirect competitors** | Companies solving the same problem a different way | Melatonin supplements vs. Headspace |
| **Status quo competitors** | The "do nothing" option or manual workaround | "I just try to sleep better" |

**Why:** Competitive analysis is only as good as the competitor list. Founders often think too narrowly (only direct competitors) or too broadly ("we have no competitors"). Structured layers produce richer competitive intelligence.

**Insight:** The founder's competitive awareness. Founders who can't name direct competitors may not understand their market. Founders who name only giants (Apple, Nike) may be aspirational rather than analytical.

**Consumed by:** S (Competitive Analysis section), CD (competitive visual landscape, what to avoid), BB (differentiation guidelines), W (competitive positioning copy)  
**Required:** Yes (minimum 2 across all layers)  
**Format:** Three text areas, one per layer. Each: "Name competitors, one per line."  
**Conditional:** If fewer than 2 total competitors named → prompt: *"Every business has competition — even if it's just the way people solve the problem today (spreadsheets, manual processes, doing nothing). Who or what are you competing against for your customer's attention and money?"*

---

#### Q2.5 — Competitive Differentiation
**Q:** For each competitor you just named, what do they do well, and where do they fall short? What do you offer that they don't?

*Complete this sentence for each: "[Competitor] is great at ____, but they fail at ____. We're different because ____."*

**Why:** Differentiation-by-competitor produces sharper positioning than a generic USP. The LLM uses these direct comparisons to build a competitive analysis with teeth.

**Insight:** The founder's honest assessment of their market position. Also reveals whether the founder actually understands their competitors or has only a surface impression.

**Consumed by:** S (Competitive Analysis, Positioning Statement), CD (visual differentiation strategy), M (competitive ad copy)  
**Required:** Conditional (required if any competitors named in Q2.4)  
**Format:** Repeater: for each competitor in Q2.4, show: "What [Competitor] does well" (textarea), "Where [Competitor] falls short" (textarea), "How we're different" (textarea)  
**Conditional:** Triggered by Q2.4.

---

#### Q2.6 — Unique Selling Proposition (USP)
**Q:** In one sentence, what can your customers get from you that they cannot get anywhere else? This is your unfair advantage — the thing only you can claim.

*Good USP: "The only observability tool that shows you the exact API request/response pair causing production bugs with zero configuration."*  
*Weak USP: "We make project management easy."*

**Why:** This is the anchor of the entire positioning strategy. A strong USP is specific, verifiable, and exclusive. A weak USP produces weak strategy output.

**Insight:** The founder's precision about their advantage. Also reveals whether the differentiation is real (product/process) or aspirational (marketing claim).

**Consumed by:** S (Positioning Statement, Executive Summary, Competitive Analysis), W (Hero header), M (All campaigns)  
**Required:** Yes  
**Format:** Text input (single line, max 250 chars). Below the input: a real-time feedback indicator — green check if the USP contains specific, verifiable claims; yellow warning if it contains generic words ("easy", "better", "innovative", "best"); red if it's a feature list.  
**Conditional:** If USP scores yellow or red, prompt: *"That's a good start. To make your positioning truly distinctive, can you be more specific? What exactly can customers only get from you?"*

---

#### Q2.7 — Competitive Advantages (Deep Dive)
**Q:** Beyond your USP, what advantages do you have that are hard for competitors to copy? Think about:

| Category | Examples |
|----------|----------|
| 🔬 **Technology/IP** | Proprietary algorithms, patents, unique data |
| 👥 **Team** | Founder expertise, industry connections, key hires |
| 🏭 **Operations** | Supply chain, cost structure, delivery speed |
| 🤝 **Relationships** | Exclusive partnerships, community, distribution |
| 📚 **Knowledge** | Unique methodology, research, thought leadership |
| ⏰ **Timing** | First mover, market window, regulatory advantage |

**Why:** USP is the headline; advantages are the evidence. Together they form a defensible positioning. The LLM uses advantages to build the credibility dimension of the brand strategy.

**Insight:** The depth and defensibility of the founder's competitive position. Multiple moats = stronger positioning.

**Consumed by:** S (Competitive Analysis, DNA Score — Differentiation subscore), CD (authentic visual differentiators), M (proof-point marketing)  
**Required:** No (but strongly encouraged)  
**Format:** Multi-select chips by category, with optional text input per selected category  
**Conditional:** No

---

#### Q2.8 — Brand Promise
**Q:** If your brand made one promise to every customer, what would it be? This isn't a tagline — it's the commitment you'd stake your reputation on.

*Examples: "We'll never sell your data." "Every meal arrives within 30 minutes or it's free." "You'll understand your codebase in the first 5 minutes."*

**Why:** A brand promise forces clarity. It's the line between positioning and personality — the thing the brand must deliver every single time. It becomes the litmus test for all future creative and strategic decisions.

**Insight:** The founder's willingness to be held accountable. A weak promise ("we'll do our best") indicates a brand not ready for strong positioning.

**Consumed by:** S (Brand Promise section, Executive Summary), BB (brand standards), W (trust-building copy), M (guarantee-based campaigns)  
**Required:** Yes  
**Format:** Text input (single line, max 200 chars)  
**Conditional:** No

---

#### Phase 2 Reflection
> *"Now I see the full picture. You're building [Company Name] for [Primary Customer description] who struggles with [Pain Point] and secretly wants [Desire]. Your key competitors are [Competitor 1], [Competitor 2], and [Competitor 3] — but you're the only one who [USP]. Your promise: [Brand Promise]. The strategic picture is coming together with real clarity. Now let's figure out what your brand should feel like."*

---

### PHASE 3: PERSONALITY

> *"A brand with a clear personality is unforgettable. A brand without one is just a logo. Let's define who your brand is — its character, its voice, its energy."*

---

#### Q3.1 — Brand Character
**Q:** If your brand were a person — not a logo or a website, but an actual human being — what kind of person would they be?

Below are 12 characters. Each one represents a different way of showing up in the world. Some are bold leaders. Some are wise teachers. Some are playful disruptors. Which one feels most like your brand — and which one would be its closest friend?

*Don't overthink this. Go with the one that feels right. You can always adjust later.*

| Archetype | Motto | Brand Examples | Best for... |
|-----------|-------|---------------|-------------|
| 🦸 **The Hero** | "Where there's a will, there's a way" | Nike, BMW, FedEx | Brands that help customers overcome challenges |
| 🧙 **The Sage** | "The truth will set you free" | Google, Harvard, TED | Knowledge, research, expertise-driven brands |
| 🎨 **The Creator** | "If it can be imagined, it can be created" | Apple, LEGO, Adobe | Design-driven, innovative, artistic brands |
| 😇 **The Innocent** | "Life is simple and good" | Dove, Coca-Cola, Innocent | Optimistic, trustworthy, pure brands |
| 🔍 **The Explorer** | "Don't fence me in" | Patagonia, Jeep, The North Face | Freedom, adventure, discovery brands |
| 😈 **The Outlaw** | "Rules are made to be broken" | Harley-Davidson, Virgin, Diesel | Disruptive, rebellious, challenger brands |
| 🧙‍♂️ **The Magician** | "It can happen" | Disney, Apple (early), Dyson | Transformational, visionary, "magical" brands |
| 👑 **The Ruler** | "Power isn't everything, it's the only thing" | Rolex, Mercedes, American Express | Premium, exclusive, leadership brands |
| 💕 **The Lover** | "I only have eyes for you" | Chanel, Victoria's Secret, Häagen-Dazs | Intimate, sensory, relationship brands |
| 🤡 **The Jester** | "You only live once" | Old Spice, M&M's, Dollar Shave Club | Humorous, irreverent, fun brands |
| 👨‍👩‍👧 **The Everyman** | "We're all in this together" | IKEA, Target, Levi's | Relatable, down-to-earth, democratic brands |
| 💝 **The Caregiver** | "Love your neighbor as yourself" | Johnson & Johnson, WWF, UNICEF | Nurturing, protective, service-oriented brands |

**Why:** Archetypes are the single most powerful framework for brand personality. They collapse thousands of possible personality combinations into 12 recognizable patterns, giving the LLM a clear creative brief. Correct archetype selection makes the difference between "this brand feels right" and "this brand feels generic."

**Insight:** The founder's instinct about their brand's character. Also surfaced: do they pick a primary AND secondary archetype, or just one? Do they gravitate toward archetypes appropriate for their industry?

**Consumed by:** S (Archetype section — primary + secondary), CD (visual archetype expression), L (logo character), BB (voice and behavior guidelines), W, M  
**Required:** Yes (primary required, secondary encouraged)  
**Format:** Visual card grid (12 cards). Click primary = solid border + badge "Primary". Click secondary = dashed border + badge "Secondary". Each card shows the archetype name, motto, 2–3 example brands, and a brief "best for" line.  
**Conditional:** Archetype selection influences suggested voice tones (Q3.3), keyword suggestions (Q3.7), and inspiration brand suggestions (Q4.1). Also cross-referenced: if Sage is selected as primary, the validator checks whether this is a pattern across recent strategies and warns if it's overrepresented.

---

#### Q3.2 — Brand Personality
**Q:** Let's stay with the person metaphor. Your brand is at a dinner party. The other guests are describing them to someone who wasn't there. What words do they use?

Pick 3–5 words that capture the energy, attitude, and style of your brand-as-person. Don't worry about branding vocabulary — just describe the character honestly.

| Category | Traits |
|----------|--------|
| ⚡ Energy | Bold, Calm, Energetic, Relaxed, Intense, Playful, Serious, Warm |
| 🎯 Attitude | Confident, Humble, Rebellious, Diplomatic, Witty, Sincere, Edgy, Safe |
| 🧠 Intellect | Analytical, Intuitive, Academic, Street-smart, Visionary, Practical, Curious, Decisive |
| 💎 Style | Polished, Raw, Minimal, Maximal, Classic, Trendy, Handcrafted, Industrial |
| 🤝 Relatability | Friendly, Authoritative, Approachable, Exclusive, Nurturing, Challenging, Collaborative, Independent |

**Why:** Personality traits operationalize the archetype. "The Hero" can be a bold hero or a calm hero; "The Creator" can be a polished creator or a raw creator. Traits provide the nuance that prevents the strategy from reading like a textbook archetype description.

**Insight:** The specific flavor of the brand's character. Also triggers contradiction detection (e.g., "Bold" + "Safe" selected simultaneously — see Section 5).

**Consumed by:** S (Brand Personality section), CD (visual personality translation), L (mark character), BB (voice guidelines), W (UX personality), M  
**Required:** Yes (minimum 3, maximum 5)  
**Format:** Chip grid by category. Select chips that light up; a counter shows "3 selected" → "5 selected (max)". With instant contradiction warnings if conflicting traits are selected (e.g., Bold + Gentle).  
**Conditional:** Contradictory selections trigger an inline notice (not a block): *"Interesting combination — 'Bold' and 'Gentle' together. Does one dominate, or is the tension intentional?"* — this is informational, not blocking.

---

#### Q3.3 — Tone of Voice
**Q:** How does your brand speak to customers? Pick the tones that best describe your brand's communication style.

| Tone | Feels like... | Use when... |
|------|--------------|-------------|
| 🎓 **Authoritative** | A trusted expert | You want to be the definitive source |
| 👋 **Friendly** | A helpful neighbor | You want to feel approachable |
| 💬 **Conversational** | A smart friend texting | You want to feel human and relatable |
| 🎯 **Direct** | A no-nonsense coach | You value clarity over politeness |
| 🎭 **Witty** | A clever dinner guest | Humor is part of your differentiation |
| 🏛️ **Formal** | A respected institution | Trust requires traditional professionalism |
| 🔬 **Technical** | An engineer explaining | Your customers value precision |
| ✨ **Inspirational** | A TED speaker | You're selling transformation and vision |
| 🫂 **Empathetic** | A therapist | Your brand is built on emotional understanding |
| ⚡ **Bold** | A challenger | You're disrupting a comfortable industry |
| 🌿 **Warm** | A cozy coffee shop | You want to feel comforting and safe |
| 🎯 **Minimal** | An Apple product page | You believe less is more |

**Why:** Tone of voice is where brand personality meets actual words. Different tones produce radically different strategy outputs — a "Witty + Technical" voice is a completely different brand than "Warm + Empathetic."

**Insight:** The founder's communication instinct. Also reveals whether the founder's voice instincts match their archetype (a Ruler archetype with a "Friendly + Conversational" voice is a tension worth exploring).

**Consumed by:** S (Voice & Messaging section), CD (typography voice — formal vs. casual), BB (voice guidelines, do/don't examples), W (copy tone), M (campaign voice)  
**Required:** Yes (minimum 2, maximum 4)  
**Format:** Chip grid — select chips. Primary tone (marked with ★) + secondary tones.  
**Conditional:** Tone selection is cross-referenced against archetype (Q3.1) and personality traits (Q3.2). If a Ruler archetype selects "Friendly + Conversational" → info notice: *"Ruler brands often use more formal, authoritative language. Your friendly tone could be a differentiator — just want to make sure that's intentional."*

---

#### Q3.4 — Communication Context
**Q:** Where and how will your brand primarily communicate with customers?

| Channel | Example |
|---------|---------|
| 📱 Social media (Twitter, Instagram, TikTok, LinkedIn) | Short-form, visual, personality-driven |
| ✉️ Email / Newsletter | Long-form, relationship-building |
| 🌐 Website / Blog | SEO-driven, educational, comprehensive |
| 📄 Product UI / In-app | Microcopy, tooltips, error messages |
| 🎤 Events / Speaking | Stage presence, deck design, speaker persona |
| 📞 Sales / Support | One-on-one, problem-solving, relationship |
| 📰 PR / Media | Press releases, journalist relationships |
| 📊 Investor Updates | Data-heavy, credibility-focused, concise |

**Why:** Voice is channel-dependent. A brand that's witty on Twitter but formal in investor updates needs voice guidelines that account for context shifts. The strategy should acknowledge where the brand's voice lives.

**Insight:** The brand's primary communication surfaces. Also reveals whether the founder has thought about how voice changes across contexts.

**Consumed by:** S (Voice section — channel-specific guidance), BB (multi-channel voice rules), W (copywriting), M (channel strategy)  
**Required:** No (but recommended)  
**Format:** Multi-select chips  
**Conditional:** If "Sales / Support" is selected → triggers Q3.4a.

---

#### Q3.4a — Sales Voice (Conditional)
**Q:** How should your brand sound in a sales conversation or support interaction? This is often different from marketing voice — more personal, more problem-solving, more human.

**Why:** Sales/support voice is where the brand promise is tested. If marketing says "we're bold and disruptive" but support is deferential and apologetic, the brand feels inconsistent.

**Insight:** The brand's human-to-human voice — the one that matters most for retention.

**Consumed by:** S (Voice section — sales/support addendum), BB, M  
**Required:** Conditional (triggered by Q3.4 Sales/Support)  
**Format:** Textarea (max 200 chars)  
**Conditional:** No

---

#### Q3.5 — Voice Examples (The "Sounds Like" Test)
**Q:** If your brand's voice were a person, publication, or character, who would it sound like? This isn't about copying — it's about calibration.

| Category | Examples |
|----------|----------|
| 📰 **Publication** | The Economist, Vox, The Verge, Kinfolk, Monocle |
| 📺 **Show/Movie** | Chef's Table, Abstract (Netflix), The West Wing |
| 🎙️ **Podcast** | How I Built This, 99% Invisible, Acquired |
| ✍️ **Writer** | Seth Godin, Anne Lamott, Paul Graham |
| 🎭 **Character** | Leslie Knope (Parks & Rec), Don Draper (Mad Men) |

**Why:** Concrete voice references give the LLM a tonal target far more precise than "friendly but professional." The model understands Kinfolk's voice differently from The Economist's.

**Insight:** The founder's voice taste. Also reveals whether the founder's voice references match their archetype and personality.

**Consumed by:** S (Voice section — reference calibration), BB (voice examples), W (copy style guide)  
**Required:** No (but strongly encouraged — provides the richest voice signal)  
**Format:** Category dropdowns with free-text suggestions, or a single textarea: "Name a publication, writer, podcast, or character whose voice you admire."  
**Conditional:** No

---

#### Q3.6 — "Don't Sound Like" Test
**Q:** What voice or tone would feel completely wrong for your brand? Whose communication style do you actively want to avoid?

**Why:** Negative space is as defining as positive space. Knowing the brand is NOT "corporate jargon" or "bro-y startup" or "wellness influencer" prevents the LLM from defaulting to those tones.

**Insight:** The founder's voice anti-patterns. These become explicit constraints in the prompt.

**Consumed by:** S (Voice section — anti-patterns), CD (visual anti-patterns), BB (voice do's and don'ts)  
**Required:** No  
**Format:** Textarea with examples: "Corporate jargon," "Try-hard cool," "Wellness influencer," "LinkedIn thought leader," "Hype beast," etc.  
**Conditional:** No

---

#### Q3.7 — Keywords (What You Want to Own)
**Q:** What words should be unmistakably associated with your brand? These are the words you want customers to think when they hear your name.

*Examples: "precision," "warmth," "craft," "velocity," "trust," "radical," "effortless"*

**Why:** Keywords are the semantic building blocks of the brand strategy. The LLM weaves them into every section — positioning, voice, creative direction. They're also the positive counterpart to never_keywords.

**Insight:** The founder's aspirational semantic territory. Also reveals whether the founder's keywords align with their archetype and industry.

**Consumed by:** S (all sections — keyword weaving), CD (semantic → visual translation), L, BB, W, M  
**Required:** Yes (minimum 5, encouraged 8–12)  
**Format:** Chip input with suggestions based on archetype (e.g., Sage → "wisdom, clarity, insight, depth, evidence"). Free text entry also allowed.  
**Conditional:** Keywords are cross-referenced for contradictions with never_keywords (Q3.8), personality traits (Q3.2), and archetype (Q3.1).

---

#### Q3.8 — Never Keywords (What You Reject)
**Q:** What words should NEVER describe your brand? These are the clichés, industry buzzwords, and vibe words that you actively reject.

*Examples: A wellness brand might reject "woo-woo," "spiritual," "holistic." A SaaS brand might reject "synergy," "leverage," "game-changer." A luxury brand might reject "affordable," "accessible," "budget."*

**Why:** This is the single most important quality-control mechanism in the entire discovery process. Never_keywords become absolute prohibitions in the LLM prompt. They prevent the #1 failure mode: the AI using words the brand explicitly rejects.

**Insight:** The founder's taste and self-awareness. Detailed never_keywords indicate a founder who knows their market's clichés.

**Consumed by:** S (prompt constraints — absolute prohibition), CD, L, BB, W, M — all modules receive the forbidden word list  
**Required:** Yes (minimum 3, encouraged 10+)  
**Format:** Chip input with suggestions based on industry and archetype. Free text entry. Red-tinted chips to visually distinguish from positive keywords.  
**Conditional:** Each never_keyword is added to the forbidden-word list. The validator checks if any never_keywords appear in the company name (Q1.1) or industry (Q1.4) and pre-processes accordingly. If the founder adds a never_keyword that's a core industry term (e.g., "wellness" for a wellness company) → info notice: *"'Wellness' describes your industry — we'll avoid using it in your strategy, but it may appear in competitive context. Is that okay?"*

---

#### Phase 3 Reflection
> *"[Company Name] has a clear personality now. You're a [Primary Archetype] with [Secondary Archetype] undertones — [Trait 1], [Trait 2], and [Trait 3] at a dinner party. Your voice is [Primary Tone] and [Secondary Tone], owning words like [Keyword 1], [Keyword 2], [Keyword 3] while rejecting [Never Keyword 1], [Never Keyword 2]. Your brand has a clear personality now — I can almost hear how it speaks. Now let's see what brands you admire, and what we can learn from them."*

---

### PHASE 4: INSPIRATION

> *"Every great brand is built on taste. In this phase, we'll explore the brands and aesthetics that inspire you — not to copy them, but to understand the principles behind why you love them."*

---

#### Q4.1 — Brand Inspirations
**Q:** What brands do you admire — in any industry, for any reason? The more specific you are about WHY, the more useful this is.

*For each brand, complete: "I admire [Brand Name] because [specific reason]."*

*Example: "I admire Stripe because their documentation feels like a conversation with a smart, helpful engineer — not a manual."*  
*Example: "I admire Glossier because they made skincare feel like a community, not a department store counter."*

**Why:** Inspiration brands are windows into the founder's taste. But the *reason* for admiration matters more than the brand itself. Admiring Apple because "clean design" is different from admiring Apple because "they command premium pricing through perceived quality." The LLM uses the reasons, not the brand names.

**Insight:** The founder's design taste, strategic values, and unspoken aspirations. Also reveals whether the founder's inspirations are coherent (all minimal, all bold, all warm) or scattered (minimal + maximal + corporate + playful = no clear direction).

**Consumed by:** S (Inspiration analysis section), CD (visual synthesis), L (logo sensibility), BB, W, M  
**Required:** Yes (minimum 3 brands with reasons)  
**Format:** Repeater cards — each card has: Brand Name (text input with autocomplete suggestions), "I admire them because..." (textarea), Category tags (choose from: Visual Design, Voice & Tone, Customer Experience, Innovation, Culture, Pricing/Business Model, Community). Plus a "What NOT to copy from this brand" optional field.  
**Conditional:** If inspirations are scattered (see Section 5, Contradiction Detection), prompt: *"You admire [minimal brand] for its simplicity and [maximal brand] for its richness. These pull in different creative directions — which one feels more like your brand's natural home?"*

---

#### Q4.2 — Brand Confusion ("Who Might They Mistake You For?")
**Q:** If someone saw your brand in the wild — your website, your packaging, your marketing — who might they mistake you for? This isn't about competitors; it's about brands that share your aesthetic or vibe.

**Why:** This is a clever way to get at the founder's unspoken visual identity preference. Saying "someone might mistake us for Aesop" reveals more about desired aesthetic than "we like minimalist design."

**Insight:** The founder's aspirational aesthetic peer group. Also reveals whether the founder's self-perception matches their actual description inputs.

**Consumed by:** S (creative context), CD (aesthetic calibration), L (logo genre)  
**Required:** No (but high-value)  
**Format:** Text input with autocomplete: "People might think we look like..."  
**Conditional:** If the "confused with" brands share a clear aesthetic pattern, the Creative Direction phase highlights that: *"You gravitate toward [aesthetic pattern] — we'll carry that DNA forward."*

---

#### Q4.3 — Emotional Response
**Q:** When a customer experiences your brand for the first time — visits your website, opens your product, walks into your space — what should they FEEL? Choose the 3 emotions that matter most.

| Emotion | What it means |
|---------|---------------|
| 😌 **Reassured** | "I'm in good hands. They know what they're doing." |
| 🤩 **Inspired** | "I want to be part of this. This excites me." |
| 🧠 **Enlightened** | "I learned something. I see things differently now." |
| 🥰 **Delighted** | "This made me smile. What a nice surprise." |
| 💪 **Empowered** | "I can do this. They gave me the tools." |
| 🏠 **At home** | "This feels like where I belong." |
| 🔥 **Fired up** | "Let's go. I'm ready to take action." |
| 😌 **Calm** | "I can relax. Everything is going to be okay." |
| 🎯 **Focused** | "No distractions. Just what I need." |
| ✨ **Special** | "This was made for someone like me." |
| 🤔 **Curious** | "Tell me more. I want to go deeper." |
| 🤝 **Connected** | "These are my people. They get me." |

**Why:** Emotional response is the ultimate KPI for brand experience. All the strategy, design, and copy work serves one goal: evoking the right feeling. Naming it explicitly gives the LLM a clear emotional target.

**Insight:** The emotional payoff the founder wants to deliver. Also reveals whether the founder's desired emotions match their archetype (a Jester brand aiming for "Reassured" is a tension worth exploring).

**Consumed by:** S (Emotional Driver section), CD (mood, color psychology), W (UX tone, micro-interactions), M (emotional ad creative)  
**Required:** Yes (choose exactly 3, rank them)  
**Format:** Visual emotion cards grid. Click to select (max 3), then drag to rank.  
**Conditional:** Emotion selection is cross-referenced against archetype (Q3.1) and voice tones (Q3.3).

---

#### Q4.4 — Visual References (Optional, Deferred to V2)
**Q:** *[V2] Upload images, screenshots, or moodboards that capture the visual world you want your brand to inhabit. These don't have to be brand-related — architecture, nature, fashion, film stills, album covers, anything that evokes the right feeling.*

**Why:** Visual references transcend verbal description. A founder who can't articulate "minimalist with warmth" can show a photo of a Japanese tea house and communicate it perfectly.

**Insight:** Direct visual taste signal. Far richer than color/type preferences alone.

**Consumed by:** CD, L, BB, W, M  
**Required:** No (V2)  
**Format:** Image upload (drag-and-drop, max 10 images, with optional caption per image)  
**Conditional:** No

---

#### Phase 4 Reflection
> *"Your taste is clear. You're inspired by [Brand 1]'s [Reason], [Brand 2]'s [Reason], and [Brand 3]'s [Reason]. Someone might mistake you for [Confused With Brand]. And when people first encounter [Company Name], they should feel [Emotion 1], [Emotion 2], and [Emotion 3]. Your taste is clear and coherent — I can see the visual world taking shape. Now let's translate all of this into a creative direction."*

---

### PHASE 5: CREATIVE FOUNDATION

> *"Now we translate strategy into aesthetics. Every choice — color, type, shape — should have a strategic reason. This phase connects your brand's personality to its visual identity."*

---

#### Q5.1 — Design Sensibility
**Q:** How would you describe your brand's visual world? Pick the words that best fit.

| Quality | Opposite |
|---------|----------|
| Minimal | Maximal |
| Warm | Cool |
| Organic | Geometric |
| Playful | Serious |
| Handcrafted | Precision-engineered |
| Bold | Subtle |
| Airy | Dense |
| Timeless | Trend-forward |
| Masculine | Feminine |
| Accessible | Exclusive |
| Digital-native | Analog/Tactile |
| Loud | Quiet |

**Why:** Design sensibility bridges personality and visual execution. These slider choices give the LLM precise calibration for color saturation, typography weight, spacing density, and logo complexity.

**Insight:** The founder's visual taste spectrum. Contradictions here (e.g., Minimal + Dense, Bold + Quiet) are red flags worth surfacing.

**Consumed by:** CD (all visual decisions), L (mark style, weight, complexity), BB (layout guidelines), W (design system)  
**Required:** Yes (all sliders)  
**Format:** Paired sliders (range: -3 to +3 with neutral center). Each pair is labeled with the two poles. Default position: center (neutral).  
**Conditional:** Extreme positions (≥|2|) are highlighted: *"You're strongly [quality]. That will produce a very distinctive visual identity."*

---

#### Q5.2 — Color Psychology (Preferred)
**Q:** What colors feel right for your brand? Don't think about what you personally like — think about what color energy matches your brand's personality.

*Pick 2–4 colors. For each, tell us why it fits.*

**Why:** Color is the most emotionally immediate brand signal. But founders pick colors they like, not colors that serve the strategy. Asking "why does this color fit your brand?" forces strategic thinking.

**Insight:** The founder's color instinct, filtered through strategic justification. Also reveals whether the founder's color choices align with their archetype and industry conventions.

**Consumed by:** CD (primary palette), L (mark color), BB (color system), W (design tokens), M (campaign palette)  
**Required:** Yes (minimum 2 colors with reasons)  
**Format:** Color picker chips (preset palette of 40 curated brand colors + custom hex). Each selected color has a "Why this color?" textarea. Preview bar shows selected colors together.  
**Conditional:** If the founder's color choices are atypical for their archetype or industry → info notice: *"[Color] is an unusual choice for a [Archetype] brand in [Industry] — that could be a powerful differentiator. Can you tell us more about why it fits?"*

---

#### Q5.3 — Color Anti-Palette (Avoid)
**Q:** What colors should your brand stay away from? These might be colors associated with competitors, colors that send the wrong emotional signal, or colors you simply don't want.

**Why:** Negative color space is as important as positive. If a brand says "avoid blue" but their preferred palette doesn't include a cool tone, the CD must find a non-blue way to signal trust/reliability.

**Insight:** The founder's color aversions. Often reveals competitive differentiation (avoiding a competitor's signature color) or emotional positioning (avoiding aggressive red).

**Consumed by:** CD (palette constraints), L, BB, W  
**Required:** No  
**Format:** Color picker chips with "Avoid" badge. Same preset palette as Q5.2.  
**Conditional:** Cross-referenced against Q5.2 — if a preferred color is very close to an avoided color, flag it. If avoid colors include classic premium palette colors (gold, black, silver) but the brand is positioned as premium → warn (this is already in the validator as a `checkPremiumColorConflict`).

---

#### Q5.4 — Typography Personality
**Q:** Choose the typefaces that best express your brand's voice — even if they're not the exact fonts we'll use.

*We'll use these choices to understand your typographic taste, then select fonts that are both beautiful and practical for web/print.*

| Style | Feels like... | Examples |
|-------|--------------|----------|
| 🔤 **Geometric Sans** | Modern, clean, precise | Futura, Montserrat, Avenir |
| 📰 **Humanist Sans** | Warm, approachable, readable | Gill Sans, Frutiger, Open Sans |
| 📐 **Grotesque Sans** | Neutral, functional, honest | Helvetica, Inter, Univers |
| 🖋️ **Serif — Old Style** | Traditional, literary, established | Garamond, Caslon, Bembo |
| 📚 **Serif — Transitional** | Elegant, refined, intellectual | Baskerville, Times New Roman |
| 🏛️ **Serif — Modern/Didone** | Luxurious, dramatic, fashion | Bodoni, Didot, Walbaum |
| 📝 **Slab Serif** | Confident, sturdy, bold | Clarendon, Rockwell, Archer |
| ✍️ **Script/Handwritten** | Personal, artisanal, intimate | (various) |
| 💻 **Monospace** | Technical, precise, developer | JetBrains Mono, Source Code Pro |

**Why:** Typography communicates as much as color. A geometric sans (Futura) says "modern and precise" while a humanist sans (Gill Sans) says "warm and approachable" — even though both are sans-serif. The LLM needs this distinction to make intelligent type recommendations.

**Insight:** The founder's typographic taste. Also reveals coherence — a brand that picks both geometric sans AND script may not have a clear typographic direction.

**Consumed by:** CD (type scale, font pairing), L (wordmark typography), BB (typography system), W (font stack), M (template fonts)  
**Required:** Yes (choose primary + secondary)  
**Format:** Visual cards — each shows the category name, description, and a sample of the typeface in a neutral phrase ("The quick brown fox..."). Select primary (★) and secondary.  
**Conditional:** If primary and secondary are from the same broad category (e.g., two sans-serifs) → note: *"Two sans-serifs can create a subtle, sophisticated contrast. For more dramatic contrast, consider a serif secondary."* If they're very different (e.g., Monospace + Script) → note: *"That's a bold typographic contrast — distinctive, but challenging to balance. We'll make sure it works."*

---

#### Q5.5 — Logo Sensibility
**Q:** What kind of logo feels right for your brand?

| Type | Best for... | Examples |
|------|------------|----------|
| 🔤 **Wordmark** (text only) | Distinctive name, building name recognition | Google, Coca-Cola, Subway |
| 🎯 **Lettermark** (initials) | Long name, need for compact mark | IBM, HBO, NASA |
| 🖼️ **Icon/Symbol** (image only) | Established brand, universal recognition | Apple, Twitter, Target |
| 🧩 **Combination Mark** (icon + text) | New brand, need for both recognition and symbol | Adidas, Burger King, Spotify |
| 🏠 **Emblem** (text inside shape) | Traditional, established, heritage | Starbucks, Harley-Davidson, BMW |
| 🎨 **Abstract Mark** (non-literal) | Unique conceptual expression, no literal representation | Nike swoosh, Pepsi, Airbnb |

**Why:** Logo type is a strategic decision, not an aesthetic one. A startup with a long name probably needs a lettermark or combination mark; a one-word brand name can pull off a wordmark. The LLM needs to recommend the right logo format before designing the mark.

**Insight:** The founder's logo expectations. Also reveals whether the founder understands the practical considerations (where will this logo live? Website header? App icon? Merch?).

**Consumed by:** L (logo type, lockup variations), BB (logo usage rules), W (header/nav/favicon), M (placements)  
**Required:** Yes  
**Format:** Visual cards with examples. Select one.  
**Conditional:** If "Icon/Symbol" selected → prompt: *"Abstract marks like the Nike swoosh are powerful but take years of brand investment to become recognizable. Are you comfortable with that timeline, or would a combination mark (icon + name) give you more immediate recognition?"*

---

#### Q5.6 — Logo References
**Q:** Share 2–5 logos or marks that you admire — and tell us what you admire about them. These don't have to be from your industry.

*For each: "I like [Brand]'s logo because [specific reason]."*

*Example: "I like FedEx's logo because the hidden arrow is clever without being gimmicky."*  
*Example: "I like Patagonia's logo because it feels timeless and organic, not corporate."*

**Why:** Logo references give the Logo Engine a concrete target. Combined with the strategic foundation, the engine knows WHAT to express (strategy) and WHAT IT SHOULD FEEL LIKE (references).

**Insight:** The founder's mark taste. Also reveals whether the founder's logo references match their brand personality (a bold, edgy personality admiring only delicate, minimalist logos = tension).

**Consumed by:** L (visual direction, technique, complexity), CD (mark sensibility)  
**Required:** No (but strongly encouraged — dramatically improves logo output)  
**Format:** Repeater: Logo name (text) + "What I admire" (textarea) + optional URL input  
**Conditional:** Logo references are cross-referenced against archetype and personality traits.

---

#### Q5.7 — Existing Assets (Rebranding & New Brands)
**Q:** Do you have any existing brand assets? Logo files, color palettes, fonts you're currently using, a website, brand guidelines?

**Why:** Existing assets constrain creative direction. A brand with a beloved existing logo needs evolution, not revolution. A brand with zero assets has a blank slate. This question also gates the Rebranding Branch (Section 4.2).

**Insight:** Whether this is a creation or evolution project. Also provides constraints the CD must work within.

**Consumed by:** CD (evolution vs. creation approach), L (logo evolution or new design), BB (existing guideline enhancement), W (design system alignment)  
**Required:** Yes  
**Format:** Multi-select: "I have a logo" / "I have brand colors" / "I have fonts" / "I have a website" / "I have brand guidelines" / "I have nothing yet." Plus optional file upload (deferred to V2 for now) or URL inputs.  
**Conditional:** If ANY existing assets are selected → triggers Existing Assets Branch (see Section 4.1).

---

#### Q5.7a — Existing Asset Details (Conditional)
**Q:** Tell us about your current brand. What's working? What isn't? What needs to change and what should stay?

*This helps us understand whether we're evolving an existing identity or building something entirely new.*

**Why:** Disambiguates between a refresh (keep the logo, improve everything else) and a rebrand (change everything). Without this question, BrandForge might recommend a radical change when the founder just wants polish.

**Insight:** The founder's relationship with their current brand identity. Also reveals attachment level — a founder who's emotionally attached to their current logo needs a different approach than one who's eager to burn it all down.

**Consumed by:** CD (evolution strategy), L (mark retention/evolution decision), BB, W (redesign scope), M (rebrand launch strategy)  
**Required:** Conditional (triggered by Q5.7)  
**Format:** Textarea (max 500 chars) + For each asset type: three radio options — "Keep as is," "Evolve," "Replace entirely"  
**Conditional:** If "Replace entirely" selected for logo → triggers Q5.7b.

---

#### Q5.7b — Logo Attachment Check (Conditional)
**Q:** You're planning to replace your current logo entirely. Just to confirm — is your current logo causing problems (recognition, reproduction, relevance), or are you simply ready for something new?

**Why:** Replacing a logo that customers recognize is a high-stakes decision. This question ensures the founder has thought it through, not just gotten excited about a redesign.

**Insight:** Whether the logo replacement is strategic or emotional. Also provides context for the rebrand narrative in the strategy.

**Consumed by:** S (Rebrand narrative), L (replacement approach), M (rebrand communication)  
**Required:** Conditional (triggered by Q5.7a "Replace entirely")  
**Format:** Radio: "The current logo has practical problems (doesn't scale, looks dated, doesn't reproduce well)" / "We've outgrown it strategically" / "I just never liked it" / "We're making a clean break" + optional textarea for details.  
**Conditional:** No

---

#### Q5.8 — Website & Digital Goals
**Q:** What role does your website play in your business? What does it need to do?

| Goal | Description |
|------|-------------|
| 🏪 **Sell directly** | E-commerce, checkout, product pages |
| 📋 **Generate leads** | Contact forms, demo requests, consultation bookings |
| 📖 **Educate & inform** | Blog, resources, documentation, thought leadership |
| 🏛️ **Build credibility** | Case studies, testimonials, team page, investor info |
| 📱 **Support product** | App landing page, download links, feature pages |
| 👥 **Build community** | Forums, membership, events, newsletter |

**Why:** Website purpose determines design priorities, information architecture, and conversion strategy. A lead-gen site vs. an e-commerce site vs. a credibility site are fundamentally different projects.

**Insight:** The website's strategic role. Also reveals whether the founder understands the difference between "we need a website" and "our website needs to convert visitors into demo requests."

**Consumed by:** W (IA, page templates, conversion design), CD (digital-first visual language), BB (digital guidelines)  
**Required:** Yes  
**Format:** Multi-select cards with checkboxes. Plus a textarea: "In one sentence, what should a visitor do after seeing your website?"  
**Conditional:** No

---

#### Q5.9 — Marketing Goals & Channels
**Q:** Beyond your website, how do you plan to reach customers? What marketing channels matter most?

| Channel | Priority (1–5) |
|---------|---------------|
| 📧 Email marketing | |
| 📱 Social media (organic) | |
| 💰 Paid ads (social/search) | |
| 🔍 SEO / Content marketing | |
| 🎤 Events / Conferences | |
| 🤝 Partnerships / Affiliates | |
| 📰 PR / Media coverage | |
| 📊 Sales team / Outreach | |
| 📦 Physical / Packaging | |
| 🎥 Video / YouTube | |

**Why:** Different marketing channels demand different brand assets. A brand heavy on social media needs templates and visual consistency rules. A brand heavy on events needs presentation design and booth graphics. The strategy must anticipate where the brand will live.

**Insight:** The brand's primary touchpoints. Also reveals whether the founder has a realistic marketing plan or is winging it.

**Consumed by:** M (asset generation strategy, template priorities), CD (channel-specific visual guidelines), BB (multi-channel brand rules)  
**Required:** No (but recommended)  
**Format:** Channel list with priority sliders (1–5). Channels rated 4+ get expanded questions.  
**Conditional:** Channels rated 4+ trigger follow-up questions about specific needs for that channel.

---

#### Phase 5 Reflection
> *"We have everything we need. [Company Name] is a [Primary Archetype] brand with a [Primary Tone] voice, living in a [Design Quality 1] + [Design Quality 2] visual world of [Color 1], [Color 2], and [Color 3]. Your logo should be a [Logo Type] that feels like [Logo Reference 1] and [Logo Reference 2]. Your website needs to [Primary Website Goal] and you'll reach customers through [Top Marketing Channels]. Ready to review before we generate your brand strategy?"*

---

## 4. Conditional Branches

Dynamic paths ensure the discovery adapts to the founder's situation rather than forcing everyone through the same funnel.

### 4.1 Existing Brand Branch

**Trigger:** Q5.7 — founder indicates they have existing brand assets.

**Path:**
```
Q5.7 (Have assets?) → YES
  ├── Q5.7a: What's working / not working? What stays / changes?
  │   └── If "Replace logo entirely" → Q5.7b: Logo attachment check
  ├── For each asset type: "Keep / Evolve / Replace"
  └── Return to main flow at Q5.8
```

**Strategic rationale:** Brands with existing assets need a different conversation. The discovery must capture the current state (what's being replaced) AND the desired future state (what's being created). The strategy should include transition analysis — what to sunset, what to evolve, what to keep. This branch is essential for V1 for any founder with existing assets, and will be expanded in V3 for full rebranding flows.

### 4.2 Full Rebranding Branch (Deferred to V3)

**Trigger:** Q1.7 Stage = "Mature" or "Growth" AND the founder has existing brand assets AND expresses desire to replace multiple elements.

**Path (V3 design):**
```
Q1.7 (Stage: Mature/Growth)
  + Q5.7 (Has assets)
  + Q5.7a (Replace multiple elements)
  ──▶ REBRANDING BRANCH
       ├── Brand Equity Analysis: What does your current brand mean to customers?
       ├── Migration Strategy: Phased rollout or hard cutover?
       ├── Legacy Asset Audit: What needs to be updated and by when?
       ├── Stakeholder Management: Who needs to approve the rebrand?
       ├── Communication Strategy: How will you tell customers about the change?
       └── Return to main flow
```

**Why deferred:** Full rebranding is dramatically more complex than new brand creation. It requires equity analysis, migration planning, and stakeholder management — none of which are needed for the V1 MVP. The V1 Existing Brand Branch (4.1) handles the 80% case: founders who have some assets and want to improve them.

### 4.3 Multi-Stakeholder Branch (Deferred to V4)

**Trigger:** Q1.7 Stage = "Growth" or "Mature" AND founder indicates multiple decision-makers.

**Path (V4 design):**
```
Multi-stakeholder detected
  ├── Stakeholder identification: Who else has input on the brand?
  ├── Alignment diagnostic: Where do stakeholders agree/disagree?
  ├── Conflict resolution prompts: Guided exercises for alignment
  └── Consensus report: Areas of agreement + areas needing discussion
```

**Why deferred:** Multi-stakeholder alignment is a consulting engagement, not a self-service flow. V1–V3 should focus on the single-founder case. V4 would add tools for teams.

### 4.4 Insufficient Competitor Knowledge Branch

**Trigger:** Q2.4 — founder names fewer than 2 competitors across all layers.

**Path:**
```
Q2.4 (Fewer than 2 competitors)
  └── "Are you sure?" prompt
      ├── Option A: "You're right — let me think harder" (return to Q2.4)
      ├── Option B: "We genuinely don't have direct competitors" → Q2.4b
      └── Option C: "I'm not sure who my competitors are" → Q2.4c

Q2.4b (No competitors)
  └── "What do your customers currently use instead of your product?
      What would they use if your product didn't exist?"

Q2.4c (Not sure)
  └── "Let's figure it out. What problem do you solve? Who else
      is solving it — even partially, even badly?"
```

**Strategic rationale:** "We have no competitors" is almost always wrong. This branch uses gentle Socratic questioning to help the founder discover their real competitive landscape without feeling interrogated.

### 4.5 Personality Contradiction Branch

**Trigger:** Q3.2 — contradictory personality trait pairs selected (see Section 5.1 for the full matrix).

**Path:**
```
Q3.2 (Contradiction detected: e.g., Bold + Gentle)
  └── Inline notice (not blocking):
      "Interesting — 'Bold' and 'Gentle' together.
       Does one of these dominate, or is the tension
       part of your brand's character?"
      ├── "Bold dominates — gentle is secondary" (saves priority)
      ├── "Gentle dominates — bold is secondary" (saves priority)
      ├── "The tension is intentional" (saves with contradiction flag)
      └── "Let me reconsider" (returns to Q3.2)
```

**Strategic rationale:** Contradictions aren't errors — they're data. Some brands genuinely embody tension (e.g., "bold yet gentle" could describe a brand like Aesop). But the system should verify intentionality rather than silently accepting contradictions.

### 4.6 Scattered Inspirations Branch

**Trigger:** Q4.1 — inspiration brands span mutually incompatible aesthetics (e.g., minimal + maximal, corporate + playful, warm + cool).

**Path:**
```
Q4.1 (Scattered inspirations: Minimal + Maximal)
  └── "You admire [Minimal brand] for its restraint AND
      [Maximal brand] for its richness. These pull in different
      directions. Which world feels more like [Company Name]'s home?"
      ├── "Closer to [Minimal brand]" (weights CD accordingly)
      ├── "Closer to [Maximal brand]" (weights CD accordingly)
      └── "Somewhere between — a bit of both" (records as intentional tension)
```

### 4.7 Premium-Color Conflict Branch

**Trigger:** Q5.2/Q5.3 — brand positioned as premium/luxury but avoiding classic premium colors.

**Path:**
```
Q5.2/Q5.3 (Premium positioning + avoiding gold/black/silver)
  └── "You're building a premium brand but avoiding [colors].
      Premium brands often use these because they signal [reason].
      Is this a deliberate creative choice?"
      ├── "Yes — I want premium without looking like everyone else"
      │   (records as intentional differentiation)
      ├── "I hadn't thought about it — let me reconsider"
      │   (returns to color selection)
      └── "Tell me more about why premium brands use those colors"
          (educational micro-content)
```

---

## 5. Contradiction Detection

Contradiction detection is a strategic differentiator for BrandForge. The system doesn't just collect answers — it listens for tension. When a founder says their brand is "bold" but also "gentle," that's not a mistake. It's a signal. The most memorable brands live in productive tension — and the discovery process is where that tension is first heard.

Detection happens at three levels:
1. **Real-time (in-wizard):** Inline notices surface contradictions as the founder answers, inviting reflection without blocking progress.
2. **Pre-generation (validator.ts):** A full contradiction pass before strategy generation flags unresolved tensions.
3. **Strategic synthesis:** The Creative Intelligence Layer transforms detected contradictions into Creative Tension (D3), the dimension that makes every BrandForge output distinctive.

### Detection Philosophy

Contradictions are not errors. They are data. The system's job is to:
- **Surface them gracefully** — never make the founder feel they got something wrong
- **Invite reflection, not correction** — "Is this tension intentional?" not "Please fix this conflict"
- **Preserve intentional tensions** — founders who embrace contradiction are building distinctive brands
- **Flag unresolved ones** — contradictions the founder hasn't acknowledged become strategic risks
- **Transform them into creative fuel** — every contradiction is an opportunity for a more interesting brand

### Contradiction Categories

The system catches and surfaces these contradictions:

### 5.1 Personality Trait Contradictions

| Trait A | Trait B | Tension |
|---------|---------|---------|
| Bold | Gentle | Assertion vs. softness |
| Playful | Serious | Levity vs. gravity |
| Modern | Traditional | Innovation vs. heritage |
| Minimal | Maximal | Subtraction vs. addition |
| Edgy | Safe | Risk vs. security |
| Aggressive | Soft | Force vs. tenderness |
| Exclusive | Approachable | Gatekeeping vs. welcoming |
| Rebellious | Diplomatic | Confrontation vs. harmony |
| Loud | Quiet | Presence vs. restraint |
| Trendy | Classic | Novelty vs. permanence |

### 5.2 Tone of Voice vs. Archetype Mismatches

| Archetype | Unexpected Tone | Why It's Tension |
|-----------|----------------|------------------|
| Ruler | Friendly, Casual | Rulers speak with authority and formality |
| Jester | Formal, Authoritative | Jesters break rules, including communication rules |
| Caregiver | Bold, Aggressive | Caregivers nurture; aggression undermines trust |
| Outlaw | Diplomatic, Safe | Outlaws challenge; diplomacy blunts the edge |
| Innocent | Witty, Edgy | Innocents are sincere, not clever or provocative |
| Lover | Technical, Minimal | Lovers are sensory and emotional, not analytical |

**Behavior:** These are surfaced as informational notices, not blocks. The founder might be intentionally choosing a counter-intuitive combination. The notice reads: *"[Archetype] brands typically use [Expected Tone]. Your [Unexpected Tone] choice could be a powerful differentiator — just want to confirm that's intentional."*

### 5.3 Keyword Contradictions

| Keyword | Never Keyword | Issue |
|---------|--------------|-------|
| "Bold" | "Aggressive" | Semantic neighbor — what's the distinction? |
| "Premium" | "Expensive" | Often conflated — clarify positioning |
| "Simple" | "Basic" | Value judgment on the same concept |
| "Modern" | "Cold" | "Modern" design is often perceived as "cold" |
| "Warm" | "Soft" | Emotional warmth vs. perception of weakness |

**Behavior:** If a keyword is a close semantic neighbor of a never_keyword, surface: *"You want to own '[Keyword]' while rejecting '[Never Keyword]'. These can be close — what's the distinction? How will you make sure [Keyword] doesn't become [Never Keyword]?"*

### 5.4 Color-Personality Mismatches

| Personality Signal | Color Choice | Tension |
|-------------------|-------------|---------|
| "Warm" personality | Only cool colors (blues, greens) | Emotional warmth expressed through cool palette |
| "Bold" personality | Only pastels | Boldness expressed through soft colors |
| "Luxury" positioning | Avoiding black, gold, white | Luxury coded through non-traditional palette |
| "Playful" personality | Only grayscale | Playfulness in monochrome |

### 5.5 Inspiration Coherence Check

The system analyzes inspiration brands for aesthetic coherence:

1. **Category clustering:** Do all inspirations fall in the same aesthetic category (minimal, bold, warm, etc.)?
2. **Industry diversity:** Are inspirations from diverse industries (good — cross-pollination) or all from the same industry (risk of derivative output)?
3. **Admiration reason clustering:** Do founders admire the same quality across brands (coherent taste) or wildly different qualities (unclear direction)?

**Scoring:** High coherence (all brands share 2+ aesthetic qualities) = green. Moderate coherence = yellow with note. Low coherence (brands are aesthetically contradictory) = prompt for clarification (Section 4.6).

### 5.6 Founder Story vs. Brand Positioning
**Check:** Compare the founder's personal story (Q1.8) against the brand's positioning (Phase 2) and personality (Phase 3).

- If the founder's story reveals deep personal connection to a problem, but the brand positioning is purely functional ("we're the most efficient CRM") → surface: *"Your story reveals a deep personal connection to [problem]. Your positioning focuses on efficiency. Is there a way to bring more of that personal conviction into how you describe the brand?"*
- If the founder built the company from lived experience, but the brand archetype and voice are impersonal/corporate → surface: *"Your founding story is deeply human. Your brand personality is more formal. Would a warmer, more personal voice feel more authentic?"*

### 5.7 Values vs. Business Goals Tension
**Check:** Cross-reference Core Values (Q1.10) against Business Goals (Q1.11).

- If the founder values "craftsmanship" but their primary goal is "rapid growth" → surface: *"You value craftsmanship, which often requires time and patience. Your primary goal is rapid growth. How do these coexist? What does craftsmanship look like at speed?"*
- If the founder values "radical transparency" but is in stealth mode or avoiding competitor mentions → surface: *"Transparency is a core value, but your competitive positioning is guarded. Is there a tension worth exploring — being open while protecting strategic advantage?"*

### 5.8 The "You vs. Your Inspirations" Gap

**Check:** Compare the founder's stated personality/tone/visual preferences against the aesthetic profile of their inspiration brands.

- If the founder says "minimal, warm, approachable" but their inspirations are all "bold, maximal, exclusive" → surface: *"Your brand personality is [X] but the brands you admire are [Y]. Is your brand personality aspirational (where you want to be) or authentic (where you are now)?"*
- This is the single most valuable contradiction — it reveals whether the founder is building a brand they love vs. a brand that's like brands they love.

---

## 6. Strategic Validation

Before the user submits and triggers generation, BrandForge runs a strategic validation pass. This is NOT the same as the input validator (which checks for missing fields). This checks whether the assembled inputs form a coherent, defensible brand strategy.

### 6.1 Section Completion Check

| Section | Critical Fields | Validation |
|---------|----------------|------------|
| Foundation | Company name, description, industry | All required |
| Positioning | Target audience, USP, competitors | At least one persona, USP scored for specificity |
| Personality | Archetype, traits, tone, keywords, never_keywords | Minimum counts met |
| Inspiration | Inspiration brands with reasons, emotions | Minimum 3 brands with reasons |
| Creative Foundation | Design sensibility, preferred colors, typography, logo type | All sliders completed, colors selected |

### 6.2 Strategic Coherence Score

Each of these dimensions is scored 1–10 by a rules engine (not the LLM — this is deterministic, pre-generation validation):

| Dimension | What it measures | How it's calculated |
|-----------|-----------------|---------------------|
| **Clarity** | Can we state what this brand does in one sentence? | Based on description length, USP specificity, tagline |
| **Differentiation** | Is there a clear reason to choose this brand over alternatives? | Based on USP quality, competitive differentiation fields, advantage count |
| **Coherence** | Do all inputs point in the same direction? | Low coherence = many contradictions detected |
| **Completeness** | Are all critical sections sufficiently filled? | % of required fields with substantive content |
| **Depth** | Did the founder go beyond surface-level answers? | Average response length, number of specifics, persona detail |
| **Ambition** | Is there enough strategic ambition to build a distinctive brand? | Based on vision/mission scope, business goals, stage |

**Display:** A radar/spider chart on the Review screen showing these 6 dimensions. Each section gets a score with a color indicator (green 8–10, yellow 5–7, red 1–4). This is NOT shown as a "grade" — it's framed as:

> *"Here's how your inputs look from a strategic perspective. Scores below 6 indicate areas where a few more details could make your brand strategy significantly stronger."*

### 6.3 The "Can We Build From This?" Gate

Three gates must be satisfied before generation:

1. **Gate 1 — Minimum Viable Strategy:** Foundation + Positioning + Personality phases complete. All required fields filled. Result: pass/fail. If fail, show exactly which fields need attention.

2. **Gate 2 — No Blocking Contradictions:** No detected contradictions that the founder hasn't acknowledged. If the founder clicked "the tension is intentional" on all contradictions, this gate passes.

3. **Gate 3 — Differentiation Check:** The USP must contain at least one specific, verifiable claim. Generic USPs ("we're better," "we're easier," "we're innovative") fail this gate. The founder can override: *"I understand my USP could be more specific. I want to proceed anyway."*

**If all gates pass:** The "Generate Strategy" button becomes active with the copy: *"We have everything we need. Ready to create your brand strategy."*

**If gates fail:** The button shows: *"Almost there — [N] areas need attention before we can build your strategy."* with links to the relevant sections.

### 6.4 Pre-Generation Intelligence Summary

Just before generation, the user sees a final summary — this is the Phase 5 Reflection (Section 3, Phase 5) plus the coherence scores. This is the founder's last chance to correct anything before the LLM generates the strategy.

---

## 7. Future Extension Points

### V2: Visual Reference Upload & Moodboard Support

**New capabilities:**
- Image upload for Q4.4 (visual references — currently placeholder)
- Automatic aesthetic analysis of uploaded images (dominant colors, style clusters)
- Moodboard generation from uploaded references
- Sketch/doodle upload for logo direction

**New questions:**
- "What's one image that captures the feeling you want your brand to have?" (hero image)
- "Show us 3 examples of brand photography that represents your world."

### V3: Full Rebranding Flow

**New phases:**
- Phase: Brand Audit — current brand perception, equity analysis, what to preserve
- Phase: Migration Planning — phased rollout vs. hard cutover, asset inventory
- Phase: Stakeholder Alignment — multi-decision-maker consensus tools

**New conditional branches:**
- Full Rebranding Branch (Section 4.2)
- Brand Equity preservation questions

### V4: Multi-Stakeholder Discovery

**New capabilities:**
- Invite co-founders/team members to contribute
- Side-by-side comparison of stakeholder perspectives
- Alignment scoring and conflict resolution
- Consensus-building exercises

**New questions:**
- "Who else should have a voice in this brand?"
- "Where do you and your co-founder agree/disagree?"

### V5: AI-Guided Follow-Up Questions

**New capabilities:**
- Real-time analysis of answers to generate dynamic follow-ups
- The system notices patterns ("you've mentioned 'craftsmanship' three times — let's explore that")
- Adaptive question ordering based on the founder's apparent knowledge gaps
- Depth probing — if a founder gives a surface answer, the AI asks a deeper follow-up

### V6: Industry Benchmark Integration

**New capabilities:**
- Compare the founder's inputs against industry benchmarks
- "Most SaaS brands in your space use [X] archetype — your choice of [Y] is distinctive"
- Competitive visual landscape mapping
- Automatic identification of white space in the market

### V7: Brand Name Generation & Validation

**New capabilities:**
- If the founder hasn't finalized their name, offer name generation
- Name validation against trademark databases (via API)
- Domain availability checking
- Name scoring against brand strategy criteria

---

## 8. Version 1 Recommendations

### 8.1 Must-Have Questions (Ship in Next Sprint)

These questions form the minimum viable discovery — the irreducible set needed to produce a non-generic brand strategy:

| Phase | # | Question | Rationale for inclusion |
|-------|---|----------|------------------------|
| Foundation | 1 | Q1.1 — Company Name | Identity anchor. Required for everything. |
| Foundation | 2 | Q1.2 — Tagline | Forces clarity. Rich strategic signal. |
| Foundation | 3 | Q1.3 — Detailed Description | Single richest data source. Non-negotiable. |
| Foundation | 4 | Q1.4 — Industry | Competitive context. Required. |
| Foundation | 5 | Q1.5 — Products & Services | Tangible grounding. |
| Foundation | 6 | Q1.6 — Country/Market | Cultural context. |
| Foundation | 7 | Q1.7 — Stage & Scale | Calibrates ambition. Required for DNA scoring. |
| Foundation | 8 | Q1.8 — Founder Story | Founder intent is a first-class strategic input. Critical for authenticity. |
| Foundation | 9 | Q1.9 — Vision & Mission | Strategic ambition ceiling. |
| Foundation | 10 | Q1.10 — Core Values | Guardrails for creative decisions. |
| Foundation | 11 | Q1.11 — Business Goals | Aligns branding to business outcomes. |
| Foundation | 12 | Q1.12 — Brand Goals | Why branding now? Critical framing. |
| Positioning | 12 | Q2.1 — Primary Customer | Personas make strategy specific. Use structured persona cards. |
| Positioning | 13 | Q2.2 — Pain Points | Drives positioning and messaging. |
| Positioning | 14 | Q2.3 — Desires & Aspirations | Emotional driver. Required for archetype selection. |
| Positioning | 15 | Q2.4 — Competitive Awareness | Required for competitive analysis. Use the 3-layer framework. |
| Positioning | 16 | Q2.5 — Differentiation | Sharpens positioning. Required if competitors listed. |
| Positioning | 17 | Q2.6 — USP | Anchor of the strategy. Required with specificity check. |
| Positioning | 18 | Q2.8 — Brand Promise | Litmus test for all decisions. |
| Personality | 19 | Q3.1 — Archetype | Single most powerful personality framework. Required. |
| Personality | 20 | Q3.2 — Personality Traits | Operationalizes archetype. Required. |
| Personality | 21 | Q3.3 — Tone of Voice | Voice definition. Required. |
| Personality | 22 | Q3.7 — Keywords | Semantic building blocks. Required. |
| Personality | 23 | Q3.8 — Never Keywords | Quality control mechanism. Required. |
| Inspiration | 24 | Q4.1 — Brand Inspirations | Taste signal. Required with reasons. |
| Inspiration | 25 | Q4.2 — Brand Confusion | Aesthetic peer group. High-value optional. |
| Inspiration | 26 | Q4.3 — Emotional Response | Emotional KPI. Required. |
| Creative | 27 | Q5.2 — Color Psychology | Primary + avoid colors. Required. |
| Creative | 28 | Q5.4 — Typography Personality | Required for font recommendations. |
| Creative | 29 | Q5.5 — Logo Sensibility | Required for logo engine. |
| Creative | 30 | Q5.7 — Existing Assets | Required for evolution vs. creation. |

### 8.2 Nice-to-Have Questions (Ship If Time Allows)

These add significant value but can be deferred if the sprint is tight:

| Phase | # | Question | Value-add | Deferral cost |
|-------|---|----------|-----------|---------------|
| Foundation | Q1.6a | Market Adaptation | Important for international brands | Low for domestic-only brands |
| Positioning | Q2.7 | Competitive Advantages | Adds depth to differentiation | Strategy is still strong without it |
| Personality | Q3.4 | Communication Context | Useful for multi-channel voice | Can be inferred from other inputs |
| Personality | Q3.5 | Voice Examples | Rich signal for voice calibration | Medium — voice may be less precise |
| Personality | Q3.6 | "Don't Sound Like" | Negative voice space | Medium — voice anti-patterns missed |
| Creative | Q5.1 | Design Sensibility | Precise visual calibration | High — CD has less guidance |
| Creative | Q5.3 | Color Anti-Palette | Important constraint for CD | Medium — may get unwanted colors |
| Creative | Q5.6 | Logo References | Dramatically improves logo output | High — logo engine has less guidance |
| Creative | Q5.8 | Website Goals | Important for website module | Low until website module ships |
| Creative | Q5.9 | Marketing Goals | Important for marketing module | Low until marketing module ships |

### 8.3 Defer to V2

These are explicitly designed but should NOT ship in the next sprint:

- Q4.4 — Visual Reference Uploads (needs image handling, storage, analysis)
- Q5.7a/Q5.7b — Existing Asset Branch details (can be simplified for V1)
- Full Rebranding Branch (Section 4.2)
- Phase Reflections (nice UX but non-critical)
- Coherence scoring visualization (radar chart on Review screen)
- Contradiction resolution UI beyond simple inline notices

### 8.4 Recommended Step Count and Grouping

For the next sprint, restructure the wizard into **7 steps** (down from current 8, but with richer content):

| Step | Phase Content | Question Count | Estimated Time |
|------|--------------|----------------|----------------|
| 1. Your Business | Foundation Q1.1–Q1.6 | 6 | 4–5 min |
| 2. Vision & Goals | Foundation Q1.7–Q1.11 | 5 | 5–7 min |
| 3. Your Customers | Positioning Q2.1–Q2.4 | 4 | 5–7 min |
| 4. Your Position | Positioning Q2.5–Q2.8 | 4 | 4–6 min |
| 5. Brand Personality | Personality Q3.1–Q3.8 | 6 | 5–7 min |
| 6. Inspiration & Feel | Inspiration Q4.1–Q4.3 | 3 | 4–5 min |
| 7. Creative Direction | Creative Q5.2–Q5.7 | 5 | 5–7 min |
| **Total** | | **~28** | **28–38 min** |

### 8.5 Key Changes from Current Wizard

| Current Wizard | Proposed Change | Rationale |
|---------------|-----------------|-----------|
| 8 flat steps | 7 steps with clearer narrative arc | Better user psychology |
| Company description is bare | Q1.3 expanded to "full story" prompt | Richer strategic signal |
| No stage-of-business question | Q1.7 Stage & Scale | Calibrates DNA scores and strategy depth |
| No business goals question | Q1.10 Business Goals | Aligns branding to real outcomes |
| Target audience is one textarea | Q2.1 Persona cards | Structured data produces better personas |
| Competitors are one text field | Q2.4 Three-layer competitive awareness | Richer competitive intelligence |
| No per-competitor differentiation | Q2.5 Competitive differentiation | Sharper competitive analysis |
| USP is just a field | Q2.6 with specificity validation | Prevents weak positioning |
| Brand promise doesn't exist | Q2.8 Brand Promise | New — strategic anchor |
| Archetype doesn't exist in wizard | Q3.1 Brand Archetype selection | Single most valuable personality question |
| Personality is free-form trait chips | Q3.2 Categorized traits with contradiction detection | Better organization, active guidance |
| "Confused with" exists but underused | Q4.2 elevated to primary question | Better aesthetic calibration |
| Emotional response doesn't exist | Q4.3 Emotional Response (choose 3, rank) | New — emotional KPI for strategy |
| Visual preferences are free-form | Q5.1 Design sensibility sliders | Structured visual calibration |
| Typography is free-form text | Q5.4 Typography personality cards | Better font recommendations |
| Logo type isn't asked | Q5.5 Logo sensibility | New — required for logo engine |
| Website/marketing goals are text areas | Q5.8/Q5.9 structured with cards/sliders | Better module inputs |

---

## 9. Question Inventory

### Complete Table of Every Question

| Phase | ID | Question Short Name | Required? | Format | Consumed By | Conditional? | V1? |
|-------|----|---------------------|-----------|--------|-------------|-------------|-----|
| Foundation | Q1.1 | Company Name | ✅ Required | Text input | S, CD, L, BB, W, M | Yes — generic name check | ✅ |
| Foundation | Q1.2 | Tagline (One-Sentence Description) | ✅ Required | Text input | S, W, M | No | ✅ |
| Foundation | Q1.3 | Detailed Description | ✅ Required | Textarea (large) | S, CD, L, BB, W, M | Yes — under 100 chars prompt | ✅ |
| Foundation | Q1.4 | Industry | ✅ Required | Type-ahead + text | S, CD, BB, W | Yes — influences suggestions | ✅ |
| Foundation | Q1.5 | Products & Services | ✅ Required | Textarea | S, CD, L, W, M | No | ✅ |
| Foundation | Q1.6 | Country / Primary Market | ✅ Required | Dropdown + multi-chips | S, CD, W, M | Yes — Q1.6a if multi-market | ✅ |
| Foundation | Q1.6a | Market Adaptation | 🔀 Conditional | Radio (3 options) | S, CD, BB, W | Triggered by Q1.6 multi-market | Nice |
| Foundation | Q1.7 | Stage & Scale | ✅ Required | Single-select cards (4) | S, CD, BB | Yes — triggers Rebranding (V3) | ✅ |
| Foundation | Q1.8 | Founder Story | ✅ Required | Textarea (min 50 chars) | S, CD, BB, W, M | No | ✅ |
| Foundation | Q1.9 | Vision & Mission | ✅ Required | Two textareas | S, CD, BB, W, M | No | ✅ |
| Foundation | Q1.10 | Core Values | ✅ Required (min 3) | Chip input (3–5) | S, CD, BB, W, M | Yes — cross-ref contradictions | ✅ |
| Foundation | Q1.11 | Business Goals (12-Month) | ✅ Required (≥1) | Checklist + text inputs | S, CD, W, M | Yes — Q1.11a if Fundraising | ✅ |
| Foundation | Q1.11a | Investor Audience | 🔀 Conditional | Textarea | S, CD, W, M | Triggered by Q1.11 Fundraising | Nice |
| Foundation | Q1.12 | Brand Goals (Why Now?) | ✅ Required | Textarea | S, CD, BB, W, M | No | ✅ |
| Positioning | Q2.1 | Primary Customer (Personas) | ✅ Required (≥1) | Persona cards (structured) | S, CD, W, M | Yes — <50 chars prompt | ✅ |
| Positioning | Q2.2 | Customer Pain Points | ✅ Required | Textarea (bullet-friendly) | S, W, M | No | ✅ |
| Positioning | Q2.3 | Customer Desires & Aspirations | ✅ Required | Textarea | S, CD, W, M | No | ✅ |
| Positioning | Q2.4 | Competitive Awareness (3 layers) | ✅ Required (≥2 total) | 3 textareas | S, CD, BB, W | Yes — <2 competitors → branch 4.4 | ✅ |
| Positioning | Q2.5 | Competitive Differentiation | 🔀 Conditional | Repeater per competitor | S, CD, M | Triggered by Q2.4 competitors | ✅ |
| Positioning | Q2.6 | Unique Selling Proposition (USP) | ✅ Required | Text input + validation | S, W, M | Yes — weak USP prompt | ✅ |
| Positioning | Q2.7 | Competitive Advantages (Deep Dive) | ⭕ Optional | Multi-select chips + text | S, CD, M | No | Nice |
| Positioning | Q2.8 | Brand Promise | ✅ Required | Text input | S, BB, W, M | No | ✅ |
| Personality | Q3.1 | Brand Archetype | ✅ Required (pri + sec) | Visual card grid (12) | S, CD, L, BB, W, M | Yes — influences suggestions | ✅ |
| Personality | Q3.2 | Brand Personality Traits | ✅ Required (3–5) | Chip grid by category | S, CD, L, BB, W | Yes — contradiction detection | ✅ |
| Personality | Q3.3 | Tone of Voice | ✅ Required (2–4) | Chip grid + primary marker | S, CD, BB, W, M | Yes — archetype cross-ref | ✅ |
| Personality | Q3.4 | Communication Context | ⭕ Optional | Multi-select chips | S, BB, W, M | Yes — Q3.4a if Sales/Support | Nice |
| Personality | Q3.4a | Sales Voice | 🔀 Conditional | Textarea | S, BB, M | Triggered by Q3.4 Sales/Support | Nice |
| Personality | Q3.5 | Voice Examples ("Sounds Like") | ⭕ Optional | Textarea + suggestions | S, BB, W | No | Nice |
| Personality | Q3.6 | "Don't Sound Like" Test | ⭕ Optional | Textarea | S, CD, BB | No | Nice |
| Personality | Q3.7 | Keywords (What You Want to Own) | ✅ Required (≥5) | Chip input + suggestions | S, CD, L, BB, W, M | Yes — contradiction cross-ref | ✅ |
| Personality | Q3.8 | Never Keywords (What You Reject) | ✅ Required (≥3) | Chip input (red) + suggestions | S, CD, L, BB, W, M | Yes — forbidden word preproc | ✅ |
| Inspiration | Q4.1 | Brand Inspirations | ✅ Required (≥3) | Repeater cards (name + reason) | S, CD, L, BB, W, M | Yes — scattered detection (4.6) | ✅ |
| Inspiration | Q4.2 | Brand Confusion | ⭕ Optional | Text input + autocomplete | S, CD, L | No | ✅ |
| Inspiration | Q4.3 | Emotional Response | ✅ Required (3, ranked) | Visual emotion cards grid | S, CD, W, M | Yes — archetype cross-ref | ✅ |
| Inspiration | Q4.4 | Visual References (Upload) | ⭕ Optional (V2) | Image upload (drag-drop) | CD, L, BB, W, M | No | ❌ V2 |
| Creative | Q5.1 | Design Sensibility | ⭕ Optional | Paired sliders (12 pairs) | CD, L, BB, W | Yes — extreme values flagged | Nice |
| Creative | Q5.2 | Color Psychology (Preferred) | ✅ Required (≥2) | Color picker + "why" textarea | CD, L, BB, W, M | Yes — atypical color notice | ✅ |
| Creative | Q5.3 | Color Anti-Palette (Avoid) | ⭕ Optional | Color picker (avoid badge) | CD, L, BB, W | Yes — premium conflict check | Nice |
| Creative | Q5.4 | Typography Personality | ✅ Required (pri + sec) | Visual category cards (9) | CD, L, BB, W | Yes — pairing guidance | ✅ |
| Creative | Q5.5 | Logo Sensibility | ✅ Required | Visual type cards (6) | L, BB, W, M | Yes — abstract mark prompt | ✅ |
| Creative | Q5.6 | Logo References | ⭕ Optional | Repeater (name + reason + URL) | L, CD | No | Nice |
| Creative | Q5.7 | Existing Assets | ✅ Required | Multi-select + upload (V2) | CD, L, BB, W | Yes → Section 4.1 branch | ✅ |
| Creative | Q5.7a | Existing Asset Details | 🔀 Conditional | Textarea + Keep/Evolve/Replace | CD, L, BB, W, M | Triggered by Q5.7 assets | ✅ |
| Creative | Q5.7b | Logo Attachment Check | 🔀 Conditional | Radio + textarea | S, L, M | Triggered by Q5.7a Replace | Nice |
| Creative | Q5.8 | Website & Digital Goals | ⭕ Optional | Multi-select cards + text | W, CD, BB | No | Nice |
| Creative | Q5.9 | Marketing Goals & Channels | ⭕ Optional | Priority sliders (1–5) | M, CD, BB | Yes — high-priority follow-up | Nice |

**Summary:** 48 total questions. ~28 must-have (V1). 8 conditional. 14 optional/nice-to-have. 1 deferred to V2.

**Format legend:** Text input (single-line) | Textarea (multi-line, min/max chars) | Textarea (large, no max) | Type-ahead search + text | Dropdown | Multi-select chips | Single-select cards | Radio | Checklist + inline inputs | Persona cards (structured) | Repeater (dynamic list) | Chip grid | Visual card grid | Visual emotion cards grid | Color picker | Paired sliders | Image upload | Priority sliders

---

*End of Discovery Blueprint v1.0*
