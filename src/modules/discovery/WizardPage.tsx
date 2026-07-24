import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "~/components/layout/Navbar";
import { useAuth } from "~/hooks/useAuth";
import type { WizardData, BrandInspiration } from "~/types";

// --- Static option lists ---

const INDUSTRIES = [
  "Technology", "SaaS", "E-commerce", "Healthcare", "Finance", "Education",
  "Real Estate", "Media & Entertainment", "Food & Beverage", "Fashion & Apparel",
  "Travel & Hospitality", "Automotive", "Energy", "Agriculture", "Construction",
  "Consulting", "Legal", "Marketing & Advertising", "Nonprofit", "Retail",
  "Sports & Fitness", "Beauty & Wellness", "Gaming", "Telecommunications",
  "Logistics & Supply Chain", "Manufacturing", "Biotechnology", "Insurance",
  "Consumer Goods", "Other",
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "Singapore", "India", "Brazil", "Netherlands",
  "Sweden", "Switzerland", "United Arab Emirates", "South Korea",
  "New Zealand", "Ireland", "Spain", "Italy", "Mexico", "Other",
];

const PERSONALITY_OPTIONS = [
  "Bold", "Playful", "Sophisticated", "Minimal", "Warm", "Professional",
  "Rebellious", "Elegant", "Friendly", "Authoritative", "Innovative", "Trustworthy",
];

const TONE_OPTIONS = [
  "Casual", "Formal", "Witty", "Empathetic", "Direct", "Inspirational",
  "Educational", "Conversational", "Premium", "Technical",
];

const EMOTION_OPTIONS = [
  "Trust", "Luxury", "Innovation", "Joy", "Power", "Security",
  "Freedom", "Creativity", "Confidence", "Excitement", "Calm", "Belonging",
];

const ADMIRE_OPTIONS = [
  "Minimalism", "Luxury", "Innovation", "Trust", "Performance",
  "Sophistication", "Elegance", "Emotional connection", "Storytelling",
  "Premium experience", "Simplicity", "Craftsmanship", "Boldness", "Playfulness",
];

const INSPIRATION_SUGGESTIONS = [
  "Apple", "Nike", "Stripe", "Rolex", "Tesla", "Airbnb", "Patagonia",
  "Notion", "Ferrari", "Spotify", "Lego", "Mercedes-Benz", "Dior",
  "Rimowa", "Aesop", "Supreme", "Glossier", "Moncler", "Porsche",
  "Bang & Olufsen", "Arc'teryx", "Herman Miller", "Sonos", "Peloton",
];

const TYPOGRAPHY_OPTIONS = [
  "Modern Sans", "Classic Serif", "Display", "Mono", "Handwritten", "Mix",
  "No preference",
];

// --- Step definitions ---
interface StepDef {
  id: string;
  title: string;
  subtitle: string;
}

const STEPS: StepDef[] = [
  { id: "company", title: "Company Basics", subtitle: "Tell us about your business" },
  { id: "vision", title: "Vision & Mission", subtitle: "What drives your company forward" },
  { id: "audience", title: "Audience & Market", subtitle: "Who you serve and how you stand out" },
  { id: "personality", title: "Brand Personality", subtitle: "The character of your brand" },
  { id: "inspirations", title: "Brand Inspirations", subtitle: "The brands and emotions that inspire you" },
  { id: "visual", title: "Visual Preferences", subtitle: "Colors, typography & existing assets" },
  { id: "goals", title: "Goals & Context", subtitle: "What you want your brand to achieve" },
  { id: "review", title: "Review & Submit", subtitle: "Review your answers before generating" },
];

const defaultData: WizardData = {
  company: { name: "", description: "", industry: "", products_services: "", country: "" },
  vision: { mission: "", vision: "", core_values: "", business_goals: "", brand_goals: "" },
  audience: { target_audience: "", pain_points: "", desires: "", competitors: "", usp: "", competitive_advantages: "" },
  personality: { brand_personality: [], tone_of_voice: [], keywords: [], never_keywords: [] },
  inspirations: { brands: [], confused_with: "", emotions: [] },
  visual: { preferred_colors: [], avoid_colors: [], typography: [], existing_assets: "", logo_references: "" },
  goals: { website_goals: "", marketing_goals: "", existing_url: "", social_networks: "" },
};

