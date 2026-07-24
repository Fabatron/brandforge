import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "~/components/layout/ThemeToggle";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { joinWaitlist } from "~/services/auth.service";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const r = await joinWaitlist(email);
      if (r.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }, [email]);

  if (status === "done") {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-brand-400 text-lg font-semibold mb-1">You're on the list</div>
        <p className="text-gray-400 text-sm">We'll let you know when BrandForge AI launches.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-1.5 flex gap-0 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="flex-1 bg-transparent px-5 py-3 text-gray-100 placeholder-gray-500 outline-none text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-brand-500 hover:bg-brand-400 disabled:opacity-50 transition-colors text-white font-medium px-6 py-3 rounded-xl text-sm whitespace-nowrap"
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-32 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-700/10 rounded-full blur-[128px] animate-pulse-glow animate-delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-[180px]" />
        </div>

        {/* Abstract geometric decoration */}
        <div className="absolute top-1/3 right-[10%] w-24 h-24 border border-brand-400/20 rounded-2xl rotate-12 animate-float opacity-40 hidden lg:block" />
        <div className="absolute bottom-1/4 left-[8%] w-16 h-16 border border-brand-400/15 rounded-full animate-float opacity-30 hidden lg:block" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[20%] left-[12%] w-8 h-8 bg-brand-400/10 rounded-lg -rotate-6 animate-float opacity-50 hidden lg:block" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-8">
            <span className="glass rounded-full px-4 py-1.5 text-sm font-medium text-brand-300 border-brand-700/30">
              AI Branding Consultant
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animate-delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Your Brand,
            <br />
            <span className="text-gradient">Understood First.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up animate-delay-200 max-w-xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed mb-10">
            BrandForge AI is an AI Branding Consultant that thinks like a strategist
            before it draws a single pixel. Get a complete brand strategy — not just a logo.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 glow hover:shadow-[0_0_80px_-15px_rgba(99,102,241,0.5)]"
            >
              Start Your Brand Discovery
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-gray-200 font-medium px-6 py-4 rounded-2xl transition-colors text-sm"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-400 text-sm font-semibold tracking-widest uppercase">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              Strategy before style.
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-lg">
              Three steps from blank canvas to complete brand strategy — all powered by AI that thinks like a strategist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Brand Discovery",
                desc: "Answer thoughtful questions about your business, vision, audience, and inspirations. Our wizard dives deeper than any form you've filled out — because branding demands context.",
              },
              {
                step: "02",
                title: "AI Strategy",
                desc: "Our AI analyzes your positioning, archetypes, emotional drivers, and competitive landscape. It thinks like a senior strategist — connecting dots no logo generator ever would.",
              },
              {
                step: "03",
                title: "Creative Direction",
                desc: "Receive a complete brand strategy document with actionable creative direction. Positioning, voice, messaging, and visual guidance — ready to hand to any designer.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass rounded-3xl p-8 group hover:border-brand-700/40 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="text-brand-400 text-sm font-bold mb-4 tracking-widest">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="relative px-6 py-32">
        <div className="absolute inset-0 bg-brand-950/20" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-400 text-sm font-semibold tracking-widest uppercase">Why BrandForge</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              This is not a logo generator.
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-lg">
              We built BrandForge AI because branding deserves better than templates and clichés.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: "◆",
                title: "Strategy-First",
                desc: "We analyze positioning, audience psychology, and competitive dynamics before we ever think about colors or shapes. The visual identity emerges from the strategy — not the other way around.",
              },
              {
                icon: "◇",
                title: "Radically Original",
                desc: "No \"coffee shop = coffee cup\" logic. Every output is bespoke and born from deep analysis of your unique business. You won't find a single template or cliché in your brand strategy.",
              },
              {
                icon: "◈",
                title: "Agency Quality, AI Speed",
                desc: "Get the depth of a $5,000 brand strategy engagement delivered in minutes. Our AI doesn't replace strategists — it encodes decades of branding expertise into every output.",
              },
              {
                icon: "⬡",
                title: "Built for Founders",
                desc: "You care about your brand because it's your life's work. We get that. BrandForge AI is for founders who refuse to settle for a generic logo and a Canva template.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass rounded-2xl p-8 group hover:border-brand-700/30 transition-all duration-300"
              >
                <div className="text-brand-400 text-2xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="relative px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 sm:p-16">
            <p className="text-2xl sm:text-3xl font-medium text-white leading-relaxed mb-8">
              "Built for founders who care about their brand."
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {["Minimalism", "Strategy", "Originality", "Depth", "Clarity", "Precision"].map((tag) => (
                <span
                  key={tag}
                  className="glass rounded-full px-5 py-2 text-sm font-medium text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-8 text-gray-500 text-sm max-w-md mx-auto">
              BrandForge AI brings the rigor of a brand strategy consultancy with the speed of AI.
              Every strategy is built from first principles — never from a template.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="relative px-6 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-brand-400 text-sm font-semibold tracking-widest uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            $99–$299 per brand
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Agency-quality brand strategy at a fraction of the cost. Launching soon — join the waitlist to be first in line.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
