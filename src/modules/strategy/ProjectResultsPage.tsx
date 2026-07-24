import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "~/components/layout/Navbar";
import { useAuth } from "~/hooks/useAuth";
import { useScrollSpy } from "~/hooks/useScrollSpy";
import { formatDate } from "~/lib/format";
import type { Project, StrategyData, DNAScore } from "~/types";

const SECTIONS = [
  { key: "executiveSummary", label: "Executive Summary", icon: "◆" },
  { key: "brandPositioning", label: "Brand Positioning", icon: "◎" },
  { key: "brandDnaScore", label: "Brand DNA Score", icon: "◉" },
  { key: "brandArchetype", label: "Brand Archetype", icon: "⬡" },
  { key: "brandPersonalityVoice", label: "Personality & Voice", icon: "♪" },
  { key: "messagingFramework", label: "Messaging Framework", icon: "✧" },
  { key: "customerPersonas", label: "Customer Personas", icon: "❖" },
  { key: "competitiveAnalysis", label: "Competitive Analysis", icon: "◈" },
  { key: "creativeDirection", label: "Creative Direction", icon: "✦" },
];

// ── Helpers ──

type ScoreColor = "emerald" | "amber" | "red";

function getScoreColor(score: number): ScoreColor {
  if (score >= 8) return "emerald";
  if (score >= 6) return "amber";
  return "red";
}

const SCORE_COLORS: Record<ScoreColor, { stroke: string; bg: string; text: string }> = {
  emerald: { stroke: "#10b981", bg: "rgba(16,185,129,0.12)", text: "text-emerald-400" },
  amber: { stroke: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "text-amber-400" },
  red: { stroke: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "text-red-400" },
};

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = 15.9;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 10) * circumference;
  const colors = SCORE_COLORS[getScoreColor(score)];

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
        <circle
          cx="18" cy="18" r={r}
          fill="none" stroke={colors.stroke} strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={`absolute text-sm font-bold ${colors.text}`}>{score}</span>
    </div>
  );
}

