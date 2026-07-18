import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";

export default function IntroductionPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border/50 p-8 sm:p-12 md:p-16 text-center shadow-sm">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Box className="mr-2 h-4 w-4" />
            @imksh/ui v0.1.0 is now live
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
            Beautifully designed components for your next project.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-[85%]">
            Accessible. Customizable. Premium. Build your application with a unified design system that feels incredible out of the box.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/docs/installation"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-content shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/docs/components/button"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Browse Components
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="prose dark:prose-invert max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Why @imksh/ui?</h2>
        <p className="text-muted-foreground text-lg leading-relaxed mt-4">
          Instead of installing dozens of individual packages or battling with monolithic UI libraries, this library is provided as a single 
          `@imksh/ui` package within your monorepo. It gives you instant access to all components while 
          retaining full control over their source code.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed mt-4">
          It's built entirely with Tailwind CSS, meaning it inherits your global design tokens and themes effortlessly.
        </p>
      </div>
    </div>
  );
}
