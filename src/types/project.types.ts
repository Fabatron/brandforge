export type ProjectStatus = "draft" | "generating" | "strategy_generated" | "error";

export interface Project {
  id: number;
  user_id: number;
  name: string;
  status: ProjectStatus;
  /** JSON-encoded wizard answers */
  data: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSummary {
  id: number;
  name: string;
  status: string;
  data: string;
  created_at: string;
  updated_at: string;
}

export interface BrandInspiration {
  name: string;
  admire: string[];
}

export interface WizardData {
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
    brands: BrandInspiration[];
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

export interface DNAScore {
  score: number;
  explanation: string;
}

export interface StrategyData {
  executiveSummary?: string;
  brandPositioning?: string;
  brandDnaScore?: Record<string, DNAScore>;
  brandArchetype?: string;
  brandPersonalityVoice?: string;
  messagingFramework?: string;
  customerPersonas?: string;
  competitiveAnalysis?: string;
  creativeDirection?: string;
  generatedAt?: string;
  error?: string;
  message?: string;
}
