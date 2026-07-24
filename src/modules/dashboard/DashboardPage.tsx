import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "~/components/layout/Navbar";
import { Badge } from "~/components/ui/Badge";
import { Modal } from "~/components/ui/Modal";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/hooks/useAuth";
import { getProjects, deleteProject } from "~/services/projects.service";
import { timeAgo } from "~/lib/format";
import type { ProjectSummary } from "~/types";

function DeleteConfirmModal({
  projectName,
  onConfirm,
  onCancel,
  deleting,
}: {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <Modal onClose={onCancel}>
      <div className="mb-5 flex justify-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Delete project?</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        This will permanently delete <strong className="text-gray-200">{projectName}</strong> and its
        brand strategy. This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "strategy_generated":
      return <Badge variant="success">Strategy ready</Badge>;
    case "generating":
      return <Badge variant="warning">Generating…</Badge>;
    case "error":
      return <Badge variant="error">Error</Badge>;
    default:
      return <Badge variant="neutral">Draft</Badge>;
  }
}

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth("/login");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    getProjects()
      .then((d) => {
        if (d.projects) setProjects(d.projects);
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await deleteProject(deleteTarget.id);
      if (r.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      // keep modal open on network error
    }
    setDeleting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar scrolled={true} />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/wizard"
              className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 glow flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Brand Discovery
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
            >
              Sign out →
            </button>
          </div>
        </div>

        {/* Projects list */}
        {projects.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-4">
              Your Projects
            </h2>
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-2xl p-5 flex items-center justify-between group transition-all duration-300 hover:border-gray-700/60 hover:bg-gray-900/80"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-gray-200 font-medium group-hover:text-white transition-colors truncate">
                        {p.name}
                      </span>
                      {getStatusBadge(p.status)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Created {timeAgo(p.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {p.status === "strategy_generated" && (
                      <>
                        <Link
                          to={`/project/${p.id}/results`}
                          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-1.5"
                        >
                          View Strategy
                          <span className="text-xs">→</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(p);
                          }}
                          className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                    {p.status === "draft" && (
                      <>
                        <Link
                          to={`/wizard`}
                          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all"
                        >
                          Continue
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(p);
                          }}
                          className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                    {p.status === "generating" && (
                      <>
                        <Link
                          to={`/project/${p.id}`}
                          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium text-sm transition-all"
                        >
                          View progress
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(p);
                          }}
                          className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                    {p.status === "error" && (
                      <>
                        <Link
                          to={`/project/${p.id}`}
                          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-red-400 font-medium text-sm transition-all"
                        >
                          View error
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(p);
                          }}
                          className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="glass rounded-3xl p-12 text-center mb-8">
            <div className="mb-5 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No brand strategies yet</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
              Walk through our intelligent brand discovery process and receive your first AI-generated brand strategy.
            </p>
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 glow"
            >
              Create Your First Brand Strategy
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Discovery CTA (always visible when projects exist) */}
        {projects.length > 0 && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-brand-400 text-3xl mb-3">✦</div>
            <h2 className="text-lg font-semibold mb-2">Brand Discovery Wizard</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
              Walk through our intelligent brand discovery process and receive your AI-generated brand
              strategy — positioning, archetype, voice, and creative direction.
            </p>
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 glow"
            >
              New Brand Discovery
              <span>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          projectName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