// ── Markdown-ish content renderer ──

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-gray-100 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function StrategyContent({ content }: { content: string }) {
  if (!content)
    return <p className="text-gray-500 italic">No content available for this section.</p>;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const k = key++;

    if (trimmed === "") {
      elements.push(<div key={k} className="h-3" />);
      i++;
      continue;
    }

    if (/^#{1,3}\s/.test(trimmed)) {
      const text = trimmed.replace(/^#{1,3}\s/, "");
      elements.push(
        <h3 key={k} className="text-lg font-semibold text-gray-100 mt-6 mb-3">
          {renderInline(text)}
        </h3>,
      );
      i++;
      continue;
    }

    if (/^[A-Z][^:]{2,40}:\s/.test(trimmed) && trimmed.length < 90) {
      const colonIdx = trimmed.indexOf(":");
      elements.push(
        <p key={k} className="text-gray-200 mt-4 mb-1">
          <strong className="text-gray-100">{trimmed.slice(0, colonIdx + 1)}</strong>{" "}
          {renderInline(trimmed.slice(colonIdx + 1).trim())}
        </p>,
      );
      i++;
      continue;
    }

    if (/^[-•]\s/.test(trimmed)) {
      const text = trimmed.replace(/^[-•]\s*/, "");
      elements.push(
        <li key={k} className="text-gray-300 ml-4 mb-1.5 list-disc marker:text-brand-400">
          {renderInline(text)}
        </li>,
      );
      i++;
      continue;
    }

    elements.push(
      <p key={k} className="text-gray-300 mb-4 leading-relaxed">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

// ── Archetype detection ──

const ARCHETYPE_MAP: Record<string, string> = {
  sage: "🦉",
  creator: "🎨",
  hero: "⚔️",
  outlaw: "🏴",
  explorer: "🧭",
  magician: "✨",
  ruler: "👑",
  lover: "💝",
  caregiver: "🤲",
  jester: "🎭",
  innocent: "🌱",
  "regular guy": "🤝",
  "regular girl": "🤝",
  everyman: "🤝",
  everywoman: "🤝",
  rebel: "🏴",
};

function detectArchetype(text: string): { name: string; emoji: string } | null {
  const lower = text.toLowerCase();
  for (const [key, emoji] of Object.entries(ARCHETYPE_MAP)) {
    if (lower.includes(key)) {
      return { name: key.charAt(0).toUpperCase() + key.slice(1), emoji };
    }
  }
  return null;
}

// ── Section card component ──

function SectionCard({
  id,
  icon,
  title,
  children,
  className = "",
}: {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className={`glass rounded-3xl p-8 sm:p-10 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-brand-400 text-lg">{icon}</span>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.12em]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

// ── Main component ──

export function ProjectResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth("/login");
  const [project, setProject] = useState<Project | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projectData, setProjectData] = useState<any>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const sectionIds = SECTIONS.map((s) => s.key);
  const activeSection = useScrollSpy(sectionIds);

  // Fetch project
  useEffect(() => {
    if (!id || !user) return;
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.project) {
          setProject(d.project);
          try {
            setProjectData(JSON.parse(d.project.data));
          } catch {
            setProjectData(null);
          }
          if (d.project.status !== "strategy_generated") {
            navigate(`/project/${id}`);
          }
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => {});
  }, [id, navigate, user]);

  const scrollTo = useCallback((key: string) => {
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileTocOpen(false);
    }
  }, []);

  const handleRegenerate = useCallback(async () => {
    if (!id) return;
    setRegenerating(true);
    try {
      await fetch(`/api/projects/${id}/generate`, { method: "POST" });
      navigate(`/project/${id}`);
    } catch {
      setRegenerating(false);
    }
  }, [id, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading strategy…</div>
      </div>
    );
  }

  if (!user || !project || !projectData?.strategy) return null;

  const strategy = projectData.strategy as StrategyData;
  const companyName = projectData?.company?.name || project.name;
  const industry: string | undefined = projectData?.company?.industry;
  const country: string | undefined = projectData?.company?.country;

  // ── Error state ──
  const isError = strategy.error != null;
  const isMissingKey = strategy.error === "AI_API_KEY_MISSING";

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <Navbar scrolled={true} />
        <main className="flex-1 flex items-center justify-center px-6 pt-20">
          <div className="glass rounded-3xl p-12 max-w-lg w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">⚠</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">
              {isMissingKey ? "API Key Not Configured" : "Strategy Generation Failed"}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {isMissingKey
                ? "The OpenAI API key hasn't been configured yet. Please set the OPENAI_API_KEY environment variable and try again."
                : strategy.message || "An unexpected error occurred while generating your strategy."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {regenerating ? "Starting…" : "Regenerate Strategy"}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Available sections ──
  const availableSections = SECTIONS.filter((s) => {
    if (s.key === "brandDnaScore") {
      const dna = strategy.brandDnaScore;
      return dna != null && typeof dna === "object" && Object.keys(dna).length > 0;
    }
    const content = strategy[s.key as keyof StrategyData];
    return typeof content === "string" && content.trim().length > 0;
  });

  const archetype =
    typeof strategy.brandArchetype === "string" ? detectArchetype(strategy.brandArchetype) : null;

  const overallScore =
    strategy.brandDnaScore?.["overall_score"] ?? strategy.brandDnaScore?.["overall"];

  // ── Render ──
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar scrolled={true} />

      {/* Desktop TOC Sidebar */}
      <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-56 overflow-y-auto border-r border-gray-800/50 bg-gray-950/90 backdrop-blur-sm z-40 print:hidden">
        <div className="p-6 pt-8">
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-4">
            Contents
          </h3>
          <nav className="space-y-0.5">
            {availableSections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => scrollTo(sec.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeSection === sec.key
                    ? "bg-brand-500/10 text-brand-300 font-medium"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <span className="mr-2 text-[10px]">{sec.icon}</span>
                {sec.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-56">
        {/* Hero */}
        <section className="pt-24 pb-10 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                Strategy Generated
              </span>
              {industry && (
                <span className="text-gray-500 text-xs font-medium bg-gray-800/50 px-3 py-1 rounded-full">
                  {industry}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-gradient">
              {companyName}
            </h1>

            <p className="text-gray-500 text-xs uppercase tracking-[0.15em] font-medium mb-4">
              Brand Strategy Document
            </p>

            {(country || strategy.generatedAt) && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-600 text-xs">
                {country && <span>{country}</span>}
                {strategy.generatedAt && <span>Generated {formatDate(strategy.generatedAt)}</span>}
              </div>
            )}
          </div>
        </section>

        {/* Mobile TOC */}
        <div className="lg:hidden sticky top-16 z-30 px-6 pb-4 bg-gray-950/90 backdrop-blur-md print:hidden">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="glass rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 flex items-center gap-2 w-full justify-between"
          >
            <span className="truncate">
              {mobileTocOpen
                ? "Close sections"
                : `Jump to: ${SECTIONS.find((s) => s.key === activeSection)?.label ?? "Contents"}`}
            </span>
            <svg
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${mobileTocOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileTocOpen && (
            <div className="glass rounded-xl mt-2 p-2 space-y-0.5 animate-fade-in">
              {availableSections.map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => scrollTo(sec.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === sec.key
                      ? "bg-brand-500/10 text-brand-300 font-medium"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className="mr-2">{sec.icon}</span>
                  {sec.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Strategy sections */}
        <div className="max-w-3xl mx-auto px-6 pb-32 space-y-10">
          {/* 1. Executive Summary */}
          {strategy.executiveSummary && (
            <section id="executiveSummary" className="scroll-mt-28">
              <div className="glass rounded-3xl p-8 sm:p-10 border-l-4 border-brand-400">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-brand-400 text-lg">◆</span>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.12em]">
                    Executive Summary
                  </h2>
                </div>
                <div className="text-gray-200 text-lg leading-relaxed space-y-4">
                  {strategy.executiveSummary
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, pi) => (
                      <p key={pi}>{renderInline(para.trim())}</p>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. Brand Positioning */}
          {strategy.brandPositioning && (
            <SectionCard id="brandPositioning" icon="◎" title="Brand Positioning">
              <StrategyContent content={strategy.brandPositioning} />
            </SectionCard>
          )}

          {/* 3. Brand DNA Score */}
          {strategy.brandDnaScore != null &&
            typeof strategy.brandDnaScore === "object" &&
            Object.keys(strategy.brandDnaScore).length > 0 && (
              <SectionCard id="brandDnaScore" icon="◉" title="Brand DNA Score">
                {overallScore && (
                  <div className="rounded-2xl p-6 mb-8 border border-gold-400/15 bg-gold-400/[0.04]">
                    <div className="flex items-center gap-5">
                      <ScoreRing score={overallScore.score} size={72} />
                      <div>
                        <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          Overall Brand Strength
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {overallScore.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(strategy.brandDnaScore)
                    .filter(([key]) => !key.startsWith("overall"))
                    .map(([key, val]) => {
                      const score = (val as DNAScore).score;
                      const color = getScoreColor(score);
                      const borderClass =
                        color === "emerald"
                          ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                          : color === "amber"
                            ? "border-amber-500/20 bg-amber-500/[0.04]"
                            : "border-red-500/20 bg-red-500/[0.04]";

                      return (
                        <div
                          key={key}
                          className={`rounded-xl p-5 border ${borderClass} transition-all duration-300 hover:scale-[1.02]`}
                        >
                          <div className="flex items-start gap-4">
                            <ScoreRing score={score} size={48} />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-200 font-medium text-sm capitalize mb-1">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-gray-500 text-xs leading-relaxed">
                                {(val as DNAScore).explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </SectionCard>
            )}

          {/* 4. Brand Archetype */}
          {strategy.brandArchetype && (
            <SectionCard id="brandArchetype" icon="⬡" title="Brand Archetype">
              {archetype && (
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-800/50">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-3xl shrink-0">
                    {archetype.emoji}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Primary Archetype
                    </p>
                    <p className="text-2xl font-bold text-gray-100">{archetype.name}</p>
                  </div>
                </div>
              )}
              <StrategyContent content={strategy.brandArchetype} />
            </SectionCard>
          )}

          {/* 5-9. Remaining sections */}
          {(
            [
              { key: "brandPersonalityVoice", label: "Personality & Voice", icon: "♪" },
              { key: "messagingFramework", label: "Messaging Framework", icon: "✧" },
              { key: "customerPersonas", label: "Customer Personas", icon: "❖" },
              { key: "competitiveAnalysis", label: "Competitive Analysis", icon: "◈" },
              { key: "creativeDirection", label: "Creative Direction", icon: "✦" },
            ] as const
          ).map((sec) => {
            const text = strategy[sec.key as keyof StrategyData];
            if (typeof text !== "string" || !text.trim()) return null;
            return (
              <SectionCard key={sec.key} id={sec.key} icon={sec.icon} title={sec.label}>
                <StrategyContent content={text} />
              </SectionCard>
            );
          })}

          {/* Footer actions */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-800/50 print:hidden">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-all"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/wizard")}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all glow"
            >
              New Brand Discovery
            </button>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-gray-200 transition-all print:hidden"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
