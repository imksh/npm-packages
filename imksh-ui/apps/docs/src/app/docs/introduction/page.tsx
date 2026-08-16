import Link from "next/link";
import { ArrowRight, Zap, Palette, Shield, Package } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Zero Config",
    description:
      "Drop in and go. Components inherit your Tailwind design tokens automatically — no configuration required.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: Palette,
    title: "Fully Themed",
    description:
      "Built-in support for light, dark, and custom themes. Every component respects your global design system.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
  {
    icon: Shield,
    title: "Accessible",
    description:
      "Every component is built with WAI-ARIA patterns in mind. Keyboard navigable and screen reader friendly.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    icon: Package,
    title: "Single Package",
    description:
      "One import. All components. No dependency hell — just `@imksh/ui` and you're ready to ship.",
    color: "#f87171",
    glow: "rgba(248,113,113,0.15)",
  },
];

const stats = [
  { value: "10+", label: "Components" },
  { value: "5", label: "Themes" },
  { value: "100%", label: "TypeScript" },
  { value: "A11y", label: "Accessible" },
];

export default function IntroductionPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl px-8 py-16 sm:px-12 sm:py-20 text-center">
        {/* Background gradient mesh */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.2), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139,92,246,0.15), transparent), var(--muted)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute -top-20 -left-20 h-64 w-64 rounded-full animate-pulse-glow pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full animate-pulse-glow pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "1.5s",
          }}
        />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "#818cf8" }}
            />
            @imksh/ui v1.4 — Now available
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
            style={{
              background:
                "linear-gradient(135deg, #e2e8f0 0%, #c7d2fe 40%, #a5b4fc 70%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Build faster with beautiful components.
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl leading-relaxed max-w-[75%]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Accessible. Customizable. Premium. A unified component library that
            inherits your design system and feels incredible out of the box.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Link
              href="/docs/installation"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/25"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 20px rgba(99,102,241,0.35)",
              }}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/docs/components/button"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--foreground)",
              }}
            >
              Browse Components
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c7d2fe, #a5b4fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Features ──────────────────────────────────── */}
      <section className="space-y-6">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Why @imksh/ui?
          </h2>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Instead of installing dozens of individual packages, get everything you
            need from a single cohesive library built for your monorepo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 30% 40%, ${feat.glow}, transparent)`,
                  }}
                />
                <div className="relative z-10 flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${feat.color}18`,
                      border: `1px solid ${feat.color}30`,
                    }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: feat.color }} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Start ───────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          Quick Start
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#0d1117",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="flex items-center px-4 py-2 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>terminal</span>
          </div>
          <pre className="p-5 text-sm leading-loose overflow-x-auto" style={{ color: "#e2e8f0" }}>
            <code>
              <span style={{ color: "#6b7280" }}># Install the package</span>{"\n"}
              <span style={{ color: "#818cf8" }}>$</span>{" "}npm install <span style={{ color: "#34d399" }}>@imksh/ui</span>{"\n\n"}
              <span style={{ color: "#6b7280" }}># Or use the CLI</span>{"\n"}
              <span style={{ color: "#818cf8" }}>$</span>{" "}imksh ui add button
            </code>
          </pre>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: "#818cf8" }}
          >
            Full installation guide
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span style={{ color: "var(--border)" }}>·</span>
          <Link
            href="/docs/components/button"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            Browse all components
          </Link>
        </div>
      </section>
    </div>
  );
}
