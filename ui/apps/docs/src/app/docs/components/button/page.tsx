import { ButtonPreview } from "./button-preview";
import { Button } from "@imksh/ui";
import { CodeBlock } from "@/components/code-block";
import { ChevronRight, Check } from "lucide-react";

export default function ButtonPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Docs</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span>Components</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-foreground">Button</span>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500">
            ✨ Stable
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            Accessible
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            Server component
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">Button</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A flexible button component supporting multiple variants, sizes, icons, loading state, and full keyboard accessibility.
        </p>
      </div>

      {/* Installation Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Installation</h2>
        <p className="text-muted-foreground">
          Install the package via your favorite package manager, or use the CLI to scaffold this component into your project.
        </p>
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 text-sm font-mono text-muted-foreground shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-blue-500 text-xs font-sans">&gt;_</span>
            <span>$ npm <span className="text-foreground">install</span> @imksh/ui</span>
          </div>
          <button className="rounded-md border border-border p-2 hover:bg-muted text-muted-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 text-sm font-mono text-muted-foreground shadow-sm mt-4">
          <div className="flex items-center gap-4">
            <span className="text-blue-500 text-xs font-sans">&gt;_</span>
            <span>$ imksh ui add button</span>
          </div>
          <button className="rounded-md border border-border p-2 hover:bg-muted text-muted-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>
      </div>

      {/* Main Interactive Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <p className="text-muted-foreground">
          Tweak the controls to see the component update in real time. The generated JSX is always in sync with your selection.
        </p>
        <ButtonPreview />
      </div>

      {/* Examples Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-background shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Primary</h3>
              <p className="text-sm text-muted-foreground">The default call-to-action.</p>
            </div>
            <div className="flex justify-center p-6 bg-muted/20 rounded-lg border border-border">
              <Button color="primary">Continue</Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Secondary</h3>
              <p className="text-sm text-muted-foreground">Neutral emphasis.</p>
            </div>
            <div className="flex justify-center p-6 bg-muted/20 rounded-lg border border-border">
              <Button color="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Props Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Props</h2>
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground">Prop</th>
                <th className="px-6 py-4 font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 font-semibold text-foreground">Default</th>
                <th className="px-6 py-4 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-mono text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">color</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  "primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error"
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">"primary"</td>
                <td className="px-6 py-4 text-muted-foreground">The semantic color of the button.</td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-mono text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">variant</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  "solid" | "outline" | "soft" | "ghost"
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">"solid"</td>
                <td className="px-6 py-4 text-muted-foreground">Visual style of the button.</td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">disabled</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">boolean</td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">false</td>
                <td className="px-6 py-4 text-muted-foreground">Prevents user interaction.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
