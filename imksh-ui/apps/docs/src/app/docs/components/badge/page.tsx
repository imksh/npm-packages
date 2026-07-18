import { BadgePreview } from "./badge-preview";
import { Badge } from "@imksh/ui";
import { ChevronRight, Check } from "lucide-react";

export default function BadgePage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Docs</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span>Components</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-foreground">Badge</span>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500">
            <Check className="h-3 w-3 mr-1" /> Stable
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            Server component
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">Badge</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Displays a badge or a component that looks like a badge, perfect for tags, status indicators, and counters.
        </p>
      </div>

      {/* Main Interactive Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <p className="text-muted-foreground">
          Tweak the controls to see the component update in real time. The generated JSX is always in sync with your selection.
        </p>
        <BadgePreview />
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
            <tbody className="divide-y divide-border text-foreground">
              <tr>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-mono text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">color</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  "primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error"
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">"primary"</td>
                <td className="px-6 py-4 text-muted-foreground">The semantic color of the badge.</td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-mono text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">variant</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  "solid" | "outline" | "soft" | "ghost"
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">"solid"</td>
                <td className="px-6 py-4 text-muted-foreground">Visual style of the badge.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
