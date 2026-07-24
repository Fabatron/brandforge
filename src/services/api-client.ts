import type { ApiResponse, SessionResponse, StatusResponse } from "~/types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const r = await fetch(url, options);
  return r.json();
}

// ── Auth ──

export function sendMagicLink(email: string): Promise<ApiResponse> {
  return request("/api/auth/send-magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function getSession(): Promise<SessionResponse> {
  return request("/api/auth/session");
}

export function logout(): Promise<void> {
  return fetch("/api/auth/logout", { method: "POST" }).then(() => undefined);
}

export function joinWaitlist(email: string): Promise<ApiResponse> {
  return request("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// ── Projects ──

export function createProject(data?: Record<string, unknown>): Promise<ApiResponse> {
  return request("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data?.company?.name || "Untitled Brand", status: "draft", data }),
  });
}

export function updateProject(
  id: number,
  data: Record<string, unknown>,
  status?: string
): Promise<ApiResponse> {
  return request(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, ...(status ? { status } : {}) }),
  });
}

export function getProject(id: number): Promise<ApiResponse> {
  return request(`/api/projects/${id}`);
}

export function getProjects(): Promise<ApiResponse> {
  return request("/api/projects");
}

export function deleteProject(id: number): Promise<ApiResponse> {
  return request(`/api/projects/${id}`, { method: "DELETE" });
}

export function regenerateStrategy(id: number): Promise<ApiResponse> {
  return request(`/api/projects/${id}/generate`, { method: "POST" });
}

export function getProjectStatus(id: number): Promise<StatusResponse> {
  return request(`/api/projects/${id}/status`);
}
