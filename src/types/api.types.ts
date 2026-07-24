import type { SessionUser } from "./auth.types";
import type { Project, ProjectSummary } from "./project.types";

export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  message?: string;
  user?: T;
  projects?: ProjectSummary[];
  project?: Project;
}

export interface SessionResponse {
  user: SessionUser | null;
}

export interface StatusResponse {
  strategyReady?: boolean;
  status?: string;
  error?: string;
}
