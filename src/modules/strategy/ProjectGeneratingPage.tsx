import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "~/components/layout/Navbar";
import { useAuth } from "~/hooks/useAuth";

const STATUS_MESSAGES = [
  "Analyzing your brand DNA...",
  "Mapping competitive landscape...",
  "Identifying archetypal patterns...",
  "Crafting your strategic narrative...",
  "Defining voice and personality...",
  "Building customer personas...",
  "Developing creative direction...",
  "Synthesizing strategic insights...",
];

export function ProjectGeneratingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth("/login");
  const [projectName, setProjectName] = useState("");
  const [statusMsgIdx, setStatusMsgIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch project and trigger generation
  useEffect(() => {
    if (!id || !user) return;

    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.project) {
          try {
            const data = JSON.parse(d.project.data);
            setProjectName(data?.company?.name || d.project.name || "Your Brand");
          } catch {
            setProjectName(d.project.name || "Your Brand");
          }

          if (d.project.status === "strategy_generated") {
            navigate(`/project/${id}/results`);
            return;
          }

          if (d.project.status === "error") {
            try {
              const data = JSON.parse(d.project.data);
              setError(data?.strategy?.message || "An error occurred during generation.");
            } catch {
              setError("An error occurred during generation.");
            }
            return;
          }

          if (d.project.status === "generating" || d.project.status === "draft") {
            triggerGeneration();
          }
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => {});
  }, [id, navigate, user]);

  // Cycle through status messages
  useEffect(() => {
    if (!isGenerating) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setStatusMsgIdx((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating]);

  // Poll for completion
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/projects/${id}/status`);
        const d = await r.json();

        if (d.strategyReady) {
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          navigate(`/project/${id}/results`);
        } else if (d.status === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          setError(d.error || "An error occurred during generation.");
          setIsGenerating(false);
        }
      } catch {
        // Keep polling on network errors
      }
    }, 2000);
  }, [id, navigate]);

  useEffect(() => {
    if (isGenerating) {
      startPolling();
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isGenerating, startPolling]);

  const triggerGeneration = async () => {
    try {
      setIsGenerating(true);
      await fetch(`/api/projects/${id}/generate`, { method: "POST" });
    } catch {
      setError("Failed to start generation. Please try again.");
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <Navbar scrolled={true} />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="relative z-10 glass rounded-3xl p-12 sm:p-16 max-w-lg w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">⚠</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">Generation Failed</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={triggerGeneration}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all"
              >
                Retry Generation
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar scrolled={true} />
      <div className="flex-1 flex items-center justify-center px-6">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-700/10 rounded-full blur-[128px] animate-pulse-glow animate-delay-500" />
          <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-[96px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 glass rounded-3xl p-12 sm:p-16 max-w-lg w-full text-center glow">
          {/* Pulsing orb */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/40 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-brand-400 animate-pulse" style={{ animationDuration: "1.5s" }} />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-brand-400/30 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute -inset-4 rounded-full border border-brand-400/10 animate-pulse" style={{ animationDelay: "0.5s", animationDuration: "3s" }} />
              <div className="absolute -inset-8 rounded-full border border-brand-400/5 animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }} />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-3">
            Generating your brand strategy<span className="text-brand-400 animate-pulse">...</span>
          </h1>

          <div className="space-y-2 mb-2">
            <div className="text-sm text-gray-400 mb-6 h-6 flex items-center justify-center">
              <span className="animate-fade-in" key={statusMsgIdx}>
                {STATUS_MESSAGES[statusMsgIdx]}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="glass rounded-full h-1.5 overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-300 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(85, elapsed * 2)}%`,
              }}
            />
          </div>

          <p className="text-gray-500 text-xs">
            {elapsed < 60
              ? "Crafting a premium, original strategy — this takes about 30–60 seconds"
              : "Still working... premium strategy takes time"}
          </p>

          <p className="text-gray-700 text-xs mt-4">
            Analyzing{" "}
            <span className="text-gray-500 font-medium">
              {projectName || "your brand"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
