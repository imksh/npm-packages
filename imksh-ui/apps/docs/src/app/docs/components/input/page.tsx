import { ComponentPreview } from "@/components/component-preview";
import { Input } from "@imksh/ui";

export default function InputPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Input</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Displays a form input field or a component that looks like an input field.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Usage</h2>
        <ComponentPreview
          preview={
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Input placeholder="Default Input" />
              <Input placeholder="Disabled Input" disabled />
              <Input placeholder="Error Input" error />
            </div>
          }
          code={`import { Input } from "@imksh/ui"

export default function InputDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Input placeholder="Default Input" />
      <Input placeholder="Disabled Input" disabled />
      <Input placeholder="Error Input" error />
    </div>
  )
}`}
        />
      </div>
    </div>
  );
}
