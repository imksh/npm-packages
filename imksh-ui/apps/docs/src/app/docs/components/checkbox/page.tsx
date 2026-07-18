import { ComponentPreview } from "@/components/component-preview";
import { Checkbox } from "@imksh/ui";

export default function CheckboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkbox</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A control that allows the user to toggle between checked and not checked.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Usage</h2>
        <ComponentPreview
          preview={
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium text-gray-700 leading-none cursor-pointer">
                  Accept terms and conditions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="disabled" disabled />
                <label htmlFor="disabled" className="text-sm font-medium text-gray-400 leading-none cursor-not-allowed">
                  Disabled checkbox
                </label>
              </div>
            </div>
          }
          code={`import { Checkbox } from "@imksh/ui"

export default function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  )
}`}
        />
      </div>
    </div>
  );
}
