import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { sendMagicLink } from "~/services/auth.service";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const r = await sendMagicLink(email);
      if (r.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar scrolled={true} />
      <div className="flex items-center justify-center min-h-screen px-6 pt-16">
        <div className="w-full max-w-md">
          {status === "sent" ? (
            <div className="glass rounded-3xl p-10 text-center">
              <div className="text-brand-400 text-4xl mb-4">✉</div>
              <h1 className="text-2xl font-bold mb-3">Check your email</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We sent a magic link to <span className="text-gray-200 font-medium">{email}</span>.
                Click the link to sign in.
              </p>
              <p className="text-gray-600 text-xs">
                (In development, check the server logs for the link.)
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                ← Use a different email
              </button>
            </div>
          ) : (
            <div className="glass rounded-3xl p-10">
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-400 text-sm mb-8">
                Enter your email and we'll send you a magic link to sign in.
              </p>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-50 transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  {status === "loading" ? "Sending link..." : "Send Magic Link"}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-4 text-red-400 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="mt-6 text-center text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
