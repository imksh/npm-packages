"use client";

import * as React from "react";
import { Button } from "@imksh/ui";
import { ComponentPreview } from "@/components/component-preview";

export function ButtonPreview() {
  const [color, setColor] = React.useState<"primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error">("primary");
  const [variant, setVariant] = React.useState<"solid" | "outline" | "soft" | "ghost">("solid");
  const [disabled, setDisabled] = React.useState(false);

  const preview = (
    <Button color={color} variant={variant} disabled={disabled}>
      Get Started
    </Button>
  );

  const code = `import { Button } from "@imksh/ui";

export default function App() {
  return (
    <Button 
      color="${color}"
      variant="${variant}"${disabled ? "\n      disabled" : ""}
    >
      Get Started
    </Button>
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

      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Disabled
        </label>
        <div className="flex items-center h-8">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            <div className="w-8 h-4 bg-[#2a2d36] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return <ComponentPreview preview={preview} code={code} controls={controls} fileName="button-demo.tsx" />;
}
