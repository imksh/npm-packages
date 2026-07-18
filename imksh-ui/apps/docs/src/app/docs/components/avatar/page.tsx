import { ComponentPreview } from "@/components/component-preview";
import { Avatar } from "@imksh/ui";

export default function AvatarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avatar</h1>
        <p className="text-lg text-muted-foreground mt-2">
          An image element with a fallback for representing the user.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Usage</h2>
        <ComponentPreview
          preview={
            <div className="flex items-end gap-4">
              <Avatar size="sm" initials="SM" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" />
              <Avatar size="lg" initials="LG" />
            </div>
          }
          code={`import { Avatar } from "@imksh/ui"

export default function AvatarDemo() {
  return (
    <div className="flex gap-4">
      <Avatar size="sm" initials="SM" />
      <Avatar size="md" src="https://i.pravatar.cc/150?img=1" />
      <Avatar size="lg" initials="LG" />
    </div>
  )
}`}
        />
      </div>
    </div>
  );
}
