"use client";

import * as React from "react";
import { Badge } from "@imksh/ui";
import { ComponentPreview } from "@/components/component-preview";

export function BadgePreview() {
  const [color, setColor] = React.useState<"primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error">("primary");
  const [variant, setVariant] = React.useState<"solid" | "outline" | "soft" | "ghost">("soft");

  const preview = (
    <Badge color={color} variant={variant}>
      New Feature
    </Badge>
  );

  const code = `import { Badge } from "@imksh/ui";

export default function App() {
  return (
    <Badge color="${color}" variant="${variant}">
      New Feature
    </Badge>
  );
}`;

  const controls = (
    <div className="flex flex-wrap items-center gap-6">
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Color
        </label>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value as any)}
          className="flex h-8 w-[160px] rounded border border-border bg-background px-3 text-xs shadow-sm focus:outline-none focus:border-blue-500"
        >
          <option value="primary">primary</option>
          <option value="secondary">secondary</option>
          <option value="neutral">neutral</option>
          <option value="info">info</option>
          <option value="success">success</option>
          <option value="warning">warning</option>
          <option value="error">error</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Variant
        </label>
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as any)}
          className="flex h-8 w-[160px] rounded border border-border bg-background px-3 text-xs shadow-sm focus:outline-none focus:border-blue-500"
        >
          <option value="solid">solid</option>
          <option value="outline">outline</option>
          <option value="soft">soft</option>
          <option value="ghost">ghost</option>
        </select>
      </div>
    </div>
  );

  return <ComponentPreview preview={preview} code={code} controls={controls} fileName="badge-demo.tsx" />;
}