// --- Helper components ---

function ChipsInput({
  label,
  options,
  selected,
  onChange,
  max,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, opt]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-brand-500/20 border border-brand-400/40 text-brand-300"
                  : "bg-gray-800/50 border border-gray-700/40 text-gray-400 hover:border-gray-600/60 hover:text-gray-300"
              }`}
            >
              {opt}
              {active && <span className="ml-1.5 text-brand-400">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TagInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">{label}</label>
      <div className="bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-2.5 flex flex-wrap gap-2 items-center focus-within:border-brand-500/40 focus-within:ring-1 focus-within:ring-brand-500/20 transition-all min-h-[48px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-brand-500/15 border border-brand-400/30 rounded-lg px-3 py-1 text-sm text-brand-300 animate-fade-in"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-brand-400 hover:text-brand-200 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addTag}
          placeholder={tags.length ? "" : placeholder}
          className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-500 text-sm min-w-[120px] py-1"
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-brand-400 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows || 3}
        className="w-full bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all text-sm resize-none"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-brand-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-brand-400 ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all text-sm appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        <option value="" className="bg-gray-900 text-gray-500">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900 text-gray-100">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorInput({
  label,
  colors,
  onChange,
  max,
}: {
  label: string;
  colors: string[];
  onChange: (v: string[]) => void;
  max: number;
}) {
  const [input, setInput] = useState("");

  const addColor = () => {
    const trimmed = input.trim();
    if (trimmed && !colors.includes(trimmed) && colors.length < max) {
      let color = trimmed;
      if (/^[0-9a-fA-F]{6}$/.test(trimmed)) color = "#" + trimmed;
      if (/^#[0-9a-fA-F]{3,6}$/.test(color) || /^[a-zA-Z]+$/.test(color)) {
        onChange([...colors, color]);
      }
    }
    setInput("");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        {label}
        <span className="text-gray-500 font-normal ml-1">(up to {max})</span>
      </label>
      <div className="flex flex-wrap gap-3 items-center mb-3">
        {colors.map((c) => (
          <div key={c} className="relative group">
            <div
              className="w-10 h-10 rounded-xl border border-gray-700/50 shadow-lg cursor-default"
              style={{ backgroundColor: c }}
            />
            <button
              type="button"
              onClick={() => onChange(colors.filter((x) => x !== c))}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
          placeholder="#6366f1 or blue"
          className="flex-1 bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/40 transition-all text-sm"
        />
        <input
          type="color"
          value={input.startsWith("#") ? input : "#6366f1"}
          onChange={(e) => {
            setInput(e.target.value);
            if (colors.length < max) {
              onChange([...colors, e.target.value]);
              setInput("");
            }
          }}
          className="w-11 h-11 rounded-xl cursor-pointer border border-gray-700/40 bg-transparent p-1"
        />
      </div>
    </div>
  );
}

// --- Main Wizard ---

export function WizardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth("/login");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(defaultData);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("brandforge_wizard");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<WizardData>;
        setData((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
  }, []);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    saveTimer.current = setInterval(() => {
      localStorage.setItem("brandforge_wizard", JSON.stringify(dataRef.current));
    }, 30000);
    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, []);

  // Save to localStorage on step change
  const saveLocal = useCallback((d: WizardData) => {
    localStorage.setItem("brandforge_wizard", JSON.stringify(d));
  }, []);

  // Save to backend
  const saveToBackend = useCallback(
    async (d: WizardData, pid: number | null, status?: string) => {
      setSaving(true);
      try {
        if (pid) {
          await fetch(`/api/projects/${pid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: d,
              name: d.company.name || "Untitled Brand",
              ...(status ? { status } : {}),
            }),
          });
        } else {
          const r = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: d,
              name: d.company.name || "Untitled Brand",
              status: status || "draft",
            }),
          });
          const json = await r.json();
          if (json.project?.id) {
            setProjectId(json.project.id);
          }
        }
      } catch {
        /* silently fail — data is in localStorage */
      }
      setSaving(false);
    },
    []
  );

  const updateData = useCallback(
    (section: keyof WizardData, field: string, value: unknown) => {
      setData((prev) => {
        const updated = {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
        saveLocal(updated);
        return updated;
      });
    },
    [saveLocal]
  );

  // Validation
  const validateStep = useCallback(
    (stepIndex: number): boolean => {
      const errs: string[] = [];
      const d = dataRef.current;

      if (stepIndex === 0) {
        if (!d.company.name.trim()) errs.push("Company Name is required");
        if (!d.company.description.trim()) errs.push("Business Description is required");
      }
      setErrors(errs);
      return errs.length === 0;
    },
    []
  );

  const goNext = useCallback(() => {
    if (validateStep(step)) {
      const next = step + 1;
      setStep(next);
      setErrors([]);
      saveToBackend(dataRef.current, projectId);
    }
  }, [step, validateStep, saveToBackend, projectId]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
      setErrors([]);
      saveToBackend(dataRef.current, projectId);
    }
  }, [step, saveToBackend, projectId]);

  const goToStep = useCallback(
    (idx: number) => {
      setStep(idx);
      setErrors([]);
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setSaving(true);
    const d = dataRef.current;
    try {
      let pid = projectId;
      if (pid) {
        await fetch(`/api/projects/${pid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: d,
            name: d.company.name || "Untitled Brand",
            status: "generating",
          }),
        });
      } else {
        const r = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: d,
            name: d.company.name || "Untitled Brand",
            status: "generating",
          }),
        });
        const json = await r.json();
        if (json.project?.id) pid = json.project.id;
      }
      localStorage.removeItem("brandforge_wizard");
      // Trigger AI strategy generation
      if (pid) {
        fetch(`/api/projects/${pid}/generate`, { method: "POST" }).catch(() => {});
        navigate(`/project/${pid}`);
      }
    } catch {
      setSaving(false);
    }
  }, [projectId, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const isLastStep = step === STEPS.length - 1;
  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar scrolled={true} />

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{currentStep.title}</h1>
              <p className="text-gray-400 text-sm mt-1">{currentStep.subtitle}</p>
            </div>
            <span className="text-sm text-gray-500">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < step && goToStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${
                  i < step
                    ? "bg-brand-500 cursor-pointer hover:bg-brand-400"
                    : i === step
                    ? "bg-brand-400"
                    : "bg-gray-800"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Save indicator */}
        <div className="flex justify-end mb-2">
          {saving ? (
            <span className="text-xs text-gray-500 animate-pulse">Saving...</span>
          ) : (
            <span className="text-xs text-gray-600">Auto-saved</span>
          )}
        </div>

        {/* Step Content */}
        <div className="glass rounded-3xl p-8 sm:p-10 transition-all duration-300">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              {errors.map((e, i) => (
                <p key={i} className="text-red-400 text-sm">
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* --- STEP 0: Company Basics --- */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <TextField
                id="company-name"
                label="Company Name"
                value={data.company.name}
                onChange={(v) => updateData("company", "name", v)}
                placeholder="e.g., Acme Inc."
                required
              />
              <TextareaField
                id="company-desc"
                label="Business Description"
                value={data.company.description}
                onChange={(v) => updateData("company", "description", v)}
                placeholder="Describe what your business does in a few sentences..."
                required
                rows={3}
              />
              <SelectField
                id="company-industry"
                label="Industry"
                value={data.company.industry}
                onChange={(v) => updateData("company", "industry", v)}
                options={INDUSTRIES}
                placeholder="Select an industry..."
              />
              <TextareaField
                id="company-products"
                label="Products & Services"
                value={data.company.products_services}
                onChange={(v) => updateData("company", "products_services", v)}
                placeholder="List your main products or services..."
                rows={3}
              />
              <SelectField
                id="company-country"
                label="Country"
                value={data.company.country}
                onChange={(v) => updateData("company", "country", v)}
                options={COUNTRIES}
                placeholder="Select a country..."
              />
            </div>
          )}

          {/* --- STEP 1: Vision & Mission --- */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <TextareaField
                id="vision-mission"
                label="Mission Statement"
                value={data.vision.mission}
                onChange={(v) => updateData("vision", "mission", v)}
                placeholder="Why does your company exist? What is its purpose?"
                rows={3}
              />
              <TextareaField
                id="vision-vision"
                label="Vision Statement"
                value={data.vision.vision}
                onChange={(v) => updateData("vision", "vision", v)}
                placeholder="What future does your company want to create? Where do you see it in 5-10 years?"
                rows={3}
              />
              <TextareaField
                id="vision-values"
                label="Core Values"
                value={data.vision.core_values}
                onChange={(v) => updateData("vision", "core_values", v)}
                placeholder="One per line, e.g.:&#10;Integrity&#10;Innovation&#10;Customer-first"
                rows={4}
              />
              <TextareaField
                id="vision-biz-goals"
                label="Business Goals"
                value={data.vision.business_goals}
                onChange={(v) => updateData("vision", "business_goals", v)}
                placeholder="What are you trying to achieve in the next 12–24 months?"
                rows={3}
              />
              <TextareaField
                id="vision-brand-goals"
                label="Brand Goals"
                value={data.vision.brand_goals}
                onChange={(v) => updateData("vision", "brand_goals", v)}
                placeholder="What do you want your brand to accomplish?"
                rows={3}
              />
            </div>
          )}

          {/* --- STEP 2: Audience & Market --- */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <TextareaField
                id="audience-target"
                label="Target Audience"
                value={data.audience.target_audience}
                onChange={(v) => updateData("audience", "target_audience", v)}
                placeholder="Who are your ideal customers? Describe demographics, psychographics, behaviors..."
                rows={3}
              />
              <TextareaField
                id="audience-pain"
                label="Customer Pain Points"
                value={data.audience.pain_points}
                onChange={(v) => updateData("audience", "pain_points", v)}
                placeholder="What problems do they have that you solve? What frustrates them?"
                rows={3}
              />
              <TextareaField
                id="audience-desires"
                label="Customer Desires"
                value={data.audience.desires}
                onChange={(v) => updateData("audience", "desires", v)}
                placeholder="What do they truly want? What aspirations drive them?"
                rows={3}
              />
              <TextareaField
                id="audience-competitors"
                label="Main Competitors"
                value={data.audience.competitors}
                onChange={(v) => updateData("audience", "competitors", v)}
                placeholder="List your top 3–5 competitors..."
                rows={3}
              />
              <TextareaField
                id="audience-usp"
                label="Unique Selling Proposition"
                value={data.audience.usp}
                onChange={(v) => updateData("audience", "usp", v)}
                placeholder="What makes your business uniquely valuable? Why should customers choose you?"
                rows={3}
              />
              <TextareaField
                id="audience-advantages"
                label="Competitive Advantages"
                value={data.audience.competitive_advantages}
                onChange={(v) => updateData("audience", "competitive_advantages", v)}
                placeholder="What advantages do you have that competitors don't? (technology, expertise, price, service...)"
                rows={3}
              />
            </div>
          )}

          {/* --- STEP 3: Brand Personality --- */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <ChipsInput
                label="Brand Personality — Pick 3–5 traits"
                options={PERSONALITY_OPTIONS}
                selected={data.personality.brand_personality}
                onChange={(v) => updateData("personality", "brand_personality", v)}
                max={5}
              />
              <ChipsInput
                label="Tone of Voice — Pick 2–4"
                options={TONE_OPTIONS}
                selected={data.personality.tone_of_voice}
                onChange={(v) => updateData("personality", "tone_of_voice", v)}
                max={4}
              />
              <TagInput
                label="Keywords that describe your brand"
                tags={data.personality.keywords}
                onChange={(v) => updateData("personality", "keywords", v)}
                placeholder="Type a keyword and press Enter..."
              />
              <TagInput
                label="Keywords that should NEVER describe your brand"
                tags={data.personality.never_keywords}
                onChange={(v) => updateData("personality", "never_keywords", v)}
                placeholder="Type a keyword and press Enter..."
              />
            </div>
          )}

          {/* --- STEP 4: Brand Inspirations (SPECIAL) --- */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-brand-500/5 border border-brand-500/15 rounded-2xl p-6 -mx-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">✦</span>
                  <div>
                    <h3 className="text-brand-300 font-semibold text-lg">The Inspirations Canvas</h3>
                    <p className="text-gray-400 text-sm">
                      This is the most important step. Great brands are built on inspiration — not imitation.
                    </p>
                  </div>
                </div>

                {/* Brand inspirations */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    What brands inspire the identity you want to build?
                    <span className="text-gray-500 font-normal ml-1">(up to 10)</span>
                  </label>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {INSPIRATION_SUGGESTIONS.filter(
                      (s) => !data.inspirations.brands.some((b) => b.name === s)
                    ).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (data.inspirations.brands.length >= 10) return;
                          updateData("inspirations", "brands", [
                            ...data.inspirations.brands,
                            { name: suggestion, admire: [] },
                          ]);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800/70 border border-gray-700/30 text-gray-400 hover:border-brand-400/30 hover:text-brand-300 transition-all"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Added brands */}
                  {data.inspirations.brands.map((brand, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400 text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-gray-100 font-medium">{brand.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateData(
                              "inspirations",
                              "brands",
                              data.inspirations.brands.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-600 hover:text-red-400 transition-colors text-lg"
                        >
                          ×
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          What do you admire about {brand.name}?
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {ADMIRE_OPTIONS.map((opt) => {
                            const active = brand.admire.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const updated = [...data.inspirations.brands];
                                  if (active) {
                                    updated[idx].admire = updated[idx].admire.filter((a) => a !== opt);
                                  } else {
                                    updated[idx].admire = [...updated[idx].admire, opt];
                                  }
                                  updateData("inspirations", "brands", updated);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  active
                                    ? "bg-gold-500/15 border border-gold-500/30 text-gold-400"
                                    : "bg-gray-800/30 border border-gray-700/20 text-gray-500 hover:border-gray-600/40 hover:text-gray-400"
                                }`}
                              >
                                {opt}
                                {active && <span className="ml-1">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Free-text brand name input - allow custom */}
                      {idx === data.inspirations.brands.length - 1 && (
                        <div className="pt-2">
                          <input
                            type="text"
                            placeholder="+ Add another brand..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = (e.target as HTMLInputElement).value.trim();
                                if (val && data.inspirations.brands.length < 10) {
                                  updateData("inspirations", "brands", [
                                    ...data.inspirations.brands,
                                    { name: val, admire: [] },
                                  ]);
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }
                            }}
                            className="w-full bg-transparent border-b border-gray-800 py-2 text-sm text-gray-400 placeholder-gray-600 outline-none focus:border-brand-500/30 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Initial state: no brands added yet, show input */}
                  {data.inspirations.brands.length === 0 && (
                    <div>
                      <input
                        type="text"
                        placeholder="Type a brand name and press Enter..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              updateData("inspirations", "brands", [{ name: val, admire: [] }]);
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="w-full bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/40 transition-all text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <TextareaField
                id="insp-confused"
                label="If people confused your brand with another company, which one would you WANT it to be, and why?"
                value={data.inspirations.confused_with}
                onChange={(v) => updateData("inspirations", "confused_with", v)}
                placeholder="e.g., 'I'd be honored if someone confused us with Patagonia — because of their commitment to quality and environmental stewardship.'"
                rows={3}
              />

              <ChipsInput
                label="What emotions should customers feel when interacting with your brand? — Pick up to 5"
                options={EMOTION_OPTIONS}
                selected={data.inspirations.emotions}
                onChange={(v) => updateData("inspirations", "emotions", v)}
                max={5}
              />
            </div>
          )}

          {/* --- STEP 5: Visual Preferences --- */}
          {step === 5 && (
            <div className="space-y-8 animate-fade-in">
              <ColorInput
                label="Preferred Colors"
                colors={data.visual.preferred_colors}
                onChange={(v) => updateData("visual", "preferred_colors", v)}
                max={5}
              />
              <ColorInput
                label="Colors to Avoid"
                colors={data.visual.avoid_colors}
                onChange={(v) => updateData("visual", "avoid_colors", v)}
                max={5}
              />
              <ChipsInput
                label="Typography Preferences"
                options={TYPOGRAPHY_OPTIONS}
                selected={data.visual.typography}
                onChange={(v) => updateData("visual", "typography", v)}
                max={3}
              />
              <TextField
                id="visual-assets"
                label="Existing Brand Assets"
                value={data.visual.existing_assets}
                onChange={(v) => updateData("visual", "existing_assets", v)}
                placeholder="URL to your current website or brand guidelines if any"
              />
              <TextareaField
                id="visual-references"
                label="Logo References / Inspiration"
                value={data.visual.logo_references}
                onChange={(v) => updateData("visual", "logo_references", v)}
                placeholder="URLs or descriptions of logos you admire..."
                rows={2}
              />
            </div>
          )}

          {/* --- STEP 6: Goals & Context --- */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <TextareaField
                id="goals-website"
                label="Website Goals"
                value={data.goals.website_goals}
                onChange={(v) => updateData("goals", "website_goals", v)}
                placeholder="What should your website accomplish? (e.g., generate leads, showcase portfolio, sell products...)"
                rows={3}
              />
              <TextareaField
                id="goals-marketing"
                label="Marketing Goals"
                value={data.goals.marketing_goals}
                onChange={(v) => updateData("goals", "marketing_goals", v)}
                placeholder="What marketing outcomes are you aiming for?"
                rows={3}
              />
              <TextField
                id="goals-url"
                label="Existing Website URL"
                value={data.goals.existing_url}
                onChange={(v) => updateData("goals", "existing_url", v)}
                placeholder="https://..."
              />
              <TextField
                id="goals-social"
                label="Social Networks"
                value={data.goals.social_networks}
                onChange={(v) => updateData("goals", "social_networks", v)}
                placeholder="Instagram: @handle, Twitter: @handle, etc."
              />
            </div>
          )}

          {/* --- STEP 7: Review & Submit --- */}
          {step === 7 && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-gray-400 text-sm mb-4">
                Review your answers before generating your brand strategy. Click any section to edit it.
              </p>

              {[
                { label: "Company Basics", stepIdx: 0, items: data.company },
                { label: "Vision & Mission", stepIdx: 1, items: data.vision },
                { label: "Audience & Market", stepIdx: 2, items: data.audience },
                { label: "Brand Personality", stepIdx: 3, items: data.personality },
                { label: "Brand Inspirations", stepIdx: 4, items: data.inspirations },
                { label: "Visual Preferences", stepIdx: 5, items: data.visual },
                { label: "Goals & Context", stepIdx: 6, items: data.goals },
              ].map((section) => (
                <div
                  key={section.label}
                  className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5 group hover:border-gray-700/60 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-300">{section.label}</h3>
                    <button
                      type="button"
                      onClick={() => goToStep(section.stepIdx)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Edit →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(section.items).map(([key, val]) => {
                      if (Array.isArray(val) && val.length === 0) return null;
                      if (typeof val === "string" && !val.trim()) return null;
                      if (Array.isArray(val) && typeof val[0] === "object") {
                        return (
                          <div key={key} className="text-xs">
                            <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}: </span>
                            {(val as BrandInspiration[])
                              .map((b) => `${b.name}${b.admire.length ? ` (${b.admire.join(", ")})` : ""}`)
                              .join(" · ")}
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="text-xs">
                          <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}: </span>
                          <span className="text-gray-400">
                            {Array.isArray(val)
                              ? (val as string[]).join(", ")
                              : String(val).slice(0, 100) + (String(val).length > 100 ? "..." : "")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all duration-200 glow"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 glow hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "Generate My Brand Strategy ✦"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
